import { NextResponse } from 'next/server';
import { getProviderSettings, saveProviderSettings } from '@/lib/providerService';
import { seedDemoData } from '@/lib/seedData';
import { jsonError } from '@/lib/apiResponse';

export async function GET() {
  await seedDemoData();
  return NextResponse.json({ settings: await getProviderSettings() });
}

export async function PUT(request) {
  try {
    const settings = await saveProviderSettings(await request.json());
    return NextResponse.json({ settings });
  } catch (error) {
    return jsonError(error);
  }
}
