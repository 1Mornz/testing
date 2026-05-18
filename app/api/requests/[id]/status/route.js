import { NextResponse } from 'next/server';
import { updateRequestStatus } from '@/lib/requestService';
import { jsonError } from '@/lib/apiResponse';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const quoteRequest = await updateRequestStatus(id, (await request.json()).status);
    if (!quoteRequest) return NextResponse.json({ error: 'Quote request not found' }, { status: 404 });
    return NextResponse.json({ request: quoteRequest });
  } catch (error) {
    return jsonError(error);
  }
}
