'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface Species { id: number; name: string; scientific_name: string; habitat: string; status: string; population: number; description: string; }

const statusMap: Record<string, { l: string; c: string }> = {
  critically_endangered: { l: 'Critically Endangered', c: 'tag-critical' },
  endangered: { l: 'Endangered', c: 'tag-endangered' },
  vulnerable: { l: 'Vulnerable', c: 'tag-vulnerable' },
  least_concern: { l: 'Least Concern', c: 'tag-safe' },
};
const emoji: Record<string, string> = { forest: '🐅', ocean: '🐋', arctic: '❄️' };
const accent: Record<string, string> = { forest: '#22c55e', ocean: '#3b82f6', arctic: '#94a3b8' };

export default function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/species').then(r => r.json()).then(d => { setSpecies(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = species.filter(s => {
    const h = filter === 'all' || s.habitat === filter;
    const q = s.name.toLowerCase().includes(search.toLowerCase()) || s.scientific_name.toLowerCase().includes(search.toLowerCase());
    return h && q;
  });

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="section-inner">
          <p className="label mb-4">Biodiversity</p>
          <h1 className="display text-[clamp(2.5rem,5vw,4rem)] text-white mb-4">Species Directory</h1>
          <p className="body-lg max-w-lg mb-12">Browse all tracked species across our three monitored habitats.</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search species..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              {[{ k: 'all', l: 'All' }, { k: 'forest', l: 'Forest' }, { k: 'ocean', l: 'Ocean' }, { k: 'arctic', l: 'Arctic' }].map(h => (
                <button key={h.k} onClick={() => setFilter(h.k)}
                  className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 border ${
                    filter === h.k ? 'bg-white/[0.06] text-white border-white/10' : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                  }`}>
                  {h.l}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[var(--text-muted)]">No species found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(s => {
                const st = statusMap[s.status] || statusMap.least_concern;
                return (
                  <a key={s.id} href={`/species/${s.id}`} className="card block group">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-5">
                        <span className="text-3xl">{emoji[s.habitat] || '🐾'}</span>
                        <span className={`tag ${st.c}`}>{st.l}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-0.5 group-hover:opacity-80 transition-opacity">{s.name}</h3>
                      <p className="text-[12px] text-[var(--text-muted)] italic mb-3">{s.scientific_name}</p>
                      <p className="body-sm line-clamp-2 mb-5">{s.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                        <span className="text-xs capitalize" style={{ color: accent[s.habitat] || 'var(--text-muted)' }}>{s.habitat}</span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{s.population?.toLocaleString() || '?'}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
