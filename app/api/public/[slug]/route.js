import { NextResponse } from 'next/server';
import { getProviderBySlug } from '@/lib/providerService';
import { seedDemoData } from '@/lib/seedData';

export async function GET(_request, { params }) {
  await seedDemoData();
  const { slug } = await params;
  const settings = await getProviderBySlug(slug);
  if (!settings) return NextResponse.json({ error: 'Quote page not found' }, { status: 404 });
  return NextResponse.json({ settings });
}
