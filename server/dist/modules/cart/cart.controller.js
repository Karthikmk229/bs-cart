"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
const response_1 = require("../../utils/response");
class CartController {
    static async getCart(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await cart_service_1.CartService.getOrCreateCart(userId);
            return (0, response_1.sendSuccess)(res, result, 'User cart retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async addItem(req, res, next) {
        try {
            const userId = req.user.userId;
            const { productVariantId, quantity } = req.body;
            const result = await cart_service_1.CartService.addItemToCart(userId, productVariantId, quantity);
            return (0, response_1.sendSuccess)(res, result, 'Item added to cart', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateItem(req, res, next) {
        try {
            const userId = req.user.userId;
            const { itemId } = req.params;
            const { quantity } = req.body;
            const result = await cart_service_1.CartService.updateCartItem(userId, itemId, quantity);
            return (0, response_1.sendSuccess)(res, result, 'Cart item updated');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteItem(req, res, next) {
        try {
            const userId = req.user.userId;
            const { itemId } = req.params;
            await cart_service_1.CartService.deleteCartItem(userId, itemId);
            return (0, response_1.sendSuccess)(res, null, 'Cart item deleted');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
