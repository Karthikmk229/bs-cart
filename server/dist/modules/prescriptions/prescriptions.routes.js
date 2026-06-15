"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/prescriptions/prescriptions.routes.ts
const express_1 = require("express");
const prescriptions_controller_1 = require("./prescriptions.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const upload_1 = require("../../middleware/upload");
const prescriptions_validation_1 = require("./prescriptions.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', prescriptions_controller_1.PrescriptionsController.listUserPrescriptions);
router.get('/:id', (0, validate_1.validate)(prescriptions_validation_1.prescriptionIdSchema), prescriptions_controller_1.PrescriptionsController.getPrescriptionById);
router.post('/', upload_1.upload.single('image'), prescriptions_controller_1.PrescriptionsController.createPrescription);
exports.default = router;
