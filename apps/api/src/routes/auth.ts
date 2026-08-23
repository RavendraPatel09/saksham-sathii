import { Router } from 'express';
import { register, login, refresh, logout, verifyEmail, resendOtp } from '../controllers/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, verifyEmailSchema, resendOtpSchema } from '../validators';
import { FallbackStore } from '../services/fallbackStore';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);

if (process.env.NODE_ENV !== 'production') {
  router.get('/test-last-otp', (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }
    const latest = FallbackStore.verificationOTPs
      .filter(o => o.email === email && !o.used)
      .reduce((prev, curr) => (!prev || curr.createdAt > prev.createdAt ? curr : prev), null as any);

    return res.status(200).json({ otp: latest ? latest.otp || null : null });
  });
}

export default router;
