import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { searchSimilarChunks } from '../rag/vectorService';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    if (isDbFallback) {
      const user = FallbackStore.users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found', data: null, meta: null });
      }
      const profile = FallbackStore.profiles.find(p => p.userId === userId) || null;
      return res.status(200).json({
        error: null,
        data: {
          user: { id: user.id, email: user.email, role: user.role },
          profile,
        },
        meta: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found', data: null, meta: null });
    }

    return res.status(200).json({
      error: null,
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        profile: user.profile,
      },
      meta: null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch user context', data: null, meta: null });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const updateData = req.body;

  try {
    if (isDbFallback) {
      const idx = FallbackStore.profiles.findIndex(p => p.userId === userId);
      if (idx !== -1) {
        FallbackStore.profiles[idx] = { ...FallbackStore.profiles[idx], ...updateData };
        return res.status(200).json({ error: null, data: FallbackStore.profiles[idx], meta: null });
      }
      return res.status(404).json({ error: 'Profile not found', data: null, meta: null });
    }

    const updated = await prisma.profile.update({
      where: { userId },
      data: updateData,
    });

    return res.status(200).json({ error: null, data: updated, meta: null });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update profile info', data: null, meta: null });
  }
};

export const runAudit = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const auditAnswers = req.body; // e.g. { physical_ramp: boolean, ... }

  try {
    // 1. Calculate audit scores
    const physicalFlags = [auditAnswers.physical_ramp, auditAnswers.physical_elevator, auditAnswers.physical_restroom, auditAnswers.physical_parking];
    const techFlags = [auditAnswers.tech_screenreader, auditAnswers.tech_captions, auditAnswers.tech_software];
    const commFlags = [auditAnswers.comm_sign, auditAnswers.comm_docs];
    const policyFlags = [auditAnswers.policy_hiring, auditAnswers.policy_training];

    const countTrue = (arr: boolean[]) => arr.filter(x => !!x).length;

    const scoreInfrastructure = Math.round((countTrue(physicalFlags) / physicalFlags.length) * 100);
    const scoreTechnology = Math.round((countTrue(techFlags) / techFlags.length) * 100);
    const scoreCulturePolicy = Math.round((countTrue(policyFlags) / policyFlags.length) * 100);
    
    // Weighted overall score
    const scoreOverall = Math.round(
      scoreInfrastructure * 0.4 +
      scoreTechnology * 0.4 +
      scoreCulturePolicy * 0.2
    );

    // 2. Retrieval of checklists for recommendations
    const retrievedChunks = await searchSimilarChunks('checklists standards audit requirements', 'accessibility_criteria', 2);

    // 3. Generate AI Recommendations via LLM
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let recommendations: string[] = [];

    if (anthropicKey) {
      try {
        const prompt = `
          You are an accessibility auditor.
          The employer completed an accessibility audit check sheet:
          - Physical Ramp: ${auditAnswers.physical_ramp}
          - Elevator: ${auditAnswers.physical_elevator}
          - Restroom Support: ${auditAnswers.physical_restroom}
          - Accessible Parking: ${auditAnswers.physical_parking}
          - Screen-reader Support: ${auditAnswers.tech_screenreader}
          - Document Simplifiers / Closed Captions: ${auditAnswers.tech_captions}
          - Policy-Hiring: ${auditAnswers.policy_hiring}
          
          Vector Context:
          ${retrievedChunks.map(c => c.chunkText).join('\n')}
          
          Output an array of exactly 4 short, actionable recommendation strings.
          Output format must be valid JSON array of strings:
          ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"]
          Do not include other text or markup.
        `;

        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 250,
            messages: [{ role: 'user', content: prompt }],
          },
          {
            headers: {
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
            timeout: 5000,
          }
        );

        recommendations = JSON.parse(response.data.content[0].text.trim());
      } catch (err: any) {
        console.warn('⚠️ Anthropic audit recommendations failed. Falling back to rule-based recommendations.');
      }
    }

    if (recommendations.length === 0) {
      // Rule-based fallback recommendations
      if (!auditAnswers.physical_ramp) recommendations.push('Install high-traction access ramps with a standard 1:12 slope ratio.');
      if (!auditAnswers.physical_restroom) recommendations.push('Modify washrooms to install support grab bars and wide door access.');
      if (!auditAnswers.tech_screenreader) recommendations.push('License screen readers (such as JAWS or NVDA) for user workstations.');
      if (!auditAnswers.policy_training) recommendations.push('Conduct periodic disability awareness training sessions for team members.');
      
      // Default fillers if recommendations are short
      while (recommendations.length < 4) {
        recommendations.push('Maintain accessible web design practices compliant with WCAG 2.1.');
      }
    }

    const auditResult = {
      scoreOverall,
      scoreInfrastructure,
      scoreTechnology,
      scoreCulturePolicy,
      recommendations,
    };

    if (isDbFallback) {
      FallbackStore.accessibilityAudits.push({
        id: `au-${uuidv4()}`,
        userId: userId!,
        physicalRamp: !!auditAnswers.physical_ramp,
        physicalElevator: !!auditAnswers.physical_elevator,
        physicalRestroom: !!auditAnswers.physical_restroom,
        physicalParking: !!auditAnswers.physical_parking,
        techScreenreader: !!auditAnswers.tech_screenreader,
        techCaptions: !!auditAnswers.tech_captions,
        techSoftware: !!auditAnswers.tech_software,
        commSign: !!auditAnswers.comm_sign,
        commDocs: !!auditAnswers.comm_docs,
        policyHiring: !!auditAnswers.policy_hiring,
        policyTraining: !!auditAnswers.policy_training,
        scoreOverall,
        scoreInfrastructure,
        scoreTechnology,
        scoreCulturePolicy,
        createdAt: new Date(),
      });
    } else {
      await prisma.accessibilityAudit.create({
        data: {
          userId: userId!,
          physicalRamp: !!auditAnswers.physical_ramp,
          physicalElevator: !!auditAnswers.physical_elevator,
          physicalRestroom: !!auditAnswers.physical_restroom,
          physicalParking: !!auditAnswers.physical_parking,
          techScreenreader: !!auditAnswers.tech_screenreader,
          techCaptions: !!auditAnswers.tech_captions,
          techSoftware: !!auditAnswers.tech_software,
          commSign: !!auditAnswers.comm_sign,
          commDocs: !!auditAnswers.comm_docs,
          policyHiring: !!auditAnswers.policy_hiring,
          policyTraining: !!auditAnswers.policy_training,
          scoreOverall,
          scoreInfrastructure,
          scoreTechnology,
          scoreCulturePolicy,
        },
      });
    }

    return res.status(200).json({ error: null, data: auditResult, meta: null });
  } catch (err: any) {
    console.error('Accessibility Audit Error:', err.message);
    return res.status(500).json({ error: 'Failed to run accessibility audit evaluation', data: null, meta: null });
  }
};

