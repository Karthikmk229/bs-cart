"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesSchema = void 0;
// src/modules/categories/categories.validation.ts
const zod_1 = require("zod");
exports.getCategoriesSchema = {
    query: zod_1.z.object({
        productType: zod_1.z.enum(['grocery', 'medical']).optional(),
    }),
};
