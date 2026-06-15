// src/modules/products/products.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service';
import { sendSuccess } from '../../utils/response';

export class ProductsController {
  static async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductsService.listProducts(req.query);
      return sendSuccess(res, result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const pincode = req.query.pincode as string | undefined;
      const result = await ProductsService.getProductBySlug(slug, pincode);
      return sendSuccess(res, result, 'Product details retrieved');
    } catch (error) {
      next(error);
    }
  }
}
