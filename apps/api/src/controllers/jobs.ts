import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { searchSimilarChunks } from '../rag/vectorService';
import axios from 'axios';

// Helper: Calculate match scores server-side
const calculateScores = (candidateSkills: string[], jobSkills: string[], candidateNeeds: string[], jobAccommodations: string[]) => {
  // Skill match score: intersection / union
  const skillIntersection = candidateSkills.filter(s => jobSkills.some(js => js.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(js.toLowerCase())));
  const skillScore = jobSkills.length > 0 ? Math.round((skillIntersection.length / jobSkills.length) * 100) : 100;

  // Accommodation match score: percentage of candidate needs satisfied by job offerings
  const metAccommodations = candidateNeeds.filter(need => jobAccommodations.some(ja => ja.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(ja.toLowerCase())));
  const accommodationScore = candidateNeeds.length > 0 ? Math.round((metAccommodations.length / candidateNeeds.length) * 100) : 100;

  // Final fit score is weighted average: 60% skills, 40% accommodations
  const fitScore = Math.round(skillScore * 0.6 + accommodationScore * 0.4);

  return { fitScore, accommodationScore };
};

export const getJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isReserved = req.query.isReserved === 'true';

    if (isDbFallback) {
      const list = FallbackStore.jobs.filter(j => j.isReserved === isReserved);
      return res.status(200).json({ error: null, data: list, meta: { total: list.length } });
    }

    const list = await prisma.job.findMany({
      where: { isReserved },
    });

    return res.status(200).json({ error: null, data: list, meta: { total: list.length } });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch jobs', data: null, meta: null });
  }
};

export const matchAndExplain = async (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.body;
  const userId = req.user?.id;

  try {
    let job: any = null;
    let profile: any = null;

    if (isDbFallback) {
      job = FallbackStore.jobs.find(j => j.id === jobId);
      profile = FallbackStore.profiles.find(p => p.userId === userId);
    } else {
      job = await prisma.job.findUnique({ where: { id: jobId } });
      profile = await prisma.profile.findUnique({ where: { userId } });
    }

    if (!job) {
      return res.status(404).json({ error: 'Job not found', data: null, meta: null });
    }

    // Default mock candidate profile if none registered
    const candidateSkills = profile?.skills || ['React', 'CSS', 'JavaScript'];
    const candidateNeeds = profile?.accessibilityNeeds || ['Screen-reader compatible', 'Flexible work hours'];

    // 1. Calculate matching scores server-side
    const { fitScore, accommodationScore } = calculateScores(
      candidateSkills,
      job.requiredSkills,
      candidateNeeds,
      job.accessibility
    );

    // 2. RAG retrieval of similarity chunks (accommodation criteria or guidelines)
    const searchTerms = `${job.title} accommodations ${job.accessibility.join(' ')}`;
    const retrievedChunks = await searchSimilarChunks(searchTerms, 'accessibility_criteria', 2);

    // 3. LLM call to explain compatibility in simple words
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let explanationText = '';

    if (anthropicKey) {
      try {
        const prompt = `
          You are Sakhi, an AI Career Coach for individuals with disabilities in India.
          Explain in very simple, clear, plain language why this job matches the user.
          
          Job Title: ${job.title} at ${job.company}
          Job Description: ${job.description}
          Job Accommodations offered: ${job.accessibility.join(', ')}
          
          User Skills: ${candidateSkills.join(', ')}
          User Accommodation needs: ${candidateNeeds.join(', ')}
          
          Vector Context:
          ${retrievedChunks.map(c => `- ${c.chunkText}`).join('\n')}
          
          Rules:
          - Use short sentences.
          - Divide explanation into: 
            1. "What you will do" (Explain the role)
            2. "Why it fits you" (Reference their skills and the accommodations offered)
          - Do not make up fake details. Keep it realistic.
        `;

        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 400,
            messages: [{ role: 'user', content: prompt }],
          },
          {
            headers: {
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
            timeout: 6000,
          }
        );
        explanationText = response.data.content[0].text;
      } catch (err: any) {
        console.warn('⚠️ Anthropic LLM explainer failed. Falling back to template explanation.', err.message);
      }
    }

    if (!explanationText) {
      // Fallback description generator
      explanationText = `
### What you will do:
You will work as a ${job.title} with the team at ${job.company}. Your work involves applying your core skills like ${job.requiredSkills.slice(0, 3).join(', ')} to build and test their digital applications.

### Why it fits you:
- **Work Mode Alignment:** Matches your preferred work mode of ${job.workMode}.
- **Accessibility Match:** The employer supports ${job.accessibility.slice(0, 2).join(' and ')}, fulfilling your request for ${candidateNeeds[0] || 'inclusive tooling'}.
- **Skill Alignment:** Strong match with your experience in ${candidateSkills[0]}.
      `.trim();
    }

    // Save match calculations
    if (!isDbFallback) {
      await prisma.jobMatch.create({
        data: {
          userId: userId!,
          jobId,
          fitScore,
          accommodationScore,
          explanation: explanationText,
        },
      });
    }

    return res.status(200).json({
      error: null,
      data: {
        jobId,
        fitScore,
        accommodationScore,
        explanation: explanationText,
        sources: retrievedChunks.map(c => ({ id: c.id, excerpt: c.chunkText.substring(0, 100) + '...' })),
      },
      meta: null,
    });
  } catch (err: any) {
    console.error('Job Matching Error:', err.message);
    return res.status(500).json({ error: 'Failed to process match comparison', data: null, meta: null });
  }
};
