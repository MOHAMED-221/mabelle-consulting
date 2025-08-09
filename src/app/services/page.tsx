'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Clapperboard, Target, Megaphone, Mic, Printer, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';

type Service = { slug: string; title: string; icon: string; image: string; description: string; points: string[] };

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clapperboard: Clapperboard,
  camera: Camera,
  target: Target,
  megaphone: Megaphone,
  mic: Mic,
  printer: Printer,
  graduation: GraduationCap,
};

const fallback: Service[] = [
  { slug: 'production-audiovisuelle', title: 'Production audiovisuelle', icon: 'clapperboard', image: '/images/CNE1.png', description: '', points: [] },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(fallback);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length) setServices(data);
      } catch {}
    })();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-12 md:py-20 px-4"
    >
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col items-center text-center mb-10 md:mb-14">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="px-3 py-1 rounded-full text-xs font-semibold bg-mabelle-gold text-white mb-3">Expertises</motion.span>
        <motion.h1 initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-3xl md:text-5xl font-extrabold text-brown-dark mb-3">Nos services</motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-brown/80 max-w-3xl">Des solutions sur-mesure pour sublimer votre marque.</motion.p>
      </div>

      {/* Cards */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, i) => {
          const Icon = iconMap[s.icon] || Clapperboard;
          return (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.2 + i * 0.07 }} whileHover={{ y: -6 }} className="relative bg-white border-2 border-[#CEA472] rounded-2xl p-7 shadow-xl flex flex-col items-start transition-all duration-300 hover:shadow-2xl overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-mabelle-gold/10" />
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-mabelle-gold text-white text-2xl shadow">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mt-4 mb-2 text-brown-dark">{s.title}</h3>
                <p className="text-brown/80 mb-4 flex-1">{s.description || '—'}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-mabelle-brown font-semibold group-hover:underline">En savoir plus →</span>
              </motion.div>
            </Link>
          );
        })}
      </section>
    </motion.main>
  );
} 