"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesController = void 0;
const addresses_service_1 = require("./addresses.service");
const response_1 = require("../../utils/response");
class AddressesController {
    static async listUserAddresses(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await addresses_service_1.AddressesService.listUserAddresses(userId);
            return (0, response_1.sendSuccess)(res, result, 'User addresses retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async getAddressById(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const result = await addresses_service_1.AddressesService.getAddressById(userId, id);
            return (0, response_1.sendSuccess)(res, result, 'Address retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async createAddress(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await addresses_service_1.AddressesService.createAddress(userId, req.body);
            return (0, response_1.sendSuccess)(res, result, 'Address created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateAddress(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const result = await addresses_service_1.AddressesService.updateAddress(userId, id, req.body);
            return (0, response_1.sendSuccess)(res, result, 'Address updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAddress(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            await addresses_service_1.AddressesService.deleteAddress(userId, id);
            return (0, response_1.sendSuccess)(res, null, 'Address deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AddressesController = AddressesController;
