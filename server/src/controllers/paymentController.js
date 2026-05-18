import { getProviderBySlug } from '../services/providerService.js';
import { getRequest } from '../services/requestService.js';
import { createCheckoutSession, handleStripeWebhook, paymentConfig } from '../services/stripeService.js';

export function fetchPaymentConfig(_req, res) {
  res.json(paymentConfig());
}

export async function createDepositCheckout(req, res) {
  const request = await getRequest(req.params.id);
  if (!request) {
    res.status(404).json({ error: 'Quote request not found' });
    return;
  }

  const provider = await getProviderBySlug(request.providerSlug);
  const session = await createCheckoutSession(request, provider);
  res.json({ url: session.url, sessionId: session.id });
}

export async function stripeWebhook(req, res) {
  const result = await handleStripeWebhook(req.body, req.headers['stripe-signature']);
  res.json(result);
}
