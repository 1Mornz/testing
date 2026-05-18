import { NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/lib/stripeService';
import { jsonError } from '@/lib/apiResponse';

export async function POST(request) {
  try {
    const rawBody = Buffer.from(await request.arrayBuffer());
    const result = await handleStripeWebhook(rawBody, request.headers.get('stripe-signature'));
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error);
  }
}
