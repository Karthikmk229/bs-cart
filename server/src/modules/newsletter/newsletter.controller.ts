import { Request, Response, NextFunction } from 'express';
import { NewsletterService } from './newsletter.service';
import { sendSuccess } from '../../utils/response';

export class NewsletterController {
  static async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await NewsletterService.subscribe(email);
      return sendSuccess(res, result, 'Subscribed to newsletter successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NewsletterService.listSubscriptions();
      return sendSuccess(res, result, 'Newsletter subscriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
