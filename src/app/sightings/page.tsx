'use client';

import { useEffect, useState } from 'react';

interface Sighting { id: number; reporter_name: string; species_name: string; habitat: string; location: string; notes: string; status: string; created_at: string; }

export default function SightingsPage() {
  const [data, setData] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sightings').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="section-inner">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="label mb-4">Community</p>
              <h1 className="display text-[clamp(2.5rem,5vw,4rem)] text-white">Sightings</h1>
            </div>
            <a href="/sightings/new" className="btn btn-primary">Report Sighting</a>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)]">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="text-lg text-white mb-2">No sightings yet</h3>
              <p className="body-sm mb-6">Be the first to report a wildlife sighting.</p>
              <a href="/sightings/new" className="btn btn-primary">Report a Sighting</a>
            </div>
          ) : (
            <div className="space-y-2">
              {data.map(s => (
                <div key={s.id} className="card group">
                  <div className="flex items-center gap-5 px-6 py-5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                         style={{ background: s.habitat === 'forest' ? 'rgba(34,197,94,0.08)' : s.habitat === 'ocean' ? 'rgba(59,130,246,0.08)' : 'rgba(148,163,184,0.08)' }}>
                      {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{s.species_name || 'Unknown'}</span>
                        <span className={`tag ${s.status === 'verified' ? 'tag-safe' : 'tag-vulnerable'}`}>{s.status}</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{s.location}{s.notes ? ` · ${s.notes}` : ''}</div>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <div className="text-xs text-[var(--text-muted)]">{s.reporter_name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
