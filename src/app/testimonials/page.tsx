'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Testimonial = {
  author: string;
  text: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    author: "Fatou D.",
    text: "Une équipe créative, à l’écoute et très professionnelle. Notre image de marque a pris une nouvelle dimension !",
  },
  {
    author: "M. Ndiaye",
    text: "Un accompagnement sur-mesure et des contenus puissants. Merci à toute l’équipe Mabelle !",
  },
  {
    author: "A. Sow",
    text: "Des réalisations audiovisuelles de grande qualité, un vrai sens du détail et de l’innovation.",
  },
  {
    author: "B. Diop",
    text: "Un service client exceptionnel et une créativité sans limites. Je recommande vivement !",
  },
];

const STORAGE_KEY = 'userTestimonials';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  // Form state
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = testimonials.length;

  const goNext = () => setCurrent((i) => (i + 1) % total);
  const goPrev = () => setCurrent((i) => (i - 1 + total) % total);

  // Charger depuis localStorage au montage
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/testimonials', { cache: 'no-store' });
        const serverItems: Testimonial[] = await res.json();
        if (!cancelled) setTestimonials((prev) => [...serverItems, ...prev.filter(p => p.text && p.author)]);
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

  // Ouvrir via ancre #temoigner
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#temoigner') {
      setShowForm(true);
      setTimeout(() => formWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Navigation clavier
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [total]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const trimmedAuthor = author.trim();
    const trimmedText = text.trim();

    if (trimmedAuthor.length < 2) {
      setError('Veuillez renseigner un nom valide (au moins 2 caractères).');
      setSubmitting(false);
      return;
    }
    if (trimmedText.length < 10) {
      setError('Votre témoignage est trop court (au moins 10 caractères).');
      setSubmitting(false);
      return;
    }

    const newItem: Testimonial = { author: trimmedAuthor, text: trimmedText };

    try {
      // Envoyer à l'API (qui sauvegarde ET envoie l'email de notification)
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi');
      }

      // Sauvegarde locale (fallback)
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const saved: Testimonial[] = raw ? JSON.parse(raw) : [];
        const nextSaved = [...saved, newItem];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved));
      } catch {}

      // Mise à jour de l'UI
      const nextList = [...testimonials, newItem];
      setTestimonials(nextList);
      setAuthor('');
      setText('');
      setSuccess('Merci pour votre témoignage ! Il a été envoyé avec succès.');
      // Aller à la dernière slide (le nouveau)
      setCurrent(nextList.length - 1);

    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du témoignage:', err);
      setError(err?.message || 'Erreur lors de l\'envoi du témoignage');
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => formWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-[70vh] bg-gradient-to-b from-[#CEA472] to-white flex flex-col items-center py-12 md:py-20 px-4"
    >
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col items-center text-center mb-8 md:mb-10">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-3 py-1 rounded-full text-xs font-semibold bg-mabelle-gold text-white mb-3"
        >
          Ils nous font confiance
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-extrabold text-brown-dark mb-3"
        >
          Témoignages
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-brown-dark/90 max-w-2xl mb-5"
        >
          Découvrez ce que nos clients pensent de notre accompagnement, de notre créativité et de notre professionnalisme.
        </motion.p>
        {/* Boutons du header retirés */}
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border-2 border-[#CEA472] shadow-xl p-6 md:p-10 text-center"
          >
            <div className="text-5xl md:text-6xl text-mabelle-brown select-none mb-2">“</div>
            <p className="text-lg md:text-xl text-brown-dark italic leading-relaxed mb-4">
              {testimonials[current]?.text}
            </p>
            <div className="text-mabelle-brown font-semibold">{testimonials[current]?.author}</div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              aria-label="Précédent"
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-3 shadow focus:outline-[#A67C52]"
            >
              ←
            </button>
            <button
              aria-label="Suivant"
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-mabelle-gold text-mabelle-brown hover:text-white rounded-full p-3 shadow focus:outline-[#A67C52]"
            >
              →
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller au témoignage ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  i === current ? 'bg-mabelle-gold border-[#CEA472]' : 'bg-white border-[#CEA472]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bouton Témoigner en bas des témoignages */}
      <div className="flex justify-center mt-8">
        <button
          onClick={openForm}
          className="px-6 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors"
        >
          Témoigner
        </button>
      </div>

      {/* Section formulaire repliable */}
      <div ref={formWrapperRef} id="temoigner" className="w-full max-w-3xl mt-12">
        <AnimatePresence initial={false}>
          {showForm && (
            <motion.div
              key="form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: 'hidden' }}
              className="will-change-[height,opacity]"
            >
              <h2 className="text-2xl font-bold text-brown-dark mb-4 text-center">Partagez votre témoignage</h2>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border-2 border-[#CEA472] shadow-xl p-6 md:p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="author" className="text-sm font-semibold text-mabelle-brown mb-1">Votre nom</label>
                    <input
                      id="author"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Ex: A. Dupont"
                      className="border rounded-lg px-3 py-2 focus:outline-[#A67C52]"
                      required
                      minLength={2}
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label htmlFor="text" className="text-sm font-semibold text-mabelle-brown mb-1">Votre témoignage</label>
                    <textarea
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Racontez votre expérience avec Mabelle..."
                      className="border rounded-lg px-3 py-2 min-h-[100px] focus:outline-[#A67C52]"
                      required
                      minLength={10}
                    />
                  </div>
                </div>
                {error && <div className="text-red-600 mt-3">{error}</div>}
                {success && <div className="text-green-700 mt-3">{success}</div>}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2 rounded-full font-semibold shadow transition-colors ${
                      submitting 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-mabelle-gold text-white hover:bg-mabelle-brown'
                    }`}
                  >
                    {submitting ? 'Envoi en cours...' : 'Envoyer mon témoignage'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-full border-2 border-[#CEA472] text-mabelle-brown font-semibold shadow hover:bg-mabelle-gold hover:text-white transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA global retiré */}
    </motion.main>
  );
} 