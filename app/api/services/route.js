import { NextResponse } from 'next/server';
import { listPublicProviders } from '@/lib/providerService';
import { seedDemoData } from '@/lib/seedData';

export async function GET(request) {
  await seedDemoData();
  const query = new URL(request.url).searchParams.get('q') || '';
  return NextResponse.json({ services: await listPublicProviders(query) });
}
