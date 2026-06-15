"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliverySlotsSchema = void 0;
// src/modules/delivery/delivery.validation.ts
const zod_1 = require("zod");
exports.getDeliverySlotsSchema = {
    query: zod_1.z.object({
        pincode: zod_1.z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    }),
};
