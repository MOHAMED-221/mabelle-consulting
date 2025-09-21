import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/simpleStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export type Service = {
  slug: string;
  title: string;
  icon: string; // clé lucide
  image: string; // URL/chemin public
  description: string;
  points: string[];
  gallery?: string[]; // nouvelles images supplémentaires
};

const defaultServices: Service[] = [
  {
    slug: 'production-audiovisuelle',
    title: 'Production audiovisuelle',
    icon: 'clapperboard',
    image: '/images/CNE1.png',
    description: `Films institutionnels & publicitaires, captation d’événements, interviews, motion design, drone…\n\nNous réalisons des contenus audiovisuels sur-mesure pour valoriser votre marque, vos événements et vos messages. Notre équipe gère la production de A à Z : conception, tournage, montage, direction artistique, sound design, diffusion.`,
    points: [
      'Films institutionnels, publicitaires, corporate',
      'Captation d’événements, interviews, témoignages',
      'Motion design, sound design, contenus immersifs',
      'Tournages drone, vidéos 360°',
    ],
    gallery: [],
  },
  {
    slug: 'photographie-professionnelle',
    title: 'Photographie professionnelle',
    icon: 'camera',
    image: '/images/LAMA1.png',
    description: `Shoots produits, corporate, lifestyle, packshots e-commerce, direction artistique…\n\nNous créons des visuels photo impactants pour tous vos supports : catalogue, réseaux sociaux, site web, presse. Notre direction artistique sublime vos produits, équipes et univers.`,
    points: [
      'Shooting produits, corporate, lifestyle',
      'Packshots e-commerce, direction artistique',
      'Moodboards, retouches, gestion de projet',
    ],
    gallery: [],
  },
  {
    slug: 'strategie-branding',
    title: 'Stratégie & Branding',
    icon: 'target',
    image: "/images/O'kraft1.png",
    description: `Positionnement, storytelling, identité visuelle, campagnes multicanal…\n\nNous accompagnons votre marque dans la définition de son identité, la création de sa charte graphique et la mise en place de stratégies de communication puissantes et cohérentes.`,
    points: [
      'Stratégie de marque, positionnement',
      'Storytelling, identité visuelle, logo',
      'Campagnes éditoriales, multicanal',
    ],
    gallery: [],
  },
  {
    slug: 'influence-relations-publiques',
    title: 'Influence & Relations publiques',
    icon: 'megaphone',
    image: '/images/CNE2.png',
    description: `Campagnes avec influenceurs, relations presse, partenariats, veille & image de marque…\n\nNous développons votre notoriété et votre influence grâce à des campagnes sur-mesure, des partenariats stratégiques et une gestion proactive de votre image.`,
    points: [
      'Campagnes influenceurs, relations presse',
      'Partenariats, veille, gestion de crise',
      'Image de marque, e-réputation',
    ],
    gallery: [],
  },
  {
    slug: 'evenementiel',
    title: 'Événementiel',
    icon: 'mic',
    image: "/images/O'kraft2.png",
    description: `Organisation de lancements, conférences, direction artistique, couverture média…\n\nNous orchestrons vos événements de A à Z, de la conception à la coordination, pour des expériences mémorables et impactantes.`,
    points: [
      'Organisation de lancements, conférences',
      'Direction artistique, coordination',
      'Couverture média, logistique',
    ],
    gallery: [],
  },
  {
    slug: 'print-supports-visuels',
    title: 'Print & supports visuels',
    icon: 'printer',
    image: '/images/CNE1.png',
    description: `Affiches, flyers, packagings, PLV, supports événementiels et institutionnels…\n\nNous concevons tous vos supports print avec créativité et rigueur, pour une communication cohérente et percutante.`,
    points: [
      'Affiches, flyers, packagings, PLV',
      'Supports événementiels, institutionnels',
      'Création graphique, impression',
    ],
    gallery: [],
  },
  {
    slug: 'coaching-formations',
    title: 'Coaching & formations',
    icon: 'graduation',
    image: '/images/LAMA2.png',
    description: `Prise de parole en public, ateliers personnalisés (communication, création…)…\n\nNous proposons des formations et coachings sur-mesure pour révéler le potentiel de vos équipes et renforcer vos compétences en communication, créativité et leadership.`,
    points: [
      'Coaching prise de parole, leadership',
      'Ateliers personnalisés, team building',
      'Formations communication, création',
    ],
    gallery: [],
  },
];

export async function GET() {
  const services = (await readJson<Service[]>('services.json', defaultServices)).map(s => ({
    gallery: [],
    ...s,
    gallery: Array.isArray(s.gallery) ? s.gallery : [],
  }));
  return NextResponse.json(services);
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Service[];
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    await writeJson('services.json', body);
    return NextResponse.json(body);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}