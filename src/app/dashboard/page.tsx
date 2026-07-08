'use client';

import { useEffect, useState } from 'react';

interface Stats { species: number; sightings: number; reporters: number; recent: any[]; }

function Counter({ value }: { value: number }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    let c = 0; const i = value / 25;
    const t = setInterval(() => { c += i; if (c >= value) { setD(value); clearInterval(t); } else setD(Math.floor(c)); }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <span>{d.toLocaleString()}</span>;
}

export default function DashboardPage() {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setS).catch(() => {}); }, []);

  if (!s) return (
    <div className="min-h-screen pattern-dots flex items-center justify-center"
         style={{ fontFamily: "'VT323', monospace", fontSize: '24px', color: 'var(--text-muted)' }}>
      Loading... ⏳
    </div>
  );

  const habitatBg = {
    forest: 'var(--gb-dark)',
    ocean: 'var(--nes-blue)',
    arctic: 'var(--gb-mid)',
  };

  return (
    <div className="pattern-dots min-h-screen">
      <section className="section">
        <div className="section-inner">
          <div className="badge badge-orange mb-4">📊 Analytics</div>
          <h1 className="text-[clamp(0.8rem,2.5vw,1.4rem)] text-[var(--text)] mb-10"
              style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
            Conservation Dashboard
          </h1>

          <div className="grid grid-cols-3 gap-5 mb-10">
            {[
              { v: s.species, l: 'Species Tracked', e: '🦁' },
              { v: s.sightings, l: 'Sightings', e: '📍' },
              { v: s.reporters, l: 'Contributors', e: '👥' },
            ].map((x, i) => (
              <div key={i} className="card text-center">
                <div className="p-8">
                  <div className="text-4xl mb-3">{x.e}</div>
                  <div className="stat-value"><Counter value={x.v} /></div>
                  <div className="stat-label">{x.l}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mb-8">
            <div className="p-8">
              <h2 className="text-sm font-bold text-[var(--text)] mb-6"
                  style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
                🗺️ Habitat Breakdown
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: 'Forest', e: '🌲', c: s.recent.filter(x => x.habitat === 'forest').length },
                  { n: 'Ocean', e: '🌊', c: s.recent.filter(x => x.habitat === 'ocean').length },
                  { n: 'Arctic', e: '❄️', c: s.recent.filter(x => x.habitat === 'arctic').length },
                ].map(h => (
                  <div key={h.n} className="text-center p-5"
                       style={{ border: '4px solid var(--outline)', background: 'var(--gb-mid)', borderRadius: 0, boxShadow: '4px 4px 0 var(--outline)' }}>
                    <div className="text-3xl mb-2">{h.e}</div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '24px', fontWeight: 400, color: 'var(--text)' }}>{h.c}</div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '8px' }}>{h.n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-8">
              <h2 className="text-sm font-bold text-[var(--text)] mb-6"
                  style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
                📡 Recent Activity
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {s.recent.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4"
                       style={{
                         border: '4px solid var(--outline)',
                         borderRadius: 0,
                         background: 'var(--gb-mid)',
                         boxShadow: '3px 3px 0 var(--outline)',
                       }}>
                    <div className="text-2xl">{r.habitat === 'forest' ? '🌲' : r.habitat === 'ocean' ? '🌊' : '❄️'}</div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', textTransform: 'uppercase', color: 'var(--text)' }}>
                        {r.species_name || 'Unknown'}
                      </div>
                      <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {r.location} · {r.reporter_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
