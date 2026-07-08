import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WILDTRACE — 8-bit Wildlife Conservation",
  description: "Community-powered wildlife conservation tracking platform. Retro pixel art style!",
  icons: {
    icon: '/pixel/icons/favicon.png',
    apple: '/pixel/icons/favicon-192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" />
        <link rel="icon" href="/pixel/icons/favicon.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/pixel/icons/favicon-192.png" />
        <meta name="theme-color" content="#0f380f" />
      </head>
      <body className="cursor-pixel">
        {/* CRT Scanline overlay */}
        <div className="crt-overlay" />

        {/* 8-bit Navigation */}
        <nav className="topbar">
          <div className="section-inner flex items-center justify-between h-14 px-6">
            <a href="/" className="flex items-center gap-3 group">
              <span className="text-sm tracking-wider" style={{ fontFamily: 'Press Start 2P', color: '#9bbc0f' }}>
                ▶ WILDTRACE
              </span>
            </a>
            <div className="flex items-center gap-1">
              {[
                { href: '/species', label: 'SPECIES' },
                { href: '/sightings', label: 'SIGHTINGS' },
                { href: '/leaderboard', label: 'RANKS' },
                { href: '/dashboard', label: 'STATS' },
              ].map(l => (
                <a key={l.href} href={l.href}
                   className="px-3 py-2 text-xs hover:bg-[#306230] transition-colors"
                   style={{ fontFamily: 'Press Start 2P', fontSize: '8px', color: '#9bbc0f' }}>
                  {l.label}
                </a>
              ))}
              <a href="/sightings/new"
                 className="ml-3 px-4 py-2 text-xs border-2 border-[#9bbc0f] hover:bg-[#306230] transition-colors"
                 style={{ fontFamily: 'Press Start 2P', fontSize: '8px', color: '#9bbc0f' }}>
                + REPORT
              </a>
            </div>
          </div>
        </nav>

        <main className="pt-14">{children}</main>

        {/* Pixel footer */}
        <footer className="border-t-4 border-[var(--outline)] py-8 px-6" style={{ background: 'var(--gb-darkest)' }}>
          <div className="section-inner text-center">
            <p style={{ fontFamily: 'Press Start 2P', fontSize: '8px', color: '#9bbc0f' }}>
              ▶ WILDTRACE v1.0 — PROTECT WILDLIFE
            </p>
            <p className="mt-3 text-sm" style={{ color: '#306230', fontFamily: 'VT323' }}>
              INSERT COIN TO CONTINUE... 🎮
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
