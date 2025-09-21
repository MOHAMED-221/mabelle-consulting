import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis: name, email, message' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO_EMAIL || 'contact@mabelleconsulting.com';
    const from = process.env.CONTACT_FROM_EMAIL || user || 'no-reply@mabelleconsulting.com';

    if (!host || !user || !pass) {
      return NextResponse.json({ error: 'SMTP non configuré côté serveur.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `Nouveau message de contact – ${name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F1EB;">
        <div style="background: linear-gradient(135deg, #CEA472 0%, #E6CBA0 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Nouveau message de contact !</h1>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px; border-left: 5px solid #CEA472; margin-bottom: 20px;">
          <h2 style="color: #754831; margin-top: 0;">Nom</h2>
          <p style="font-size: 16px; color: #333; font-weight: bold;">${name}</p>
          
          <h2 style="color: #754831;">Email</h2>
          <p style="font-size: 16px; color: #333; font-weight: bold;">${email}</p>
          
          <h2 style="color: #754831;">Message</h2>
          <blockquote style="background: #F5F1EB; padding: 15px; border-left: 3px solid #CEA472; margin: 0; font-style: italic; color: #555;">
            "${String(message).replace(/\n/g, '<br/>')}"
          </blockquote>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Reçu le ${new Date().toLocaleDateString('fr-FR', { 
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
      to,
      from,
      replyTo: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}