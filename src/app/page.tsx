'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── Firefly Canvas ─── */
function Fireflies({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const p = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.5 + 0.5, o: Math.random(), s: Math.random() * 0.015 + 0.005,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      p.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.o += p.s;
        if (p.o > 0.8 || p.o < 0.1) p.s *= -1;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 255, 180, ${p.o})`;
        ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(100, 255, 150, 0.4)';
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, [count]);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ─── Animated Counter ─── */
function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setVal(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

/* ─── Sighting Card ─── */
function SightingCard({ icon, species, location, reporter, time, delay = 0 }: {
  icon: string; species: string; location: string; reporter: string; time: string; delay?: number;
}) {
  return (
    <div className="glass p-5 flex items-center gap-4 group" style={{ animationDelay: `${delay}s` }}>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0
                      group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm truncate">{species}</h4>
        <p className="text-slate-500 text-xs truncate">{location} · {reporter}</p>
      </div>
      <div className="text-slate-600 text-xs shrink-0">{time}</div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [stats, setStats] = useState({ species: 0, sightings: 0, reporters: 0 });
  const [sightings, setSightings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      setStats({ species: d.species, sightings: d.sightings, reporters: d.reporters });
      setSightings(d.recent || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(16,185,129,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(59,130,246,0.06)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,_rgba(16,185,129,0.05)_0%,_transparent_40%)]" />
        <Fireflies count={60} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-slide-up mb-8">
            <span className="badge badge-green">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Community-Powered Conservation
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-up leading-[0.95]"
              style={{ animationDelay: '0.15s', fontFamily: 'Playfair Display, serif' }}>
            Protect Wildlife.
            <br />
            <span className="gradient-text">Track Everything.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed"
             style={{ animationDelay: '0.3s' }}>
            Join thousands of conservationists tracking endangered species.
            Report sightings, monitor populations, and make a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.45s' }}>
            <a href="/sightings/new" className="btn-primary text-center">
              Report a Sighting
            </a>
            <a href="/species" className="btn-ghost text-center">
              Explore Species
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-slate-600 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border border-slate-700 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-slate-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass p-10 sm:p-12 grid grid-cols-3 gap-6 sm:gap-8">
            {[
              { value: stats.species, label: 'Species Tracked', icon: '🦁' },
              { value: stats.sightings, label: 'Total Sightings', icon: '📍' },
              { value: stats.reporters, label: 'Active Reporters', icon: '👥' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="stat-number"><Counter end={s.value} /></div>
                <div className="text-slate-500 text-xs sm:text-sm mt-2 tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HABITATS ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-green mb-4 inline-flex">Ecosystems</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4"
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Three Habitats. <span className="gradient-text">One Mission.</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Track wildlife across Earth&apos;s most critical ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Forest */}
            <a href="/species?habitat=forest" className="habitat-card glass group habitat-card-forest">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-emerald-950/20 z-0" />
              <div className="absolute inset-0 z-[2] p-6 flex flex-col justify-end">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">🌲</div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Forest</h3>
                <p className="text-emerald-300/70 text-sm">Tigers, Orangutans, Elephants</p>
                <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <span className="text-lg">→</span>
                </div>
              </div>
            </a>

            {/* Ocean */}
            <a href="/species?habitat=ocean" className="habitat-card glass group habitat-card-ocean">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-blue-950/20 z-0" />
              <div className="absolute inset-0 z-[2] p-6 flex flex-col justify-end">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">🌊</div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Ocean</h3>
                <p className="text-blue-300/70 text-sm">Blue Whales, Hawksbill Turtles, Vaquitas</p>
                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <span className="text-lg">→</span>
                </div>
              </div>
            </a>

            {/* Arctic */}
            <a href="/species?habitat=arctic" className="habitat-card glass group habitat-card-arctic">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/40 to-slate-900/20 z-0" />
              <div className="absolute inset-0 z-[2] p-6 flex flex-col justify-end">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">❄️</div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Arctic</h3>
                <p className="text-slate-300/70 text-sm">Snow Leopards, Arctic Foxes, Polar Bears</p>
                <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <span className="text-lg">→</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ RECENT SIGHTINGS ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-green mb-4 inline-flex">Live Feed</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4"
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Recent Sightings
            </h2>
          </div>

          <div className="space-y-3">
            {sightings.length > 0 ? sightings.map((s: any, i: number) => (
              <SightingCard
                key={s.id}
                icon={s.habitat === 'forest' ? '🐅' : s.habitat === 'ocean' ? '🐋' : '🐆'}
                species={s.species_name || 'Unknown'}
                location={s.location}
                reporter={s.reporter_name}
                time={new Date(s.created_at).toLocaleDateString()}
                delay={i * 0.1}
              />
            )) : (
              <>
                <SightingCard icon="🐅" species="Sumatran Tiger" location="Sumatra, Indonesia" reporter="Arthur" time="2h ago" />
                <SightingCard icon="🐋" species="Blue Whale" location="Pacific Ocean" reporter="Marine Watch" time="5h ago" />
                <SightingCard icon="🐆" species="Snow Leopard" location="Himalayas, Nepal" reporter="Arctic Team" time="1d ago" />
              </>
            )}
          </div>

          <div className="text-center mt-8">
            <a href="/sightings" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
              View all sightings →
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-blue-900/10" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🌍</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                Every Sighting Counts
              </h2>
              <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
                Your wildlife observation helps scientists track populations,
                identify threats, and protect endangered species for future generations.
              </p>
              <a href="/sightings/new" className="btn-primary inline-block">
                Report Your First Sighting
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🐾</span>
            <span className="font-bold text-white text-sm tracking-wide"
                  style={{ fontFamily: 'Playfair Display, serif' }}>WildTrace</span>
          </div>
          <p className="text-slate-600 text-xs">
            Built for TestSprite Hackathon S3 · Protect Wildlife. Track Everything.
          </p>
        </div>
      </footer>
    </div>
  );
}
