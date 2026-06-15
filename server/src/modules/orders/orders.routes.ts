// src/modules/orders/orders.routes.ts
import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { checkoutSchema, orderIdSchema } from './orders.validation';

const router = Router();

router.use(authenticate as any);

router.get('/', OrdersController.listUserOrders as any);
router.get('/:id', validate(orderIdSchema), OrdersController.getOrderById as any);
router.post('/checkout', validate(checkoutSchema), OrdersController.checkout as any);

export default router;
