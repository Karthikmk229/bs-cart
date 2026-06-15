// src/modules/prescriptions/prescriptions.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { PrescriptionsService } from './prescriptions.service';
import { sendSuccess } from '../../utils/response';

export class PrescriptionsController {
  static async listUserPrescriptions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await PrescriptionsService.listUserPrescriptions(userId);
      return sendSuccess(res, result, 'User prescriptions retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getPrescriptionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const result = await PrescriptionsService.getPrescriptionById(userId, id);
      return sendSuccess(res, result, 'Prescription retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createPrescription(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const file = req.file as Express.Multer.File;
      const result = await PrescriptionsService.createPrescription(userId, file, req.body);
      return sendSuccess(res, result, 'Prescription uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}
