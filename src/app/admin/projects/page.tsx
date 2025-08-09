'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save, Trash2, Upload } from 'lucide-react';

type Project = {
  id: number;
  nom: string;
  desc: string;
  client?: string;
  infos?: string;
  images: string[];
  logo?: string;
};

type Drafts = Record<number, Partial<Project>>;

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Drafts>({});

  // Form state
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [client, setClient] = useState('');
  const [infos, setInfos] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const fileImagesRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const data = await res.json();
      setProjects(data);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!nom.trim() || !desc.trim()) {
      setError('Veuillez renseigner nom et description');
      return;
    }
    const fd = new FormData();
    fd.append('nom', nom.trim());
    fd.append('desc', desc.trim());
    if (client.trim()) fd.append('client', client.trim());
    if (infos.trim()) fd.append('infos', infos.trim());
    if (logo) fd.append('logo', logo);
    images.forEach((f) => fd.append('images', f));

    try {
      setLoading(true);
      const res = await fetch('/api/projects', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Échec de la création');
      const created = await res.json();
      setProjects((prev) => [...prev, created]);
      setSuccess('Projet créé');
      setNom(''); setDesc(''); setClient(''); setInfos(''); setLogo(null); setImages([]);
      if (fileImagesRef.current) fileImagesRef.current.value = '';
    } catch (e: any) {
      setError(e?.message || 'Erreur de création');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (p: Project) => {
    const patch = drafts[p.id];
    if (!patch || Object.keys(patch).length === 0) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
      if (!res.ok) throw new Error('Échec de la mise à jour');
      const updated = await res.json();
      setProjects((prev) => prev.map((it) => (it.id === p.id ? updated : it)));
      setDrafts((prev) => ({ ...prev, [p.id]: {} }));
      setSuccess('Modifications enregistrées');
    } catch (e: any) {
      setError(e?.message || 'Erreur de mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleAppendImages = async (p: Project, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append('images', f);
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${p.id}`, { method: 'PUT', body: fd });
      if (!res.ok) throw new Error('Échec de l\'upload');
      const updated = await res.json();
      setProjects((prev) => prev.map((it) => (it.id === p.id ? updated : it)));
      setSuccess('Images ajoutées');
    } catch (e: any) {
      setError(e?.message || 'Erreur d\'upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec de la suppression');
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Projet supprimé');
    } catch (e: any) {
      setError(e?.message || 'Erreur de suppression');
    } finally {
      setLoading(false);
    }
  };

  const setProjectDraft = (id: number, patch: Partial<Project>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  };

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-12 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-brown-dark mb-6 text-center">Admin – Projets</h1>

      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Formulaire de création */}
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#CEA472] shadow-xl p-6 min-w-0 overflow-hidden">
          <h2 className="text-lg font-bold text-brown-dark mb-4">Nouveau projet</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm font-semibold text-mabelle-brown">Nom
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="w-full min-w-0 border rounded-lg px-3 py-2 mt-1" required />
            </label>
            <label className="text-sm font-semibold text-mabelle-brown">Description courte
              <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full min-w-0 border rounded-lg px-3 py-2 mt-1" required />
            </label>
            <label className="text-sm font-semibold text-mabelle-brown">Client
              <input value={client} onChange={(e) => setClient(e.target.value)} className="w-full min-w-0 border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="text-sm font-semibold text-mabelle-brown">Infos (description longue)
              <textarea value={infos} onChange={(e) => setInfos(e.target.value)} className="w-full min-w-0 border rounded-lg px-3 py-2 mt-1 min-h-[100px] resize-y" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm font-semibold text-mabelle-brown">Logo (optionnel)
                <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="mt-1 w-full text-sm" />
              </label>
              <label className="text-sm font-semibold text-mabelle-brown">Images (plusieurs)
                <input ref={fileImagesRef} type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} className="mt-1 w-full text-sm" />
              </label>
            </div>
            <button type="submit" disabled={loading} className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors">
              <Upload className="w-4 h-4" /> Créer
            </button>
            {error && <div className="text-red-600 text-sm break-words">{error}</div>}
            {success && <div className="text-green-700 text-sm break-words">{success}</div>}
          </div>
        </form>

        {/* Liste des projets */}
        <div className="bg-white rounded-2xl border border-[#CEA472] shadow-xl p-6 min-w-0 overflow-hidden">
          <h2 className="text-lg font-bold text-brown-dark mb-4">Projets existants</h2>
          {loading && <div className="text-sm">Chargement…</div>}
          <div className="flex flex-col gap-4">
            {projects.map((p) => {
              const draft = drafts[p.id] || {};
              const hasDraft = Object.keys(draft).length > 0;
              return (
                <div key={p.id} className="border rounded-xl p-4 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-16 h-12 bg-gold-light rounded overflow-hidden flex-shrink-0">
                      {p.logo ? (
                        <Image src={p.logo} alt={p.nom} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-brown/70">Sans logo</div>
                      )}
                    </div>
                    <input
                      className="font-semibold text-brown-dark flex-1 min-w-0 border rounded-lg px-3 py-2 text-sm"
                      value={draft.nom ?? p.nom}
                      onChange={(e) => setProjectDraft(p.id, { nom: e.target.value })}
                    />
                  </div>
                  <input
                    className="mt-2 w-full min-w-0 border rounded-lg px-3 py-2 text-sm"
                    value={draft.desc ?? p.desc}
                    onChange={(e) => setProjectDraft(p.id, { desc: e.target.value })}
                  />
                  <input
                    className="mt-2 w-full min-w-0 border rounded-lg px-3 py-2 text-sm"
                    placeholder="Client"
                    value={draft.client ?? p.client ?? ''}
                    onChange={(e) => setProjectDraft(p.id, { client: e.target.value })}
                  />
                  <textarea
                    className="mt-2 w-full min-w-0 border rounded-lg px-3 py-2 text-sm min-h-[80px] resize-y"
                    placeholder="Infos"
                    value={draft.infos ?? p.infos ?? ''}
                    onChange={(e) => setProjectDraft(p.id, { infos: e.target.value })}
                  />
                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <label className="text-sm font-semibold text-mabelle-brown inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Ajouter logo
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const fd = new FormData();
                        fd.append('logo', f);
                        try {
                          setLoading(true);
                          const res = await fetch(`/api/projects/${p.id}`, { method: 'PUT', body: fd });
                          if (!res.ok) throw new Error('Upload logo échoué');
                          const updated = await res.json();
                          setProjects((prev) => prev.map((it) => (it.id === p.id ? updated : it)));
                          setSuccess('Logo ajouté');
                        } catch (e: any) { setError(e?.message || 'Erreur'); } finally { setLoading(false); }
                      }} className="ml-2 w-full sm:w-auto text-sm" />
                    </label>
                    <label className="text-sm font-semibold text-mabelle-brown inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Ajouter des images
                      <input type="file" accept="image/*" multiple onChange={(e) => handleAppendImages(p, e.target.files)} className="ml-2 w-full sm:w-auto text-sm" />
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => saveDraft(p)}
                        disabled={!hasDraft || loading}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold shadow transition-colors ${hasDraft ? 'bg-mabelle-gold text-white hover:bg-mabelle-brown' : 'bg-gray-200 text-gray-500'}`}
                      >
                        <Save className="w-4 h-4" /> Enregistrer
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border-2 border-[#CEA472] text-mabelle-brown font-semibold shadow hover:bg-mabelle-gold hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 overflow-x-auto max-w-full">
                    {p.images?.map((img, i) => (
                      <div key={i} className="relative w-20 h-14 rounded overflow-hidden border flex-shrink-0">
                        <Image src={img} alt={`${p.nom} ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && !loading && <div className="text-brown/70 text-sm">Aucun projet pour le moment.</div>}
          </div>
        </div>
      </section>
    </main>
  );
}