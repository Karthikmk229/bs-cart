// src/modules/categories/categories.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
import { sendSuccess } from '../../utils/response';

export class CategoriesController {
  static async getCategoryTree(req: Request, res: Response, next: NextFunction) {
    try {
      const { productType } = req.query as { productType?: 'grocery' | 'medical' };
      const tree = await CategoriesService.getCategoryTree(productType);
      return sendSuccess(res, tree, 'Category tree retrieved');
    } catch (error) {
      next(error);
    }
  }
}
