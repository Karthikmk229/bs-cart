import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import { authenticate, requireRole } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { subscribeNewsletterSchema } from './newsletter.validation';

const router = Router();

// Public subscribe endpoint
router.post('/subscribe', validate(subscribeNewsletterSchema), NewsletterController.subscribe as any);

// Protected endpoint to view subscriptions
router.get('/subscriptions', authenticate as any, requireRole(['admin']) as any, NewsletterController.listSubscriptions as any);

export default router;
