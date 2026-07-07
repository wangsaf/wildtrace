import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WildTrace — Protect Wildlife. Track Everything.",
  description: "Community-powered wildlife conservation tracking platform. Report sightings, track endangered species, and contribute to global conservation efforts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="font-bold text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                WildTrace
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a href="/species" className="text-sm text-gray-300 hover:text-white transition-colors">
                Species
              </a>
              <a href="/sightings" className="text-sm text-gray-300 hover:text-white transition-colors">
                Sightings
              </a>
              <a href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                Dashboard
              </a>
              <a
                href="/sightings/new"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors"
              >
                Report Sighting
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
