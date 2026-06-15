"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.adminLoginSchema = exports.verifyOtpSchema = exports.sendOtpSchema = void 0;
// src/modules/auth/auth.validation.ts
const zod_1 = require("zod");
exports.sendOtpSchema = {
    body: zod_1.z.object({
        phone: zod_1.z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number format (must start with +91)'),
    }),
};
exports.verifyOtpSchema = {
    body: zod_1.z.object({
        phone: zod_1.z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number format (must start with +91)'),
        code: zod_1.z.string().length(4, 'OTP must be 4 digits'),
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
    }),
};
exports.adminLoginSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
};
exports.refreshSchema = {
    body: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
};
