"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/orders/orders.routes.ts
const express_1 = require("express");
const orders_controller_1 = require("./orders.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const orders_validation_1 = require("./orders.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', orders_controller_1.OrdersController.listUserOrders);
router.get('/:id', (0, validate_1.validate)(orders_validation_1.orderIdSchema), orders_controller_1.OrdersController.getOrderById);
router.post('/checkout', (0, validate_1.validate)(orders_validation_1.checkoutSchema), orders_controller_1.OrdersController.checkout);
exports.default = router;
