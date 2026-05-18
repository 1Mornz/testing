import { NextResponse } from 'next/server';
import { getRequest } from '@/lib/requestService';

export async function GET(_request, { params }) {
  const { id } = await params;
  const quoteRequest = await getRequest(id);
  if (!quoteRequest) return NextResponse.json({ error: 'Quote request not found' }, { status: 404 });
  return NextResponse.json({ request: quoteRequest });
}
