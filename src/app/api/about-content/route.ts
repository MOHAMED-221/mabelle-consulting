import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/simpleStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export type TeamMember = { name: string; role: string; image: string };
export type ClientLogo = { image: string; alt: string };
export type AboutContent = {
  mission: string;
  ceoQuote: string;
  ceoName: string;
  team: TeamMember[];
  clients: ClientLogo[];
};

const defaults: AboutContent = {
  mission: "Créer des expériences visuelles, émotionnelles et stratégiques, sur-mesure, sans jamais rentrer dans les cases.",
  ceoQuote: "Chez Mabelle Consulting, nous croyons que chaque marque a une histoire unique à raconter...",
  ceoName: 'CEO, Mabelle Consulting',
  team: [],
  clients: [],
};

export async function GET() {
  const data = readJson<AboutContent>('about-content.json', defaults);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as AboutContent;
    writeJson('about-content.json', body);
    return NextResponse.json(body);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}