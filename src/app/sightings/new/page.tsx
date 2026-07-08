'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Species { id: number; name: string; habitat: string; }

export default function NewSightingPage() {
  const router = useRouter();
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ reporter_name: '', species_id: '', location: '', notes: '' });

  useEffect(() => { fetch('/api/species').then(r => r.json()).then(setSpecies).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/sightings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, species_id: parseInt(form.species_id) }),
      });
      if (res.ok) { setSuccess(true); setTimeout(() => router.push('/sightings'), 2000); }
    } catch {} finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🐅</div>
          <h2 className="display text-3xl text-white mb-2">Sighting Reported</h2>
          <p className="body-sm">Thank you for your contribution to wildlife conservation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 600 }}>
          <p className="label mb-4">Contribute</p>
          <h1 className="display text-[clamp(2rem,4vw,3rem)] text-white mb-2">Report a Sighting</h1>
          <p className="body-sm mb-10">Help us track and protect endangered species worldwide.</p>

          <form onSubmit={handleSubmit} className="card">
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 tracking-wide uppercase">Your Name *</label>
                <input required value={form.reporter_name} onChange={e => setForm({ ...form, reporter_name: e.target.value })}
                  className="input" placeholder="Enter your name" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 tracking-wide uppercase">Species *</label>
                <select required value={form.species_id} onChange={e => setForm({ ...form, species_id: e.target.value })}
                  className="input">
                  <option value="">Select a species</option>
                  {species.map(s => <option key={s.id} value={s.id}>{s.name} ({s.habitat})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 tracking-wide uppercase">Location *</label>
                <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className="input" placeholder="e.g., Sumatra, Indonesia" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 tracking-wide uppercase">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={4} className="input resize-none" placeholder="Describe what you observed..." />
              </div>

              <button type="submit" disabled={loading}
                className="btn btn-primary w-full !py-3.5 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Sighting'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
