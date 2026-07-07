'use client';

import { useEffect, useState } from 'react';

interface Stats {
  species: number;
  sightings: number;
  reporters: number;
  recent: Array<{
    id: number;
    reporter_name: string;
    species_name: string;
    habitat: string;
    location: string;
    created_at: string;
  }>;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = value / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Failed to load stats
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Conservation Dashboard
        </h1>
        <p className="text-gray-400 mb-10">Real-time overview of our global wildlife tracking efforts.</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-2">🦁</div>
            <div className="stat-number">
              <AnimatedNumber value={stats.species} />
            </div>
            <div className="text-gray-400 text-sm mt-2">Species Tracked</div>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-2">📍</div>
            <div className="stat-number">
              <AnimatedNumber value={stats.sightings} />
            </div>
            <div className="text-gray-400 text-sm mt-2">Total Sightings</div>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-2">👥</div>
            <div className="stat-number">
              <AnimatedNumber value={stats.reporters} />
            </div>
            <div className="text-gray-400 text-sm mt-2">Active Reporters</div>
          </div>
        </div>

        {/* Habitat Breakdown */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Habitat Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Forest', icon: '🌲', color: 'emerald', count: stats.recent.filter(s => s.habitat === 'forest').length },
              { name: 'Ocean', icon: '🌊', color: 'blue', count: stats.recent.filter(s => s.habitat === 'ocean').length },
              { name: 'Arctic', icon: '❄️', color: 'sky', count: stats.recent.filter(s => s.habitat === 'arctic').length },
            ].map((h) => (
              <div key={h.name} className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">{h.icon}</div>
                <div className="text-white font-bold text-xl">{h.count}</div>
                <div className="text-gray-400 text-sm">{h.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Recent Activity
          </h2>
          {stats.recent.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {stats.recent.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                  <div className="text-2xl">
                    {s.habitat === 'forest' ? '🌲' : s.habitat === 'ocean' ? '🌊' : '❄️'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{s.species_name || 'Unknown'}</div>
                    <div className="text-gray-400 text-sm">{s.location} · by {s.reporter_name}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
