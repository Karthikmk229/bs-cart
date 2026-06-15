"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
class AuthController {
    static async sendOtp(req, res, next) {
        try {
            const { phone } = req.body;
            const result = await auth_service_1.AuthService.sendOtp(phone);
            return (0, response_1.sendSuccess)(res, result, 'OTP code sent');
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyOtp(req, res, next) {
        try {
            const { phone, code, name, email } = req.body;
            const result = await auth_service_1.AuthService.verifyOtp(phone, code, name, email);
            return (0, response_1.sendSuccess)(res, result, 'OTP verified successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.adminLogin(email, password);
            return (0, response_1.sendSuccess)(res, result, 'Staff logged in successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            return (0, response_1.sendSuccess)(res, result, 'Access token refreshed');
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await auth_service_1.AuthService.logout(refreshToken);
            return (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
