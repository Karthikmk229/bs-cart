"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const payments_service_1 = require("./payments.service");
const response_1 = require("../../utils/response");
class PaymentsController {
    static async verifyPayment(req, res, next) {
        try {
            const result = await payments_service_1.PaymentsService.verifyPayment(req.body);
            return (0, response_1.sendSuccess)(res, result, 'Payment transaction verified');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentsController = PaymentsController;
