import { Router } from 'express';
import { getMentors, connectMentor } from '../controllers/mentors';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMentors);
router.post('/connect', authenticate, connectMentor);

export default router;
