// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load variables from .env
dotenv.config({ path: path.join(__dirname, '../../.env') });


export const env = z.object({
  PORT: z.string().default('4000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_D1_DATABASE_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
}).parse(process.env);
