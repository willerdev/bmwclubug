# BMW Club Uganda

Premium web application for **BMW Club Uganda** — the official digital home for BMW enthusiasts across Uganda.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — page and component animations
- **Neon Postgres** — CMS content and join applications
- **React Query** — client data fetching
- **Leaflet** — interactive maps for routes and locations
- **Lucide React** — icons

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npm run seed   # optional: load initial content into Neon
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin CMS: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Environment variables

Required for local development and **Render**:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres connection string (`sslmode=require`) |
| `ADMIN_PASSWORD` | Shared password for `/admin` login |
| `ADMIN_SESSION_SECRET` | Long random string used to sign the admin session cookie |

On Render: leave **Root Directory** empty, set the three env vars on the Web Service, then redeploy. After deploy, open `/admin/login` with the shared password.

## Admin CMS

Password-protected CMS at `/admin` backed by Neon:

- Events, partners, garages, shop products
- Join applications (approve / reject)
- Public member directory profiles
- Gallery and media library (uploads stored in Neon, served at `/api/media/[id]`)
- Hero image and contact overrides

Seed script (uses mock/real content as the initial dataset):

```bash
npm run seed
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (live events, shop, members, gallery, etc.) |
| `/about` | Club mission and story |
| `/members` | Member directory (from Neon) |
| `/members/[id]` | Member profile |
| `/events` | Events calendar |
| `/events/[id]` | Event detail |
| `/garages` | Partner garage directory |
| `/marketplace` | Buy/sell listings |
| `/routes` | Driving routes map |
| `/gallery` | Photo gallery |
| `/forum` | Community discussions |
| `/partners` | Sponsors and partners |
| `/contact` | Contact form |
| `/join` | Membership application → `POST /api/applications` |
| `/shop` | Club merchandise |
| `/admin` | Admin CMS |
| `/admin/login` | Admin password login |

## Design

- Dark luxury aesthetic (Matte Black `#0B0B0B`, BMW Blue `#1C69D4`, M Red `#EB0129`)
- Glassmorphism, carbon textures, metallic gradients
- Framer Motion animations throughout
- Fully responsive

## Production Build

```bash
npm run build
npm start
```
