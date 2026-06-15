// src/modules/coupons/coupons.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CouponsService } from './coupons.service';
import { sendSuccess } from '../../utils/response';

export class CouponsController {
  static async listCoupons(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await CouponsService.listCoupons();
      return sendSuccess(res, result, 'Coupons listed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async validateCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { code, subTotal } = req.body;
      const result = await CouponsService.validateCoupon(userId, code, subTotal);
      return sendSuccess(res, result, 'Coupon code validated successfully');
    } catch (error) {
      next(error);
    }
  }
}
