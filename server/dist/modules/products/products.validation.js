"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSlugSchema = exports.listProductsSchema = void 0;
// src/modules/products/products.validation.ts
const zod_1 = require("zod");
exports.listProductsSchema = {
    query: zod_1.z.object({
        category: zod_1.z.string().optional(),
        pincode: zod_1.z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits').optional(),
        prescription: zod_1.z.string().transform((v) => v === 'true').optional(),
        perishable: zod_1.z.string().transform((v) => v === 'true').optional(),
        search: zod_1.z.string().optional(),
        priceMin: zod_1.z.string().transform((v) => parseFloat(v)).optional(),
        priceMax: zod_1.z.string().transform((v) => parseFloat(v)).optional(),
        sort: zod_1.z.enum(['priceAsc', 'priceDesc', 'newest', 'name']).default('newest'),
        page: zod_1.z.string().default('1').transform((v) => parseInt(v, 10)),
        limit: zod_1.z.string().default('10').transform((v) => parseInt(v, 10)),
    }),
};
exports.productSlugSchema = {
    params: zod_1.z.object({
        slug: zod_1.z.string().min(1, 'Slug parameter is required'),
    }),
};
