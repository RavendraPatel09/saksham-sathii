import { Router } from 'express';
import { getQuestions, submitAnswers } from '../controllers/assessments';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { assessmentSubmitSchema } from '../validators';

const router = Router();

router.get('/questions', authenticate, getQuestions);
router.post('/submit', authenticate, validate(assessmentSubmitSchema), submitAnswers);

export default router;
