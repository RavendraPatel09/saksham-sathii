import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma, isDbFallback } from '../db';
import { FallbackStore } from '../services/fallbackStore';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/mailService';

const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

const hashOtp = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'saksham-super-secret-access-token-key-change-in-prod-12345';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'saksham-super-secret-refresh-token-key-change-in-prod-12345';

// Helper to generate access and refresh tokens
const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    role,
    name,
    age = '',
    gender = '',
    city = '',
    state = '',
    phone = '',
    disabilityType = '',
    severity = '',
    assistiveDevices = '',
    communicationMode = '',
    educationLevel = '',
    degree = '',
    college = '',
    certifications = '',
    skills = [],
    workMode = '',
    accessibilityNeeds = []
  } = req.body;

  try {
    const passwordHash = await argon2.hash(password);

    if (isDbFallback) {
      // 1. Fallback in-memory registration
      const existing = FallbackStore.users.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ error: 'Email already registered', data: null, meta: null });
      }

      const userId = `u-${uuidv4()}`;
      const newUser = { id: userId, email, passwordHash, role: role as any, isVerified: false, createdAt: new Date() };
      FallbackStore.users.push(newUser);

      const profileId = `p-${uuidv4()}`;
      const newProfile = {
        id: profileId,
        userId,
        name,
        age,
        gender,
        city,
        state,
        phone,
        disabilityType,
        severity,
        assistiveDevices,
        communicationMode,
        educationLevel,
        degree,
        college,
        certifications,
        skills,
        workMode,
        accessibilityNeeds,
        aiSummary: 'Profile successfully constructed. Recommended accommodations loaded.',
      };
      FallbackStore.profiles.push(newProfile);

      // Generate secure 6-digit OTP
      const otp = generateOtp();
      const otpHash = hashOtp(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      FallbackStore.verificationOTPs.push({
        id: `otp-${uuidv4()}`,
        userId,
        email,
        otpHash,
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
        expiresAt,
        createdAt: new Date(),
        attempts: 0,
        used: false,
      });

      // Send verification email
      await sendVerificationEmail({
        to: email,
        subject: 'Verify your email address',
        name,
        otp,
      });

      return res.status(201).json({
        error: null,
        data: {
          success: true,
          message: 'Registration successful. Verification code sent to your email.',
          requiresVerification: true,
        },
        meta: null,
      });
    }

    // 2. Standard PostgreSQL database registration
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered', data: null, meta: null });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        isVerified: false,
        profile: {
          create: {
            name,
            age,
            gender,
            city,
            state,
            phone,
            disabilityType,
            severity,
            assistiveDevices,
            communicationMode,
            educationLevel,
            degree,
            college,
            certifications,
            skills,
            workMode,
            accessibilityNeeds,
            aiSummary: 'Profile successfully constructed. Recommended accommodations loaded.',
          },
        },
      },
      include: { profile: true },
    });

    // Generate secure 6-digit OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await prisma.verificationOTP.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        expiresAt,
      },
    });

    // Send verification email
    await sendVerificationEmail({
      to: email,
      subject: 'Verify your email address',
      name: user.profile?.name || email.split('@')[0],
      otp,
    });

    return res.status(201).json({
      error: null,
      data: {
        success: true,
        message: 'Registration successful. Verification code sent to your email.',
        requiresVerification: true,
      },
      meta: null,
    });
  } catch (err: any) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.', data: null, meta: null });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (isDbFallback) {
      // 1. Fallback verification
      const user = FallbackStore.users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password', data: null, meta: null });
      }

      const validPassword = await argon2.verify(user.passwordHash, password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password', data: null, meta: null });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          error: 'Please verify your email before logging in.',
          success: false,
          message: 'Please verify your email before logging in.',
          requiresVerification: true,
        });
      }

      const profile = FallbackStore.profiles.find(p => p.userId === user.id) || null;
      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        error: null,
        data: {
          user: { id: user.id, email: user.email, role: user.role },
          profile,
          accessToken,
        },
        meta: null,
      });
    }

    // 2. Database verification
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password', data: null, meta: null });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password', data: null, meta: null });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        error: 'Please verify your email before logging in.',
        success: false,
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      error: null,
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        profile: user.profile,
        accessToken,
      },
      meta: null,
    });
  } catch (err: any) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Internal server error during login', data: null, meta: null });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required', data: null, meta: null });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };

    if (isDbFallback) {
      const user = FallbackStore.users.find(u => u.id === payload.id);
      if (!user) {
        return res.status(401).json({ error: 'User session not found', data: null, meta: null });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        error: null,
        data: { accessToken },
        meta: null,
      });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res.status(401).json({ error: 'User session not found', data: null, meta: null });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      error: null,
      data: { accessToken },
      meta: null,
    });
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid refresh token', data: null, meta: null });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({ error: null, data: { success: true }, meta: null });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const inputOtpHash = hashOtp(otp);

    if (isDbFallback) {
      const user = FallbackStore.users.find(u => u.email === email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found', error: 'User not found' });
      }

      // Find active OTP record
      const otpRecord = FallbackStore.verificationOTPs.find(
        o => o.email === email && !o.used
      );

      if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'Invalid verification code', error: 'Invalid verification code' });
      }

      // Increment attempts
      otpRecord.attempts += 1;

      if (otpRecord.attempts > 5) {
        otpRecord.used = true; // Invalidate
        return res.status(400).json({
          success: false,
          message: 'Too many verification attempts. Verification code has been invalidated. Please request a new code.',
          error: 'Too many verification attempts',
        });
      }

      // Check expiry
      if (new Date() > otpRecord.expiresAt) {
        return res.status(400).json({ success: false, message: 'Verification code has expired', error: 'Verification code has expired' });
      }

      // Check match
      if (otpRecord.otpHash !== inputOtpHash) {
        if (otpRecord.attempts === 5) {
          otpRecord.used = true;
          return res.status(400).json({
            success: false,
            message: 'Invalid verification code. Verification code has been invalidated. Please request a new code.',
            error: 'Invalid verification code',
          });
        }
        return res.status(400).json({ success: false, message: 'Invalid verification code', error: 'Invalid verification code' });
      }

      // Mark user as verified
      user.isVerified = true;
      user.verifiedAt = new Date();

      // Invalidate current and previous OTPs
      otpRecord.used = true;
      FallbackStore.verificationOTPs.forEach(o => {
        if (o.email === email) {
          o.used = true;
        }
      });

      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    }

    // Database mode
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', error: 'User not found' });
    }

    // Find active OTP record
    const otpRecord = await prisma.verificationOTP.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid verification code', error: 'Invalid verification code' });
    }

    // Increment attempts
    const updatedOtp = await prisma.verificationOTP.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    if (updatedOtp.attempts > 5) {
      await prisma.verificationOTP.update({
        where: { id: otpRecord.id },
        data: { used: true },
      });
      return res.status(400).json({
        success: false,
        message: 'Too many verification attempts. Verification code has been invalidated. Please request a new code.',
        error: 'Too many verification attempts',
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ success: false, message: 'Verification code has expired', error: 'Verification code has expired' });
    }

    // Check match
    if (otpRecord.otpHash !== inputOtpHash) {
      if (updatedOtp.attempts === 5) {
        await prisma.verificationOTP.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code. Verification code has been invalidated. Please request a new code.',
          error: 'Invalid verification code',
        });
      }
      return res.status(400).json({ success: false, message: 'Invalid verification code', error: 'Invalid verification code' });
    }

    // Mark user verified and invalidate OTPs
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verifiedAt: new Date() },
      }),
      prisma.verificationOTP.updateMany({
        where: { email, used: false },
        data: { used: true },
      }),
    ]);

    return res.status(200).json({ success: true, message: 'Email verified successfully' });

  } catch (err: any) {
    console.error('Email verification error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to verify email. Please try again.', error: 'Internal server error' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (isDbFallback) {
      const user = FallbackStore.users.find(u => u.email === email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found', error: 'User not found' });
      }

      // Check resend rate-limit (60 seconds)
      const userOtps = FallbackStore.verificationOTPs.filter(o => o.email === email);
      if (userOtps.length > 0) {
        const latest = userOtps.reduce((prev, curr) => (prev.createdAt > curr.createdAt ? prev : curr));
        const diffSeconds = (new Date().getTime() - latest.createdAt.getTime()) / 1000;
        if (diffSeconds < 60) {
          return res.status(429).json({
            success: false,
            message: `Please wait ${Math.ceil(60 - diffSeconds)} seconds before requesting another code.`,
            error: 'Too many resend requests',
          });
        }
      }

      // Invalidate existing OTPs
      FallbackStore.verificationOTPs.forEach(o => {
        if (o.email === email) {
          o.used = true;
        }
      });

      // Generate & store new
      const otp = generateOtp();
      const otpHash = hashOtp(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      FallbackStore.verificationOTPs.push({
        id: `otp-${uuidv4()}`,
        userId: user.id,
        email,
        otpHash,
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
        expiresAt,
        createdAt: new Date(),
        attempts: 0,
        used: false,
      });

      // Retrieve name from profile
      const profile = FallbackStore.profiles.find(p => p.userId === user.id);
      const name = profile?.name || email.split('@')[0];

      await sendVerificationEmail({ to: email, subject: 'Verify your email address', name, otp });

      return res.status(200).json({ success: true, message: 'Verification code resent successfully' });
    }

    // Database mode
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', error: 'User not found' });
    }

    // Rate limiting check
    const latestOtp = await prisma.verificationOTP.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    if (latestOtp) {
      const diffSeconds = (new Date().getTime() - latestOtp.createdAt.getTime()) / 1000;
      if (diffSeconds < 60) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(60 - diffSeconds)} seconds before requesting another code.`,
          error: 'Too many resend requests',
        });
      }
    }

    // Invalidate existing OTPs
    await prisma.verificationOTP.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Generate new OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationOTP.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        expiresAt,
      },
    });

    const name = user.profile?.name || email.split('@')[0];
    await sendVerificationEmail({ to: email, subject: 'Verify your email address', name, otp });

    return res.status(200).json({ success: true, message: 'Verification code resent successfully' });

  } catch (err: any) {
    console.error('Resend OTP error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to resend code. Please try again.', error: 'Internal server error' });
  }
};
