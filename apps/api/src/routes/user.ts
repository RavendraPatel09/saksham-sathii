import { Router } from 'express';
import { getMe, updateProfile, runAudit, submitInterviewResponse } from '../controllers/user';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { submitInterviewResponseSchema, runAuditSchema } from '../validators';

const router = Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateProfile);
router.post('/audit', authenticate, validate(runAuditSchema), runAudit);
router.post('/interview', authenticate, validate(submitInterviewResponseSchema), submitInterviewResponse);

export default router;
