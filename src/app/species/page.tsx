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
const bg: Record<string, string> = { forest: '#dcfce7', ocean: '#dbeafe', arctic: '#f1f5f9' };
const border: Record<string, string> = { forest: '#86efac', ocean: '#93c5fd', arctic: '#cbd5e1' };

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
    <div className="pattern-dots min-h-screen">
      <section className="section">
        <div className="section-inner">
          <div className="badge badge-green mb-4">🦁 Biodiversity</div>
          <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] text-[var(--text)] mb-4">Species Directory</h1>
          <p className="text-[var(--text-secondary)] font-semibold max-w-lg mb-10">
            Meet the amazing animals we&apos;re tracking around the world! 🌍
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search species... 🔍" value={search} onChange={e => setSearch(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              {[{ k: 'all', l: '🌈 All' }, { k: 'forest', l: '🌲 Forest' }, { k: 'ocean', l: '🌊 Ocean' }, { k: 'arctic', l: '❄️ Arctic' }].map(h => (
                <button key={h.k} onClick={() => setFilter(h.k)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${
                    filter === h.k ? 'bg-[var(--green-bg)] text-[var(--green)] border-[#86efac]' : 'text-[var(--text-muted)] border-transparent hover:border-[var(--border)]'
                  }`}>
                  {h.l}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)] font-bold">Loading... ⏳</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[var(--text-muted)] font-bold">No species found 😢</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(s => {
                const st = statusMap[s.status] || statusMap.least_concern;
                return (
                  <a key={s.id} href={`/species/${s.id}`} className="card block group" style={{ background: bg[s.habitat] || '#fff', borderColor: border[s.habitat] || 'var(--border)' }}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-5xl group-hover:scale-125 transition-transform duration-300">{emoji[s.habitat] || '🐾'}</span>
                        <span className={`tag ${st.c}`}>{st.l}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[var(--text)] mb-0.5">{s.name}</h3>
                      <p className="text-xs text-[var(--text-muted)] font-bold italic mb-3">{s.scientific_name}</p>
                      <p className="text-sm text-[var(--text-secondary)] font-semibold line-clamp-2 mb-4">{s.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t-2 border-[var(--border)]">
                        <span className="text-xs font-extrabold capitalize" style={{ color: s.habitat === 'forest' ? '#15803d' : s.habitat === 'ocean' ? '#1d4ed8' : '#475569' }}>{s.habitat}</span>
                        <span className="text-xs text-[var(--text-muted)] font-bold">Pop: {s.population?.toLocaleString() || '?'}</span>
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
