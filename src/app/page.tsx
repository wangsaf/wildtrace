'use client';

import { useEffect, useRef, useState } from 'react';

function Fireflies({ count = 30 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1,
      opacity: Math.random(),
      speed: Math.random() * 0.02 + 0.01,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.speed;
        if (p.opacity > 1 || p.opacity < 0) p.speed *= -1;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, ${150 + Math.random() * 100}, ${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 150, 0.5)';
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function StatCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let current = 0;
          const increment = end / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="stat-number">{count.toLocaleString()}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Layers */}
        <div
          className="parallax-layer"
          style={{
            background: 'linear-gradient(180deg, #000a00 0%, #0a1a0a 40%, #1a3a1a 100%)',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div
          className="parallax-layer opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 80%, #1a3a1a, transparent 60%)',
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
        <div
          className="parallax-layer opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 70% 60%, #2d5a2d, transparent 50%)',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        {/* Fireflies */}
        <Fireflies count={40} />

        {/* Fog */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 60%, rgba(10, 26, 10, 0.8) 100%)',
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm text-emerald-300">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Community-Powered Conservation
            </div>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up"
            style={{ animationDelay: '0.2s', fontFamily: 'Playfair Display, serif' }}
          >
            Protect Wildlife.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Track Everything.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            Join thousands of conservationists tracking endangered species worldwide.
            Report sightings, monitor populations, and make a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a
              href="/sightings/new"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/25 text-lg"
            >
              Report a Sighting
            </a>
            <a
              href="/species"
              className="px-8 py-4 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-all text-lg"
            >
              Explore Species
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCounter end={9} label="Species Tracked" />
            <StatCounter end={1247} label="Total Sightings" />
            <StatCounter end={342} label="Active Reporters" />
          </div>
        </div>
      </section>

      {/* Habitat Preview */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl font-bold text-white text-center mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Three Habitats. One Mission.
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Track wildlife across Earth's most critical ecosystems. Each habitat has its own unique species, challenges, and conservation needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Forest */}
            <a href="/species?habitat=forest" className="group">
              <div className="glass-card p-8 h-64 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 to-transparent" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">🌲</div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Forest</h3>
                  <p className="text-gray-300 text-sm">Tigers, Orangutans, Elephants</p>
                  <div className="mt-4 text-emerald-400 text-sm group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </div>
            </a>

            {/* Ocean */}
            <a href="/species?habitat=ocean" className="group">
              <div className="glass-card p-8 h-64 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-transparent" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">🌊</div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Ocean</h3>
                  <p className="text-gray-300 text-sm">Blue Whales, Hawksbill Turtles, Vaquitas</p>
                  <div className="mt-4 text-blue-400 text-sm group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </div>
            </a>

            {/* Arctic */}
            <a href="/species?habitat=arctic" className="group">
              <div className="glass-card p-8 h-64 relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/50 to-transparent" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">❄️</div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Arctic</h3>
                  <p className="text-gray-300 text-sm">Snow Leopards, Arctic Foxes, Polar Bears</p>
                  <div className="mt-4 text-sky-400 text-sm group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Recent Sightings */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-4xl font-bold text-white text-center mb-12"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Recent Sightings
          </h2>
          <div className="space-y-4">
            {[
              { species: 'Sumatran Tiger', location: 'Sumatra, Indonesia', reporter: 'Arthur', time: '2 hours ago', icon: '🐅' },
              { species: 'Blue Whale', location: 'Pacific Ocean', reporter: 'Marine Watch', time: '5 hours ago', icon: '🐋' },
              { species: 'Snow Leopard', location: 'Himalayas, Nepal', reporter: 'Arctic Team', time: '1 day ago', icon: '🐆' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-6 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="text-4xl">{s.icon}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{s.species}</h4>
                  <p className="text-gray-400 text-sm">{s.location} · by {s.reporter}</p>
                </div>
                <div className="text-gray-500 text-sm">{s.time}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/sightings" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              View all sightings →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Every Sighting Counts
            </h2>
            <p className="text-gray-300 mb-8">
              Your wildlife observation helps scientists track populations, identify threats, and protect endangered species for future generations.
            </p>
            <a
              href="/sightings/new"
              className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/25 text-lg"
            >
              Report Your First Sighting
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>WildTrace</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built for TestSprite Hackathon S3 · Protect Wildlife. Track Everything.
          </p>
        </div>
      </footer>
    </div>
  );
}
