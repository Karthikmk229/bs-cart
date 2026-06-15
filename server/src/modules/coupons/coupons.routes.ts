// src/modules/coupons/coupons.routes.ts
import { Router } from 'express';
import { CouponsController } from './coupons.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { validateCouponSchema } from './coupons.validation';

const router = Router();

router.use(authenticate as any);

router.get('/', CouponsController.listCoupons as any);
router.post('/validate', validate(validateCouponSchema), CouponsController.validateCoupon as any);

export default router;
