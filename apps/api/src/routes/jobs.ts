import { Router } from 'express';
import { getJobs, matchAndExplain } from '../controllers/jobs';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { jobMatchExplainSchema } from '../validators';

const router = Router();

router.get('/', authenticate, getJobs);
router.post('/match-explain', authenticate, validate(jobMatchExplainSchema), matchAndExplain);

export default router;
