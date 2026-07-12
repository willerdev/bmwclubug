# BMW Club Uganda

Premium web application for **BMW Club Uganda** — the official digital home for BMW enthusiasts across Uganda.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — page and component animations
- **GSAP** — available for advanced animations
- **React Query** — data fetching layer (ready for backend integration)
- **Leaflet** — interactive maps for routes and locations
- **Lucide React** — icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Cinematic homepage with all sections |
| `/about` | Club mission and story |
| `/members` | Searchable member directory (150 members) |
| `/members/[id]` | Member profile pages |
| `/events` | Events calendar with upcoming/past views |
| `/events/[id]` | Event detail with countdown |
| `/garages` | Partner garage directory (30 garages) |
| `/marketplace` | Buy/sell listings (50 items) |
| `/marketplace/[id]` | Listing detail |
| `/routes` | Interactive driving routes map |
| `/gallery` | Masonry photo gallery (300 photos) |
| `/forum` | Community discussions (150 posts) |
| `/partners` | Sponsors and partners |
| `/contact` | Contact form |
| `/login` | Member login |
| `/join` | Membership application |
| `/dashboard` | Member dashboard with QR pass |
| `/shop` | Official club merchandise |
| `/admin` | Admin management dashboard |

## Mock Data

All content is populated with realistic Ugandan mock data:
- 150 members across 14 districts
- 80 BMW vehicles
- 30 partner garages
- 50 marketplace listings
- 25 driving routes
- 30 events
- 300 gallery photos
- 150 forum discussions
- 20 partner businesses

## Design

- Dark luxury aesthetic (Matte Black `#0B0B0B`, BMW Blue `#0066B1`)
- Glassmorphism, carbon textures, metallic gradients
- Particle backgrounds, mouse glow effects
- Framer Motion animations throughout
- Fully responsive
- PWA manifest included

## Production Build

```bash
npm run build
npm start
```

## Next Steps

- Connect Firebase/Supabase for authentication
- Integrate Cloudinary for image uploads
- Add Google Maps API key for enhanced maps
- Wire up backend API for live data
