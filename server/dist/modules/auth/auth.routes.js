"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/auth/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_1 = require("../../middleware/validate");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/send-otp', (0, validate_1.validate)(auth_validation_1.sendOtpSchema), auth_controller_1.AuthController.sendOtp);
router.post('/verify-otp', (0, validate_1.validate)(auth_validation_1.verifyOtpSchema), auth_controller_1.AuthController.verifyOtp);
router.post('/admin-login', (0, validate_1.validate)(auth_validation_1.adminLoginSchema), auth_controller_1.AuthController.adminLogin);
router.post('/refresh', (0, validate_1.validate)(auth_validation_1.refreshSchema), auth_controller_1.AuthController.refresh);
router.post('/logout', (0, validate_1.validate)(auth_validation_1.refreshSchema), auth_controller_1.AuthController.logout);
exports.default = router;
