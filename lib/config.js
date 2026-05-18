export const config = {
  clientUrl: process.env.CLIENT_URL || process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
  serverUrl: process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

export const isStripeConfigured = Boolean(config.stripeSecretKey);
