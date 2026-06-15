"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// src/config/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
// Load variables from .env
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.env = zod_1.z.object({
    PORT: zod_1.z.string().default('4000').transform((v) => parseInt(v, 10)),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    TWILIO_ACCOUNT_SID: zod_1.z.string().optional(),
    TWILIO_AUTH_TOKEN: zod_1.z.string().optional(),
    TWILIO_PHONE_NUMBER: zod_1.z.string().optional(),
    RAZORPAY_KEY_ID: zod_1.z.string().optional(),
    RAZORPAY_KEY_SECRET: zod_1.z.string().optional(),
    CLOUDFLARE_ACCOUNT_ID: zod_1.z.string().optional(),
    CLOUDFLARE_D1_DATABASE_ID: zod_1.z.string().optional(),
    CLOUDFLARE_API_TOKEN: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
}).parse(process.env);
