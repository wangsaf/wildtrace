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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CustomCursor habitat="forest" />

        <nav className="topbar">
          <div className="section-inner flex items-center justify-between h-14 px-6">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-base group-hover:scale-110 transition-transform duration-300">🐾</span>
              <span className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>WildTrace</span>
            </a>
            <div className="flex items-center gap-1">
              {[
                { href: '/species', label: 'Species' },
                { href: '/sightings', label: 'Sightings' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map(l => (
                <a key={l.href} href={l.href}
                   className="px-3 py-1.5 text-[13px] text-[var(--text-secondary)] hover:text-white transition-colors rounded-lg hover:bg-white/[0.03]">
                  {l.label}
                </a>
              ))}
              <a href="/sightings/new" className="btn btn-primary ml-3 !py-1.5 !px-4 !text-[13px]">
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
