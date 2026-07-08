'use client';

import { useEffect, useState } from 'react';

interface LeaderEntry { rank: number; name: string; score: number; }

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard?limit=10')
      .then(r => r.json())
      .then(d => { setLeaders(d.leaderboard || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="pattern-dots min-h-screen">
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 600 }}>
          <div className="badge badge-yellow mb-4">🏆 Leaderboard</div>
          <h1 className="text-[clamp(1rem,3vw,1.6rem)] text-[var(--text)] mb-2"
              style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
            Top Feeders
          </h1>
          <p className="text-[var(--text-soft)] mb-10"
             style={{ fontFamily: "'VT323', monospace", fontSize: '22px' }}>
            Who&apos;s feeding the most animals? 🐾
          </p>

          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)]"
                 style={{ fontFamily: "'VT323', monospace", fontSize: '24px' }}>
              Loading... ⏳
            </div>
          ) : leaders.length === 0 ? (
            <div className="card text-center p-12">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-sm font-bold mb-2"
                  style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'uppercase' }}>
                No feeders yet!
              </h3>
              <p className="text-[var(--text-soft)] mb-6"
                 style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
                Be the first to feed an animal.
              </p>
              <a href="/species" className="btn btn-green">🦁 Go Feed Animals</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaders.map((entry, i) => (
                <div key={entry.rank} className="card" style={{
                  background: i === 0 ? '#f8d800' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--gb-light)',
                  borderColor: 'var(--outline)',
                }}>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div style={{
                      width: 44, height: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: 700,
                      border: '4px solid var(--outline)',
                      background: i < 3 ? 'var(--gb-mid)' : 'var(--gb-light)',
                      fontFamily: "'Press Start 2P', cursive",
                      imageRendering: 'pixelated' as any,
                    }}>
                      {i < 3 ? medals[i] : `#${entry.rank}`}
                    </div>
                    <div className="flex-1">
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', textTransform: 'uppercase', color: 'var(--text)' }}>
                        {entry.name}
                      </div>
                      <div style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: 'var(--text-soft)', marginTop: '2px' }}>
                        {entry.score} feeds
                      </div>
                    </div>
                    <div className="text-2xl">
                      {i === 0 ? '👑' : i === 1 ? '⭐' : i === 2 ? '🌟' : '🐾'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
