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
          <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] text-[var(--text)] mb-2">Top Feeders</h1>
          <p className="text-[var(--text-soft)] font-bold mb-10">
            Who&apos;s feeding the most animals? 🐾
          </p>

          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)] font-bold">Loading... ⏳</div>
          ) : leaders.length === 0 ? (
            <div className="card text-center p-12">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">No feeders yet!</h3>
              <p className="text-[var(--text-soft)] font-bold mb-6">Be the first to feed an animal.</p>
              <a href="/species" className="btn btn-green">🦁 Go Feed Animals</a>
            </div>
          ) : (
            <div className="space-y-3">
              {leaders.map((entry, i) => (
                <div key={entry.rank} className="card" style={{
                  background: i < 3 ? ['#fef9c3', '#f1f5f9', '#ffedd5'][i] : 'var(--surface)',
                }}>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold border-2 border-[var(--outline)]"
                         style={{ background: i < 3 ? 'white' : '#f8fafc' }}>
                      {i < 3 ? medals[i] : `#${entry.rank}`}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[var(--text)]">{entry.name}</div>
                      <div className="text-xs text-[var(--text-soft)] font-bold">
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
