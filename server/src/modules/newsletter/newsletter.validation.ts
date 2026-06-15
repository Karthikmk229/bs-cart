import { z } from 'zod';

export const subscribeNewsletterSchema = {
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
};
