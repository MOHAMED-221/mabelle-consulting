'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { Camera, Clapperboard, Lightbulb, Megaphone, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useInView } from 'framer-motion';

const sliderImages = [
  "/images/CNE1.png",
  "/images/LAMA1.png",
  "/images/O'kraft1.png",
  "/images/CNE2.png",
  "/images/LAMA2.png",
  "/images/O'kraft2.png",
];

const missionSlides = [
  {
    img: "/images/CNE2.png",
    text: "Créer des expériences visuelles puissantes pour les marques et institutions."
  },
  {
    img: "/images/LAMA2.png",
    text: "Accompagner nos clients avec créativité, professionnalisme et audace."
  },
  {
    img: "/images/O'kraft2.png",
    text: "Innover sans cesse pour révéler l'identité unique de chaque projet."
  },
];

function useCountUp(target: number, duration = 1000, start = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!start) {
      // Réinitialiser tant que non démarré
      setCount(0);
      if (ref.current) clearTimeout(ref.current);
      return;
    }
    let currentValue = 0;
    const step = Math.ceil(target / (duration / 16));
    function update() {
      currentValue += step;
      if (currentValue >= target) {
        setCount(target);
        if (ref.current) clearTimeout(ref.current);
      } else {
        setCount(currentValue);
        ref.current = setTimeout(update, 16);
      }
    }
    setCount(0);
    update();
    return () => {
      if (ref.current) clearTimeout(ref.current);
      return undefined;
    };
  }, [target, duration, start]);
  return count;
}

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

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = gauche, 1 = droite
  const [missionIdx, setMissionIdx] = useState(0);
  const [heroTitle, setHeroTitle] = useState('Mabelle Consulting');
  const [heroSubtitle, setHeroSubtitle] = useState("Votre histoire, notre vision 360°");
  const [missionText, setMissionText] = useState("Nous ne racontons pas juste des histoires. Nous construisons des identités qui inspirent et qui durent.");
  const [servicesIntro, setServicesIntro] = useState('Des solutions sur-mesure pour sublimer votre marque.');
  const [heroImages, setHeroImages] = useState<string[]>(sliderImages);
  const [missionData, setMissionData] = useState<{ img: string; text: string }[]>(missionSlides);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsSectionRef, { once: true, amount: 0.4 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/site-content', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.missionHome) setMissionText(data.missionHome);
        if (data.servicesIntro) setServicesIntro(data.servicesIntro);
        if (Array.isArray(data.heroSlider) && data.heroSlider.length) setHeroImages(data.heroSlider);
        if (Array.isArray(data.missionSlides) && data.missionSlides.length) setMissionData(data.missionSlides);
      } catch {}
    })();
  }, []);

  // Autoplay slider hero
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMissionIdx((prev) => (prev + 1) % missionData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [missionData.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-light via-white to-gold/10 flex flex-col items-center justify-start font-sans">
      {/* Hero avec slider d'images */}
      <section className="w-full relative h-[380px] md:h-[460px] flex items-center justify-center overflow-hidden bg-gold shadow-lg">
        <div className="absolute top-6 left-6 z-20">
          <Image src="/images/LOGO Mabelle-01.png" alt="Logo Mabelle Consulting" width={84} height={84} className="rounded-full bg-white/80 p-2 shadow-lg" />
        </div>
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ x: direction === 1 ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: direction === 1 ? '-100%' : '100%' }}
              transition={{ duration: 1.0, ease: [0.4, 0.01, 0.2, 1] }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={{ zIndex: 2 }}
            >
              {/* Arrière-plan flouté en cover pour remplir sans coupes visibles */}
              <div className="absolute inset-0 -z-10">
                <Image
                  src={heroImages[current]}
                  alt=""
                  fill
                  className="object-cover w-full h-full scale-110 blur-xl opacity-70"
                  priority
                />
              </div>
              {/* Image principale en contain pour éviter toute coupe */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={heroImages[current]}
                  alt={`Visuel ${current + 1}`}
                  fill
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              {/* Overlay léger pour lisibilité du texte */}
              <div className="absolute inset-0 bg-black/25" />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Boutons navigation slider */}
        <button
          onClick={() => {
            setDirection(-1);
            setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-2 shadow-lg transition-all"
          aria-label="Image précédente"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % heroImages.length);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-2 shadow-lg transition-all"
          aria-label="Image suivante"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full border ${i === current ? 'bg-mabelle-gold border-[#CEA472]' : 'bg-white/70 border-white/80'} mx-1 transition-all`} />
          ))}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center z-10 select-none px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3">{heroTitle}</h1>
          <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow mb-5">{heroSubtitle}</p>
        </div>
      </section>

      {/* Présentation rapide sous forme de texte typewriter */}
      <section className="w-full max-w-3xl px-4 py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brown-dark">Notre mission</h2>
        <div className="w-full flex items-center justify-center min-h-[80px]">
          <p className="text-2xl md:text-3xl text-brown-dark font-semibold text-center max-w-2xl mx-auto" style={{letterSpacing: '0.01em'}}>
            {useTypewriter(missionText, 32)}
            <span className="animate-pulse text-gold-dark">|</span>
          </p>
        </div>
      </section>

      {/* NOS SERVICES (icônes Lucide + liens) */}
      <section className="w-full max-w-6xl px-4 py-12 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-brown-dark">NOS SERVICES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-2 group">
              <span className="w-10 h-10 rounded-lg bg-mabelle-gold text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Clapperboard className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-semibold text-mabelle-brown">{useTypewriter("Production de Film", 30)}</h3>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-brown-dark">De l’institutionnel au plus décalé, nos productions donnent vie à vos idées avec <strong>justesse et originalité</strong>.</motion.p>
          </motion.div>
          {/* Service 2 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2 group">
              <span className="w-10 h-10 rounded-lg bg-mabelle-gold text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Camera className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-semibold text-mabelle-brown">{useTypewriter("Photographie Professionnelle", 30)}</h3>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="text-brown-dark">Une communication réussie commence par une image forte et maîtrisée. <strong>Mabelle Consulting</strong> organise et réalise des prises de vues capturant l’essence de votre marque avec créativité et qualité.</motion.p>
          </motion.div>
          {/* Service 3 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-2 group">
              <span className="w-10 h-10 rounded-lg bg-mabelle-gold text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Target className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-semibold text-mabelle-brown">{useTypewriter("Conseil & Expertise", 30)}</h3>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }} className="text-brown-dark">Nous vous accompagnons à chaque étape de votre projet, offrant un conseil stratégique et une expertise pointue en gestion de communication, pour garantir la <strong>cohérence et l’efficacité</strong> de votre image.</motion.p>
          </motion.div>
          {/* Service 4 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-2 group">
              <span className="w-10 h-10 rounded-lg bg-mabelle-gold text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Lightbulb className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-semibold text-mabelle-brown">{useTypewriter("Image aérienne", 30)}</h3>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }} className="text-brown-dark">Donnez une nouvelle dimension à votre communication grâce à nos prises de vue aériennes, pour des contenus <strong>innovants, spectaculaires et impactants</strong>.</motion.p>
          </motion.div>
          {/* Service 5 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
            <div className="flex items-center gap-3 mb-2 group">
              <span className="w-10 h-10 rounded-lg bg-mabelle-gold text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Megaphone className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-semibold text-mabelle-brown">{useTypewriter("Stratégie de communication", 30)}</h3>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} className="text-brown-dark">Nous élaborons avec vous des stratégies sur mesure, alignées avec vos objectifs, pour maximiser l’impact de votre message et <strong>renforcer la relation</strong> avec votre audience.</motion.p>
          </motion.div>
          {/* Service 6 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }}>
            <div className="flex items-center gap-3 mb-2 group">
              <span className="w-10 h-10 rounded-lg bg-mabelle-gold text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-semibold text-mabelle-brown">{useTypewriter("Branding & storytelling", 30)}</h3>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }} className="text-brown-dark">Nous construisons une identité de marque forte et authentique, en racontant votre histoire avec justesse et émotion pour créer un <strong>lien durable</strong> avec votre public.</motion.p>
          </motion.div>
        </div>
        <div className="mt-8 flex justify-center">
          <a href="/services" className="px-6 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">Voir tous nos services</a>
        </div>
      </section>

      {/* Section Réalisations (home) */}
      <section className="w-full max-w-6xl px-4 py-12 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-brown-dark">Réalisations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'CNE', img: '/images/CNE1.png' },
            { title: 'Lama Boutique', img: '/images/LAMA1.png' },
            { title: "O'Kraft", img: "/images/O'kraft1.png" },
          ].map((item, i) => (
            <Link key={item.title} href="/realisations" className="group">
              <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-[#CEA472]">
                <Image src={item.img} alt={item.title} fill className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
                  <span className="text-white font-semibold text-lg drop-shadow">{item.title}</span>
                  <span className="px-3 py-1 rounded-full bg-mabelle-gold text-white text-sm font-semibold shadow">Voir</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a href="/realisations" className="px-6 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">Voir toutes nos réalisations</a>
        </div>
      </section>

      {/* Section Nos valeurs créative et immersive avec images */}
      <section className="w-full max-w-5xl px-4 py-16 flex flex-col items-center relative overflow-visible">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gold-light/60 via-white/80 to-gold/40 rounded-3xl blur-sm" />
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-brown-dark text-center">Nos valeurs</h2>
        <motion.div
          className="flex flex-col md:flex-row md:justify-between gap-10 w-full items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.18 } }, hidden: {} }}
        >
          {/* Professionnalisme */}
          <motion.div
            className="relative group flex flex-col items-center bg-white/90 rounded-2xl p-0 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl md:translate-y-0 -translate-y-2 md:w-1/4 w-full overflow-hidden h-56"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
          >
            <Image src="/images/proffessionalisme.png" alt="Professionnalisme" fill className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6">
              <span className="font-bold text-white text-lg text-center mb-1">{useTypewriter('Professionnalisme', 24)}</span>
              <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-white/90 text-center text-sm">Rigueur stratégique et excellence</motion.span>
            </div>
          </motion.div>
          {/* Créativité */}
          <motion.div
            className="relative group flex flex-col items-center bg-white/90 rounded-2xl p-0 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl md:-translate-y-8 md:w-1/4 w-full overflow-hidden h-56"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.1 }}
          >
            <Image src="/images/créativitée.png" alt="Créativité" fill className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6">
              <span className="font-bold text-white text-lg text-center mb-1">{useTypewriter('Créativité', 24)}</span>
              <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-white/90 text-center text-sm">Idées originales et audace</motion.span>
            </div>
          </motion.div>
          {/* Accompagnement humain */}
          <motion.div
            className="relative group flex flex-col items-center bg-white/90 rounded-2xl p-0 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl md:translate-y-0 -translate-y-2 md:w-1/4 w-full overflow-hidden h-56"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
          >
            <Image src="/images/acomepagnement_humain.png" alt="Accompagnement humain" fill className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6">
              <span className="font-bold text-white text-lg text-center mb-1">{useTypewriter('Accompagnement humain', 24)}</span>
              <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-white/90 text-center text-sm">Proximité et sur-mesure</motion.span>
            </div>
          </motion.div>
          {/* Innovation */}
          <motion.div
            className="relative group flex flex-col items-center bg-white/90 rounded-2xl p-0 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl md:-translate-y-8 md:w-1/4 w-full overflow-hidden h-56"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.3 }}
          >
            <Image src="/images/inovation.png" alt="Innovation" fill className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6">
              <span className="font-bold text-white text-lg text-center mb-1">{useTypewriter('Innovation', 24)}</span>
              <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-white/90 text-center text-sm">Veille & solutions nouvelles</motion.span>
            </div>
          </motion.div>
        </motion.div>
        {/* Citation animée */}
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative italic text-brown-dark text-2xl md:text-3xl text-center mt-12 max-w-2xl mx-auto px-8 py-8 rounded-3xl shadow-lg bg-gradient-to-br from-gold-light/40 via-white/80 to-gold/20 border-l-8 border-gold-dark"
          style={{ fontFamily: '"Dancing Script", cursive', letterSpacing: '0.01em' }}
        >
          <span className="absolute left-4 top-2 text-5xl text-gold-dark select-none" aria-hidden="true">“</span>
          <span className="inline-block animate-pulse text-gold-dark font-bold mr-2">{useTypewriter("Chez Mabelle Consulting, chaque projet est une aventure humaine, créative et ambitieuse.", 32)}</span>
          <span className="absolute right-4 bottom-2 text-5xl text-gold-dark select-none" aria-hidden="true">”</span>
        </motion.blockquote>
      </section>

      {/* Section chiffres clés animée */}
      <section ref={statsSectionRef} className="w-full max-w-5xl px-4 py-12 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brown-dark text-center">Nos chiffres clés</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {/* Projets réalisés */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col items-center bg-white/80 rounded-xl p-6 shadow-lg">
            <span className="text-4xl font-extrabold text-gold-dark mb-2">{useCountUp(12, 900, statsInView)}+</span>
            <span className="font-semibold text-brown-dark text-lg text-center">Projets réalisés</span>
          </motion.div>
          {/* Clients accompagnés */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="flex flex-col items-center bg-white/80 rounded-xl p-6 shadow-lg">
            <span className="text-4xl font-extrabold text-gold-dark mb-2">{useCountUp(10, 900, statsInView)}+</span>
            <span className="font-semibold text-brown-dark text-lg text-center">Clients accompagnés</span>
          </motion.div>
          {/* Secteurs d'activité */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="flex flex-col items-center bg-white/80 rounded-xl p-6 shadow-lg">
            <span className="text-4xl font-extrabold text-gold-dark mb-2">{useCountUp(12, 900, statsInView)}</span>
            <span className="font-semibold text-brown-dark text-lg text-center">Secteurs d'activité</span>
          </motion.div>
          {/* Satisfaction client */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col items-center bg-white/80 rounded-xl p-6 shadow-lg">
            <span className="text-4xl font-extrabold text-gold-dark mb-2">{useCountUp(100, 900, statsInView)}%</span>
            <span className="font-semibold text-brown-dark text-lg text-center">Satisfaction client</span>
          </motion.div>
        </div>
      </section>

      {/* Section Clients & partenaires */}
      <section className="w-full max-w-5xl px-4 py-12 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brown-dark text-center">Ils nous font confiance</h2>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <Image src="/images/Logo_CNE.png" alt="CNE" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
          <Image src="/images/Logo_LAMA.png" alt="Lama Boutique" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
          <Image src="/images/Logo_O'kraft.png" alt="O'Kraft" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
          <Image src="/images/logo_SOBOA.png" alt="SOBOA" width={80} height={80} className="object-contain grayscale hover:grayscale-0 transition-all" />
        </div>
      </section>

      {/* Call to action premium */}
      <section className="w-full flex flex-col items-center py-12">
        <div className="bg-mabelle-overlay rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center max-w-2xl w-full">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center drop-shadow">let's work together</h3>
          <a href="/contact" className="bg-mabelle-gold text-white font-semibold rounded px-8 py-4 text-lg shadow-lg hover:bg-mabelle-brown transition-colors">Demander un devis</a>
        </div>
      </section>
    </div>
  );
}
