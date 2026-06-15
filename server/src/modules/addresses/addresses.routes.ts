// src/modules/addresses/addresses.routes.ts
import { Router } from 'express';
import { AddressesController } from './addresses.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createAddressSchema, updateAddressSchema, addressIdSchema } from './addresses.validation';

const router = Router();

// Protect all address routes
router.use(authenticate as any);

router.get('/', AddressesController.listUserAddresses as any);
router.get('/:id', validate(addressIdSchema), AddressesController.getAddressById as any);
router.post('/', validate(createAddressSchema), AddressesController.createAddress as any);
router.patch('/:id', validate(updateAddressSchema), AddressesController.updateAddress as any);
router.delete('/:id', validate(addressIdSchema), AddressesController.deleteAddress as any);

export default router;
