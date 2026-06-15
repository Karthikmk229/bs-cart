// src/modules/addresses/addresses.validation.ts
import { z } from 'zod';

export const createAddressSchema = {
  body: z.object({
    type: z.enum(['home', 'work', 'other']),
    addressLine1: z.string().min(3, 'Address line 1 must be at least 3 characters'),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2, 'City name is too short'),
    district: z.string().min(2, 'District name is too short'),
    state: z.string().default('Tamil Nadu'),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    lat: z.number().optional(),
    lng: z.number().optional(),
    isDefault: z.boolean().default(false),
  }),
};

export const updateAddressSchema = {
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
  body: z.object({
    type: z.enum(['home', 'work', 'other']).optional(),
    addressLine1: z.string().min(3).optional(),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2).optional(),
    district: z.string().min(2).optional(),
    state: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/).optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    isDefault: z.boolean().optional(),
  }),
};

export const addressIdSchema = {
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
};
