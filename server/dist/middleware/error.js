"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const response_1 = require("../utils/response");
function errorHandler(err, req, res, next) {
    console.error('[Error Handler] Caught error:', err);
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || (err.stack && process.env.NODE_ENV === 'development' ? [err.stack] : null);
    return (0, response_1.sendError)(res, message, errors, statusCode);
}
