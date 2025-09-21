'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Clapperboard, Target, Megaphone, Mic, Printer, GraduationCap, Award, Users, Sparkles } from 'lucide-react';
import SafeImage from '@/components/SafeImage';

const iconByKey: Record<string, React.ComponentType<{ className?: string }>> = {
  clapperboard: Clapperboard,
  camera: Camera,
  target: Target,
  megaphone: Megaphone,
  mic: Mic,
  printer: Printer,
  graduation: GraduationCap,
};

type Service = { slug: string; title: string; icon: string; image: string; description: string; points: string[] };

export default function ServicePage({ params }: { params: { slug: string } }) {
  const [service, setService] = useState<Service | null | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        const list = (await res.json()) as Service[];
        const found = list.find(s => s.slug === params.slug) || null;
        if (!cancelled) setService(found);
      } catch {
        if (!cancelled) setService(null);
      }
    })();
    return () => { cancelled = true; };
  }, [params.slug]);

  if (service === 'loading') {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">Chargement…</main>
    );
  }

  if (service === null) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="text-brown-dark text-xl font-semibold">Service introuvable</div>
        <Link href="/services" className="px-5 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">Retour aux services</Link>
      </main>
    );
  }

  const Icon = iconByKey[service.icon] || Clapperboard;

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-10 md:py-16 px-4">
      {/* Breadcrumb */}
      <nav className="w-full max-w-4xl text-sm mb-3 text-brown/70">
        <Link href="/services" className="hover:underline">Services</Link>
        <span className="mx-2">/</span>
        <span className="text-brown-dark font-semibold">{service.title}</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Hero image */}
        <div className="relative w-full h-56 md:h-72">
          <SafeImage src={service.image} alt={service.title} className="w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-6 flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-mabelle-gold text-white text-2xl shadow">
              <Icon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">{service.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-lg text-brown/90 mb-8 whitespace-pre-line">
            {service.description}
          </motion.p>

          {/* Features / Points sous forme de cartes */}
          {Array.isArray(service.points) && service.points.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-brown-dark mb-4">Ce que nous proposons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.points.map((pt, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="flex items-start gap-3 p-4 border rounded-xl bg-white/70">
                    <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-mabelle-gold flex-shrink-0" />
                    <span className="text-brown-dark">{pt}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Galerie d'images si disponible */}
          {Array.isArray((service as any).gallery) && (service as any).gallery.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-brown-dark mb-4">Exemples récents</h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {(service as any).gallery.map((img: string, i: number) => (
                  <div key={i} className="w-64 h-40 rounded-xl overflow-hidden border flex-shrink-0">
                    <SafeImage src={img} alt={`Exemple ${i + 1} - ${service.title}`} className="w-full h-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pourquoi nous choisir */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-brown-dark mb-4">Pourquoi nous choisir</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ Icon: Award, title: 'Qualité premium', text: 'Exigence et excellence à chaque étape.' }, { Icon: Users, title: 'Équipe dédiée', text: 'Accompagnement humain et réactif.' }, { Icon: Sparkles, title: 'Créativité', text: 'Idées originales et impactantes.' }].map(({ Icon: Cmp, title, text }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 * i }} className="p-5 rounded-2xl border bg-white/70 shadow-sm">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-mabelle-gold text-white mb-3"><Cmp className="w-5 h-5" /></div>
                  <div className="font-semibold text-brown-dark mb-1">{title}</div>
                  <div className="text-brown/80 text-sm">{text}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <a href="/contact" className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">Demander un devis</a>
            <Link href="/services" className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-[#CEA472] text-mabelle-brown font-semibold shadow hover:bg-mabelle-gold hover:text-white transition-colors">Retour aux services</Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 