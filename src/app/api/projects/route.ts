import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readProjects, writeProjects, nextId, getUploadsDir, type Project } from '@/lib/projects';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const projects = readProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    let payload: Partial<Project> = {};
    let logoPath: string | undefined;
    const imagePaths: string[] = [];

    if (isMultipart) {
      const form = await req.formData();
      const fields = ['nom', 'desc', 'client', 'infos'] as const;
      fields.forEach((f) => {
        const v = form.get(f);
        if (typeof v === 'string') (payload as any)[f] = v;
      });

      const uploadsDir = getUploadsDir();

      const logo = form.get('logo');
      if (logo && logo instanceof File && logo.size > 0) {
        const bytes = Buffer.from(await logo.arrayBuffer());
        const filename = `${Date.now()}-${logo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, bytes);
        logoPath = `/uploads/projects/${filename}`;
      }

      const images = form.getAll('images');
      for (const file of images) {
        if (file instanceof File && file.size > 0) {
          const bytes = Buffer.from(await file.arrayBuffer());
          const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, bytes);
          imagePaths.push(`/uploads/projects/${filename}`);
        }
      }

      payload.images = imagePaths;
      if (logoPath) payload.logo = logoPath;
    } else {
      // JSON
      const body = await req.json();
      payload = body;
    }

    if (!payload.nom || !payload.desc) {
      return NextResponse.json({ error: 'Champs requis: nom, desc' }, { status: 400 });
    }

    const projects = readProjects();
    const id = nextId(projects);

    const project: Project = {
      id,
      nom: payload.nom!,
      desc: payload.desc!,
      client: payload.client || '',
      infos: payload.infos || '',
      images: payload.images || [],
      logo: payload.logo || '',
    };

    projects.push(project);
    writeProjects(projects);

    return NextResponse.json(project, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}