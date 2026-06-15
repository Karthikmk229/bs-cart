"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterController = void 0;
const newsletter_service_1 = require("./newsletter.service");
const response_1 = require("../../utils/response");
class NewsletterController {
    static async subscribe(req, res, next) {
        try {
            const { email } = req.body;
            const result = await newsletter_service_1.NewsletterService.subscribe(email);
            return (0, response_1.sendSuccess)(res, result, 'Subscribed to newsletter successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async listSubscriptions(req, res, next) {
        try {
            const result = await newsletter_service_1.NewsletterService.listSubscriptions();
            return (0, response_1.sendSuccess)(res, result, 'Newsletter subscriptions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NewsletterController = NewsletterController;
