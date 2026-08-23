import { Response } from 'express';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const getUserDetail = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?.id;

  try {
    let userRecord: any = null;

    if (isDbFallback) {
      const u = FallbackStore.users.find(x => x.id === id);
      if (u) {
        const profile = FallbackStore.profiles.find(p => p.userId === u.id) || null;
        userRecord = {
          id: u.id,
          email: u.email,
          role: u.role,
          profile,
        };
      }

      // Log access audit
      FallbackStore.auditLogs.push({
        id: `al-${uuidv4()}`,
        adminId: adminId!,
        action: 'GET_USER_PROFILE',
        targetUserId: id,
        details: `Admin retrieved profile for user ${id}`,
        createdAt: new Date(),
      });
    } else {
      userRecord = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
          assessments: true,
          applications: true,
        },
      });

      if (userRecord) {
        // Log access audit
        await prisma.auditLog.create({
          data: {
            adminId: adminId!,
            action: 'GET_USER_PROFILE',
            targetUserId: id,
            details: `Admin retrieved profile for user ${id}`,
          },
        });
      }
    }

    if (!userRecord) {
      return res.status(404).json({ error: 'User not found', data: null, meta: null });
    }

    return res.status(200).json({ error: null, data: userRecord, meta: null });
  } catch (err: any) {
    console.error('Admin Cross-Fetch Error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve user details', data: null, meta: null });
  }
};
