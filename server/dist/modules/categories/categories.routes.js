"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/categories/categories.routes.ts
const express_1 = require("express");
const categories_controller_1 = require("./categories.controller");
const validate_1 = require("../../middleware/validate");
const categories_validation_1 = require("./categories.validation");
const router = (0, express_1.Router)();
router.get('/', (0, validate_1.validate)(categories_validation_1.getCategoriesSchema), categories_controller_1.CategoriesController.getCategoryTree);
exports.default = router;
