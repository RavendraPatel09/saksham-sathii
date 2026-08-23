import { Router } from 'express';
import { getUserDetail } from '../controllers/admin';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Restricted to admin role only
router.get('/users/:id', authenticate, authorize(['admin']), getUserDetail);

export default router;
