import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/simpleStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export type Testimonial = { author: string; text: string };

const defaultTestimonials: Testimonial[] = [
  { author: 'Fatou D.', text: 'Une équipe créative, à l’écoute et très professionnelle.' },
  { author: 'M. Ndiaye', text: 'Un accompagnement sur-mesure et des contenus puissants.' },
];

export async function GET() {
  const data = readJson<Testimonial[]>('testimonials.json', defaultTestimonials);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Testimonial[];
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    writeJson('testimonials.json', body);
    return NextResponse.json(body);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}