'use client';

import { useEffect, useState } from 'react';

export default function SightingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sightings').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="pattern-dots min-h-screen">
      <section className="section">
        <div className="section-inner">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="badge badge-pink mb-2">📡 Community</div>
              <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] text-[var(--text)] mt-2">Sightings</h1>
            </div>
            <a href="/sightings/new" className="btn btn-green">📸 Report</a>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)] font-bold">Loading... ⏳</div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-extrabold text-[var(--text)] mb-2">No sightings yet!</h3>
              <p className="text-[var(--text-secondary)] font-semibold mb-6">Be the first to report a wildlife sighting. 🌿</p>
              <a href="/sightings/new" className="btn btn-green">📸 Report a Sighting</a>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map(s => (
                <div key={s.id} className="card group">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2"
                         style={{ background: s.habitat === 'forest' ? '#dcfce7' : s.habitat === 'ocean' ? '#dbeafe' : '#f1f5f9', borderColor: s.habitat === 'forest' ? '#86efac' : s.habitat === 'ocean' ? '#93c5fd' : '#cbd5e1' }}>
                      {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[var(--text)] text-sm">{s.species_name || 'Unknown'}</span>
                        <span className={`tag ${s.status === 'verified' ? 'tag-safe' : 'tag-vulnerable'}`}>{s.status}</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] font-semibold">{s.location}{s.notes ? ` · ${s.notes}` : ''}</div>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <div className="text-xs text-[var(--text-muted)] font-bold">{s.reporter_name}</div>
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
