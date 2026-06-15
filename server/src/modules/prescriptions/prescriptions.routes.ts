// src/modules/prescriptions/prescriptions.routes.ts
import { Router } from 'express';
import { PrescriptionsController } from './prescriptions.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { upload } from '../../middleware/upload';
import { prescriptionIdSchema } from './prescriptions.validation';

const router = Router();

router.use(authenticate as any);

router.get('/', PrescriptionsController.listUserPrescriptions as any);
router.get('/:id', validate(prescriptionIdSchema), PrescriptionsController.getPrescriptionById as any);
router.post('/', upload.single('image'), PrescriptionsController.createPrescription as any);

export default router;
