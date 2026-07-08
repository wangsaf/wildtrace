'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSightingPage() {
  const router = useRouter();
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ reporter_name: '', species_id: '', location: '', notes: '' });

  useEffect(() => { fetch('/api/species').then(r => r.json()).then(setSpecies).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/sightings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, species_id: parseInt(form.species_id) }) });
      if (res.ok) { setSuccess(true); setTimeout(() => router.push('/sightings'), 2000); }
    } catch {} finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="pattern-dots min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6 anim-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-[var(--text)] mb-2">Sighting Reported!</h2>
          <p className="text-[var(--text-secondary)] font-semibold">Thank you for helping wildlife conservation! 🌿</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pattern-dots min-h-screen">
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 600 }}>
          <div className="badge badge-green mb-4">📸 Contribute</div>
          <h1 className="text-[clamp(2rem,4vw,3rem)] text-[var(--text)] mb-2">Report a Sighting</h1>
          <p className="text-[var(--text-secondary)] font-semibold mb-10">Spotted an animal? Let us know! 🐾</p>

          <form onSubmit={handleSubmit} className="card">
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">👤 Your Name *</label>
                <input required value={form.reporter_name} onChange={e => setForm({ ...form, reporter_name: e.target.value })} className="input" placeholder="What's your name?" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">🦁 Species *</label>
                <select required value={form.species_id} onChange={e => setForm({ ...form, species_id: e.target.value })} className="input">
                  <option value="">Pick a species...</option>
                  {species.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">📍 Location *</label>
                <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input" placeholder="Where did you see it?" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">📝 Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={4} className="input resize-none" placeholder="Tell us what you saw..." />
              </div>
              <button type="submit" disabled={loading} className="btn btn-green w-full !py-4 text-lg disabled:opacity-50">
                {loading ? 'Submitting... ⏳' : '📸 Submit Sighting'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
