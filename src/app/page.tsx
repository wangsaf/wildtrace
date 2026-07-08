'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Reveal ── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = '0'; el.style.transform = 'scale(0.8) translateY(16px)';
    el.style.transition = `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`;
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

/* ── Wavy Divider ── */
function Wave({ fill = '#fff', flip = false }: { fill?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1200 40" className="wave-divider" style={{ transform: flip ? 'scaleY(-1)' : undefined }} preserveAspectRatio="none">
      <path d="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z" fill={fill} />
    </svg>
  );
}

/* ── Cartoon Tiger SVG ── */
function TigerSVG({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <ellipse cx="60" cy="75" rx="35" ry="30" fill="#FF8C00" stroke="#1e293b" strokeWidth="3"/>
      <circle cx="60" cy="40" r="28" fill="#FF8C00" stroke="#1e293b" strokeWidth="3"/>
      <path d="M35 20 L30 5 L45 15Z" fill="#FF8C00" stroke="#1e293b" strokeWidth="3"/>
      <path d="M85 20 L90 5 L75 15Z" fill="#FF8C00" stroke="#1e293b" strokeWidth="3"/>
      <path d="M36 18 L34 10 L43 16Z" fill="#FFB366"/>
      <path d="M84 18 L86 10 L77 16Z" fill="#FFB366"/>
      <ellipse cx="48" cy="36" rx="5" ry="6" fill="white" stroke="#1e293b" strokeWidth="2"/>
      <ellipse cx="72" cy="36" rx="5" ry="6" fill="white" stroke="#1e293b" strokeWidth="2"/>
      <circle cx="49" cy="37" r="3" fill="#1e293b"/>
      <circle cx="73" cy="37" r="3" fill="#1e293b"/>
      <circle cx="50" cy="35.5" r="1" fill="white"/>
      <circle cx="74" cy="35.5" r="1" fill="white"/>
      <ellipse cx="60" cy="46" rx="5" ry="3.5" fill="#FF6B6B" stroke="#1e293b" strokeWidth="2"/>
      <path d="M55 50 Q60 56 65 50" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
      <path d="M45 25 Q48 20 51 25" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
      <path d="M57 22 Q60 17 63 22" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
      <path d="M69 25 Q72 20 75 25" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
      <ellipse cx="60" cy="80" rx="20" ry="18" fill="#FFE0B2"/>
      <rect x="35" y="95" width="12" height="18" rx="6" fill="#FF8C00" stroke="#1e293b" strokeWidth="2.5"/>
      <rect x="73" y="95" width="12" height="18" rx="6" fill="#FF8C00" stroke="#1e293b" strokeWidth="2.5"/>
      <circle cx="40" cy="45" r="5" fill="#FFB3B3" opacity="0.5"/>
      <circle cx="80" cy="45" r="5" fill="#FFB3B3" opacity="0.5"/>
    </svg>
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
        {/* Floating decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🐅', '🐋', '🐆', '🐘', '🐢', '🦊', '🐻‍❄️', '🦅', '🦜'].map((e, i) => (
            <div key={i} className="deco-emoji anim-float"
                 style={{ left: `${8 + (i * 11) % 84}%`, top: `${10 + (i * 19) % 75}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + (i % 3)}s` }}>
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
          <div className="mb-6"><TigerSVG size={100} /></div>
        </Reveal>

        <Reveal delay={0.15}>
          <h1 className="text-[clamp(2.8rem,8vw,5rem)] text-[var(--text)] max-w-3xl">
            Protect Wildlife.<br/>
            <span className="text-[var(--green)]">Track Everything! 🐾</span>
          </h1>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="text-[var(--text-soft)] text-lg max-w-md mt-6 font-bold">
            Join our community of animal lovers! Report sightings, track endangered species, and help protect our planet. 🌿
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="/sightings/new" className="btn btn-green text-lg">📸 Report a Sighting</a>
            <a href="/species" className="btn btn-outline text-lg">🔍 Explore Species</a>
          </div>
        </Reveal>
      </section>

      {/* ═══ STATS ═══ */}
      <Wave fill="var(--surface)" />
      <section className="bg-[var(--surface)]">
        <div className="section">
          <div className="section-inner">
            <div className="grid grid-cols-3 gap-5">
              {[
                { val: stats.species, label: 'Species Tracked', emoji: '🦁', bg: '#ffedd5' },
                { val: stats.sightings, label: 'Sightings', emoji: '📍', bg: '#dbeafe' },
                { val: stats.reporters, label: 'Contributors', emoji: '👥', bg: '#fce7f3' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="card text-center" style={{ background: s.bg }}>
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
        </div>
      </section>
      <Wave fill="var(--bg)" flip />

      {/* ═══ HABITATS ═══ */}
      <section className="section">
        <div className="section-inner">
          <Reveal>
            <div className="text-center mb-12">
              <div className="badge badge-blue mb-4">🗺️ Explore</div>
              <h2 className="text-[clamp(2rem,4vw,3rem)] mt-4">Three Habitats, One Mission!</h2>
              <p className="text-[var(--text-soft)] font-bold mt-3 max-w-md mx-auto">
                Each habitat is home to amazing creatures that need our help. 🌱
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { key: 'forest', emoji: '🌲', animal: '🐅', title: 'Forest', desc: 'Tigers, Orangutans, Elephants', bg: '#dcfce7', count: 3 },
              { key: 'ocean', emoji: '🌊', animal: '🐋', title: 'Ocean', desc: 'Whales, Turtles, Vaquitas', bg: '#dbeafe', count: 3 },
              { key: 'arctic', emoji: '❄️', animal: '🐆', title: 'Arctic', desc: 'Snow Leopards, Foxes, Polar Bears', bg: '#f1f5f9', count: 3 },
            ].map((h, i) => (
              <Reveal key={h.key} delay={i * 0.1}>
                <a href={`/species?habitat=${h.key}`} className="card block group" style={{ background: h.bg }}>
                  <div className="p-7 text-center">
                    <div className="flex justify-center gap-3 mb-4">
                      <span className="text-5xl group-hover:scale-110 transition-transform">{h.emoji}</span>
                      <span className="text-4xl anim-float" style={{ animationDelay: `${i * 0.3}s` }}>{h.animal}</span>
                    </div>
                    <h3 className="text-xl mb-1">{h.title}</h3>
                    <p className="text-[var(--text-soft)] text-sm font-bold">{h.desc}</p>
                    <div className="mt-4 inline-block badge badge-yellow text-xs">{h.count} species</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIGHTINGS ═══ */}
      <Wave fill="var(--surface)" />
      <section className="bg-[var(--surface)]">
        <div className="section">
          <div className="section-inner">
            <div className="flex items-center justify-between mb-8">
              <Reveal>
                <div>
                  <div className="badge badge-orange mb-2">📡 Live Feed</div>
                  <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] mt-2">Recent Sightings</h2>
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
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border-2 border-[var(--outline)]"
                           style={{ background: s.habitat === 'forest' ? '#dcfce7' : s.habitat === 'ocean' ? '#dbeafe' : '#f1f5f9' }}>
                        {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{s.species_name || 'Unknown'}</div>
                        <div className="text-xs text-[var(--text-soft)] font-bold">{s.location} · {s.reporter_name}</div>
                      </div>
                      <div className="text-2xl group-hover:translate-x-1 transition-transform">→</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Wave fill="var(--bg)" flip />

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="section-inner text-center">
          <Reveal>
            <div className="card" style={{ background: '#dcfce7' }}>
              <div className="p-12 sm:p-16">
                <div className="text-6xl mb-6">🌍</div>
                <h2 className="text-[clamp(2rem,4vw,3rem)] mb-4">Every Sighting Counts!</h2>
                <p className="text-[var(--text-soft)] font-bold max-w-md mx-auto mb-8">
                  Your observation helps scientists protect endangered species. 🌿
                </p>
                <a href="/sightings/new" className="btn btn-green text-lg">📸 Report Your First Sighting</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-6 border-t-3 border-[var(--outline)]">
        <div className="section-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-[var(--text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>WildTrace</span>
          </div>
          <p className="text-[var(--text-soft)] text-xs font-bold">
            TestSprite Hackathon S3 · Protect Wildlife. Track Everything! 🌿
          </p>
        </div>
      </footer>
    </div>
  );
}
