import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/simpleStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export type MissionSlide = { img: string; text: string };
export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  missionHome: string;
  servicesIntro: string;
  values: Array<{ title: string; subtitle: string }>;
  ctaText: string;
  heroSlider: string[]; // images de la page d'accueil (hero)
  missionSlides: MissionSlide[]; // slides mission (image + texte)
};

const defaultContent: SiteContent = {
  heroTitle: 'Mabelle Consulting',
  heroSubtitle: 'Votre histoire, notre vision 360°',
  missionHome: "Nous ne racontons pas juste des histoires. Nous construisons des identités qui inspirent et qui durent.",
  servicesIntro: 'Des solutions sur-mesure pour sublimer votre marque: stratégie, contenus, production audiovisuelle, événementiel et plus encore.',
  values: [
    { title: 'Professionnalisme', subtitle: 'Rigueur stratégique et excellence' },
    { title: 'Créativité', subtitle: 'Idées originales et audace' },
    { title: 'Accompagnement humain', subtitle: 'Proximité et sur-mesure' },
    { title: 'Innovation', subtitle: 'Veille & solutions nouvelles' }
  ],
  ctaText: "let's work together",
  heroSlider: [
    '/images/CNE1.png',
    '/images/LAMA1.png',
    "/images/O'kraft1.png",
    '/images/CNE2.png',
    '/images/LAMA2.png',
    "/images/O'kraft2.png",
  ],
  missionSlides: [
    { img: '/images/CNE2.png', text: 'Créer des expériences visuelles puissantes pour les marques et institutions.' },
    { img: '/images/LAMA2.png', text: 'Accompagner nos clients avec créativité, professionnalisme et audace.' },
    { img: "/images/O'kraft2.png", text: "Innover sans cesse pour révéler l'identité unique de chaque projet." },
  ],
};

export async function GET() {
  const data = readJson<SiteContent>('site-content.json', defaultContent);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const current = readJson<SiteContent>('site-content.json', defaultContent);
    const next = { ...current, ...body } as SiteContent;
    writeJson('site-content.json', next);
    return NextResponse.json(next);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}