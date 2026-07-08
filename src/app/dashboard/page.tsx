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

  if (!s) return <div className="min-h-screen pattern-dots flex items-center justify-center text-[var(--text-muted)] font-bold">Loading... ⏳</div>;

  return (
    <div className="pattern-dots min-h-screen">
      <section className="section">
        <div className="section-inner">
          <div className="badge badge-orange mb-4">📊 Analytics</div>
          <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] text-[var(--text)] mb-10">Conservation Dashboard</h1>

          <div className="grid grid-cols-3 gap-5 mb-10">
            {[
              { v: s.species, l: 'Species Tracked', e: '🦁', bg: '#ffedd5', border: '#fdba74' },
              { v: s.sightings, l: 'Sightings', e: '📍', bg: '#dbeafe', border: '#93c5fd' },
              { v: s.reporters, l: 'Contributors', e: '👥', bg: '#fce7f3', border: '#f9a8d4' },
            ].map((x, i) => (
              <div key={i} className="card text-center" style={{ background: x.bg, borderColor: x.border }}>
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
              <h2 className="text-xl font-bold text-[var(--text)] mb-6">🗺️ Habitat Breakdown</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: 'Forest', e: '🌲', c: s.recent.filter(x => x.habitat === 'forest').length, bg: '#dcfce7', border: '#86efac' },
                  { n: 'Ocean', e: '🌊', c: s.recent.filter(x => x.habitat === 'ocean').length, bg: '#dbeafe', border: '#93c5fd' },
                  { n: 'Arctic', e: '❄️', c: s.recent.filter(x => x.habitat === 'arctic').length, bg: '#f1f5f9', border: '#cbd5e1' },
                ].map(h => (
                  <div key={h.n} className="text-center p-5 rounded-2xl border-2" style={{ background: h.bg, borderColor: h.border }}>
                    <div className="text-3xl mb-2">{h.e}</div>
                    <div className="text-3xl font-bold text-[var(--text)]">{h.c}</div>
                    <div className="text-xs text-[var(--text-muted)] font-bold mt-1">{h.n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-8">
              <h2 className="text-xl font-bold text-[var(--text)] mb-6">📡 Recent Activity</h2>
              <div className="space-y-3">
                {s.recent.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border-2" style={{ background: r.habitat === 'forest' ? '#f0fdf4' : r.habitat === 'ocean' ? '#eff6ff' : '#f8fafc', borderColor: r.habitat === 'forest' ? '#86efac' : r.habitat === 'ocean' ? '#93c5fd' : '#cbd5e1' }}>
                    <div className="text-2xl">{r.habitat === 'forest' ? '🌲' : r.habitat === 'ocean' ? '🌊' : '❄️'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[var(--text)] text-sm">{r.species_name || 'Unknown'}</div>
                      <div className="text-xs text-[var(--text-muted)] font-semibold">{r.location} · {r.reporter_name}</div>
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
