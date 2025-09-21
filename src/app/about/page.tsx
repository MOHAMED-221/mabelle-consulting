'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SafeImage from '@/components/SafeImage';
import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, Users, Lightbulb } from 'lucide-react';

type TeamMember = { name: string; role: string; image: string };
// Équipe par défaut (fallback)
const fallbackTeam: TeamMember[] = [
  { name: 'Awa Sarr', role: 'Directrice artistique', image: '/images/LAMA1.png' },
  { name: 'Moussa Diop', role: 'Chef de projet', image: "/images/O'kraft1.png" },
  { name: 'Fatou Ndiaye', role: 'Responsable communication', image: '/images/CNE1.png' },
];

type ClientLogo = { image: string; alt: string };
type AboutContent = {
  mission: string;
  ceoQuote: string;
  ceoName: string;
  team: TeamMember[];
  clients: ClientLogo[];
};

export default function About() {
  // Ajout du hook useTypewriter localement (copié depuis page.tsx)
  function useTypewriter(text: string, speed = 40) {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
      setDisplayed('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, [text, speed]);
    return displayed;
  }

  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [showAllTeam, setShowAllTeam] = useState(false);
  const teamScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/about-content', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAboutData(data);
      } catch {}
    };
    load();
    const onFocus = () => load();
    const onVisibility = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const itv = setInterval(load, 20000);
    return () => { cancelled = true; window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVisibility); clearInterval(itv); };
  }, []);

  // Team computed once to reuse in carousel and modal
  const team: TeamMember[] = (aboutData?.team && aboutData.team.length > 0)
    ? aboutData.team
    : fallbackTeam;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-[70vh] bg-gradient-to-b from-gold-light via-white to-gold/10 flex flex-col items-center justify-start py-0"
    >
      {/* Bannière avec logo */}
      <section className="w-full bg-gold py-12 flex flex-col items-center justify-center text-center shadow-lg relative">
        <Image src="/images/LOGO Mabelle-01.png" alt="Logo Mabelle Consulting" width={220} height={220} className="mx-auto mb-4 rounded-full bg-white p-2 shadow-lg" />
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl font-extrabold text-brown-dark mb-2 drop-shadow-lg">À propos de Mabelle Consulting</motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-lg max-w-2xl mx-auto text-brown-dark/90 font-medium">Agence de communication 360° et de production audiovisuelle à Dakar. Créative, professionnelle et audacieuse, nous accompagnons marques, institutions et entrepreneurs dans la création de contenus puissants, la stratégie de marque, le branding, l’influence, la formation et l’événementiel.</motion.p>
      </section>

      {/* Mission & valeurs animées */}
      <section className="w-full max-w-5xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-2xl font-bold mb-4 text-brown-dark">Notre mission</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7 }} className="text-lg text-brown/90 mb-6">Créer des expériences visuelles, émotionnelles et stratégiques, sur-mesure, sans jamais rentrer dans les cases.</motion.p>
          <motion.div className="grid grid-cols-2 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.18 } }, hidden: {} }}>
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }} className="flex items-center gap-3 bg-gold-light/40 rounded-lg p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-mabelle-gold text-white">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-semibold text-brown-dark">{useTypewriter('Professionnalisme', 24)}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring', delay: 0.1 }} className="flex items-center gap-3 bg-gold-light/40 rounded-lg p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-mabelle-gold text-white">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-semibold text-brown-dark">{useTypewriter('Créativité', 24)}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring', delay: 0.2 }} className="flex items-center gap-3 bg-gold-light/40 rounded-lg p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-mabelle-gold text-white">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-semibold text-brown-dark">{useTypewriter('Accompagnement humain', 24)}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring', delay: 0.3 }} className="flex items-center gap-3 bg-gold-light/40 rounded-lg p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-mabelle-gold text-white">
                <Lightbulb className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-semibold text-brown-dark">{useTypewriter('Innovation', 24)}</span>
            </motion.div>
          </motion.div>
        </div>
        {/* Ambiance/équipe en image */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center items-center">
          <Image src="/images/LAMA1.png" alt="Ambiance équipe Mabelle" width={400} height={300} className="rounded-xl shadow-lg object-cover" />
        </motion.div>
      </section>

      {/* Section équipe animée (dynamique) */}
      <section className="w-full max-w-5xl px-4 py-12 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brown-dark text-center">Notre équipe</h2>
        <div className="relative w-full">
          {/* Flèches */}
          {team.length > 3 && (
            <>
              <button
                aria-label="Défiler à gauche"
                onClick={() => teamScrollerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-2 shadow"
              >
                ←
              </button>
              <button
                aria-label="Défiler à droite"
                onClick={() => teamScrollerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-2 shadow"
              >
                →
              </button>
            </>
          )}

          {/* Carrousel horizontal */}
          <motion.div
            ref={teamScrollerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
          >
            {team.map((m, idx) => (
              <motion.div
                key={`${m.name}-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="snap-start flex-shrink-0 w-64 bg-white/90 rounded-xl p-6 shadow-lg flex flex-col items-center"
              >
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3 shadow">
                  <SafeImage src={m.image} alt={m.name} className="w-full h-full" />
                </div>
                <span className="font-semibold text-brown-dark text-lg text-center">{m.name}</span>
                <span className="text-brown/80 text-sm text-center">{m.role}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {team.length > 0 && (
          <button
            onClick={() => setShowAllTeam(true)}
            className="mt-6 px-5 py-2 rounded-full bg-mabelle-gold text-white text-sm font-semibold shadow hover:bg-mabelle-brown transition-colors"
          >
            Voir toute l'équipe
          </button>
        )}
      </section>

      {/* Modal: liste complète de l'équipe */}
      {showAllTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6">
            <button
              aria-label="Fermer"
              onClick={() => setShowAllTeam(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-brown/10 hover:bg-brown/20 text-brown flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="text-xl md:text-2xl font-bold text-brown-dark mb-4">Toute l'équipe</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto scrollbar-hide pr-2">
              {team.map((m, idx) => (
                <div key={`${m.name}-${idx}-full`} className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
                  <div className="w-[110px] h-[110px] rounded-full overflow-hidden mb-3 shadow">
                    <SafeImage src={m.image} alt={m.name} className="w-full h-full" />
                  </div>
                  <span className="font-semibold text-brown-dark text-center text-sm md:text-base">{m.name}</span>
                  <span className="text-brown/80 text-xs md:text-sm text-center">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section vision & engagements animée (logos dynamiques si dispo) */}
      <section className="w-full max-w-4xl px-4 py-12 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brown-dark text-center">Notre vision & nos engagements</h2>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-gold-light/30 rounded-2xl shadow-xl p-8 flex flex-col gap-6 items-center">
          <p className="text-lg text-brown-dark text-center max-w-2xl">Chez Mabelle Consulting, nous croyons que chaque marque a une histoire unique à révéler. Notre engagement : accompagner nos clients avec passion, créativité et exigence, pour des résultats sur-mesure et durables.</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            <motion.li initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3"><Image src="/images/acomepagnement_humain.png" alt="Écoute & proximité" width={28} height={28} className="object-contain" /> <span className="text-brown-dark font-semibold">Écoute & proximité</span></motion.li>
            <motion.li initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-3"><Image src="/images/inovation.png" alt="Engagement éthique" width={28} height={28} className="object-contain" /> <span className="text-brown-dark font-semibold">Engagement éthique</span></motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex items-center gap-3"><Image src="/images/créativitée.png" alt="Créativité sur-mesure" width={28} height={28} className="object-contain" /> <span className="text-brown-dark font-semibold">Créativité sur-mesure</span></motion.li>
            <motion.li initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center gap-3"><Image src="/images/proffessionalisme.png" alt="Résultats mesurables" width={28} height={28} className="object-contain" /> <span className="text-brown-dark font-semibold">Résultats mesurables</span></motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Section Clients & partenaires (dynamique si fourni) */}
      <section className="w-full max-w-5xl px-4 py-12 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brown-dark text-center">Ils nous font confiance</h2>
        {aboutData?.clients && aboutData.clients.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {aboutData.clients.map((c, idx) => (
              <Image key={idx} src={c.image} alt={c.alt || 'Client'} width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <Image src="/images/Logo_CNE.png" alt="CNE" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
            <Image src="/images/Logo_LAMA.png" alt="Lama Boutique" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
            <Image src="/images/Logo_O'kraft.png" alt="O'Kraft" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
            <Image src="/images/logo_SOBOA.png" alt="SOBOA" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
          </div>
        )}
      </section>
    </motion.main>
  );
} 