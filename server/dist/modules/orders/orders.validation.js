"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdSchema = exports.checkoutSchema = void 0;
// src/modules/orders/orders.validation.ts
const zod_1 = require("zod");
exports.checkoutSchema = {
    body: zod_1.z.object({
        addressId: zod_1.z.string().uuid('Invalid address ID'),
        deliverySlotId: zod_1.z.string().uuid('Invalid delivery slot ID'),
        paymentMethod: zod_1.z.enum(['upi', 'card', 'netbanking', 'cod', 'wallet']),
        couponCode: zod_1.z.string().optional(),
        prescriptionId: zod_1.z.string().uuid('Invalid prescription ID').optional(),
        notes: zod_1.z.string().optional(),
    }),
};
exports.orderIdSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid order ID'),
    }),
};
