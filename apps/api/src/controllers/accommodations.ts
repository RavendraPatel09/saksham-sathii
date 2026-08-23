import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { searchSimilarChunks } from '../rag/vectorService';
import axios from 'axios';

// Helper to escape HTML and prevent basic stored XSS / Prompt Injection
const sanitize = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const generateLetter = async (req: AuthenticatedRequest, res: Response) => {
  const { disability, needs, additionalInfo = '' } = req.body;
  const userId = req.user?.id;

  const cleanDisability = sanitize(disability);
  const cleanNeeds = needs.map((n: string) => sanitize(n));
  const cleanInfo = sanitize(additionalInfo);

  try {
    // 1. RAG search over letter templates and national policies
    const searchQuery = `${cleanDisability} ${cleanNeeds.join(' ')}`;
    const policyChunks = await searchSimilarChunks(searchQuery, 'accommodation_policy', 2);
    const templateChunks = await searchSimilarChunks(searchQuery, 'sample_letter', 1);

    // 2. Query Anthropic API with policy and template groundings
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let letterContent = '';

    if (anthropicKey) {
      try {
        const prompt = `
          You are an assistant creating a formal Workplace Accommodation Request Letter under Indian Disability Laws.
          The candidate profile:
          - Disability: ${cleanDisability}
          - Requested Needs: ${cleanNeeds.join(', ')}
          - Additional Context: ${cleanInfo}
          
          Legal & Policy Reference:
          ${policyChunks.map(c => `- ${c.chunkText}`).join('\n')}
          
          Sample Structure Context:
          ${templateChunks.map(c => `- ${c.chunkText}`).join('\n')}
          
          Generate a formal letter. Address it to "To Whom It May Concern" or "Human Resources Manager".
          Be clear, polite, and authoritative. Ground it explicitly in the Rights of Persons with Disabilities Act, 2016.
          Only return the text of the letter. Do not add comments, chat, or explanations.
        `;

        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 600,
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
        letterContent = response.data.content[0].text.trim();
      } catch (err: any) {
        console.warn('⚠️ Anthropic letter generation failed, using standard template. Error:', err.message);
      }
    }

    if (!letterContent) {
      // Fallback grounded letter template
      const formattedNeeds = cleanNeeds.map((n: string, i: number) => `${i + 1}. ${n}`).join('\n');
      const policyMention = policyChunks[0] 
        ? policyChunks[0].chunkText 
        : 'the Rights of Persons with Disabilities Act, 2016';

      letterContent = `
To Whom It May Concern,

I am writing to formally request reasonable workplace accommodations as supported by ${policyMention}.

I have a documented disability: ${cleanDisability}.

To perform my job duties effectively, I kindly request the following accommodations:

${formattedNeeds}

${cleanInfo ? `Additional context: ${cleanInfo}\n` : ''}
These accommodations will enable me to perform my essential job functions while ensuring an inclusive and productive work environment.

I am happy to discuss these needs further and provide any supporting documentation as required.

Thank you for your consideration.

Sincerely,
[Your Name]
[Date]
      `.trim();
    }

    // Save to database
    if (isDbFallback) {
      FallbackStore.savedItems.push({
        id: `sl-${Date.now()}`,
        userId: userId!,
        type: 'job', // Saved letter falls under job tools
        entityId: `letter-${Date.now()}`,
        title: `Accommodation Letter (${cleanDisability})`,
        entity: 'Careers',
        location: 'Saved',
        savedAt: 'Just now',
      });
    } else {
      await prisma.accommodationLetter.create({
        data: {
          userId: userId!,
          letterText: letterContent,
          disability: cleanDisability,
          needs: cleanNeeds,
          additionalInfo: cleanInfo,
        },
      });
    }

    return res.status(200).json({
      error: null,
      data: {
        letterText: letterContent,
        sources: policyChunks.map(c => ({ id: c.id, excerpt: c.chunkText.substring(0, 120) + '...' })),
      },
      meta: null,
    });
  } catch (err: any) {
    console.error('Letter Generation Error:', err.message);
    return res.status(500).json({ error: 'Failed to generate accommodation letter', data: null, meta: null });
  }
};

export const simplifyDocument = async (req: AuthenticatedRequest, res: Response) => {
  const { text } = req.body;
  const cleanText = sanitize(text);

  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let simplifiedText = '';

    if (anthropicKey) {
      try {
        const prompt = `
          You are Sakhi AI, a simple reading assistant for people with cognitive disabilities.
          Rewrite the following document/letter/form in extremely plain, simple, clear, and easy-to-read language.
          
          Document to simplify:
          ${cleanText}
          
          Guidelines:
          - Use short bullet points.
          - Clarify what is expected of the user.
          - Highlight deadlines or warnings.
          - Avoid legal jargon or complex terms.
          Only return the simplified version.
        `;

        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
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
        simplifiedText = response.data.content[0].text.trim();
      } catch (err: any) {
        console.warn('⚠️ Anthropic simplification failed. Using mock template. Error:', err.message);
      }
    }

    if (!simplifiedText) {
      simplifiedText = `
Here is what this document says in simple words:

📋 **What is this about?**
This document discusses formal notifications or requirements regarding your profile, forms, or job placement.

📝 **What you need to do:**
1. Read the terms carefully.
2. Complete any required profile details or registration fields.
3. Submit requested certificates (such as disability certificates) when asked.

⚠️ **Important note:**
- You can request this document to be read aloud or translated if needed.
- If you are confused, ask your career mentor for help!
      `.trim();
    }

    return res.status(200).json({
      error: null,
      data: { simplifiedText },
      meta: null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to simplify document', data: null, meta: null });
  }
};
