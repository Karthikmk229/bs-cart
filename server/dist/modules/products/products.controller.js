"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const products_service_1 = require("./products.service");
const response_1 = require("../../utils/response");
class ProductsController {
    static async listProducts(req, res, next) {
        try {
            const result = await products_service_1.ProductsService.listProducts(req.query);
            return (0, response_1.sendSuccess)(res, result, 'Products retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getProductBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const pincode = req.query.pincode;
            const result = await products_service_1.ProductsService.getProductBySlug(slug, pincode);
            return (0, response_1.sendSuccess)(res, result, 'Product details retrieved');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductsController = ProductsController;
