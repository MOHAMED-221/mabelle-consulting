'use client';
import { useEffect, useState } from 'react';

type Service = {
  slug: string;
  title: string;
  icon: string;
  image: string;
  description: string;
  points: string[];
  gallery?: string[];
};

const ICON_OPTIONS = ['clapperboard', 'camera', 'target', 'megaphone', 'mic', 'printer', 'graduation'];

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const json = await res.json();
      setItems(json);
    })();
  }, []);

  const uploadImage = async (file: File, sub = 'services'): Promise<string> => {
    const fd = new FormData();
    fd.append('subdir', sub);
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload échoué');
    const json = await res.json();
    return json.url as string;
  };

  const save = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch('/api/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
      if (!res.ok) throw new Error('Échec de la sauvegarde');
      setMsg('Modifications enregistrées');
    } catch (e: any) {
      setMsg(e?.message || 'Erreur');
    } finally { setLoading(false); }
  };

  const add = () => setItems(prev => [...prev, { slug: '', title: '', icon: 'clapperboard', image: '', description: '', points: [], gallery: [] }]);
  const remove = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const setField = (idx: number, key: keyof Service, value: any) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: value } : it));
  const setPoint = (idx: number, pIdx: number, value: string) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, points: it.points.map((p, j) => j === pIdx ? value : p) } : it));
  const addPoint = (idx: number) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, points: [...it.points, ''] } : it));
  const removePoint = (idx: number, pIdx: number) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, points: it.points.filter((_, j) => j !== pIdx) } : it));

  const addGalleryImages = async (idx: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const url = await uploadImage(f, 'services/gallery');
      urls.push(url);
    }
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, gallery: [...(it.gallery || []), ...urls] } : it));
  };
  const removeGalleryImage = (idx: number, gIdx: number) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, gallery: (it.gallery || []).filter((_, j) => j !== gIdx) } : it));

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-12 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-brown-dark mb-6 text-center">Admin – Services</h1>
      <section className="w-full max-w-5xl bg-white rounded-2xl border border-[#CEA472] shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={add} className="px-4 py-1.5 rounded-full bg-mabelle-gold text-white text-sm font-semibold">Ajouter un service</button>
          <button onClick={save} disabled={loading} className="px-5 py-1.5 rounded-full bg-mabelle-gold text-white text-sm font-semibold">{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
        <div className="flex flex-col gap-6">
          {items.map((s, idx) => (
            <div key={idx} className="border rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm">Slug
                  <input value={s.slug} onChange={(e) => setField(idx, 'slug', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </label>
                <label className="text-sm">Titre
                  <input value={s.title} onChange={(e) => setField(idx, 'title', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </label>
                <label className="text-sm">Icône
                  <select value={s.icon} onChange={(e) => setField(idx, 'icon', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1">
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <label className="text-sm">Image (hero)
                  <input type="file" accept="image/*" className="w-full mt-1" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const url = await uploadImage(f, 'services');
                    setField(idx, 'image', url);
                  }} />
                  {s.image && <div className="text-xs mt-1">Image chargée</div>}
                </label>
              </div>
              <label className="text-sm block mt-2">Description
                <textarea value={s.description} onChange={(e) => setField(idx, 'description', e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[90px]" />
              </label>
              <div className="mt-2">
                <div className="text-sm font-semibold mb-1">Points</div>
                {s.points.map((p, pIdx) => (
                  <div key={pIdx} className="flex gap-2 mb-2">
                    <input value={p} onChange={(e) => setPoint(idx, pIdx, e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    <button onClick={() => removePoint(idx, pIdx)} className="px-3 py-1.5 rounded-full text-sm border">x</button>
                  </div>
                ))}
                <button onClick={() => addPoint(idx)} className="px-4 py-1.5 rounded-full text-sm border">Ajouter un point</button>
              </div>
              {/* Galerie d'images */}
              <div className="mt-3">
                <div className="text-sm font-semibold mb-2">Galerie</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(s.gallery || []).map((g, gIdx) => (
                    <div key={gIdx} className="flex items-center gap-2 border rounded px-2 py-1 text-sm">
                      <span className="truncate max-w-[200px]">{g}</span>
                      <button onClick={() => removeGalleryImage(idx, gIdx)} className="px-2 py-0.5 rounded-full border">Supprimer</button>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple onChange={(e) => addGalleryImages(idx, e.target.files)} />
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => remove(idx)} className="px-4 py-1.5 rounded-full text-sm border">Supprimer ce service</button>
              </div>
            </div>
          ))}
        </div>
        {msg && <div className="mt-3 text-sm">{msg}</div>}
      </section>
    </main>
  );
}