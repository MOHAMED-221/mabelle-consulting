'use client';
import { useEffect, useState } from 'react';

type Testimonial = { author: string; text: string };

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/testimonials', { cache: 'no-store' });
      const json = await res.json();
      setItems(json);
    })();
  }, []);

  const save = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch('/api/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
      if (!res.ok) throw new Error('Échec de la sauvegarde');
      setMsg('Modifications enregistrées');
    } catch (e: any) { setMsg(e?.message || 'Erreur'); } finally { setLoading(false); }
  };

  const add = () => setItems(prev => [...prev, { author: '', text: '' }]);
  const remove = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const setField = (idx: number, key: keyof Testimonial, value: string) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: value } : it));

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-12 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-brown-dark mb-6 text-center">Admin – Témoignages</h1>
      <section className="w-full max-w-4xl bg-white rounded-2xl border border-[#CEA472] shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={add} className="px-4 py-1.5 rounded-full bg-mabelle-gold text-white text-sm font-semibold">Ajouter</button>
          <button onClick={save} disabled={loading} className="px-5 py-1.5 rounded-full bg-mabelle-gold text-white text-sm font-semibold">{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
        <div className="flex flex-col gap-4">
          {items.map((t, idx) => (
            <div key={idx} className="border rounded-xl p-4">
              <input value={t.author} onChange={(e) => setField(idx, 'author', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-2" placeholder="Auteur" />
              <textarea value={t.text} onChange={(e) => setField(idx, 'text', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" placeholder="Texte" />
              <div className="mt-2 flex justify-end">
                <button onClick={() => remove(idx)} className="px-4 py-1.5 rounded-full text-sm border">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
        {msg && <div className="mt-3 text-sm">{msg}</div>}
      </section>
    </main>
  );
}