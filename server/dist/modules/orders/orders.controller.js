"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const orders_service_1 = require("./orders.service");
const response_1 = require("../../utils/response");
class OrdersController {
    static async listUserOrders(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await orders_service_1.OrdersService.listUserOrders(userId);
            return (0, response_1.sendSuccess)(res, result, 'User orders retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrderById(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const result = await orders_service_1.OrdersService.getOrderById(userId, id);
            return (0, response_1.sendSuccess)(res, result, 'Order details retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async checkout(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await orders_service_1.OrdersService.checkout(userId, req.body);
            return (0, response_1.sendSuccess)(res, result, 'Order placed successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrdersController = OrdersController;
