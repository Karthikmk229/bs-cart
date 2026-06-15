"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/delivery/delivery.routes.ts
const express_1 = require("express");
const delivery_controller_1 = require("./delivery.controller");
const validate_1 = require("../../middleware/validate");
const delivery_validation_1 = require("./delivery.validation");
const router = (0, express_1.Router)();
router.get('/', (0, validate_1.validate)(delivery_validation_1.getDeliverySlotsSchema), delivery_controller_1.DeliveryController.getSlots);
exports.default = router;
