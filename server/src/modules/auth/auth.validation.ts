// src/modules/auth/auth.validation.ts
import { z } from 'zod';

export const sendOtpSchema = {
  body: z.object({
    phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number format (must start with +91)'),
  }),
};

export const verifyOtpSchema = {
  body: z.object({
    phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number format (must start with +91)'),
    code: z.string().length(4, 'OTP must be 4 digits'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
};

export const adminLoginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const refreshSchema = {
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
};
