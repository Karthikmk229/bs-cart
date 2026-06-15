import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { sendThanksgivingEmail } from '../../utils/email';

export class NewsletterService {
  static async subscribe(email: string) {
    // 1. Save locally to Prisma dev.db
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    let result = existing;
    if (!existing) {
      result = await prisma.newsletterSubscription.create({
        data: { email },
      });
      
      // Send thanksgiving welcome email to the subscriber
      await sendThanksgivingEmail(email);
    }

    // 2. Sync to remote Cloudflare D1 database asynchronously using D1 REST API
    if (result && env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_D1_DATABASE_ID && env.CLOUDFLARE_API_TOKEN) {
      const id = result.id;
      const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_D1_DATABASE_ID}/query`;
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          },
          body: JSON.stringify({
            sql: 'INSERT INTO newsletter_subscriptions (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING;',
            params: [id, email],
          }),
        });
        
        if (!response.ok) {
          const body = await response.text();
          console.error(`[Cloudflare D1 Sync Error] Status: ${response.status}, Body: ${body}`);
        } else {
          console.log(`[Cloudflare D1 Sync Success] Synced ${email} to remote D1.`);
        }
      } catch (err) {
        console.error('[Cloudflare D1 Connection Error] Failed to fetch:', err);
      }
    }

    return result;
  }

  static async listSubscriptions() {
    return prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
