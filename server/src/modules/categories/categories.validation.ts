// src/modules/categories/categories.validation.ts
import { z } from 'zod';

export const getCategoriesSchema = {
  query: z.object({
    productType: z.enum(['grocery', 'medical']).optional(),
  }),
};
