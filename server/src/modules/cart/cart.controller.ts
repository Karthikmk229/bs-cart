// src/modules/cart/cart.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CartService } from './cart.service';
import { sendSuccess } from '../../utils/response';

export class CartController {
  static async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await CartService.getOrCreateCart(userId);
      return sendSuccess(res, result, 'User cart retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { productVariantId, quantity } = req.body;
      const result = await CartService.addItemToCart(userId, productVariantId, quantity);
      return sendSuccess(res, result, 'Item added to cart', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { itemId } = req.params;
      const { quantity } = req.body;
      const result = await CartService.updateCartItem(userId, itemId, quantity);
      return sendSuccess(res, result, 'Cart item updated');
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { itemId } = req.params;
      await CartService.deleteCartItem(userId, itemId);
      return sendSuccess(res, null, 'Cart item deleted');
    } catch (error) {
      next(error);
    }
  }
}