export const submitInterviewResponse = async (req: AuthenticatedRequest, res: Response) => {
  const { mode, question, answer } = req.body;
  const userId = req.user?.id;

  try {
    // 1. RAG retrieval of question hints / prior transcripts
    const retrievedChunks = await searchSimilarChunks(question, 'interview_question', 2);

    // 2. Score evaluation via LLM
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let confidence = 75;
    let communication = 70;
    let clarity = 80;
    let techKnowledge = 65;
    let suggestions: string[] = [];

    if (anthropicKey) {
      try {
        const prompt = `
          You are an AI Interview Coach.
          Assess the candidate's answer for this interview question.
          
          Question: "${question}"
          Candidate Answer: "${answer}"
          
          RAG Suggestions Reference:
          ${retrievedChunks.map(c => c.chunkText).join('\n')}
          
          Analyze and output a JSON object:
          {
            "confidence": number (0-100),
            "communication": number (0-100),
            "clarity": number (0-100),
            "techKnowledge": number (0-100),
            "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
          }
          Only output valid JSON.
        `;

        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            messages: [{ role: 'user', content: prompt }],
          },
          {
            headers: {
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
            timeout: 5000,
          }
        );

        const parsed = JSON.parse(response.data.content[0].text.trim());
        confidence = parsed.confidence || confidence;
        communication = parsed.communication || communication;
        clarity = parsed.clarity || clarity;
        techKnowledge = parsed.techKnowledge || techKnowledge;
        suggestions = parsed.suggestions || suggestions;
      } catch (err: any) {
        console.warn('⚠️ Anthropic interview analysis failed, running fallback evaluation.');
      }
    }

    if (suggestions.length === 0) {
      // Fallback suggest checks
      suggestions = [
        'Try to speak a bit more confidently and avoid filler words like "um".',
        'Use the STAR method (Situation, Task, Action, Result) for behavioral questions.',
        'Your clarity of thought is excellent. Keep it up!',
      ];
    }

    const feedbackScore = Math.round((confidence + communication + clarity + techKnowledge) / 4);

    const interviewResult = {
      feedbackScore,
      feedbackConfidence: confidence,
      feedbackCommunication: communication,
      feedbackClarity: clarity,
      feedbackTechKnowledge: techKnowledge,
      feedbackSuggestions: suggestions,
    };

    if (isDbFallback) {
      FallbackStore.interviewSessions.push({
        id: `is-${uuidv4()}`,
        userId: userId!,
        mode,
        questionText: question,
        answerText: answer,
        feedbackScore,
        feedbackConfidence: confidence,
        feedbackCommunication: communication,
        feedbackClarity: clarity,
        feedbackTechKnowledge: techKnowledge,
        feedbackSuggestions: suggestions,
        createdAt: new Date(),
      });
    } else {
      await prisma.interviewSession.create({
        data: {
          userId: userId!,
          mode,
          questionText: question,
          answerText: answer,
          feedbackScore,
          feedbackConfidence: confidence,
          feedbackCommunication: communication,
          feedbackClarity: clarity,
          feedbackTechKnowledge: techKnowledge,
          feedbackSuggestions: suggestions,
        },
      });
    }

    return res.status(200).json({ error: null, data: interviewResult, meta: null });
  } catch (err: any) {
    console.error('Interview Coaching Error:', err.message);
    return res.status(500).json({ error: 'Failed to evaluate interview response', data: null, meta: null });
  }
};
