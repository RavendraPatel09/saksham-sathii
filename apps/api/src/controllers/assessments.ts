import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { searchSimilarChunks } from '../rag/vectorService';
import axios from 'axios';

const ASSESSMENT_QUESTIONS = [
  { id: 'q1', section: 'Aptitude', question: 'If you have to organize 100 files into 5 folders equally, how many files go in each folder?', options: ['10', '20', '25', '50'], answer: '20' },
  { id: 'q2', section: 'Communication', question: 'How would you respond to an angry customer?', options: ['Argue back', 'Ignore them', 'Listen patiently and offer a solution', 'Transfer call immediately'], answer: 'Listen patiently and offer a solution' },
  { id: 'q3', section: 'Technology', question: 'Which of the following is a screen reader?', options: ['Photoshop', 'JAWS', 'Excel', 'VS Code'], answer: 'JAWS' },
  { id: 'q4', section: 'Work Style', question: 'Do you prefer working alone or in a team?', options: ['Alone', 'Team', 'Depends on the task', 'Neither'], answer: 'Depends on the task' },
];

export const getQuestions = async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({ error: null, data: ASSESSMENT_QUESTIONS, meta: null });
};

export const submitAnswers = async (req: AuthenticatedRequest, res: Response) => {
  const { answers } = req.body; // Record<string, string>
  const userId = req.user?.id;

  try {
    // Calculate raw correct answers
    let correctCount = 0;
    ASSESSMENT_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const percentCorrect = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);

    // RAG retrieval of skills taxonomy reference
    const taxonomyChunks = await searchSimilarChunks('skills categories evaluation', 'skills_taxonomy', 2);

    // Call Anthropic for dynamic evaluation or fallback
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let strength = 80;
    let weakness = 40;
    let confidence = 85;
    let learningStyle = 'Visual & Hands-on';
    let careerReadiness = 75;

    if (anthropicKey) {
      try {
        const prompt = `
          You are an AI career assessor.
          Assess this candidate's performance. They answered ${correctCount} out of ${ASSESSMENT_QUESTIONS.length} correctly on a basic aptitude, tech, and communication check.
          Their raw answers: ${JSON.stringify(answers)}
          
          Skills Taxonomy Context:
          ${taxonomyChunks.map(c => c.chunkText).join('\n')}
          
          Provide a JSON response representing the scored categories.
          Output format must be exactly:
          {
            "strength": number (0-100),
            "weakness": number (0-100),
            "confidence": number (0-100),
            "learningStyle": "string",
            "careerReadiness": number (0-100)
          }
          Do not write code blocks or extra explanations, output raw JSON only.
        `;

        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 200,
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

        const textResponse = response.data.content[0].text.trim();
        const parsed = JSON.parse(textResponse);
        strength = parsed.strength || strength;
        weakness = parsed.weakness || weakness;
        confidence = parsed.confidence || confidence;
        learningStyle = parsed.learningStyle || learningStyle;
        careerReadiness = parsed.careerReadiness || careerReadiness;
      } catch (err: any) {
        console.warn('⚠️ Anthropic scoring failed. Falling back to default scoring formula.', err.message);
        // Dynamic scoring formula fallback
        strength = Math.min(60 + percentCorrect / 2, 95);
        weakness = Math.max(80 - percentCorrect, 30);
        confidence = Math.min(50 + percentCorrect / 2, 90);
        careerReadiness = Math.round((strength * 0.7) + (confidence * 0.3));
      }
    } else {
      // Dynamic scoring formula fallback
      strength = Math.min(60 + percentCorrect / 2, 95);
      weakness = Math.max(80 - percentCorrect, 30);
      confidence = Math.min(50 + percentCorrect / 2, 90);
      careerReadiness = Math.round((strength * 0.7) + (confidence * 0.3));
    }

    const result = {
      strength,
      weakness,
      confidence,
      learningStyle,
      careerReadiness,
      score: percentCorrect,
    };

    if (isDbFallback) {
      FallbackStore.assessments.push({
        id: `as-${Date.now()}`,
        userId: userId!,
        score: percentCorrect,
        answers,
        resultStrength: strength,
        resultWeakness: weakness,
        resultConfidence: confidence,
        resultLearningStyle: learningStyle,
        resultCareerReadiness: careerReadiness,
        createdAt: new Date(),
      });
    } else {
      await prisma.assessment.create({
        data: {
          userId: userId!,
          score: percentCorrect,
          answers,
          resultStrength: strength,
          resultWeakness: weakness,
          resultConfidence: confidence,
          resultLearningStyle: learningStyle,
          resultCareerReadiness: careerReadiness,
        },
      });
    }

    return res.status(200).json({
      error: null,
      data: result,
      meta: null,
    });
  } catch (err: any) {
    console.error('Assessment Submission Error:', err.message);
    return res.status(500).json({ error: 'Failed to process assessment scores', data: null, meta: null });
  }
};
