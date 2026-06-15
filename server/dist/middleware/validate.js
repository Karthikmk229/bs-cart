"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
function validate(schema) {
    return async (req, res, next) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query);
            }
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                }));
                return (0, response_1.sendError)(res, 'Validation failed', formattedErrors, 400);
            }
            return (0, response_1.sendError)(res, 'Validation error occurred', null, 400);
        }
    };
}
