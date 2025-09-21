import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/simpleStore';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export type Testimonial = { author: string; text: string };

const defaultTestimonials: Testimonial[] = [
  { author: 'Fatou D.', text: 'Une équipe créative, à l’écoute et très professionnelle.' },
  { author: 'M. Ndiaye', text: 'Un accompagnement sur-mesure et des contenus puissants.' },
];

export async function GET() {
  const data = await readJson<Testimonial[]>('testimonials.json', defaultTestimonials);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { author: string; text: string };
    if (!body.author?.trim() || !body.text?.trim()) {
      return NextResponse.json({ error: 'Auteur et texte requis' }, { status: 400 });
    }

    const newTestimonial: Testimonial = {
      author: body.author.trim(),
      text: body.text.trim()
    };

    // Lire les témoignages existants
    const existing = await readJson<Testimonial[]>('testimonials.json', defaultTestimonials);
    
    // Ajouter le nouveau témoignage
    const updated = [...existing, newTestimonial];
    await writeJson('testimonials.json', updated);

    // Envoyer l'email de notification
    await sendTestimonialNotification(newTestimonial);

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (e: any) {
    console.error('Erreur lors de l\'ajout du témoignage:', e);
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Testimonial[];
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    await writeJson('testimonials.json', body);
    return NextResponse.json(body);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}

async function sendTestimonialNotification(testimonial: Testimonial) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL || 'contact@mabelleconsulting.com';
  const from = process.env.CONTACT_FROM_EMAIL || user || 'no-reply@mabelleconsulting.com';

  // Si les variables SMTP ne sont pas configurées, on continue sans erreur
  if (!host || !user || !pass) {
    console.log('SMTP non configuré côté serveur - notification email ignorée');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = '🌟 Nouveau témoignage sur Mabelle Consulting';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F1EB;">
        <div style="background: linear-gradient(135deg, #CEA472 0%, #E6CBA0 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✨ Nouveau témoignage reçu !</h1>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px; border-left: 5px solid #CEA472; margin-bottom: 20px;">
          <h2 style="color: #754831; margin-top: 0;">👤 Auteur</h2>
          <p style="font-size: 16px; color: #333; font-weight: bold;">${testimonial.author}</p>
          
          <h2 style="color: #754831;">💬 Témoignage</h2>
          <blockquote style="background: #F5F1EB; padding: 15px; border-left: 3px solid #CEA472; margin: 0; font-style: italic; color: #555;">
            "${testimonial.text}"
          </blockquote>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            📅 Reçu le ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p style="margin: 10px 0 0 0; color: #CEA472; font-weight: bold;">
            Mabelle Consulting - Votre histoire, notre vision 360°
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log('Email de notification envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    // On ne fait pas échouer la création du témoignage si l'email échoue
  }
}