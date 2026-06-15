// src/modules/coupons/coupons.validation.ts
import { z } from 'zod';

export const validateCouponSchema = {
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    subTotal: z.number().nonnegative('Subtotal must be positive'),
  }),
};
