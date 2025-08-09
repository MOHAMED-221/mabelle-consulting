'use client';
import { useEffect, useState } from 'react';

type TeamMember = { name: string; role: string; image: string };
type ClientLogo = { image: string; alt: string };

type AboutContent = {
  mission: string;
  ceoQuote: string;
  ceoName: string;
  team: TeamMember[];
  clients: ClientLogo[];
};

export default function AdminAbout() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Formulaire de création rapide de membre
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/about-content', { cache: 'no-store' });
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

  const saveData = async (next: AboutContent) => {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch('/api/about-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
      if (!res.ok) throw new Error('Échec de la sauvegarde');
      const saved = await res.json();
      setData(saved);
      setMsg('Modifications enregistrées');
    } catch (e: any) { setMsg(e?.message || 'Erreur'); } finally { setLoading(false); }
  };

  const save = async () => {
    if (!data) return;
    await saveData(data);
  };

  const updateTeam = (idx: number, patch: Partial<TeamMember>) => setData(prev => prev ? { ...prev, team: prev.team.map((m, i) => i === idx ? { ...m, ...patch } : m) } : prev);
  const addMember = () => setData(prev => prev ? { ...prev, team: [...prev.team, { name: '', role: '', image: '' }] } : prev);
  const removeMember = (idx: number) => setData(prev => prev ? { ...prev, team: prev.team.filter((_, i) => i !== idx) } : prev);

  const updateClient = (idx: number, patch: Partial<ClientLogo>) => setData(prev => prev ? { ...prev, clients: prev.clients.map((m, i) => i === idx ? { ...m, ...patch } : m) } : prev);
  const addClient = () => setData(prev => prev ? { ...prev, clients: [...prev.clients, { image: '', alt: '' }] } : prev);
  const removeClient = (idx: number) => setData(prev => prev ? { ...prev, clients: prev.clients.filter((_, i) => i !== idx) } : prev);

  const createMember = async () => {
    if (!data) return;
    if (!newName.trim() || !newRole.trim() || !newFile) { setMsg('Veuillez renseigner nom, rôle et photo'); return; }
    try {
      setLoading(true); setMsg(null);
      const url = await uploadImage(newFile, 'about/team');
      const next: AboutContent = { ...data, team: [...data.team, { name: newName.trim(), role: newRole.trim(), image: url }] };
      await saveData(next);
      setNewName(''); setNewRole(''); setNewFile(null);
    } catch (e: any) {
      setMsg(e?.message || 'Erreur lors de la création');
    } finally { setLoading(false); }
  };

  if (!data) return <main className="min-h-[60vh] flex items-center justify-center">Chargement…</main>;

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-gold-light/30 to-white flex flex-col items-center py-12 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-brown-dark mb-6 text-center">Admin – À propos</h1>
      <section className="w-full max-w-5xl bg-white rounded-2xl border border-[#CEA472] shadow-xl p-6">
        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm">Mission
            <textarea value={data.mission} onChange={(e) => setData(prev => prev ? { ...prev, mission: e.target.value } : prev)} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[80px]" />
          </label>
          <label className="text-sm">Citation CEO
            <textarea value={data.ceoQuote} onChange={(e) => setData(prev => prev ? { ...prev, ceoQuote: e.target.value } : prev)} className="w-full border rounded-lg px-3 py-2 mt-1 min-h-[80px]" />
          </label>
          <label className="text-sm">Signature CEO
            <input value={data.ceoName} onChange={(e) => setData(prev => prev ? { ...prev, ceoName: e.target.value } : prev)} className="w-full border rounded-lg px-3 py-2 mt-1" />
          </label>

          {/* Création de membre (visibilité en premier) */}
          <div className="mt-2 p-3 border rounded-xl">
            <div className="text-sm font-semibold mb-2">Créer un membre avec sa photo</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="border rounded-lg px-3 py-2" placeholder="Nom" />
              <input value={newRole} onChange={(e) => setNewRole(e.target.value)} className="border rounded-lg px-3 py-2" placeholder="Rôle" />
              <input type="file" accept="image/*" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
              <button onClick={createMember} className="px-4 py-1.5 rounded-full text-sm bg-mabelle-gold text-white">Créer le membre</button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Équipe</div>
            {data.team.map((m, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-center">
                <input value={m.name} onChange={(e) => updateTeam(idx, { name: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Nom" />
                <input value={m.role} onChange={(e) => updateTeam(idx, { role: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Rôle" />
                <input value={m.image} readOnly className="border rounded-lg px-3 py-2 bg-gray-50" placeholder="Image" />
                <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadImage(f, 'about/team'); updateTeam(idx, { image: url }); }} />
                <button onClick={() => removeMember(idx)} className="px-4 py-1.5 rounded-full text-sm border">Supprimer</button>
              </div>
            ))}
            <div className="flex gap-2 flex-wrap items-center mt-2">
              <button onClick={addMember} className="px-4 py-1.5 rounded-full text-sm border">Ajouter un membre (puis uploader la photo)</button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Clients</div>
            {data.clients.map((m, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 items-center">
                <input value={m.alt} onChange={(e) => updateClient(idx, { alt: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Alt" />
                <input value={m.image} readOnly className="border rounded-lg px-3 py-2 bg-gray-50" placeholder="Logo" />
                <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadImage(f, 'about/clients'); updateClient(idx, { image: url }); }} />
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={addClient} className="px-4 py-1.5 rounded-full text-sm border">Ajouter un client</button>
              {data.clients.length > 0 && <button onClick={() => removeClient(data.clients.length - 1)} className="px-4 py-1.5 rounded-full text-sm border">Retirer le dernier</button>}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-mabelle-gold text-white font-semibold shadow hover:bg-mabelle-brown transition-colors text-sm">{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
        {msg && <div className="mt-2 text-sm">{msg}</div>}
      </section>
    </main>
  );
}