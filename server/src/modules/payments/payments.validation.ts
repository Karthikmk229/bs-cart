// src/modules/payments/payments.validation.ts
import { z } from 'zod';

export const verifyPaymentSchema = {
  body: z.object({
    razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
    razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
    status: z.enum(['success', 'failed']),
  }),
};
