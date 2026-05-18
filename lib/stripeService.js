import Stripe from 'stripe';
import { config, isStripeConfigured } from './config.js';
import { attachCheckoutSession, markRequestPaid } from './requestService.js';

let stripeClient = null;

function getStripe() {
  if (!isStripeConfigured) return null;
  if (!stripeClient) stripeClient = new Stripe(config.stripeSecretKey, { apiVersion: '2025-04-30.basil' });
  return stripeClient;
}

export function paymentConfig() {
  return {
    configured: isStripeConfigured,
    message: isStripeConfigured ? null : 'Stripe is not configured. Deposit payments are in demo mode.',
  };
}

export async function createCheckoutSession(request, provider) {
  const stripe = getStripe();
  if (!stripe) {
    const error = new Error('Stripe is not configured');
    error.status = 503;
    error.details = paymentConfig();
    throw error;
  }
  if (!request?.deposit?.enabled) {
    const error = new Error('This request does not require a deposit');
    error.status = 400;
    throw error;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(Number(request.deposit.amount) * 100),
        product_data: {
          name: `${provider.businessName} quote deposit`,
          description: `Quote request from ${request.customerName}`,
        },
      },
    }],
    customer_email: request.email,
    metadata: {
      quoteRequestId: request.id,
      providerSlug: provider.slug,
    },
    success_url: `${config.clientUrl}/success?requestId=${request.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.clientUrl}/cancel?requestId=${request.id}`,
  });

  await attachCheckoutSession(request.id, session.id);
  return session;
}

export async function handleStripeWebhook(rawBody, signature) {
  const stripe = getStripe();
  if (!stripe || !config.stripeWebhookSecret) {
    const error = new Error('Stripe webhook is not configured');
    error.status = 503;
    throw error;
  }
  const event = stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await markRequestPaid(session.metadata?.quoteRequestId, {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
    });
  }
  return { received: true };
}
