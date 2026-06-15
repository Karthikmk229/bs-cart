// src/modules/admin/admin.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AdminService } from './admin.service';
import { sendSuccess } from '../../utils/response';

export class AdminController {
  // Stats
  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getStats();
      return sendSuccess(res, stats, 'Admin statistics loaded');
    } catch (error) {
      next(error);
    }
  }

  // Products
  static async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const result = await AdminService.createProduct(adminId, req.body);
      return sendSuccess(res, result, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await AdminService.updateProduct(id, req.body);
      return sendSuccess(res, result, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteProduct(id);
      return sendSuccess(res, null, 'Product deactivated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Inventory
  static async createInventory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createInventory(req.body);
      return sendSuccess(res, result, 'Inventory stock batch logged', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateInventory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantity, expiryDate } = req.body;
      const result = await AdminService.updateInventory(id, quantity, expiryDate);
      return sendSuccess(res, result, 'Inventory updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Coupons
  static async createCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createCoupon(req.body);
      return sendSuccess(res, result, 'Coupon created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Prescriptions
  static async listAllPrescriptions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listAllPrescriptions();
      return sendSuccess(res, result, 'All prescriptions retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async reviewPrescription(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const { id } = req.params;
      const { status, adminRemarks } = req.body;
      const result = await AdminService.reviewPrescription(adminId, id, status, adminRemarks);
      return sendSuccess(res, result, `Prescription ${status}`);
    } catch (error) {
      next(error);
    }
  }

  // Orders
  static async listAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listAllOrders();
      return sendSuccess(res, result, 'All orders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const { id } = req.params;
      const { status, comment } = req.body;
      const result = await AdminService.updateOrderStatus(adminId, id, status, comment);
      return sendSuccess(res, result, `Order status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }
}
