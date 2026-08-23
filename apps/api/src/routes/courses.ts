import { Router } from 'express';
import { getCourses, updateProgress } from '../controllers/courses';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCourses);
router.post('/progress', authenticate, updateProgress);

export default router;
