"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendThanksgivingEmail = sendThanksgivingEmail;
// src/utils/email.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
async function sendThanksgivingEmail(email) {
    // Clean credentials of inline comments and spaces
    const cleanUser = env_1.env.SMTP_USER?.split('#')[0].trim();
    const cleanPass = env_1.env.SMTP_PASS?.split('#')[0].replace(/\s+/g, '');
    const isSmtpConfigured = env_1.env.SMTP_HOST &&
        env_1.env.SMTP_PORT &&
        cleanUser &&
        cleanPass &&
        cleanUser !== 'your-email@gmail.com' &&
        cleanPass !== 'your-google-app-password';
    const subject = 'Thank you for subscribing to BS cart!';
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8f9ff;">
      <h2 style="color: #006c49;">Thank you for subscribing to BS cart!</h2>
      <p>Dear Subscriber,</p>
      <p>Thank you so much for subscribing to our newsletter! We are thrilled to have you join the BS cart community.</p>
      <p>Get ready to receive the freshest farm produce updates, essential health tips, and exclusive offers straight to your inbox.</p>
      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Warm regards,<br /><strong>The BS cart Team</strong><br />Certified Pharmacy & Grocery Delivery, Tamil Nadu</p>
    </div>
  `;
    if (isSmtpConfigured) {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: env_1.env.SMTP_HOST,
                port: env_1.env.SMTP_PORT,
                secure: env_1.env.SMTP_PORT === 465, // true for 465, false for other ports
                auth: {
                    user: cleanUser,
                    pass: cleanPass,
                },
            });
            await transporter.sendMail({
                from: `"BS cart" <${cleanUser}>`,
                to: email,
                subject: subject,
                html: htmlContent,
            });
            console.log(`[Email Service] Thanksgiving email sent successfully to ${email} via SMTP.`);
        }
        catch (error) {
            console.error(`[Email Service Error] Failed to send email to ${email} via SMTP:`, error);
        }
    }
    else {
        // Stub logging the Thanksgiving / Welcome email as fallback
        console.log(`\n==================================================`);
        console.log(`[Email Service Stub] Sending Thanksgiving Email`);
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:`);
        console.log(`  Dear Subscriber,`);
        console.log(`  `);
        console.log(`  Thank you so much for subscribing to our newsletter!`);
        console.log(`  We are thrilled to have you join the BS cart community.`);
        console.log(`  Get ready to receive the freshest farm produce updates,`);
        console.log(`  essential health tips, and exclusive offers straight to your inbox.`);
        console.log(`  `);
        console.log(`  Warm regards,`);
        console.log(`  The BS cart Team`);
        console.log(`  (Note: SMTP not fully configured in .env, fell back to stub)`);
        console.log(`==================================================\n`);
    }
}
