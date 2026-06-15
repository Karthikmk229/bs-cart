"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/cart/cart.routes.ts
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const cart_validation_1 = require("./cart.validation");
const router = (0, express_1.Router)();
// Enforce authentication on all cart paths
router.use(auth_1.authenticate);
router.get('/', cart_controller_1.CartController.getCart);
router.post('/items', (0, validate_1.validate)(cart_validation_1.addToCartSchema), cart_controller_1.CartController.addItem);
router.patch('/items/:itemId', (0, validate_1.validate)(cart_validation_1.updateCartItemSchema), cart_controller_1.CartController.updateItem);
router.delete('/items/:itemId', (0, validate_1.validate)(cart_validation_1.cartItemIdSchema), cart_controller_1.CartController.deleteItem);
exports.default = router;
