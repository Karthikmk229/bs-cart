"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsController = void 0;
const coupons_service_1 = require("./coupons.service");
const response_1 = require("../../utils/response");
class CouponsController {
    static async listCoupons(req, res, next) {
        try {
            const result = await coupons_service_1.CouponsService.listCoupons();
            return (0, response_1.sendSuccess)(res, result, 'Coupons listed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async validateCoupon(req, res, next) {
        try {
            const userId = req.user.userId;
            const { code, subTotal } = req.body;
            const result = await coupons_service_1.CouponsService.validateCoupon(userId, code, subTotal);
            return (0, response_1.sendSuccess)(res, result, 'Coupon code validated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CouponsController = CouponsController;
