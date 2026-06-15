"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemIdSchema = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
// src/modules/cart/cart.validation.ts
const zod_1 = require("zod");
exports.addToCartSchema = {
    body: zod_1.z.object({
        productVariantId: zod_1.z.string().uuid('Invalid variant ID'),
        quantity: zod_1.z.number().int().gt(0, 'Quantity must be greater than 0'),
    }),
};
exports.updateCartItemSchema = {
    params: zod_1.z.object({
        itemId: zod_1.z.string().uuid('Invalid cart item ID'),
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().int().gt(0, 'Quantity must be greater than 0'),
    }),
};
exports.cartItemIdSchema = {
    params: zod_1.z.object({
        itemId: zod_1.z.string().uuid('Invalid cart item ID'),
    }),
};
