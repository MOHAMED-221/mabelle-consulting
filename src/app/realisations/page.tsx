'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import SafeImage from "@/components/SafeImage";

type Project = {
  id?: number;
  nom: string;
  desc: string;
  client?: string;
  infos?: string;
  images: string[];
  logo?: string;
};

const staticProjects: Project[] = [
  {
    nom: "CNE",
    desc: "Banque d’images corporate",
    client: "Conseil National de l'Entrepreneuriat CNE",
    infos: "Le CNE est une organisation patronale regroupant les TPE et PME. Il intervient dans différents secteurs : industrie, BTP, services, commerce, artisanat, professions libérales.\n\nNotre mission était de réaliser une banque d'images corporate mettant en avant le personnel, les valeurs de l’entreprise. Mabelleconsulting s’est chargée du casting en interne, du stylisme, DA.",
    images: ["/images/CNE1.png", "/images/CNE2.png"],
    logo: "/images/Logo_CNE.png",
  },
  {
    nom: "Lama Boutique",
    desc: "Shooting textile & direction artistique",
    client: "Lama Boutique",
    infos: "Découvrez notre réalisation exceptionnelle de la banque d’image des tissus de Lama boutique. Lama boutique est spécialisée dans la vente de tissus et accessoires de tous genres.\n\nUn shooting destiné à la communication interne et externe ainsi qu’aux différents supports de communication de la boutique.\n\nNous avons créé une collection d'images de qualité supérieure pour mettre en avant la qualité des différents tissus et motifs que Lama boutique propose. Une direction artistique de bout en bout en allant du casting, au stylisme et aux conseils.",
    images: ["/images/LAMA1.png", "/images/LAMA2.png"],
    logo: "/images/Logo_LAMA.png",
  },
  {
    nom: "O’Kraft",
    desc: "Banque d’image industrielle (sacs papier)",
    client: "O’Kraft",
    infos: "O’kraft a sollicité notre expertise pour leur première banque d’image destinée à leur site internet et autres supports de communications de l’entreprise.\n\nNotre objectif était de mettre en avant l’usine, le dynamisme du personnel y compris la gestion complète de la production, la qualité des sacs…",
    images: ["/images/O'kraft1.png", "/images/O'kraft2.png"],
    logo: "/images/Logo_O'kraft.png",
  },
  {
    nom: "SOBOA",
    desc: "Shooting produit",
    client: "SOBOA",
    infos: "SOBOA – Banque d’images industrielle\nSOBOA a fait appel à nous pour mettre en valeur l’environnement industriel et humain de l’usine à travers une banque d’images destinée à la communication interne et externe.\n\nNotre mission :\n- Direction artistique complète\n- Mise en lumière des lignes de production, du personnel et des infrastructures\n- Shooting photo sur site, dans une approche esthétique et professionnelle\n\nRésultat :\nDes visuels percutants utilisés pour : site web, réseaux sociaux, supports corporate & institutionnels.",
    images: [],
    logo: "/images/logo_SOBOA.png",
  },
];

