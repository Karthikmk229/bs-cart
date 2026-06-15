"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCouponSchema = void 0;
// src/modules/coupons/coupons.validation.ts
const zod_1 = require("zod");
exports.validateCouponSchema = {
    body: zod_1.z.object({
        code: zod_1.z.string().min(1, 'Coupon code is required'),
        subTotal: zod_1.z.number().nonnegative('Subtotal must be positive'),
    }),
};
