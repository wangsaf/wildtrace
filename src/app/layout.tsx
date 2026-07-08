import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "WildTrace — Protect Wildlife. Track Everything! 🐾",
  description: "Community-powered wildlife conservation tracking platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CustomCursor habitat="forest" />

        <nav className="topbar">
          <div className="section-inner flex items-center justify-between h-16 px-6">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🐾</span>
              <span className="text-lg font-bold text-[var(--text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>WildTrace</span>
            </a>
            <div className="flex items-center gap-2">
              {[
                { href: '/species', label: '🦁 Species' },
                { href: '/sightings', label: '📡 Sightings' },
                { href: '/dashboard', label: '📊 Dashboard' },
              ].map(l => (
                <a key={l.href} href={l.href}
                   className="px-3 py-1.5 text-sm font-bold text-[var(--text-soft)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-white/50">
                  {l.label}
                </a>
              ))}
              <a href="/sightings/new" className="btn btn-green btn-sm ml-2">📸 Report</a>
            </div>
          </div>
        </nav>

        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
