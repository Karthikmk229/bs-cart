"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/addresses/addresses.routes.ts
const express_1 = require("express");
const addresses_controller_1 = require("./addresses.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const addresses_validation_1 = require("./addresses.validation");
const router = (0, express_1.Router)();
// Protect all address routes
router.use(auth_1.authenticate);
router.get('/', addresses_controller_1.AddressesController.listUserAddresses);
router.get('/:id', (0, validate_1.validate)(addresses_validation_1.addressIdSchema), addresses_controller_1.AddressesController.getAddressById);
router.post('/', (0, validate_1.validate)(addresses_validation_1.createAddressSchema), addresses_controller_1.AddressesController.createAddress);
router.patch('/:id', (0, validate_1.validate)(addresses_validation_1.updateAddressSchema), addresses_controller_1.AddressesController.updateAddress);
router.delete('/:id', (0, validate_1.validate)(addresses_validation_1.addressIdSchema), addresses_controller_1.AddressesController.deleteAddress);
exports.default = router;
