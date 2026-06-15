"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsController = void 0;
const prescriptions_service_1 = require("./prescriptions.service");
const response_1 = require("../../utils/response");
class PrescriptionsController {
    static async listUserPrescriptions(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await prescriptions_service_1.PrescriptionsService.listUserPrescriptions(userId);
            return (0, response_1.sendSuccess)(res, result, 'User prescriptions retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async getPrescriptionById(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const result = await prescriptions_service_1.PrescriptionsService.getPrescriptionById(userId, id);
            return (0, response_1.sendSuccess)(res, result, 'Prescription retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    static async createPrescription(req, res, next) {
        try {
            const userId = req.user.userId;
            const file = req.file;
            const result = await prescriptions_service_1.PrescriptionsService.createPrescription(userId, file, req.body);
            return (0, response_1.sendSuccess)(res, result, 'Prescription uploaded successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PrescriptionsController = PrescriptionsController;
