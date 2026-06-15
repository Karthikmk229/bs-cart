// src/modules/orders/orders.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { OrdersService } from './orders.service';
import { sendSuccess } from '../../utils/response';

export class OrdersController {
  static async listUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await OrdersService.listUserOrders(userId);
      return sendSuccess(res, result, 'User orders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const result = await OrdersService.getOrderById(userId, id);
      return sendSuccess(res, result, 'Order details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async checkout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await OrdersService.checkout(userId, req.body);
      return sendSuccess(res, result, 'Order placed successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}
