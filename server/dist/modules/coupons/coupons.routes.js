"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/coupons/coupons.routes.ts
const express_1 = require("express");
const coupons_controller_1 = require("./coupons.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const coupons_validation_1 = require("./coupons.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', coupons_controller_1.CouponsController.listCoupons);
router.post('/validate', (0, validate_1.validate)(coupons_validation_1.validateCouponSchema), coupons_controller_1.CouponsController.validateCoupon);
exports.default = router;
