// src/modules/delivery/delivery.routes.ts
import { Router } from 'express';
import { DeliveryController } from './delivery.controller';
import { validate } from '../../middleware/validate';
import { getDeliverySlotsSchema } from './delivery.validation';

const router = Router();

router.get('/', validate(getDeliverySlotsSchema), DeliveryController.getSlots);

export default router;
