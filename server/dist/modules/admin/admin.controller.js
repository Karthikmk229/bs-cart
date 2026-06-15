"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const response_1 = require("../../utils/response");
class AdminController {
    // Stats
    static async getStats(req, res, next) {
        try {
            const stats = await admin_service_1.AdminService.getStats();
            return (0, response_1.sendSuccess)(res, stats, 'Admin statistics loaded');
        }
        catch (error) {
            next(error);
        }
    }
    // Products
    static async createProduct(req, res, next) {
        try {
            const adminId = req.user.userId;
            const result = await admin_service_1.AdminService.createProduct(adminId, req.body);
            return (0, response_1.sendSuccess)(res, result, 'Product created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const result = await admin_service_1.AdminService.updateProduct(id, req.body);
            return (0, response_1.sendSuccess)(res, result, 'Product updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            await admin_service_1.AdminService.deleteProduct(id);
            return (0, response_1.sendSuccess)(res, null, 'Product deactivated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    // Inventory
    static async createInventory(req, res, next) {
        try {
            const result = await admin_service_1.AdminService.createInventory(req.body);
            return (0, response_1.sendSuccess)(res, result, 'Inventory stock batch logged', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateInventory(req, res, next) {
        try {
            const { id } = req.params;
            const { quantity, expiryDate } = req.body;
            const result = await admin_service_1.AdminService.updateInventory(id, quantity, expiryDate);
            return (0, response_1.sendSuccess)(res, result, 'Inventory updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    // Coupons
    static async createCoupon(req, res, next) {
        try {
            const result = await admin_service_1.AdminService.createCoupon(req.body);
            return (0, response_1.sendSuccess)(res, result, 'Coupon created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    // Prescriptions
    static async listAllPrescriptions(req, res, next) {
        try {
            const result = await admin_service_1.AdminService.listAllPrescriptions();
            return (0, response_1.sendSuccess)(res, result, 'All prescriptions retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async reviewPrescription(req, res, next) {
        try {
            const adminId = req.user.userId;
            const { id } = req.params;
            const { status, adminRemarks } = req.body;
            const result = await admin_service_1.AdminService.reviewPrescription(adminId, id, status, adminRemarks);
            return (0, response_1.sendSuccess)(res, result, `Prescription ${status}`);
        }
        catch (error) {
            next(error);
        }
    }
    // Orders
    static async listAllOrders(req, res, next) {
        try {
            const result = await admin_service_1.AdminService.listAllOrders();
            return (0, response_1.sendSuccess)(res, result, 'All orders retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateOrderStatus(req, res, next) {
        try {
            const adminId = req.user.userId;
            const { id } = req.params;
            const { status, comment } = req.body;
            const result = await admin_service_1.AdminService.updateOrderStatus(adminId, id, status, comment);
            return (0, response_1.sendSuccess)(res, result, `Order status updated to ${status}`);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
