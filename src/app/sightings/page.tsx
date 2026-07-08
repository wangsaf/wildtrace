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
              <h1 className="text-[clamp(1rem,3vw,1.6rem)] text-[var(--text)] mt-2"
                  style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
                Sightings
              </h1>
            </div>
            <a href="/sightings/new" className="btn btn-green">📸 Report</a>
          </div>

          {loading ? (
            <div className="text-center py-20"
                 style={{ fontFamily: "'VT323', monospace", fontSize: '24px', color: 'var(--text-muted)' }}>
              Loading... ⏳
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-sm font-bold text-[var(--text)] mb-2"
                  style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
                No sightings yet!
              </h3>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: 'var(--text-soft)', marginBottom: '24px' }}>
                Be the first to report a wildlife sighting. 🌿
              </p>
              <a href="/sightings/new" className="btn btn-green">📸 Report a Sighting</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.map(s => (
                <div key={s.id} className="card">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div style={{
                      width: 48, height: 48,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', flexShrink: 0,
                      border: '4px solid var(--outline)',
                      borderRadius: 0,
                      background: 'var(--gb-mid)',
                      boxShadow: '3px 3px 0 var(--outline)',
                    }}>
                      {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', textTransform: 'uppercase', color: 'var(--text)' }}>
                          {s.species_name || 'Unknown'}
                        </span>
                        <span className={`tag ${s.status === 'verified' ? 'tag-safe' : 'tag-vulnerable'}`}>{s.status}</span>
                      </div>
                      <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: 'var(--text-muted)' }}>
                        {s.location}{s.notes ? ` · ${s.notes}` : ''}
                      </div>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {s.reporter_name}
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
