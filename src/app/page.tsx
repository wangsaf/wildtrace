'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Scroll-triggered fade-in ── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ── Counter ── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const s = performance.now();
      const tick = (n: number) => {
        const p = Math.min((n - s) / 1800, 1);
        setV(Math.floor((1 - Math.pow(1 - p, 4)) * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
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
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(200,165,90,0.06)_0%,_transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#08090d] to-transparent" />
        </div>

        <div className="relative z-10 section-inner">
          <Reveal>
            <p className="label mb-6">Wildlife Conservation Platform</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="display text-[clamp(3rem,8vw,6.5rem)] text-white max-w-4xl">
              Protect Wildlife.<br/>
              <span style={{ color: 'var(--accent)' }}>Track Everything.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="body-lg max-w-lg mt-8">
              A community-driven platform for tracking endangered species.
              Report sightings. Monitor populations. Make a difference.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex gap-4 mt-10">
              <a href="/sightings/new" className="btn btn-primary">Report a Sighting</a>
              <a href="/species" className="btn btn-outline">Explore Species</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <div className="rule" />
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-3 gap-8">
            {[
              { val: stats.species, label: 'Species Tracked' },
              { val: stats.sightings, label: 'Sightings Reported' },
              { val: stats.reporters, label: 'Active Contributors' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <div className="stat-value"><Counter end={s.val} /></div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HABITATS ═══════════════ */}
      <div className="rule" />
      <section className="section">
        <div className="section-inner">
          <Reveal>
            <p className="label mb-4">Ecosystems</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[clamp(2rem,4vw,3.5rem)] text-white max-w-2xl mb-16">
              Three habitats.<br/>One shared mission.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'forest', emoji: '🌲', title: 'Forest', desc: 'Tigers, Orangutans, Elephants', species: 3, accent: '#22c55e' },
              { key: 'ocean', emoji: '🌊', title: 'Ocean', desc: 'Blue Whales, Hawksbill Turtles, Vaquitas', species: 3, accent: '#3b82f6' },
              { key: 'arctic', emoji: '❄️', title: 'Arctic', desc: 'Snow Leopards, Arctic Foxes, Polar Bears', species: 3, accent: '#94a3b8' },
            ].map((h, i) => (
              <Reveal key={h.key} delay={i * 0.1}>
                <a href={`/species?habitat=${h.key}`} className="card block group">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-8">
                      <span className="text-4xl">{h.emoji}</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{h.species} species</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {h.title}
                    </h3>
                    <p className="body-sm">{h.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ color: h.accent }}>
                      Explore <span>→</span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ RECENT SIGHTINGS ═══════════════ */}
      <div className="rule" />
      <section className="section">
        <div className="section-inner">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Reveal>
                <p className="label mb-4">Live Feed</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="display text-[clamp(2rem,4vw,3rem)] text-white">Recent Sightings</h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <a href="/sightings" className="btn btn-outline text-sm hidden md:inline-flex">View All</a>
            </Reveal>
          </div>

          <div className="space-y-2">
            {(recent.length > 0 ? recent : [
              { id: 1, species_name: 'Sumatran Tiger', habitat: 'forest', location: 'Sumatra, Indonesia', reporter_name: 'Arthur', created_at: new Date().toISOString() },
              { id: 2, species_name: 'Blue Whale', habitat: 'ocean', location: 'Pacific Ocean', reporter_name: 'Marine Watch', created_at: new Date().toISOString() },
              { id: 3, species_name: 'Snow Leopard', habitat: 'arctic', location: 'Himalayas, Nepal', reporter_name: 'Arctic Team', created_at: new Date().toISOString() },
            ]).map((s: any, i: number) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <div className="card group">
                  <div className="flex items-center gap-5 px-6 py-5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                         style={{ background: s.habitat === 'forest' ? 'rgba(34,197,94,0.08)' : s.habitat === 'ocean' ? 'rgba(59,130,246,0.08)' : 'rgba(148,163,184,0.08)' }}>
                      {s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{s.species_name || 'Unknown'}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.location}</div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-xs text-[var(--text-muted)]">{s.reporter_name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <div className="rule" />
      <section className="section">
        <div className="section-inner text-center">
          <Reveal>
            <p className="label mb-6">Take Action</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[clamp(2rem,5vw,4rem)] text-white max-w-2xl mx-auto">
              Every observation<br/>matters.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="body-lg max-w-md mx-auto mt-6">
              Your sighting helps scientists track populations,
              identify threats, and protect species for future generations.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a href="/sightings/new" className="btn btn-primary mt-10">
              Report Your First Sighting
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="rule" />
      <footer className="py-12 px-6">
        <div className="section-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🐾</span>
            <span className="text-sm font-semibold text-white tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>WildTrace</span>
          </div>
          <p className="text-[var(--text-muted)] text-xs">
            TestSprite Hackathon S3 · Built for wildlife conservation
          </p>
        </div>
      </footer>
    </>
  );
}
