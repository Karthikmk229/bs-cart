"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/admin/admin.routes.ts
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const admin_validation_1 = require("./admin.validation");
const router = (0, express_1.Router)();
// Secure all endpoints under Admin
router.use(auth_1.authenticate);
router.use((0, auth_1.requireRole)(['admin']));
// Statistics
router.get('/stats', admin_controller_1.AdminController.getStats);
// Products CRUD
router.post('/products', (0, validate_1.validate)(admin_validation_1.createProductSchema), admin_controller_1.AdminController.createProduct);
router.patch('/products/:id', (0, validate_1.validate)(admin_validation_1.updateProductSchema), admin_controller_1.AdminController.updateProduct);
router.delete('/products/:id', admin_controller_1.AdminController.deleteProduct);
// Inventory CRUD
router.post('/inventory', (0, validate_1.validate)(admin_validation_1.createInventorySchema), admin_controller_1.AdminController.createInventory);
router.patch('/inventory/:id', (0, validate_1.validate)(admin_validation_1.updateInventorySchema), admin_controller_1.AdminController.updateInventory);
// Coupon CRUD
router.post('/coupons', (0, validate_1.validate)(admin_validation_1.createCouponSchema), admin_controller_1.AdminController.createCoupon);
// Prescriptions Review
router.get('/prescriptions', admin_controller_1.AdminController.listAllPrescriptions);
router.patch('/prescriptions/:id/review', (0, validate_1.validate)(admin_validation_1.reviewPrescriptionSchema), admin_controller_1.AdminController.reviewPrescription);
// Order Management
router.get('/orders', admin_controller_1.AdminController.listAllOrders);
router.patch('/orders/:id/status', (0, validate_1.validate)(admin_validation_1.updateOrderStatusSchema), admin_controller_1.AdminController.updateOrderStatus);
exports.default = router;
