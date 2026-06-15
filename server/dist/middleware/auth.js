"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_1.sendError)(res, 'Authentication token missing or invalid', null, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Invalid or expired access token', [error.message], 401);
    }
}
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.sendError)(res, 'User not authenticated', null, 401);
        }
        if (!roles.includes(req.user.role)) {
            return (0, response_1.sendError)(res, 'Forbidden: Insufficient permissions', null, 403);
        }
        next();
    };
}
