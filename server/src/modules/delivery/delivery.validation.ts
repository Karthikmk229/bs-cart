// src/modules/delivery/delivery.validation.ts
import { z } from 'zod';

export const getDeliverySlotsSchema = {
  query: z.object({
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  }),
};
