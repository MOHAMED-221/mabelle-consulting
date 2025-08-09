import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readProjects, writeProjects, getUploadsDir, type Project } from '@/lib/projects';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const projects = readProjects();
  const found = projects.find(p => p.id === id);
  if (!found) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const projects = readProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });

    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    let patch: Partial<Project> = {};
    const newImages: string[] = [];
    let newLogo: string | undefined;

    if (isMultipart) {
      const form = await req.formData();
      const fields = ['nom', 'desc', 'client', 'infos'] as const;
      fields.forEach((f) => {
        const v = form.get(f);
        if (typeof v === 'string') (patch as any)[f] = v;
      });

      const uploadsDir = getUploadsDir();

      const logo = form.get('logo');
      if (logo && logo instanceof File && logo.size > 0) {
        const bytes = Buffer.from(await logo.arrayBuffer());
        const filename = `${Date.now()}-${logo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, bytes);
        newLogo = `/uploads/projects/${filename}`;
      }

      const images = form.getAll('images');
      for (const file of images) {
        if (file instanceof File && file.size > 0) {
          const bytes = Buffer.from(await file.arrayBuffer());
          const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, bytes);
          newImages.push(`/uploads/projects/${filename}`);
        }
      }

      if (newImages.length) patch.images = [ ...(projects[idx].images || []), ...newImages ];
      if (newLogo) patch.logo = newLogo;
    } else {
      const body = await req.json();
      patch = body;
    }

    projects[idx] = { ...projects[idx], ...patch };
    writeProjects(projects);

    return NextResponse.json(projects[idx]);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });

  const [removed] = projects.splice(idx, 1);
  writeProjects(projects);

  return NextResponse.json({ ok: true, removed });
}