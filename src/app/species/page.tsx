'use client';

import { useEffect, useState } from 'react';
import { Search, TreePine, Waves, Snowflake } from 'lucide-react';

interface Species {
  id: number; name: string; scientific_name: string; habitat: string;
  status: string; population: number; description: string;
}

const statusMap: Record<string, { label: string; cls: string }> = {
  critically_endangered: { label: 'Critically Endangered', cls: 'status-critical' },
  endangered: { label: 'Endangered', cls: 'status-endangered' },
  vulnerable: { label: 'Vulnerable', cls: 'status-vulnerable' },
  least_concern: { label: 'Least Concern', cls: 'status-safe' },
};

const habitatIcons: Record<string, React.ReactNode> = {
  forest: <TreePine className="w-3.5 h-3.5" />,
  ocean: <Waves className="w-3.5 h-3.5" />,
  arctic: <Snowflake className="w-3.5 h-3.5" />,
};

const habitatEmoji: Record<string, string> = { forest: '🐅', ocean: '🐋', arctic: '❄️' };
const habitatAccent: Record<string, string> = {
  forest: 'from-emerald-900/30 to-emerald-950/10',
  ocean: 'from-blue-900/30 to-blue-950/10',
  arctic: 'from-slate-700/30 to-slate-900/10',
};

export default function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/species').then(r => r.json()).then(d => { setSpecies(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = species.filter(s => {
    const matchH = filter === 'all' || s.habitat === filter;
    const matchS = s.name.toLowerCase().includes(search.toLowerCase()) || s.scientific_name.toLowerCase().includes(search.toLowerCase());
    return matchH && matchS;
  });

  return (
    <div className="min-h-screen gradient-bg py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge badge-green mb-4 inline-flex">Biodiversity</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Species Directory
          </h1>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm">
            Browse all tracked species across our three monitored habitats.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search species..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass pl-11" />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', icon: null },
              { key: 'forest', label: 'Forest', icon: <TreePine className="w-3.5 h-3.5" /> },
              { key: 'ocean', label: 'Ocean', icon: <Waves className="w-3.5 h-3.5" /> },
              { key: 'arctic', label: 'Arctic', icon: <Snowflake className="w-3.5 h-3.5" /> },
            ].map(h => (
              <button key={h.key} onClick={() => setFilter(h.key)}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  filter === h.key
                    ? 'glass bg-white/[0.06] text-white border-white/15'
                    : 'text-slate-500 hover:text-slate-300'
                }`}>
                {h.icon}<span>{h.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-600">Loading species...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-600">No species found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s, i) => {
              const st = statusMap[s.status] || statusMap.least_concern;
              return (
                <a key={s.id} href={`/species/${s.id}`} className="group block">
                  <div className="glass overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
                    {/* Habitat header */}
                    <div className={`h-28 bg-gradient-to-b ${habitatAccent[s.habitat]} relative flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />
                      <span className="text-5xl group-hover:scale-125 transition-transform duration-500 relative z-10">
                        {habitatEmoji[s.habitat] || '🐾'}
                      </span>
                      <div className="absolute top-3 right-3">
                        <span className={`badge text-[10px] ${st.cls}`}>{st.label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
                        {s.name}
                      </h3>
                      <p className="text-slate-600 text-xs italic mb-3">{s.scientific_name}</p>
                      <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">{s.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          {habitatIcons[s.habitat]}<span className="capitalize">{s.habitat}</span>
                        </div>
                        <div className="text-xs text-slate-600 font-mono">
                          Pop: {s.population?.toLocaleString() || '?'}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
