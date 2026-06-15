"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const newsletter_validation_1 = require("./newsletter.validation");
const router = (0, express_1.Router)();
// Public subscribe endpoint
router.post('/subscribe', (0, validate_1.validate)(newsletter_validation_1.subscribeNewsletterSchema), newsletter_controller_1.NewsletterController.subscribe);
// Protected endpoint to view subscriptions
router.get('/subscriptions', auth_1.authenticate, (0, auth_1.requireRole)(['admin']), newsletter_controller_1.NewsletterController.listSubscriptions);
exports.default = router;
