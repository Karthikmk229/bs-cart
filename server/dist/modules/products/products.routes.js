"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/products/products.routes.ts
const express_1 = require("express");
const products_controller_1 = require("./products.controller");
const validate_1 = require("../../middleware/validate");
const products_validation_1 = require("./products.validation");
const router = (0, express_1.Router)();
router.get('/', (0, validate_1.validate)(products_validation_1.listProductsSchema), products_controller_1.ProductsController.listProducts);
router.get('/:slug', (0, validate_1.validate)(products_validation_1.productSlugSchema), products_controller_1.ProductsController.getProductBySlug);
exports.default = router;
