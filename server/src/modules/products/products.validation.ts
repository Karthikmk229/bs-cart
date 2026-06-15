// src/modules/products/products.validation.ts
import { z } from 'zod';

export const listProductsSchema = {
  query: z.object({
    category: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits').optional(),
    prescription: z.string().transform((v) => v === 'true').optional(),
    perishable: z.string().transform((v) => v === 'true').optional(),
    search: z.string().optional(),
    priceMin: z.string().transform((v) => parseFloat(v)).optional(),
    priceMax: z.string().transform((v) => parseFloat(v)).optional(),
    sort: z.enum(['priceAsc', 'priceDesc', 'newest', 'name']).default('newest'),
    page: z.string().default('1').transform((v) => parseInt(v, 10)),
    limit: z.string().default('10').transform((v) => parseInt(v, 10)),
  }),
};

export const productSlugSchema = {
  params: z.object({
    slug: z.string().min(1, 'Slug parameter is required'),
  }),
};
