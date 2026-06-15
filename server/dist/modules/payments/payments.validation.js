"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = void 0;
// src/modules/payments/payments.validation.ts
const zod_1 = require("zod");
exports.verifyPaymentSchema = {
    body: zod_1.z.object({
        razorpayOrderId: zod_1.z.string().min(1, 'Razorpay order ID is required'),
        razorpayPaymentId: zod_1.z.string().min(1, 'Razorpay payment ID is required'),
        status: zod_1.z.enum(['success', 'failed']),
    }),
};
