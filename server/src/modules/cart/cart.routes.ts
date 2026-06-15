// src/modules/cart/cart.routes.ts
import { Router } from 'express';
import { CartController } from './cart.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { addToCartSchema, updateCartItemSchema, cartItemIdSchema } from './cart.validation';

const router = Router();

// Enforce authentication on all cart paths
router.use(authenticate as any);

router.get('/', CartController.getCart as any);
router.post('/items', validate(addToCartSchema), CartController.addItem as any);
router.patch('/items/:itemId', validate(updateCartItemSchema), CartController.updateItem as any);
router.delete('/items/:itemId', validate(cartItemIdSchema), CartController.deleteItem as any);

export default router;
