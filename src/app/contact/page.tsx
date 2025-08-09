'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [focus, setFocus] = useState({ name: false, email: false, message: false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      message: String(form.get('message') || '').trim(),
    };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Échec de l\'envoi');
      setMsg('Votre message a été envoyé. Merci !');
      e.currentTarget.reset();
      setFocus({ name: false, email: false, message: false });
    } catch (err: any) {
      setMsg(err?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-[70vh] bg-gradient-to-b from-gold-light via-white to-gold/10 flex flex-col items-center py-16 px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gold-dark to-gold text-center drop-shadow-lg"
      >
        Contact & Devis
      </motion.h1>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="w-full max-w-xl bg-white border border-gold-dark rounded-xl p-8 shadow-lg flex flex-col items-center mb-8"
      >
        <p className="text-brown/90 mb-4 text-center">Liberté 6, Cité Aliou Sow – Dakar, Sénégal<br/>contact@mabelleconsulting.com<br/>33 802 60 40 / 76 802 15 25</p>
        <form className="w-full flex flex-col gap-6" onSubmit={onSubmit}>
          {/* Champ Nom */}
          <div className="relative">
            <input
              type="text"
              name="name"
              id="name"
              className={`peer border-b-2 bg-transparent w-full px-2 pt-6 pb-2 text-brown-dark font-medium focus:outline-none focus:border-gold-dark transition-all ${focus.name ? 'border-gold-dark' : 'border-gold-light'}`}
              placeholder=" "
              required
              onFocus={() => setFocus(f => ({ ...f, name: true }))}
              onBlur={e => setFocus(f => ({ ...f, name: !!e.target.value }))}
            />
            <label htmlFor="name" className="absolute left-2 top-2 text-brown/70 text-sm font-semibold pointer-events-none transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-gold-dark">Nom</label>
          </div>
          {/* Champ Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              className={`peer border-b-2 bg-transparent w-full px-2 pt-6 pb-2 text-brown-dark font-medium focus:outline-none focus:border-gold-dark transition-all ${focus.email ? 'border-gold-dark' : 'border-gold-light'}`}
              placeholder=" "
              required
              onFocus={() => setFocus(f => ({ ...f, email: true }))}
              onBlur={e => setFocus(f => ({ ...f, email: !!e.target.value }))}
            />
            <label htmlFor="email" className="absolute left-2 top-2 text-brown/70 text-sm font-semibold pointer-events-none transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-gold-dark">Email</label>
          </div>
          {/* Champ Message */}
          <div className="relative">
            <textarea
              name="message"
              id="message"
              rows={4}
              className={`peer border-b-2 bg-transparent w-full px-2 pt-6 pb-2 text-brown-dark font-medium focus:outline-none focus:border-gold-dark transition-all resize-none ${focus.message ? 'border-gold-dark' : 'border-gold-light'}`}
              placeholder=" "
              required
              onFocus={() => setFocus(f => ({ ...f, message: true }))}
              onBlur={e => setFocus(f => ({ ...f, message: !!e.target.value }))}
            />
            <label htmlFor="message" className="absolute left-2 top-2 text-brown/70 text-sm font-semibold pointer-events-none transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-gold-dark">Votre message</label>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#CEA472' }}
            type="submit"
            className="bg-gold-dark text-white font-semibold rounded px-8 py-3 mt-2 hover:bg-gold transition-colors shadow-lg text-lg tracking-wide disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Envoi…' : 'Envoyer'}
          </motion.button>
          {msg && <div className="text-center text-sm mt-1">{msg}</div>}
        </form>
      </motion.section>
      <div className="text-center text-brown/80">Let’s work together </div>
    </motion.main>
  );
} 