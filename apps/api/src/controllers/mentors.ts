import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';

export const getMentors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (isDbFallback) {
      return res.status(200).json({ error: null, data: FallbackStore.mentors, meta: null });
    }

    const list = await prisma.mentor.findMany();
    return res.status(200).json({ error: null, data: list, meta: null });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve mentors list', data: null, meta: null });
  }
};

export const connectMentor = async (req: AuthenticatedRequest, res: Response) => {
  const { mentorId } = req.body;
  const userId = req.user?.id;

  try {
    if (isDbFallback) {
      const mentor = FallbackStore.mentors.find(m => m.id === mentorId);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found', data: null, meta: null });
      }

      FallbackStore.savedItems.push({
        id: `sc-${Date.now()}`,
        userId: userId!,
        type: 'mentor',
        entityId: mentorId,
        title: mentor.name,
        entity: mentor.title,
        location: 'Connected',
        savedAt: 'Just now',
      });

      return res.status(200).json({ error: null, data: { success: true, status: 'pending' }, meta: null });
    }

    const mentor = await prisma.mentor.findUnique({ where: { id: mentorId } });
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found', data: null, meta: null });
    }

    const connection = await prisma.mentorshipConnection.create({
      data: {
        userId: userId!,
        mentorId,
        status: 'pending',
      },
    });

    return res.status(200).json({ error: null, data: connection, meta: null });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to request mentor connection', data: null, meta: null });
  }
};
