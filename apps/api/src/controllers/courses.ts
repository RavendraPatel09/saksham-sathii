import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';

export const getCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (isDbFallback) {
      return res.status(200).json({ error: null, data: FallbackStore.courses, meta: null });
    }

    const list = await prisma.course.findMany();
    return res.status(200).json({ error: null, data: list, meta: null });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve courses', data: null, meta: null });
  }
};

export const updateProgress = async (req: AuthenticatedRequest, res: Response) => {
  const { courseId, progress } = req.body;
  const userId = req.user?.id;

  const numericProgress = Number(progress);
  if (isNaN(numericProgress) || numericProgress < 0 || numericProgress > 100) {
    return res.status(400).json({ error: 'Progress must be a number between 0 and 100', data: null, meta: null });
  }

  try {

    if (isDbFallback) {
      const course = FallbackStore.courses.find(c => c.id === courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found', data: null, meta: null });
      }

      const userProg = FallbackStore.courseProgress.find(
        cp => cp.userId === userId && cp.courseId === courseId
      );

      if (userProg) {
        userProg.progress = numericProgress;
      } else {
        FallbackStore.courseProgress.push({
          id: `cp-${Date.now()}`,
          userId: userId!,
          courseId,
          progress: numericProgress,
        });
      }

      return res.status(200).json({ error: null, data: { success: true, progress: numericProgress }, meta: null });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found', data: null, meta: null });
    }

    const connection = await prisma.courseProgress.upsert({
      where: { id: `${userId}-${courseId}` }, // If we define id as compounding, but here we can findFirst and then update or create
      create: {
        userId: userId!,
        courseId,
        progress: numericProgress,
      },
      update: {
        progress: numericProgress,
      },
    });

    return res.status(200).json({ error: null, data: connection, meta: null });
  } catch (err: any) {
    // If compounding id fails, findFirst and create
    try {
      const progressRecord = await prisma.courseProgress.findFirst({
        where: { userId: userId!, courseId }
      });
      if (progressRecord) {
        const updated = await prisma.courseProgress.update({
          where: { id: progressRecord.id },
          data: { progress: numericProgress }
        });
        return res.status(200).json({ error: null, data: updated, meta: null });
      } else {
        const created = await prisma.courseProgress.create({
          data: { userId: userId!, courseId, progress: numericProgress }
        });
        return res.status(200).json({ error: null, data: created, meta: null });
      }
    } catch (innerErr: any) {
      return res.status(500).json({ error: 'Failed to update course progress', data: null, meta: null });
    }
  }
};
