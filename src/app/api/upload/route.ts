import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const subdir = (form.get('subdir') as string | null) || 'misc';
    const file = form.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
    }

    const uploadsBase = path.join(process.cwd(), 'public', 'uploads');
    const targetDir = path.join(uploadsBase, subdir);
    ensureDir(targetDir);

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(targetDir, filename);

    const bytes = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, bytes);

    const publicUrl = `/uploads/${subdir}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur upload' }, { status: 500 });
  }
}