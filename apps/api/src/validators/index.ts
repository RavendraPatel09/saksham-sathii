import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['user', 'admin', 'employer']),
  name: z.string().min(1, 'Name is required'),
  age: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  disabilityType: z.string().optional(),
  severity: z.string().optional(),
  assistiveDevices: z.string().optional(),
  communicationMode: z.string().optional(),
  educationLevel: z.string().optional(),
  degree: z.string().optional(),
  college: z.string().optional(),
  certifications: z.string().optional(),
  skills: z.array(z.string()).optional(),
  workMode: z.string().optional(),
  accessibilityNeeds: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const jobMatchExplainSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
});

export const assessmentSubmitSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export const generateLetterSchema = z.object({
  disability: z.string().min(1, 'Disability is required'),
  needs: z.array(z.string()).nonempty('At least one accommodation need is required'),
  additionalInfo: z.string().optional(),
});

export const simplifyDocumentSchema = z.object({
  text: z.string().min(1, 'Document text is required'),
});

export const submitInterviewResponseSchema = z.object({
  mode: z.enum(['text', 'voice', 'video']),
  question: z.string().min(1, 'Question text is required'),
  answer: z.string().min(1, 'Answer text is required'),
});

export const runAuditSchema = z.object({
  physical_ramp: z.boolean(),
  physical_elevator: z.boolean(),
  physical_restroom: z.boolean(),
  physical_parking: z.boolean(),
  tech_screenreader: z.boolean(),
  tech_captions: z.boolean(),
  tech_software: z.boolean(),
  comm_sign: z.boolean(),
  comm_docs: z.boolean(),
  policy_hiring: z.boolean(),
  policy_training: z.boolean(),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});
