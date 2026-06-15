// src/modules/delivery/delivery.controller.ts
import { Request, Response, NextFunction } from 'express';
import { DeliveryService } from './delivery.service';
import { sendSuccess } from '../../utils/response';

export class DeliveryController {
  static async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { pincode } = req.query as { pincode: string };
      const result = await DeliveryService.getDeliverySlotsForPincode(pincode);
      return sendSuccess(res, result, 'Fulfillment slots retrieved');
    } catch (error) {
      next(error);
    }
  }
}
