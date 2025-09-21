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

// Valeurs par défaut visibles côté site et admin si aucune donnée n'a encore été sauvegardée
const seedTeam: TeamMember[] = [
  { name: 'Awa Sarr', role: 'Directrice artistique', image: '/images/LAMA1.png' },
  { name: 'Moussa Diop', role: 'Chef de projet', image: "/images/O'kraft1.png" },
  { name: 'Fatou Ndiaye', role: 'Responsable communication', image: '/images/CNE1.png' },
];

const defaults: AboutContent = {
  mission: "Créer des expériences visuelles, émotionnelles et stratégiques, sur-mesure, sans jamais rentrer dans les cases.",
  ceoQuote: "Chez Mabelle Consulting, nous croyons que chaque marque a une histoire unique à raconter...",
  ceoName: 'CEO, Mabelle Consulting',
  team: seedTeam,
  clients: [],
};

export async function GET() {
  const data = await readJson<AboutContent>('about-content.json', defaults);
  // Si une sauvegarde vide existe déjà, exposer quand même l'équipe seed côté admin/public
  const effective = { ...data, team: (data.team && data.team.length > 0) ? data.team : seedTeam };
  return NextResponse.json(effective);
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as AboutContent;
    await writeJson('about-content.json', body);
    return NextResponse.json(body);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}