'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Species {
  id: number;
  name: string;
  habitat: string;
}

export default function NewSightingPage() {
  const router = useRouter();
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    reporter_name: '',
    species_id: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/species')
      .then((r) => r.json())
      .then(setSpecies);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          species_id: parseInt(form.species_id),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/sightings'), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🐅</div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sighting Reported!
          </h2>
          <p className="text-gray-400">Thank you for your contribution to wildlife conservation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Report a Sighting
        </h1>
        <p className="text-gray-400 mb-8">Help us track and protect endangered species worldwide.</p>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
            <input
              type="text"
              required
              value={form.reporter_name}
              onChange={(e) => setForm({ ...form, reporter_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Species *</label>
            <select
              required
              value={form.species_id}
              onChange={(e) => setForm({ ...form, species_id: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            >
              <option value="" className="bg-gray-900">Select a species</option>
              {species.map((s) => (
                <option key={s.id} value={s.id} className="bg-gray-900">
                  {s.name} ({s.habitat})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              placeholder="e.g., Sumatra, Indonesia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
              placeholder="Describe what you observed..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl font-medium transition-colors text-lg"
          >
            {loading ? 'Submitting...' : 'Submit Sighting'}
          </button>
        </form>
      </div>
    </div>
  );
}
