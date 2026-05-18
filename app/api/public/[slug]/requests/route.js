import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { getProviderBySlug } from '@/lib/providerService';
import { createRequest } from '@/lib/requestService';
import { uploadsDir } from '@/lib/jsonStore';
import { jsonError } from '@/lib/apiResponse';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const maxFileSize = 5 * 1024 * 1024;

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const provider = await getProviderBySlug(slug);
    if (!provider) return NextResponse.json({ error: 'Quote page not found' }, { status: 404 });

    const form = await request.formData();
    const input = Object.fromEntries(['customerName', 'phone', 'email', 'serviceNeeded', 'location', 'description', 'timeframe', 'budgetRange'].map((key) => [key, form.get(key) || '']));
    const files = form.getAll('photos').filter((file) => file && file.size);

    if (files.length > 6) {
      const error = new Error('Upload up to 6 photos');
      error.status = 400;
      throw error;
    }

    await mkdir(uploadsDir, { recursive: true });
    const photos = [];
    for (const file of files) {
      if (!allowedTypes.has(file.type)) {
        const error = new Error('Only JPG, PNG, WEBP, and GIF images are allowed');
        error.status = 400;
        throw error;
      }
      if (file.size > maxFileSize) {
        const error = new Error('Each photo must be 5 MB or smaller');
        error.status = 400;
        throw error;
      }

      const ext = path.extname(file.name).toLowerCase() || '.jpg';
      const filename = `${Date.now()}-${nanoid(10)}${ext}`;
      await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
      photos.push({
        id: nanoid(10),
        originalName: file.name,
        filename,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${filename}`,
      });
    }

    const quoteRequest = await createRequest(input, provider, photos);
    return NextResponse.json({ request: quoteRequest }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
