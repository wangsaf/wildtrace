'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Species {
  id: number;
  name: string;
  scientific_name: string;
  habitat: string;
  status: string;
  population: number;
  description: string;
}

interface Sighting {
  id: number;
  reporter_name: string;
  location: string;
  notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  critically_endangered: 'bg-red-500/20 text-red-300 border-red-500/30',
  endangered: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  vulnerable: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  least_concern: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const habitatGradients: Record<string, string> = {
  forest: 'from-emerald-900 via-emerald-950 to-black',
  ocean: 'from-blue-900 via-blue-950 to-black',
  arctic: 'from-sky-800 via-sky-900 to-slate-900',
};

const habitatEmoji: Record<string, string> = {
  forest: '🐅',
  ocean: '🐋',
  arctic: '❄️',
};

export default function SpeciesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [species, setSpecies] = useState<Species | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      fetch('/api/species').then(r => r.json()),
      fetch('/api/sightings').then(r => r.json()),
    ]).then(([speciesData, sightingsData]) => {
      const sp = speciesData.find((s: Species) => s.id === parseInt(params.id as string));
      setSpecies(sp || null);
      setSightings(sightingsData.filter((s: any) => s.species_id === parseInt(params.id as string)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading species...
      </div>
    );
  }

  if (!species) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl text-white mb-2">Species Not Found</h2>
        <button onClick={() => router.push('/species')} className="mt-4 text-emerald-400 hover:text-emerald-300">
          ← Back to Species
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`relative h-80 bg-gradient-to-b ${habitatGradients[species.habitat]} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-4">{habitatEmoji[species.habitat] || '🐾'}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            {species.name}
          </h1>
          <p className="text-gray-300 italic mt-2">{species.scientific_name}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Info Card */}
        <div className="glass-card p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-gray-400 text-sm mb-1">Status</div>
              <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[species.status]}`}>
                {species.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Habitat</div>
              <div className="text-white capitalize">{species.habitat}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Population</div>
              <div className="text-white">{species.population?.toLocaleString() || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Sightings</div>
              <div className="text-white">{sightings.length}</div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{species.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <a
            href={`/sightings/new?species=${species.id}`}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
          >
            Report Sighting
          </a>
          <button
            onClick={() => router.push('/species')}
            className="px-6 py-3 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
          >
            ← All Species
          </button>
        </div>

        {/* Recent Sightings */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Recent Sightings
          </h2>
          {sightings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No sightings reported yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {sightings.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">{s.reporter_name}</div>
                    <div className="text-gray-500 text-sm">{new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-gray-400 text-sm mb-1">📍 {s.location}</div>
                  {s.notes && <div className="text-gray-300 text-sm">{s.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
