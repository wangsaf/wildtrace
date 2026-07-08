'use client';

import { useEffect, useState } from 'react';

interface Stats { species: number; sightings: number; reporters: number; recent: any[]; }

function Counter({ value }: { value: number }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    let c = 0; const i = value / 30;
    const t = setInterval(() => { c += i; if (c >= value) { setD(value); clearInterval(t); } else setD(Math.floor(c)); }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <span>{d.toLocaleString()}</span>;
}

export default function DashboardPage() {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setS).catch(() => {}); }, []);

  if (!s) return <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="section-inner">
          <p className="label mb-4">Analytics</p>
          <h1 className="display text-[clamp(2.5rem,5vw,4rem)] text-white mb-12">Conservation Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { v: s.species, l: 'Species Tracked' },
              { v: s.sightings, l: 'Sightings Reported' },
              { v: s.reporters, l: 'Active Contributors' },
            ].map((x, i) => (
              <div key={i} className="card">
                <div className="p-8">
                  <div className="stat-value"><Counter value={x.v} /></div>
                  <div className="stat-label">{x.l}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Habitat */}
          <div className="card mb-8">
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Habitat Breakdown</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: 'Forest', e: '🌲', c: s.recent.filter(x => x.habitat === 'forest').length, color: '#22c55e' },
                  { n: 'Ocean', e: '🌊', c: s.recent.filter(x => x.habitat === 'ocean').length, color: '#3b82f6' },
                  { n: 'Arctic', e: '❄️', c: s.recent.filter(x => x.habitat === 'arctic').length, color: '#94a3b8' },
                ].map(h => (
                  <div key={h.n} className="text-center p-5 rounded-xl" style={{ background: `${h.color}08` }}>
                    <div className="text-2xl mb-2">{h.e}</div>
                    <div className="text-3xl font-bold text-white">{h.c}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{h.n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="card">
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Activity</h2>
              <div className="space-y-2">
                {s.recent.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                         style={{ background: r.habitat === 'forest' ? 'rgba(34,197,94,0.08)' : r.habitat === 'ocean' ? 'rgba(59,130,246,0.08)' : 'rgba(148,163,184,0.08)' }}>
                      {r.habitat === 'forest' ? '🌲' : r.habitat === 'ocean' ? '🌊' : '❄️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.species_name || 'Unknown'}</div>
                      <div className="text-xs text-[var(--text-muted)] truncate">{r.location} · {r.reporter_name}</div>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono shrink-0">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
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
