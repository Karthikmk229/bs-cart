// src/modules/cart/cart.validation.ts
import { z } from 'zod';

export const addToCartSchema = {
  body: z.object({
    productVariantId: z.string().uuid('Invalid variant ID'),
    quantity: z.number().int().gt(0, 'Quantity must be greater than 0'),
  }),
};

export const updateCartItemSchema = {
  params: z.object({
    itemId: z.string().uuid('Invalid cart item ID'),
  }),
  body: z.object({
    quantity: z.number().int().gt(0, 'Quantity must be greater than 0'),
  }),
};

export const cartItemIdSchema = {
  params: z.object({
    itemId: z.string().uuid('Invalid cart item ID'),
  }),
};
