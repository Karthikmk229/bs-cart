"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsService = void 0;
// src/modules/prescriptions/prescriptions.service.ts
const db_1 = require("../../config/db");
const r2_service_1 = require("../storage/r2.service");
class PrescriptionsService {
    static async listUserPrescriptions(userId) {
        return db_1.prisma.prescription.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    static async getPrescriptionById(userId, id) {
        const prescription = await db_1.prisma.prescription.findFirst({
            where: { id, userId },
        });
        if (!prescription) {
            throw new Error('Prescription not found');
        }
        return prescription;
    }
    static async createPrescription(userId, file, body) {
        if (!file) {
            throw new Error('Prescription image/PDF file is required');
        }
        const imageUrl = await r2_service_1.R2Service.uploadFile(file);
        return db_1.prisma.prescription.create({
            data: {
                userId,
                imageUrl,
                doctorName: body.doctorName || 'Unknown Doctor',
                issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
                status: 'pending',
            },
        });
    }
}
exports.PrescriptionsService = PrescriptionsService;
