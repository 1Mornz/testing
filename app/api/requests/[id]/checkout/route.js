import { NextResponse } from 'next/server';
import { getProviderBySlug } from '@/lib/providerService';
import { getRequest } from '@/lib/requestService';
import { createCheckoutSession } from '@/lib/stripeService';
import { jsonError } from '@/lib/apiResponse';

export async function POST(_request, { params }) {
  try {
    const { id } = await params;
    const quoteRequest = await getRequest(id);
    if (!quoteRequest) return NextResponse.json({ error: 'Quote request not found' }, { status: 404 });
    const provider = await getProviderBySlug(quoteRequest.providerSlug);
    const session = await createCheckoutSession(quoteRequest, provider);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return jsonError(error);
  }
}
