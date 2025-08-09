'use client';
import { useEffect, useState } from 'react';

type MissionSlide = { img: string; text: string };

type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  missionHome: string;
  servicesIntro: string;
  values: Array<{ title: string; subtitle: string }>;
  ctaText: string;
  heroSlider: string[];
  missionSlides: MissionSlide[];
};

export default function AdminSite() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/site-content', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    })();
  }, []);

  const uploadImage = async (file: File, sub: string): Promise<string> => {
    const fd = new FormData();
    fd.append('subdir', sub);
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload échoué');
    const json = await res.json();
    return json.url as string;
  };

  const save = async () => {
    if (!data) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/site-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Échec de la sauvegarde');
      const json = await res.json();
      setData(json);
      setMsg('Modifications enregistrées');
    } catch (e: any) {
      setMsg(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: keyof SiteContent, value: any) => setData((prev) => (prev ? { ...prev, [key]: value } : prev));

  if (!data) return <main className="min-h-[60vh] flex items-center justify-center">Chargement…</main>;

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-12 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-brown-dark mb-6 text-center">Admin – Site</h1>
      <section className="w-full max-w-4xl bg-white rounded-2xl border border-[#CEA472] shadow-xl p-6">
        <h2 className="text-lg font-bold text-brown-dark mb-4">Contenus principaux</h2>
        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm">Titre Hero
            <input value={data.heroTitle} onChange={(e) => setField('heroTitle', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
          </label>
          <label className="text-sm">Sous-titre Hero
            <input value={data.heroSubtitle} onChange={(e) => setField('heroSubtitle', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
          </label>
          <label className="text-sm">Mission (Accueil)
            <textarea value={data.missionHome} onChange={(e) => setField('missionHome', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[80px]" />
          </label>
          <label className="text-sm">Intro Services
            <textarea value={data.servicesIntro} onChange={(e) => setField('servicesIntro', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[80px]" />
          </label>

          {/* Slider Hero (images) */}
          <div className="mt-2">
            <div className="text-sm font-semibold mb-2">Images du Hero</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.heroSlider.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 border rounded px-2 py-1 text-sm">
                  <span className="truncate max-w-[200px]">{img}</span>
                  <button onClick={() => setField('heroSlider', data.heroSlider.filter((_, i) => i !== idx))} className="px-2 py-0.5 rounded-full border">Supprimer</button>
                </div>
              ))}
            </div>
            <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadImage(f, 'home/hero'); setField('heroSlider', [...data.heroSlider, url]); }} />
          </div>

          {/* Slides Mission (image + texte) */}
          <div className="mt-2">
            <div className="text-sm font-semibold mb-2">Slides Mission</div>
            {data.missionSlides.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 items-center">
                <input value={s.text} onChange={(e) => setField('missionSlides', data.missionSlides.map((it, i) => i === idx ? { ...it, text: e.target.value } : it))} className="border rounded-lg px-3 py-2" placeholder="Texte" />
                <input value={s.img} readOnly className="border rounded-lg px-3 py-2 bg-gray-50" placeholder="Image" />
                <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadImage(f, 'home/mission'); setField('missionSlides', data.missionSlides.map((it, i) => i === idx ? { ...it, img: url } : it)); }} />
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setField('missionSlides', [...data.missionSlides, { img: '', text: '' }])} className="px-4 py-1.5 rounded-full text-sm border">Ajouter un slide</button>
              {data.missionSlides.length > 0 && <button onClick={() => setField('missionSlides', data.missionSlides.slice(0, -1))} className="px-4 py-1.5 rounded-full text-sm border">Retirer le dernier</button>}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Valeurs</div>
            {data.values.map((v, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <input value={v.title} onChange={(e) => { const next = [...data.values]; next[idx] = { ...next[idx], title: e.target.value }; setField('values', next); }} className="border rounded-lg px-3 py-2" placeholder="Titre" />
                <input value={v.subtitle} onChange={(e) => { const next = [...data.values]; next[idx] = { ...next[idx], subtitle: e.target.value }; setField('values', next); }} className="border rounded-lg px-3 py-2" placeholder="Sous-titre" />
              </div>
            ))}
          </div>
          <label className="text-sm">Texte CTA
            <input value={data.ctaText} onChange={(e) => setField('ctaText', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors text-sm">
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
        {msg && <div className="mt-2 text-sm">{msg}</div>}
      </section>
    </main>
  );
}