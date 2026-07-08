# 🐾 WildTrace — Protect Wildlife. Track Everything.

Community-powered wildlife conservation tracking platform built for **TestSprite Hackathon S3**.

## 🌍 Live Demo

**https://wildtrace.spectriad.com**

## ✨ Features

- **Landing Page** — Parallax forest background with firefly particle animations
- **Species Gallery** — 9 endangered species with habitat filtering (forest/ocean/arctic) and search
- **Report Sighting** — Community members can report wildlife observations via glassmorphism form
- **Dashboard** — Conservation stats with animated counters and recent activity feed
- **Custom Cursor** — Context-aware cursor that changes per habitat (🐻 bear, 🪼 jellyfish, ❄️ snowflake)
- **Species Detail** — Individual species pages with status, population data, and sighting history

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + Glassmorphism |
| Animations | Canvas particles + CSS transitions |
| Icons | Lucide React (SVG) |
| Backend | Next.js API Routes |
| Database | PostgreSQL 16 (VPS-250 via Tailscale) |
| Deployment | VPS-239 + pm2 + Nginx Proxy Manager |
| DNS | Cloudflare (proxied) |
| Testing | TestSprite CLI |

## 🧪 TestSprite Verification

All tests verified against the live production URL:

| Test Plan | Status | Verdict |
|-----------|--------|---------|
| Landing page with parallax | ✅ Passed | All assertions verified |
| Species gallery with filter | ✅ Passed | All assertions verified |
| Report sighting form | ✅ Passed | Form submission verified |
| Dashboard with stats | ✅ Passed | Stats and activity verified |

## 🔄 The Loop

This project was built using the **TestSprite verification loop**:

1. **Write** — AI agent builds features
2. **Verify** — TestSprite CLI runs real tests against live app
3. **Fix** — Agent reads failure bundles and fixes root causes
4. **Verify Again** — Re-run tests, bank passes

Real failures were caught and fixed:
- Database authentication failure (wrong password)
- Missing database (had to recreate)

See [LOOP.md](./LOOP.md) for the full iteration log.

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/wangsaf/wildtrace.git
cd wildtrace

# Install
npm install

# Environment
# Create .env with:
# DATABASE_URL=postgresql://postgres:password@host:5432/wildtrace

# Run
npm run dev

# Build
npm run build
npm start
```

## 📁 Project Structure

```
wildtrace/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (parallax + particles)
│   │   ├── layout.tsx            # Root layout (nav + custom cursor)
│   │   ├── globals.css           # Global styles + animations
│   │   ├── species/
│   │   │   ├── page.tsx          # Species gallery
│   │   │   └── [id]/page.tsx     # Species detail
│   │   ├── sightings/
│   │   │   ├── page.tsx          # Sightings feed
│   │   │   └── new/page.tsx      # Report form
│   │   ├── dashboard/page.tsx    # Conservation dashboard
│   │   └── api/
│   │       ├── species/route.ts  # Species CRUD
│   │       ├── sightings/route.ts # Sightings CRUD
│   │       └── stats/route.ts    # Dashboard stats
│   ├── components/
│   │   ├── CustomCursor.tsx      # Context-aware cursor
│   │   └── Animations.tsx        # Scroll animations
│   └── lib/
│       └── db.ts                 # PostgreSQL connection
├── testsprite-plans/             # Test plans for verification
├── LOOP.md                       # Loop iteration log
└── README.md                     # This file
```

## 🏆 Hackathon Submission

**TestSprite Hackathon S3 — Build the Loop**

- **Project**: Wildlife conservation tracking platform
- **Loop**: 3 iterations with real failures caught and fixed
- **Tests**: 4/4 passing
- **Innovation**: Custom cursor per habitat, parallax particles, conservation story

---

Built with ❤️ for wildlife conservation
