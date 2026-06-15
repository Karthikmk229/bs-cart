// src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, requireRole } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  createInventorySchema,
  updateInventorySchema,
  createCouponSchema,
  reviewPrescriptionSchema,
  updateOrderStatusSchema,
} from './admin.validation';

const router = Router();

// Secure all endpoints under Admin
router.use(authenticate as any);
router.use(requireRole(['admin']) as any);

// Statistics
router.get('/stats', AdminController.getStats as any);

// Products CRUD
router.post('/products', validate(createProductSchema), AdminController.createProduct as any);
router.patch('/products/:id', validate(updateProductSchema), AdminController.updateProduct as any);
router.delete('/products/:id', AdminController.deleteProduct as any);

// Inventory CRUD
router.post('/inventory', validate(createInventorySchema), AdminController.createInventory as any);
router.patch('/inventory/:id', validate(updateInventorySchema), AdminController.updateInventory as any);

// Coupon CRUD
router.post('/coupons', validate(createCouponSchema), AdminController.createCoupon as any);

// Prescriptions Review
router.get('/prescriptions', AdminController.listAllPrescriptions as any);
router.patch('/prescriptions/:id/review', validate(reviewPrescriptionSchema), AdminController.reviewPrescription as any);

// Order Management
router.get('/orders', AdminController.listAllOrders as any);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), AdminController.updateOrderStatus as any);

export default router;
