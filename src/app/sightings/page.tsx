'use client';

import { useEffect, useState } from 'react';

interface Sighting {
  id: number;
  reporter_name: string;
  species_id: number;
  species_name: string;
  habitat: string;
  location: string;
  notes: string;
  status: string;
  created_at: string;
}

export default function SightingsPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sightings')
      .then((r) => r.json())
      .then((data) => {
        setSightings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Community Sightings
            </h1>
            <p className="text-gray-400 mt-2">All verified wildlife observations from our community</p>
          </div>
          <a
            href="/sightings/new"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
          >
            + Report Sighting
          </a>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading sightings...</div>
        ) : sightings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl text-white mb-2">No sightings yet</h3>
            <p className="text-gray-400 mb-6">Be the first to report a wildlife sighting!</p>
            <a
              href="/sightings/new"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
            >
              Report a Sighting
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {sightings.map((s) => (
              <div key={s.id} className="glass-card p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {s.habitat === 'forest' ? '🌲' : s.habitat === 'ocean' ? '🌊' : '❄️'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{s.species_name || 'Unknown Species'}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        s.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{s.location}</p>
                    {s.notes && <p className="text-gray-300 text-sm">{s.notes}</p>}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>By {s.reporter_name}</span>
                      <span>•</span>
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
