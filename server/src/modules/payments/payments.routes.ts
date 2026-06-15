// src/modules/payments/payments.routes.ts
import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { validate } from '../../middleware/validate';
import { verifyPaymentSchema } from './payments.validation';

const router = Router();

// Webhook endpoint is usually public so that Razorpay/mock gateways can notify the backend
router.post('/verify', validate(verifyPaymentSchema), PaymentsController.verifyPayment);

export default router;
