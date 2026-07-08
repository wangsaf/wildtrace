import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "WildTrace — Protect Wildlife. Track Everything.",
  description: "Community-powered wildlife conservation tracking platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <CustomCursor habitat="forest" />
        <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-lg group-hover:scale-110 transition-transform">🐾</span>
              <span className="font-bold text-sm text-white tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                WildTrace
              </span>
            </a>
            <div className="flex items-center gap-1">
              {[
                { href: '/species', label: 'Species' },
                { href: '/sightings', label: 'Sightings' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map(l => (
                <a key={l.href} href={l.href}
                   className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  {l.label}
                </a>
              ))}
              <a href="/sightings/new"
                 className="ml-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg font-medium transition-colors">
                Report
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
