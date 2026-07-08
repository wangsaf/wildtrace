'use client';

import { useEffect, useState } from 'react';

interface Stats {
  species: number; sightings: number; reporters: number;
  recent: Array<{ id: number; reporter_name: string; species_name: string; habitat: string; location: string; created_at: string }>;
}

function Counter({ value }: { value: number }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    let c = 0; const inc = value / 40;
    const t = setInterval(() => { c += inc; if (c >= value) { setD(value); clearInterval(t); } else setD(Math.floor(c)); }, 25);
    return () => clearInterval(t);
  }, [value]);
  return <span>{d.toLocaleString()}</span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen gradient-bg flex items-center justify-center text-slate-600">Loading...</div>;
  if (!stats) return <div className="min-h-screen gradient-bg flex items-center justify-center text-slate-600">Failed to load</div>;

  return (
    <div className="min-h-screen gradient-bg py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge badge-green mb-4 inline-flex">Analytics</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Conservation Dashboard
          </h1>
          <p className="text-slate-500 mt-3 text-sm">Real-time overview of global wildlife tracking.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            { icon: '🦁', value: stats.species, label: 'Species Tracked' },
            { icon: '📍', value: stats.sightings, label: 'Total Sightings' },
            { icon: '👥', value: stats.reporters, label: 'Active Reporters' },
          ].map((s, i) => (
            <div key={i} className="glass p-8 text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="stat-number"><Counter value={s.value} /></div>
              <div className="text-slate-500 text-xs mt-2 tracking-wider uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Habitat Breakdown */}
        <div className="glass p-8 mb-10">
          <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Habitat Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Forest', icon: '🌲', color: 'emerald', count: stats.recent.filter(s => s.habitat === 'forest').length },
              { name: 'Ocean', icon: '🌊', color: 'blue', count: stats.recent.filter(s => s.habitat === 'ocean').length },
              { name: 'Arctic', icon: '❄️', color: 'slate', count: stats.recent.filter(s => s.habitat === 'arctic').length },
            ].map(h => (
              <div key={h.name} className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl mb-2">{h.icon}</div>
                <div className="text-white font-bold text-2xl">{h.count}</div>
                <div className="text-slate-500 text-xs mt-1">{h.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-8">
          <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Recent Activity
          </h2>
          {stats.recent.length === 0 ? (
            <p className="text-slate-600 text-center py-8 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {stats.recent.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                    {s.habitat === 'forest' ? '🌲' : s.habitat === 'ocean' ? '🌊' : '❄️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{s.species_name || 'Unknown'}</div>
                    <div className="text-slate-500 text-xs truncate">{s.location} · {s.reporter_name}</div>
                  </div>
                  <div className="text-slate-600 text-xs shrink-0">{new Date(s.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
