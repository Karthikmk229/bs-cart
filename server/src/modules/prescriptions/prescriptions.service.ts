// src/modules/prescriptions/prescriptions.service.ts
import { prisma } from '../../config/db';
import { R2Service } from '../storage/r2.service';

export class PrescriptionsService {
  static async listUserPrescriptions(userId: string) {
    return prisma.prescription.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  static async getPrescriptionById(userId: string, id: string) {
    const prescription = await prisma.prescription.findFirst({
      where: { id, userId },
    });
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    return prescription;
  }

  static async createPrescription(userId: string, file: Express.Multer.File, body: any) {
    if (!file) {
      throw new Error('Prescription image/PDF file is required');
    }

    const imageUrl = await R2Service.uploadFile(file);

    return prisma.prescription.create({
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
