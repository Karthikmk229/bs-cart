"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/payments/payments.routes.ts
const express_1 = require("express");
const payments_controller_1 = require("./payments.controller");
const validate_1 = require("../../middleware/validate");
const payments_validation_1 = require("./payments.validation");
const router = (0, express_1.Router)();
// Webhook endpoint is usually public so that Razorpay/mock gateways can notify the backend
router.post('/verify', (0, validate_1.validate)(payments_validation_1.verifyPaymentSchema), payments_controller_1.PaymentsController.verifyPayment);
exports.default = router;
