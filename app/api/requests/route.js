import { NextResponse } from 'next/server';
import { listRequests } from '@/lib/requestService';
import { seedDemoData } from '@/lib/seedData';

export async function GET() {
  await seedDemoData();
  return NextResponse.json({ requests: await listRequests() });
}
