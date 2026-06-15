// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { sendOtpSchema, verifyOtpSchema, adminLoginSchema, refreshSchema } from './auth.validation';

const router = Router();

router.post('/send-otp', validate(sendOtpSchema), AuthController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), AuthController.verifyOtp);
router.post('/admin-login', validate(adminLoginSchema), AuthController.adminLogin);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', validate(refreshSchema), AuthController.logout);

export default router;
