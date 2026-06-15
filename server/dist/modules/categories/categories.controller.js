"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const categories_service_1 = require("./categories.service");
const response_1 = require("../../utils/response");
class CategoriesController {
    static async getCategoryTree(req, res, next) {
        try {
            const { productType } = req.query;
            const tree = await categories_service_1.CategoriesService.getCategoryTree(productType);
            return (0, response_1.sendSuccess)(res, tree, 'Category tree retrieved');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoriesController = CategoriesController;
