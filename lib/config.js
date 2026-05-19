const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
const appUrl = process.env.CLIENT_URL || process.env.NEXT_PUBLIC_CLIENT_URL || vercelUrl || 'http://localhost:3000';

export const config = {
  clientUrl: appUrl,
  serverUrl: process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || appUrl,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

export const isStripeConfigured = Boolean(config.stripeSecretKey);
