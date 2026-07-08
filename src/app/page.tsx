'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Pixel Reveal ── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
    el.style.transition = `all 0.3s ease ${delay}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ── Pixel Counter ── */
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

/* ── Pixel Divider ── */
function PixelDivider() {
  return (
    <div className="w-full h-2" style={{
      background: 'repeating-linear-gradient(90deg, var(--outline) 0px, var(--outline) 8px, transparent 8px, transparent 16px)'
    }} />
  );
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
        {/* Pixel scanlines bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, rgba(15,56,15,0.03) 0px, rgba(15,56,15,0.03) 1px, transparent 1px, transparent 4px)'
        }} />

        <Reveal>
          <div className="badge badge-green mb-8">
            WILDLIFE CONSERVATION PLATFORM
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="max-w-3xl mb-2" style={{
            fontFamily: 'Press Start 2P',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            lineHeight: 1.6,
            color: 'var(--gb-darkest)',
            textShadow: '4px 4px 0px var(--gb-mid)',
          }}>
            WILDTRACE
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex items-center gap-4 mb-8" style={{ fontFamily: 'VT323', fontSize: '28px', color: 'var(--text-soft)' }}>
            <span>PROTECT WILDLIFE.</span>
            <span className="anim-blink">▶</span>
            <span>TRACK EVERYTHING.</span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="max-w-md mb-10" style={{ fontFamily: 'VT323', fontSize: '22px', color: 'var(--text-soft)' }}>
            Join our community! Report sightings, track endangered species, and help protect our planet.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/sightings/new" className="btn btn-green">
              ▶ REPORT SIGHTING
            </a>
            <a href="/species" className="btn btn-outline">
              ► EXPLORE SPECIES
            </a>
          </div>
        </Reveal>

        {/* Blinking "Press Start" */}
        <div className="absolute bottom-12 anim-blink" style={{ fontFamily: 'Press Start 2P', fontSize: '10px', color: 'var(--text-muted)' }}>
          ▼ PRESS START ▼
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <PixelDivider />
      <section style={{ background: 'var(--surface)' }}>
        <div className="section">
          <div className="section-inner">
            <div className="grid grid-cols-3 gap-5">
              {[
                { val: stats.species, label: 'SPECIES TRACKED', color: 'var(--nes-orange)' },
                { val: stats.sightings, label: 'SIGHTINGS', color: 'var(--nes-blue)' },
                { val: stats.reporters, label: 'CONTRIBUTORS', color: 'var(--nes-pink)' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="card text-center">
                    <div className="p-6">
                      <div className="stat-value" style={{ color: s.color }}><Counter end={s.val} /></div>
                      <div className="stat-label mt-2">{s.label}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PixelDivider />

      {/* ═══ HABITATS ═══ */}
      <section className="section">
        <div className="section-inner">
          <Reveal>
            <div className="text-center mb-12">
              <div className="badge badge-blue mb-4">EXPLORE</div>
              <h2 className="mt-4" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
                THREE HABITATS, ONE MISSION
              </h2>
              <p className="mt-3 max-w-md mx-auto" style={{ fontFamily: 'VT323', fontSize: '20px', color: 'var(--text-soft)' }}>
                Each habitat is home to amazing creatures that need our help.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { key: 'forest', emoji: '🌲', title: 'FOREST', desc: 'Tigers, Orangutans, Elephants', bg: '#c8e8a8', count: 3 },
              { key: 'ocean', emoji: '🌊', title: 'OCEAN', desc: 'Whales, Turtles, Vaquitas', bg: '#a8c8e8', count: 3 },
              { key: 'arctic', emoji: '❄️', title: 'ARCTIC', desc: 'Snow Leopards, Foxes, Bears', bg: '#d8d8e8', count: 3 },
            ].map((h, i) => (
              <Reveal key={h.key} delay={i * 0.1}>
                <a href={`/species?habitat=${h.key}`} className="card block group" style={{ background: h.bg }}>
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">{h.emoji}</div>
                    <h3 style={{ fontSize: '12px' }}>{h.title}</h3>
                    <p className="mt-2" style={{ fontFamily: 'VT323', fontSize: '18px', color: 'var(--text-soft)' }}>{h.desc}</p>
                    <div className="mt-4 inline-block badge badge-yellow">{h.count} SPECIES</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIGHTINGS ═══ */}
      <PixelDivider />
      <section style={{ background: 'var(--surface)' }}>
        <div className="section">
          <div className="section-inner">
            <div className="flex items-center justify-between mb-8">
              <Reveal>
                <div>
                  <div className="badge badge-orange mb-2">LIVE FEED</div>
                  <h2 className="mt-2" style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)' }}>RECENT SIGHTINGS</h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <a href="/sightings" className="btn btn-outline btn-sm hidden md:inline-flex">VIEW ALL →</a>
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
                      <div className="w-12 h-12 flex items-center justify-center text-2xl shrink-0 border-3 border-[var(--outline)]"
                           style={{ background: s.habitat === 'forest' ? '#c8e8a8' : s.habitat === 'ocean' ? '#a8c8e8' : '#d8d8e8' }}>
                        {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: 'Press Start 2P', fontSize: '9px' }}>{s.species_name || 'Unknown'}</div>
                        <div style={{ fontFamily: 'VT323', fontSize: '16px', color: 'var(--text-soft)' }}>{s.location} · {s.reporter_name}</div>
                      </div>
                      <div style={{ fontFamily: 'Press Start 2P', fontSize: '12px', color: 'var(--gb-mid)' }}>→</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PixelDivider />

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="section-inner text-center">
          <Reveal>
            <div className="card" style={{ background: '#c8e8a8' }}>
              <div className="p-12 sm:p-16">
                <h2 className="mb-4" style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)' }}>EVERY SIGHTING COUNTS!</h2>
                <p className="max-w-md mx-auto mb-8" style={{ fontFamily: 'VT323', fontSize: '20px', color: 'var(--text-soft)' }}>
                  Your observation helps scientists protect endangered species.
                </p>
                <a href="/sightings/new" className="btn btn-green">▶ REPORT YOUR FIRST SIGHTING</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