export default function Realisations() {
  const [projets, setProjets] = useState<Project[]>(staticProjects);
  const [selected, setSelected] = useState<number | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Charger les projets depuis l'API
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) return;
        const data: Project[] = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) setProjets(data);
      } catch {
        // silent fallback
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Fermer la modale avec la touche Echap
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") setCarouselIdx(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight" && selected !== null && Array.isArray(projets[selected]?.images) && projets[selected].images.length)
        setCarouselIdx(i => Math.min(projets[selected].images.length - 1, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, projets]);

  useEffect(() => {
    setCarouselIdx(0);
  }, [selected]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-0 px-4"
    >
      {/* Header visuel */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 py-12 md:py-20">
        <div className="flex-1 flex flex-col items-start">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 text-brown-dark text-left drop-shadow-lg"
          >
            Nos réalisations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg md:text-xl text-brown/80 mb-4 max-w-xl"
          >
            Découvrez quelques-uns de nos projets phares, réalisés avec passion et créativité pour nos clients. Chaque réalisation est le fruit d'une collaboration sur-mesure, alliant expertise, innovation et sens du détail.
          </motion.p>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/images/LOGO Mabelle-01.png" alt="Mabelle Logo" width={220} height={220} className="rounded-2xl shadow-xl bg-white p-4 object-contain" />
        </div>
      </div>
      {/* Grille projets */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projets.map((p, idx) => (
          <motion.div
            key={`${p.nom}-${idx}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 + idx * 0.1 }}
            className="relative bg-white border border-gold-dark rounded-2xl shadow-xl flex flex-col items-center transition-transform duration-300 hover:scale-[1.04] hover:shadow-2xl cursor-pointer group overflow-hidden min-h-[340px]"
            tabIndex={0}
            aria-label={`Voir le projet ${p.nom}`}
            onClick={() => setSelected(idx)}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && setSelected(idx)}
          >
            {/* Image d'aperçu ou logo */}
            <div className="w-full h-44 relative">
              {p.images && p.images[0] ? (
                <SafeImage src={p.images[0]} alt={`Aperçu ${p.nom}`} className="w-full h-full" imgClassName="transition-transform duration-300 group-hover:scale-105" />
              ) : (
                p.logo ? <SafeImage src={p.logo} alt={`Logo ${p.nom}`} className="w-full h-full" /> : <div className="w-full h-full bg-gold-light" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {/* Contenu */}
            <div className="flex flex-col items-center justify-center p-5 w-full flex-1">
              <h3 className="font-bold text-xl mb-1 text-brown-dark text-center drop-shadow-lg">{p.nom}</h3>
              <p className="text-base text-brown/80 text-center mb-2">{p.desc}</p>
              {p.client && p.client.trim().toLowerCase() !== p.nom.trim().toLowerCase() && (
                <span className="text-xs text-gold-dark font-semibold mb-2">{p.client}</span>
              )}
              <button className="mt-auto px-5 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">Voir le projet</button>
            </div>
          </motion.div>
        ))}
      </section>
      {/* Modale projet animée */}
      <AnimatePresence>
        {selected !== null && projets[selected] && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              ref={modalRef}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border-2 border-gold-dark shadow-2xl max-w-2xl w-full p-8 relative flex flex-col items-center"
              onClick={e => e.stopPropagation()}
              tabIndex={-1}
            >
              <button className="absolute top-3 right-3 text-brown-dark text-3xl font-bold hover:text-gold-dark focus:outline-gold-dark" onClick={() => setSelected(null)} aria-label="Fermer la modale">&times;</button>
              <h2 className="text-2xl font-bold text-brown-dark mb-2 text-center">{projets[selected].nom}</h2>
              {projets[selected].client && projets[selected].client.trim().toLowerCase() !== projets[selected].nom.trim().toLowerCase() && (
                <div className="text-gold-dark font-semibold mb-2 text-center">{projets[selected].client}</div>
              )}
              <div className="mb-4 text-brown/90 whitespace-pre-line text-center">{projets[selected].infos}</div>
              {/* Carrousel d'images */}
              {Array.isArray(projets[selected].images) && projets[selected].images.length > 0 && (
                <div className="flex flex-col items-center mb-4 w-full">
                  <div className="relative w-full flex items-center justify-center">
                    <button
                      className="absolute left-0 z-10 bg-white/80 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-2 shadow focus:outline-[#A67C52]"
                      onClick={() => setCarouselIdx(i => Math.max(0, i - 1))}
                      disabled={carouselIdx === 0}
                      aria-label="Image précédente"
                    >
                      &#8592;
                    </button>
                    <div className="w-72 h-48 mx-auto rounded-xl overflow-hidden shadow-lg bg-gold-light flex items-center justify-center">
                      <SafeImage src={projets[selected].images[carouselIdx]} alt={`Image ${carouselIdx + 1} de ${projets[selected].nom}`} className="w-full h-full" />
                    </div>
                    <button
                      className="absolute right-0 z-10 bg-white/80 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-2 shadow focus:outline-[#A67C52]"
                      onClick={() => setCarouselIdx(i => Math.min(projets[selected].images.length - 1, i + 1))}
                      disabled={carouselIdx === projets[selected].images.length - 1}
                      aria-label="Image suivante"
                    >
                      &#8594;
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2 justify-center">
                    {projets[selected].images.map((img, i) => (
                      <button
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 ${i === carouselIdx ? 'bg-mabelle-gold border-[#CEA472]' : 'bg-white border-[#CEA472]'} transition-colors`}
                        onClick={() => setCarouselIdx(i)}
                        aria-label={`Voir l'image ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* CTA */}
              <a href="/contact" className="mt-4 px-6 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">Contactez-nous pour un projet similaire</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Bouton retour en haut */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-40 bg-mabelle-gold text-white p-3 rounded-full shadow-lg hover:bg-mabelle-brown transition-colors focus:outline-[#A67C52]"
        aria-label="Retour en haut"
      >
        ↑
      </button>
    </motion.main>
  );
} 