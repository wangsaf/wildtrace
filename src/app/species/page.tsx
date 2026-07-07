'use client';

import { useEffect, useState } from 'react';
import { TreePine, Waves, Snowflake, Search } from 'lucide-react';

interface Species {
  id: number;
  name: string;
  scientific_name: string;
  habitat: string;
  status: string;
  population: number;
  description: string;
}

const habitatIcons: Record<string, React.ReactNode> = {
  forest: <TreePine className="w-5 h-5" />,
  ocean: <Waves className="w-5 h-5" />,
  arctic: <Snowflake className="w-5 h-5" />,
};

const habitatColors: Record<string, string> = {
  forest: 'from-emerald-900/50 to-emerald-950/80',
  ocean: 'from-blue-900/50 to-blue-950/80',
  arctic: 'from-sky-900/50 to-sky-950/80',
};

const statusColors: Record<string, string> = {
  critically_endangered: 'bg-red-500/20 text-red-300 border-red-500/30',
  endangered: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  vulnerable: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  least_concern: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const habitatEmojis: Record<string, string> = {
  forest: '🐅',
  ocean: '🐋',
  arctic: '❄️',
};

export default function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/species')
      .then((r) => r.json())
      .then((data) => {
        setSpecies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = species.filter((s) => {
    const matchesHabitat = filter === 'all' || s.habitat === filter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.scientific_name.toLowerCase().includes(search.toLowerCase());
    return matchesHabitat && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Species Directory
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse all tracked species across our three monitored habitats. Click any species to view details and report sightings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search species..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'forest', 'ocean', 'arctic'].map((h) => (
              <button
                key={h}
                onClick={() => setFilter(h)}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  filter === h
                    ? 'glass-card bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {h !== 'all' && habitatIcons[h]}
                <span className="capitalize">{h}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Species Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading species...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <a key={s.id} href={`/species/${s.id}`} className="group">
                <div className={`glass-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                  {/* Habitat header */}
                  <div className={`h-32 bg-gradient-to-b ${habitatColors[s.habitat]} relative flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform">{habitatEmojis[s.habitat] || '🐾'}</span>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[s.status]}`}>
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-gray-500 text-sm italic mb-3">{s.scientific_name}</p>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{s.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        {habitatIcons[s.habitat]}
                        <span className="capitalize">{s.habitat}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Pop: {s.population?.toLocaleString() || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No species found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
