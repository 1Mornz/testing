import { NextResponse } from 'next/server';
import { paymentConfig } from '@/lib/stripeService';

export async function GET() {
  return NextResponse.json(paymentConfig());
}
