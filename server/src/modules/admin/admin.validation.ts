// src/modules/admin/admin.validation.ts
import { z } from 'zod';

export const createProductSchema = {
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(5),
    categoryId: z.string().uuid(),
    brand: z.string().min(1),
    hsnCode: z.string(),
    gstPercent: z.number().nonnegative(),
    mrp: z.number().positive(),
    sellingPrice: z.number().positive(),
    unit: z.string(),
    imageUrls: z.array(z.string()),
    productType: z.enum(['grocery', 'medical']),
    requiresPrescription: z.boolean().default(false),
    isPerishable: z.boolean().default(false),
    shelfLifeDays: z.number().int().optional(),
    storageCondition: z.enum(['ambient', 'chilled', 'frozen']).default('ambient'),
    manufacturer: z.string(),
    countryOfOrigin: z.string(),
  }),
};

export const updateProductSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: createProductSchema.body.partial(),
};

export const createInventorySchema = {
  body: z.object({
    productVariantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    batchNo: z.string().min(1),
    expiryDate: z.string().transform((v) => new Date(v)),
    quantity: z.number().int().nonnegative(),
  }),
};

export const updateInventorySchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    quantity: z.number().int().nonnegative(),
    expiryDate: z.string().transform((v) => new Date(v)).optional(),
  }),
};

export const createCouponSchema = {
  body: z.object({
    code: z.string().min(1),
    discountType: z.enum(['flat', 'percent']),
    discountValue: z.number().positive(),
    minOrderValue: z.number().nonnegative().default(0.0),
    maxDiscount: z.number().positive().optional(),
    appliesTo: z.enum(['all', 'category', 'product']),
    categoryId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    validFrom: z.string().transform((v) => new Date(v)),
    validTo: z.string().transform((v) => new Date(v)),
    usageLimit: z.number().int().positive().optional(),
    perUserLimit: z.number().int().positive().default(1),
  }),
};

export const reviewPrescriptionSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    adminRemarks: z.string().optional(),
  }),
};

export const updateOrderStatusSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum([
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned',
    ]),
    comment: z.string().optional(),
  }),
};
