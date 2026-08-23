import { Router } from 'express';
import authRoutes from './auth';
import jobRoutes from './jobs';
import assessmentRoutes from './assessments';
import mentorRoutes from './mentors';
import courseRoutes from './courses';
import accommodationRoutes from './accommodations';
import adminRoutes from './admin';
import userRoutes from './user';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/mentors', mentorRoutes);
router.use('/courses', courseRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

export default router;
