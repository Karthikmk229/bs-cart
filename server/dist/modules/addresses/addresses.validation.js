"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressIdSchema = exports.updateAddressSchema = exports.createAddressSchema = void 0;
// src/modules/addresses/addresses.validation.ts
const zod_1 = require("zod");
exports.createAddressSchema = {
    body: zod_1.z.object({
        type: zod_1.z.enum(['home', 'work', 'other']),
        addressLine1: zod_1.z.string().min(3, 'Address line 1 must be at least 3 characters'),
        addressLine2: zod_1.z.string().optional(),
        landmark: zod_1.z.string().optional(),
        city: zod_1.z.string().min(2, 'City name is too short'),
        district: zod_1.z.string().min(2, 'District name is too short'),
        state: zod_1.z.string().default('Tamil Nadu'),
        pincode: zod_1.z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
        lat: zod_1.z.number().optional(),
        lng: zod_1.z.number().optional(),
        isDefault: zod_1.z.boolean().default(false),
    }),
};
exports.updateAddressSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid address ID'),
    }),
    body: zod_1.z.object({
        type: zod_1.z.enum(['home', 'work', 'other']).optional(),
        addressLine1: zod_1.z.string().min(3).optional(),
        addressLine2: zod_1.z.string().optional(),
        landmark: zod_1.z.string().optional(),
        city: zod_1.z.string().min(2).optional(),
        district: zod_1.z.string().min(2).optional(),
        state: zod_1.z.string().optional(),
        pincode: zod_1.z.string().regex(/^\d{6}$/).optional(),
        lat: zod_1.z.number().optional(),
        lng: zod_1.z.number().optional(),
        isDefault: zod_1.z.boolean().optional(),
    }),
};
exports.addressIdSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid address ID'),
    }),
};
