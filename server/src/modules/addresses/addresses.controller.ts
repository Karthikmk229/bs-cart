// src/modules/addresses/addresses.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AddressesService } from './addresses.service';
import { sendSuccess } from '../../utils/response';

export class AddressesController {
  static async listUserAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await AddressesService.listUserAddresses(userId);
      return sendSuccess(res, result, 'User addresses retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getAddressById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const result = await AddressesService.getAddressById(userId, id);
      return sendSuccess(res, result, 'Address retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await AddressesService.createAddress(userId, req.body);
      return sendSuccess(res, result, 'Address created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const result = await AddressesService.updateAddress(userId, id, req.body);
      return sendSuccess(res, result, 'Address updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      await AddressesService.deleteAddress(userId, id);
      return sendSuccess(res, null, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
