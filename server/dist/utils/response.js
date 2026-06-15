"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Operation successful', statusCode = 200) {
    const responseBody = {
        success: true,
        data,
        message,
        errors: null,
    };
    return res.status(statusCode).json(responseBody);
}
function sendError(res, message = 'An error occurred', errors = null, statusCode = 400) {
    const responseBody = {
        success: false,
        data: null,
        message,
        errors,
    };
    return res.status(statusCode).json(responseBody);
}
