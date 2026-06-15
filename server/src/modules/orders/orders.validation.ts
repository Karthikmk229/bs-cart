// src/modules/orders/orders.validation.ts
import { z } from 'zod';

export const checkoutSchema = {
  body: z.object({
    addressId: z.string().uuid('Invalid address ID'),
    deliverySlotId: z.string().uuid('Invalid delivery slot ID'),
    paymentMethod: z.enum(['upi', 'card', 'netbanking', 'cod', 'wallet']),
    couponCode: z.string().optional(),
    prescriptionId: z.string().uuid('Invalid prescription ID').optional(),
    notes: z.string().optional(),
  }),
};

export const orderIdSchema = {
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
};
