'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FeedZone from '@/components/FeedZone';

interface Species { id: number; name: string; scientific_name: string; habitat: string; status: string; population: number; description: string; feed_count: number; image: string | null; }
interface Sighting { id: number; reporter_name: string; location: string; notes: string; created_at: string; }

const statusMap: Record<string, { l: string; c: string }> = {
  critically_endangered: { l: 'Critically Endangered', c: 'tag-critical' },
  endangered: { l: 'Endangered', c: 'tag-endangered' },
  vulnerable: { l: 'Vulnerable', c: 'tag-vulnerable' },
  least_concern: { l: 'Least Concern', c: 'tag-safe' },
};

const bg: Record<string, string> = { forest: '#dcfce7', ocean: '#dbeafe', arctic: '#f1f5f9', savanna: '#ffedd5', rainforest: '#fef9c3' };

// ChatGPT-generated sprite sheets (high quality)
const CHATGPT_SHEETS: Record<string, string> = {
  'Sumatran Tiger': '/pixel/tiger_sheet_chatgpt.png',
};

function getSpriteSheet(name: string, image: string | null): string | null {
  // Prefer ChatGPT sheets
  if (CHATGPT_SHEETS[name]) return CHATGPT_SHEETS[name];
  if (!image) return null;
  return image.replace('/thumbs/', '/sheets/').replace('_thumb.webp', '_sheet.png');
}

export default function SpeciesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [species, setSpecies] = useState<Species | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedCount, setFeedCount] = useState(0);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      fetch('/api/species').then(r => r.json()),
      fetch('/api/sightings').then(r => r.json()),
    ]).then(([speciesData, sightingsData]) => {
      const sp = speciesData.find((s: Species) => s.id === parseInt(params.id as string));
      setSpecies(sp || null);
      if (sp) setFeedCount(sp.feed_count || 0);
      setSightings(sightingsData.filter((s: any) => s.species_id === parseInt(params.id as string)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="pattern-dots min-h-screen flex items-center justify-center text-[var(--text-muted)] font-bold">Loading... ⏳</div>;
  if (!species) return (
    <div className="pattern-dots min-h-screen flex flex-col items-center justify-center text-[var(--text-muted)]">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Species Not Found</h2>
      <button onClick={() => router.push('/species')} className="btn btn-outline mt-4">← Back</button>
    </div>
  );

  const st = statusMap[species.status] || statusMap.least_concern;
  const spriteSheet = getSpriteSheet(species.name, species.image);

  return (
    <div className="pattern-dots min-h-screen">
      {/* Header */}
      <section className="pt-10 pb-4 px-6" style={{ background: bg[species.habitat] || '#fff' }}>
        <div className="section-inner text-center" style={{ maxWidth: 800 }}>
          <h1 className="text-[clamp(2rem,5vw,3rem)] text-[var(--text)] mb-1">{species.name}</h1>
          <p className="text-[var(--text-soft)] italic font-bold text-sm">{species.scientific_name}</p>
          <div className="mt-3">
            <span className={`tag ${st.c}`}>{st.l}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner" style={{ maxWidth: 800 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Info */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">📊 Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl" style={{ background: bg[species.habitat] }}>
                    <div className="stat-value text-2xl">{species.population?.toLocaleString() || '?'}</div>
                    <div className="stat-label">Population</div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ background: '#fef9c3' }}>
                    <div className="stat-value text-2xl">{feedCount}</div>
                    <div className="stat-label">Times Fed</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">ℹ️ About</h2>
                <p className="text-[var(--text-soft)] font-bold">{species.description}</p>
              </div>

              <div className="flex gap-3">
                <a href={`/sightings/new?species=${species.id}`} className="btn btn-green flex-1 text-center">
                  📸 Report Sighting
                </a>
                <button onClick={() => router.push('/species')} className="btn btn-outline flex-1">
                  ← All Species
                </button>
              </div>
            </div>

            {/* Right: Character + Feed unified */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-2 text-center">🍽️ Feed {species.name}</h2>

              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-[var(--green)]">{feedCount}</span>
                <span className="text-sm text-[var(--text-muted)] font-bold ml-1">Total Feeds</span>
              </div>

              {/* Unified: sprite + food items */}
              <FeedZone
                speciesId={species.id}
                speciesName={species.name}
                spriteSheet={spriteSheet}
              />
            </div>
          </div>

          {/* Sightings */}
          <div className="card p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">📡 Recent Sightings</h2>
            {sightings.length === 0 ? (
              <p className="text-[var(--text-muted)] font-bold text-center py-8">No sightings yet. Be the first! 🐾</p>
            ) : (
              <div className="space-y-3">
                {sightings.map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/50 border-2 border-[var(--outline)]">
                    <div className="flex-1">
                      <div className="font-bold text-sm">{s.reporter_name}</div>
                      <div className="text-xs text-[var(--text-muted)]">📍 {s.location}</div>
                      {s.notes && <div className="text-xs text-[var(--text-soft)] mt-1">{s.notes}</div>}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">
                      {new Date(s.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
