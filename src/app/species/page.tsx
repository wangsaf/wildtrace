'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface Species { id: number; name: string; scientific_name: string; habitat: string; status: string; population: number; description: string; image: string | null; }

const statusMap: Record<string, { l: string; c: string }> = {
  critically_endangered: { l: 'CRITICAL', c: 'tag-critical' },
  endangered: { l: 'ENDANGERED', c: 'tag-endangered' },
  vulnerable: { l: 'VULNERABLE', c: 'tag-vulnerable' },
  least_concern: { l: 'SAFE', c: 'tag-safe' },
};
const habitatBg: Record<string, string> = { forest: '#c8e8a8', ocean: '#a8c8e8', arctic: '#d8d8e8', savanna: '#e8d8a8', rainforest: '#b8e8c8' };

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
          <div className="badge badge-green mb-4">SPECIES DIRECTORY</div>
          <h1 className="mb-4" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>ALL SPECIES</h1>
          <p className="max-w-lg mb-10" style={{ fontFamily: 'VT323', fontSize: '20px', color: 'var(--text-soft)' }}>
            Meet the amazing animals we&apos;re tracking around the world!
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="SEARCH SPECIES..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              {[{ k: 'all', l: 'ALL' }, { k: 'forest', l: 'FOREST' }, { k: 'ocean', l: 'OCEAN' }, { k: 'arctic', l: 'ARCTIC' }].map(h => (
                <button key={h.k} onClick={() => setFilter(h.k)}
                  className={`px-4 py-2.5 text-xs transition-all duration-100 border-3 ${
                    filter === h.k ? 'bg-[var(--gb-mid)] text-[var(--gb-darkest)] border-[var(--outline)]' : 'text-[var(--text-muted)] border-transparent hover:border-[var(--outline)]'
                  }`}
                  style={{ fontFamily: 'Press Start 2P', fontSize: '8px' }}>
                  {h.l}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20" style={{ fontFamily: 'Press Start 2P', fontSize: '10px', color: 'var(--text-muted)' }}>LOADING...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" style={{ fontFamily: 'Press Start 2P', fontSize: '10px', color: 'var(--text-muted)' }}>NO SPECIES FOUND</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(s => {
                const st = statusMap[s.status] || statusMap.least_concern;
                return (
                  <a key={s.id} href={`/species/${s.id}`} className="card block group" style={{ background: habitatBg[s.habitat] || '#e8e0c8' }}>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="w-16 h-16 border-3 border-[var(--outline)] object-cover" loading="lazy" style={{ imageRendering: 'pixelated' }} />
                        ) : (
                          <div className="w-16 h-16 border-3 border-[var(--outline)] flex items-center justify-center text-3xl" style={{ background: 'var(--surface)' }}>🐾</div>
                        )}
                        <span className={`tag ${st.c}`}>{st.l}</span>
                      </div>
                      <h3 style={{ fontSize: '10px' }}>{s.name}</h3>
                      <p style={{ fontFamily: 'VT323', fontSize: '14px', color: 'var(--text-muted)' }} className="italic">{s.scientific_name}</p>
                      <p className="mt-2 line-clamp-2" style={{ fontFamily: 'VT323', fontSize: '16px', color: 'var(--text-soft)' }}>{s.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t-3 border-[var(--outline)]">
                        <span style={{ fontFamily: 'Press Start 2P', fontSize: '7px', color: 'var(--text-soft)' }}>{s.habitat.toUpperCase()}</span>
                        <span style={{ fontFamily: 'VT323', fontSize: '16px', color: 'var(--text-muted)' }}>POP: {s.population?.toLocaleString() || '?'}</span>
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
