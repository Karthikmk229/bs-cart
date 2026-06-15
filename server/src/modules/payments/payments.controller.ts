// src/modules/payments/payments.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';
import { sendSuccess } from '../../utils/response';

export class PaymentsController {
  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.verifyPayment(req.body);
      return sendSuccess(res, result, 'Payment transaction verified');
    } catch (error) {
      next(error);
    }
  }
}
