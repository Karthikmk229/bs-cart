"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const delivery_service_1 = require("./delivery.service");
const response_1 = require("../../utils/response");
class DeliveryController {
    static async getSlots(req, res, next) {
        try {
            const { pincode } = req.query;
            const result = await delivery_service_1.DeliveryService.getDeliverySlotsForPincode(pincode);
            return (0, response_1.sendSuccess)(res, result, 'Fulfillment slots retrieved');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DeliveryController = DeliveryController;
