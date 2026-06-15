"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionIdSchema = exports.uploadPrescriptionSchema = void 0;
// src/modules/prescriptions/prescriptions.validation.ts
const zod_1 = require("zod");
exports.uploadPrescriptionSchema = {
    body: zod_1.z.object({
        doctorName: zod_1.z.string().optional(),
        issueDate: zod_1.z.string().optional().transform((v) => (v ? new Date(v) : undefined)),
    }),
};
exports.prescriptionIdSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid prescription ID'),
    }),
};
