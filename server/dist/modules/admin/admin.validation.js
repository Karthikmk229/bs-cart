"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.reviewPrescriptionSchema = exports.createCouponSchema = exports.updateInventorySchema = exports.createInventorySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
// src/modules/admin/admin.validation.ts
const zod_1 = require("zod");
exports.createProductSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        slug: zod_1.z.string().min(2),
        description: zod_1.z.string().min(5),
        categoryId: zod_1.z.string().uuid(),
        brand: zod_1.z.string().min(1),
        hsnCode: zod_1.z.string(),
        gstPercent: zod_1.z.number().nonnegative(),
        mrp: zod_1.z.number().positive(),
        sellingPrice: zod_1.z.number().positive(),
        unit: zod_1.z.string(),
        imageUrls: zod_1.z.array(zod_1.z.string()),
        productType: zod_1.z.enum(['grocery', 'medical']),
        requiresPrescription: zod_1.z.boolean().default(false),
        isPerishable: zod_1.z.boolean().default(false),
        shelfLifeDays: zod_1.z.number().int().optional(),
        storageCondition: zod_1.z.enum(['ambient', 'chilled', 'frozen']).default('ambient'),
        manufacturer: zod_1.z.string(),
        countryOfOrigin: zod_1.z.string(),
    }),
};
exports.updateProductSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: exports.createProductSchema.body.partial(),
};
exports.createInventorySchema = {
    body: zod_1.z.object({
        productVariantId: zod_1.z.string().uuid(),
        warehouseId: zod_1.z.string().uuid(),
        batchNo: zod_1.z.string().min(1),
        expiryDate: zod_1.z.string().transform((v) => new Date(v)),
        quantity: zod_1.z.number().int().nonnegative(),
    }),
};
exports.updateInventorySchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().int().nonnegative(),
        expiryDate: zod_1.z.string().transform((v) => new Date(v)).optional(),
    }),
};
exports.createCouponSchema = {
    body: zod_1.z.object({
        code: zod_1.z.string().min(1),
        discountType: zod_1.z.enum(['flat', 'percent']),
        discountValue: zod_1.z.number().positive(),
        minOrderValue: zod_1.z.number().nonnegative().default(0.0),
        maxDiscount: zod_1.z.number().positive().optional(),
        appliesTo: zod_1.z.enum(['all', 'category', 'product']),
        categoryId: zod_1.z.string().uuid().optional(),
        productId: zod_1.z.string().uuid().optional(),
        validFrom: zod_1.z.string().transform((v) => new Date(v)),
        validTo: zod_1.z.string().transform((v) => new Date(v)),
        usageLimit: zod_1.z.number().int().positive().optional(),
        perUserLimit: zod_1.z.number().int().positive().default(1),
    }),
};
exports.reviewPrescriptionSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['approved', 'rejected']),
        adminRemarks: zod_1.z.string().optional(),
    }),
};
exports.updateOrderStatusSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum([
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'out_for_delivery',
            'delivered',
            'cancelled',
            'returned',
        ]),
        comment: zod_1.z.string().optional(),
    }),
};
