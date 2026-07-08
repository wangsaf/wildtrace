'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Bounce-in reveal ── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = '0'; el.style.transform = 'scale(0.8) translateY(20px)';
    el.style.transition = `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'scale(1) translateY(0)'; obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ── Counter ── */
function Counter({ end }: { end: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const s = performance.now();
      const tick = (n: number) => {
        const p = Math.min((n - s) / 1500, 1);
        setV(Math.floor((1 - (1 - p) * (1 - p)) * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{v.toLocaleString()}</span>;
}

export default function Home() {
  const [stats, setStats] = useState({ species: 0, sightings: 0, reporters: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      setStats({ species: d.species, sightings: d.sightings, reporters: d.reporters });
      setRecent(d.recent || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="pattern-dots min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🐅', '🐋', '🐆', '🐘', '🐢', '🦊', '🐻', '🦅', '🦜'].map((e, i) => (
            <div key={i} className="absolute text-3xl opacity-20 anim-float"
                 style={{
                   left: `${10 + (i * 10) % 80}%`,
                   top: `${15 + (i * 17) % 70}%`,
                   animationDelay: `${i * 0.4}s`,
                   animationDuration: `${3 + (i % 3)}s`,
                 }}>
              {e}
            </div>
          ))}
        </div>

        <Reveal>
          <div className="badge badge-green mb-6">
            <span className="anim-wiggle inline-block">🌍</span>
            Wildlife Conservation Platform
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] text-[var(--text)] max-w-3xl leading-[1.05]">
            Protect Wildlife.<br/>
            <span className="text-[var(--green)]">Track Everything! 🐾</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-[var(--text-secondary)] text-lg max-w-md mt-6 font-semibold">
            Join our community of animal lovers! Report sightings, track endangered species, and help protect our planet. 🌿
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="/sightings/new" className="btn btn-green text-lg">
              📸 Report a Sighting
            </a>
            <a href="/species" className="btn btn-outline text-lg">
              🔍 Explore Species
            </a>
          </div>
        </Reveal>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[var(--text-muted)] text-xs font-bold">scroll down</span>
          <div className="w-6 h-10 border-3 border-[var(--border)] rounded-full flex justify-center pt-2">
            <div className="w-2 h-2 bg-[var(--green)] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-3 gap-5">
            {[
              { val: stats.species, label: 'Species Tracked', emoji: '🦁', color: 'var(--orange-bg)', border: '#fdba74' },
              { val: stats.sightings, label: 'Sightings', emoji: '📍', color: 'var(--blue-bg)', border: '#93c5fd' },
              { val: stats.reporters, label: 'Contributors', emoji: '👥', color: 'var(--pink-bg)', border: '#f9a8d4' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="card text-center" style={{ background: s.color, borderColor: s.border }}>
                  <div className="p-8">
                    <div className="text-4xl mb-3">{s.emoji}</div>
                    <div className="stat-value"><Counter end={s.val} /></div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HABITATS ═══ */}
      <section className="section">
        <div className="section-inner">
          <Reveal>
            <div className="text-center mb-12">
              <div className="badge badge-blue mb-4">🗺️ Explore</div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] text-[var(--text)] mt-4">
                Three Habitats, One Mission!
              </h2>
              <p className="text-[var(--text-secondary)] mt-3 font-semibold max-w-md mx-auto">
                Each habitat is home to amazing creatures that need our help. 🌱
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { key: 'forest', emoji: '🌲', animal: '🐅', title: 'Forest', desc: 'Tigers, Orangutans, Elephants', color: '#dcfce7', border: '#86efac', count: 3 },
              { key: 'ocean', emoji: '🌊', animal: '🐋', title: 'Ocean', desc: 'Whales, Turtles, Vaquitas', color: '#dbeafe', border: '#93c5fd', count: 3 },
              { key: 'arctic', emoji: '❄️', animal: '🐆', title: 'Arctic', desc: 'Snow Leopards, Foxes, Polar Bears', color: '#f1f5f9', border: '#cbd5e1', count: 3 },
            ].map((h, i) => (
              <Reveal key={h.key} delay={i * 0.1}>
                <a href={`/species?habitat=${h.key}`} className="card block group" style={{ background: h.color, borderColor: h.border }}>
                  <div className="p-7 text-center">
                    <div className="flex justify-center gap-2 mb-4">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{h.emoji}</span>
                      <span className="text-4xl anim-float" style={{ animationDelay: `${i * 0.3}s` }}>{h.animal}</span>
                    </div>
                    <h3 className="text-xl mb-1 text-[var(--text)]">{h.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-semibold">{h.desc}</p>
                    <div className="mt-4 text-xs font-bold text-[var(--text-muted)]">
                      {h.count} species tracked →
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIGHTINGS ═══ */}
      <section className="section">
        <div className="section-inner">
          <div className="flex items-center justify-between mb-8">
            <Reveal>
              <div>
                <div className="badge badge-orange mb-2">📡 Live Feed</div>
                <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--text)] mt-2">Recent Sightings</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <a href="/sightings" className="btn btn-outline btn-sm hidden md:inline-flex">View All →</a>
            </Reveal>
          </div>

          <div className="space-y-3">
            {(recent.length > 0 ? recent : [
              { id: 1, species_name: 'Sumatran Tiger', habitat: 'forest', location: 'Sumatra, Indonesia', reporter_name: 'Arthur' },
              { id: 2, species_name: 'Blue Whale', habitat: 'ocean', location: 'Pacific Ocean', reporter_name: 'Marine Watch' },
              { id: 3, species_name: 'Snow Leopard', habitat: 'arctic', location: 'Himalayas, Nepal', reporter_name: 'Arctic Team' },
            ]).map((s: any, i: number) => (
              <Reveal key={s.id} delay={i * 0.08}>
                <div className="card group">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2"
                         style={{
                           background: s.habitat === 'forest' ? '#dcfce7' : s.habitat === 'ocean' ? '#dbeafe' : '#f1f5f9',
                           borderColor: s.habitat === 'forest' ? '#86efac' : s.habitat === 'ocean' ? '#93c5fd' : '#cbd5e1',
                         }}>
                      {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[var(--text)] text-sm">{s.species_name || 'Unknown'}</div>
                      <div className="text-xs text-[var(--text-muted)] font-semibold">{s.location} · {s.reporter_name}</div>
                    </div>
                    <div className="text-2xl group-hover:scale-125 transition-transform duration-300">→</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="section-inner text-center">
          <Reveal>
            <div className="card" style={{ background: '#dcfce7', borderColor: '#86efac' }}>
              <div className="p-12 sm:p-16">
                <div className="text-6xl mb-6">🌍</div>
                <h2 className="text-[clamp(2rem,4vw,3rem)] text-[var(--text)] mb-4">
                  Every Sighting Counts!
                </h2>
                <p className="text-[var(--text-secondary)] font-semibold max-w-md mx-auto mb-8">
                  Your observation helps scientists protect endangered species for future generations. 🌿
                </p>
                <a href="/sightings/new" className="btn btn-green text-lg">
                  📸 Report Your First Sighting
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-6 border-t-3 border-[var(--border)]">
        <div className="section-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-extrabold text-[var(--text)]">WildTrace</span>
          </div>
          <p className="text-[var(--text-muted)] text-xs font-bold">
            TestSprite Hackathon S3 · Protect Wildlife. Track Everything! 🌿
          </p>
        </div>
      </footer>
    </div>
  );
}
