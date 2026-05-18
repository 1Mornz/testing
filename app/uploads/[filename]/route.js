import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { uploadsDir } from '@/lib/jsonStore';

const contentTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function GET(_request, { params }) {
  const { filename } = await params;
  const safeName = path.basename(filename);
  if (safeName !== filename) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  try {
    const file = await readFile(path.join(uploadsDir, safeName));
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentTypes[path.extname(safeName).toLowerCase()] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
