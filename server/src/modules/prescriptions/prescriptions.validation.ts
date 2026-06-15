// src/modules/prescriptions/prescriptions.validation.ts
import { z } from 'zod';

export const uploadPrescriptionSchema = {
  body: z.object({
    doctorName: z.string().optional(),
    issueDate: z.string().optional().transform((v) => (v ? new Date(v) : undefined)),
  }),
};

export const prescriptionIdSchema = {
  params: z.object({
    id: z.string().uuid('Invalid prescription ID'),
  }),
};
