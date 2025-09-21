import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const subdir = (form.get('subdir') as string | null) || 'misc';
    const file = form.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
    }

    const sanitizedName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `uploads/${subdir}/${Date.now()}-${sanitizedName}`;

    const blob = await put(pathname, file as any, {
      access: 'public',
      addRandomSuffix: false,
      // Optional: cache for 30 days for images; adjust if needed
      cacheControlMaxAge: 2592000,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    } as any);

    return NextResponse.json({ url: blob.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur upload' }, { status: 500 });
  }
}