# CLAUDE.md - Konectr Website

**Last Updated**: 2026-07-07 | **Status**: Production Live (V1.0) | **FAQ**: v3 (58 questions) | **RSVP `/a/[code]`**: Kinetic redesign LIVE (2026-07-07)

---

## Project Overview

Konectr's official marketing website and landing page. Built with Next.js 16 and deployed on Vercel.

**Live URL**: https://konectr.app

**How we work (since 2026-10-01):** tickets are GitHub Issues in `Konectr/konectr-mvp` (one tracker for app, backend, web and console); process in `Development/docs/ENGINEERING.md`. Changes go branch → PR (`Closes Konectr/konectr-mvp#n`) → green `web-ci.yml` → merge to `main`, which deploys. `docs/BUGLOG.md` is only a capture inbox for when GitHub can't be reached.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React framework with App Router |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| next-intl | 4.6.1 | Internationalization (8 locales) |
| Framer Motion | 12.x | Animations |

---

## Project Structure

```
konectr-web/
├── src/
│   ├── app/
│   │   ├── [locale]/        # Locale-specific pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── about/       # About page
│   │   │   ├── blog/        # Blog pages
│   │   │   ├── contact/     # Contact page
│   │   │   ├── faq/         # FAQ page (58 questions)
│   │   │   ├── feedback/    # Feedback board
│   │   │   ├── gamification/ # Gamification showcase
│   │   │   ├── how-it-works/# How it works
│   │   │   └── safety/      # Safety page
│   │   ├── a/[code]/        # Activity share links (no locale)
│   │   ├── api/venue-interview/ # Venue interview → Notion API
│   │   ├── api/calendar/[code]/ # .ics generator for activity (no locale)
│   │   ├── unsubscribe/     # Token-based one-click email unsub (no locale)
│   │   ├── venue-interview/ # Venue discovery interview form
│   │   ├── not-found.tsx    # 404 page (Flappy Konectr game)
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── sitemap.ts       # Dynamic sitemap
│   ├── components/
│   │   ├── games/           # Interactive game components
│   │   │   ├── flappy-constants.ts  # Physics, colors, types
│   │   │   ├── useFlappyGame.ts     # Game engine hook
│   │   │   └── FlappyKonectr.tsx    # Canvas game component
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Navigation.tsx   # Global navigation
│   │   └── Footer.tsx       # Global footer
│   ├── i18n/                # Internationalization config
│   └── lib/
│       ├── utils.ts         # Utility functions
│       └── supabase.ts      # Supabase client + helpers
├── public/
│   ├── logos/               # Brand logos (SVG)
│   └── .well-known/         # Universal Links config
├── messages/                # Translation files (JSON)
├── vercel.json              # Vercel config + redirects
└── next.config.ts           # Next.js config
```

---

## Deployment

### Production Domains

| Domain | Purpose | Platform |
|--------|---------|----------|
| **konectr.app** | Primary website | Vercel |
| **www.konectr.app** | WWW variant | Vercel (redirects to apex) |
| **konectrapp.com** | Legacy/alternate | Vercel **domain redirect** (308 → konectr.app) |
| **www.konectrapp.com** | Legacy WWW | Vercel **domain redirect** (308 → konectr.app) |
| **konectr.my** | Owned alt (MY ccTLD) | Vercel **domain redirect** (308 → konectr.app) |
| **www.konectr.my** | Owned alt WWW | Vercel **domain redirect** (308 → konectr.app) |
| **konectrcircle.com** | Owned alt | Vercel **domain redirect** (308 → konectr.app) |
| **www.konectrcircle.com** | Owned alt WWW | Vercel **domain redirect** (308 → konectr.app) |

> ⚠️ **Redirects are configured at the Vercel domain level, NOT in `vercel.json`.**
> This is a **Next.js** project, so Vercel **ignores `redirects`/`headers`/`rewrites` in
> `vercel.json`** (and the next-intl middleware 307s `/` → `/en` before any such rule could
> run). The `vercel.json` `redirects` block below is **dead config** — left only as historical
> reference; do not rely on it. The live redirects are set per-domain via the Vercel API/dashboard
> (`PATCH /v9/projects/{id}/domains/{domain}` → `{"redirect":"konectr.app","redirectStatusCode":308}`).
> Verified 2026-06-06: all 6 alt hostnames return `308 → https://konectr.app/`.

### Vercel Configuration

- **Project**: `konectr-web`
- **Team**: `konectr`
- **Region**: Auto (Edge)
- **Build**: `next build`
- **Install**: `npm install`

### DNS Records (Namecheap)

All alt/redirect domains use identical DNS pointing at Vercel:

```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

All 6 alt hostnames (konectrapp.com, konectr.my, konectrcircle.com + their www variants)
are attached to the `konectr-web` Vercel project and `verified: true` as of 2026-06-06.

### Domain Redirects (Vercel domain-level, NOT vercel.json)

Set per-domain via the Vercel API (or dashboard → Settings → Domains → Edit → "Redirect to Another Domain"):

```bash
# Token from CLI auth; TEAM=team_NGteFxpD625ykJhngEJOZciV  PROJ=prj_JmAtBAphd9uHVnxHX7dHtFt62w40
curl -X PATCH "https://api.vercel.com/v9/projects/$PROJ/domains/$DOMAIN?teamId=$TEAM" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"redirect":"konectr.app","redirectStatusCode":308}'
```

> The `vercel.json` `redirects` block (konectrapp.com / www.konectrapp.com) is **dead config on
> Next.js** — it does not fire. Kept only as historical reference. Do not add new redirects there;
> use the domain-level redirect above.

---

## Internationalization

### Supported Locales

| Code | Language | Status |
|------|----------|--------|
| en | English | Default |
| ms | Malay (Bahasa Malaysia) | Active |
| zh-HK | Chinese Traditional (Hong Kong) | Active |
| zh-CN | Chinese Simplified | Active |
| ja | Japanese | Active |
| ko | Korean | Active |
| th | Thai | Active |
| vi | Vietnamese | Active |

### Adding Translations

1. Add translation file: `messages/{locale}.json`
2. Update `src/i18n/request.ts` if needed
3. Translations auto-generate static pages at build time

---

## Brand Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Sunset Orange | `#FF774D` | `--primary` | Primary CTA, accents |
| Solar Amber | `#FFC845` | `--secondary` | Secondary highlights |
| Graphite Grey | `#1F1F1F` | `--foreground` | Text, dark sections |
| Cloud White | `#FAFAFA` | `--background` | Backgrounds |

---

## Favicon

Branded favicon set using the Konectr "K" symbol in Sunset Orange (#FF774D).

### Files (`public/`)

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Legacy browsers |
| `favicon-16x16.png` | 16x16 | Small browser tabs |
| `favicon-32x32.png` | 32x32 | Standard browser tabs |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `android-chrome-192x192.png` | 192x192 | Android home screen |
| `android-chrome-512x512.png` | 512x512 | Android splash/PWA |

### Source

Generated from `/public/logos/konectr-icon-orange.svg`

### Head Tags (`src/app/layout.tsx`)

```tsx
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

---

## Development

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Deployment Commands

> ✅ **Git auto-deploy WORKS — pushing to `main` ships to production.** Verified 2026-08-09: `git push` of `a8a4150` produced a `src=git` production deployment that reached READY on its own, and the three pushes before it did the same.
>
> The old "auto-deploy is BROKEN as of 2026-04-27" warning that lived here was **stale for months**. Its root cause (FI-25, `docs/CHANGELOG.md:1119`) was that Vercel's Production Branch was still `nextjs-website` while development had moved to `main` — so pushes landed on a branch nothing was watching. The branch setting has since been corrected to `main`; nobody updated this doc, so every session kept deploying by hand and kept re-asserting the breakage. Confirm any future suspicion against the API rather than this file:
>
> ```bash
> # productionBranch should be "main"
> curl -s "https://api.vercel.com/v9/projects/$PROJ?teamId=$TEAM" -H "Authorization: Bearer $TOK" | jq '.link.productionBranch'
> # recent deploys — src=git means auto-deploy fired
> curl -s "https://api.vercel.com/v6/deployments?projectId=$PROJ&teamId=$TEAM&limit=5" -H "Authorization: Bearer $TOK" \
>   | jq -r '.deployments[] | "\(.target) \(.state) src=\(.source) \(.meta.githubCommitRef)"'
> ```
>
> `vercel --prod` still works and is the right tool for deploying uncommitted local work, but it is no longer required for anything that has been pushed.

```bash
# Normal path: push to main and Vercel builds it. No manual step needed.
git push origin main

# Manual deploy — only for work that is NOT committed/pushed
cd /Users/devsmac/Konectr/Development/konectr-web && vercel --prod --yes

# Deploy preview (generates unique URL)
vercel

# Verify production is up to date
curl -sL https://konectr.app/en/ | grep "Launching"

# List recent production deploys (check freshness)
vercel ls --prod

# List all domains
vercel domains ls

# Inspect domain status
vercel domains inspect konectr.app

# Check SSL certificates
vercel certs ls
```

---

## FAQ Page (v3)

**Live URL**: https://konectr.app/faq

### Content Summary

| Category | Icon | Questions |
|----------|------|-----------|
| About Konectr | 📱 | 7 |
| Getting Started | 🚀 | 5 |
| How Konectr Works | 💡 | 10 |
| Safety & Trust | 🛡️ | 8 |
| Activities & Meetups | 🎯 | 9 |
| Badges & Gamification | 🏆 | 5 |
| Account & Settings | ⚙️ | 6 |
| Premium & Future Features | ✨ | 3 |
| Troubleshooting & Support | 🔧 | 5 |
| **Total** | | **58** |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/faq/page.tsx` | FAQ page component |
| `src/app/[locale]/faq/FAQContent.tsx` | FAQ content with 58 questions |
| `src/app/[locale]/faq/faq-data.ts` | FAQ data (shared between client + server JSON-LD) |

### Emoji Reference (Synced with Mobile)

Emojis in FAQ content match `konectr_mobile/lib/constants/category_reference.dart`:

**Venue Categories:**
| Emoji | Category |
|-------|----------|
| ☕ | Cafe |
| 🍽️ | Restaurant |
| 🍻 | Bar |
| 💪 | Fitness |
| ⛰️ | Outdoors |
| 🎭 | Entertainment |

**Activity Categories:**
| Emoji | Category |
|-------|----------|
| ☕ | Chill |
| 💪 | Active |
| 🎯 | Focus |
| 🎨 | Creative |
| ⛰️ | Adventure |
| 🎉 | Social |
| 📌 | Default |

### Components Used

- `shadcn/ui Accordion` - Collapsible FAQ items
- `Framer Motion` - Fade-in animations
- `Next.js Link` - Internal navigation

---

## Related Projects

| Project | Path | Description |
|---------|------|-------------|
| konectr-mobile | `../konectr-mvp/konectr_mobile/` | Flutter mobile app |
| konectr-analytics | `../konectr-analytics/` | Admin dashboard |

---

## Quick Reference

### Key Files

- `src/app/[locale]/page.tsx` - Homepage
- `src/app/[locale]/faq/FAQContent.tsx` - FAQ page (58 questions, 9 categories)
- `src/app/[locale]/layout.tsx` - Locale layout (includes Navigation + Footer)
- `src/components/Navigation.tsx` - Global navigation header
- `src/components/Footer.tsx` - Global footer
- `src/app/globals.css` - Global styles + brand colors
- `vercel.json` - Domain redirects
- `next.config.ts` - Next.js + next-intl config
- `messages/*.json` - Translation files

### Common Tasks

| Task | Command/Location |
|------|------------------|
| Add new page | Create folder in `src/app/[locale]/` |
| Update FAQ content | Edit `src/app/[locale]/faq/FAQContent.tsx` |
| Update translations | Edit `messages/{locale}.json` |
| Change redirects | `next.config.ts` `redirects()` (host-based) — NOT `vercel.json`, which Vercel ignores on Next.js |
| Page metadata / canonicals | `buildPageMetadata()` in `src/lib/metadata.ts` — never add `alternates`/`openGraph` to `[locale]/layout.tsx` |
| Add component | Use `npx shadcn@latest add {component}` |

---

## How It Works Page

**Live URL**: https://konectr.app/how-it-works

### Steps with Local Images

| Step | Title | Image |
|------|-------|-------|
| 01 | Pick Your Vibe | `/images/homepage/step-1.jpg` |
| 02 | See Who's Free | `/images/homepage/step-2.jpg` |
| 03 | Meet at the Spot | `/images/homepage/step-3.jpg` |

### Key Details
- Small groups: 2-5 people for quality conversations
- All images stored locally in `public/images/homepage/`

---

## Safety Page

**Live URL**: https://konectr.app/safety

### Safety Features (6 cards)

| Icon | Title | Description | Badge |
|------|-------|-------------|-------|
| ✅ | Phone Verified | Every member verifies their phone number before joining. Real people only. | - |
| 📍 | Public Venues Only | All meetups happen at cafés, gyms, and public spaces—never private locations. | - |
| 🚨 | Quick Reporting | Flag concerning behavior in two taps. Reports trigger automatic review. | - |
| ⚖️ | Three-Strike System | 3 reports = warning. 6 = suspension. 9 = six-month ban. No exceptions. | - |
| 🔒 | Private Messaging | Chat in-app only. Your phone number is never shared. | - |
| 📸 | Photo Verification | AI-powered selfie matching to prevent catfishing. | COMING SOON |

### Coming Soon Badge Styling

```tsx
<span className="ml-2 inline-block bg-[#FFC845] text-[#1F1F1F] text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
  Coming Soon
</span>
```

### Key File

| File | Purpose |
|------|---------|
| `src/app/[locale]/safety/SafetyContent.tsx` | Safety page with 6 feature cards |

### Page Sections

1. **How We Keep You Safe** - 6 feature cards (grid layout)
2. **Community Guidelines** - Be Respectful, Be Honest, Be Safe
3. **Safety Tips** - Before, During, After meetup tips
4. **Need Help?** - Contact support CTA + safety@konectr.app

---

## Gamification Page

**Live URL**: https://konectr.app/gamification

### Purpose

Marketing showcase page for the mobile app's gamification system (tiers, badges, streaks, daily rewards, XP). Drives curiosity and app downloads. Follows SafetyContent pattern — thin server `page.tsx` wrapper + `"use client"` content component with Framer Motion scroll animations.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/gamification/page.tsx` | Server wrapper with PageHeader + SEO metadata |
| `src/app/[locale]/gamification/GamificationContent.tsx` | 7-section content component (~350 lines) |
| `src/app/[locale]/gamification/gamification-data.ts` | Static data arrays (tiers, badges, streaks, rewards, XP) |
| `src/messages/en/gamification.json` | English i18n translation file |

### Page Sections (7)

| # | Section | Background | Key Visual |
|---|---------|-----------|------------|
| 1 | Tier Progression | default | 6 tier cards with colored left border, emoji, perks |
| 2 | Badge Collection | `bg-muted/50` | 3x3 category grid + 5-level rarity pills |
| 3 | Streak System | default | Vertical timeline + flame progression + shield callout |
| 4 | Daily Rewards | `bg-muted/50` | 6 reward nodes, special days highlighted |
| 5 | XP System | default | 2x3 source grid + streak multiplier callout |
| 6 | Summary Stats | dark (`bg-foreground`) | 4 key metrics with emojis |
| 7 | CTA | `bg-primary` gradient | "Get Early Access" + "How It Works" buttons |

### Navigation

- **Footer only** (Resources column) — not in top nav
- Link label: "Rewards & Progression" (key: `gamification`)
- Added to all 8 locale `common.json` files

### Data Source

Static data arrays in `gamification-data.ts` derived from mobile app constants:
- 6 tiers (Basic -> Legendary)
- 9 badge categories with example badges
- 5 badge rarity levels (Common -> Legendary)
- 6 streak milestones (1 week -> 3 months)
- 4 flame color phases
- 6 daily reward highlights from 30-day cycle
- 6 XP sources with ranges

---

## 404 Page — Flappy Konectr Mini-Game (2026-02-20)

**Live URL**: https://konectr.app/nonexistent (any invalid route)

### Purpose

Custom 404 page featuring a "Flappy Bird"-style mini-game. Player controls a Konectr stick-figure mascot flying through branded obstacle pillars while collecting activity emoji collectibles. Turns a dead-end into a memorable, on-brand experience.

### Architecture

**Placement**: `src/app/not-found.tsx` (root-level, outside `[locale]` layout)

| Design Decision | Rationale |
|----------------|-----------|
| Root-level not-found | Catches ALL 404s (invalid locales, invalid pages, everything) |
| No Navigation/Footer | Full-screen immersive game canvas |
| No ThemeProvider | Detects dark mode via `matchMedia` + `MutationObserver` on `<html>` class |
| No next-intl | English-only text (acceptable for whimsical game page) |
| Locale-aware "Go Home" | Detects `navigator.language` → maps to supported locale |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/not-found.tsx` | Server component wrapper (metadata + renders FlappyKonectr) |
| `src/components/games/flappy-constants.ts` | Physics values, colors (light/dark), types, brand config |
| `src/components/games/useFlappyGame.ts` | Game engine hook: requestAnimationFrame loop, delta-time physics, collision detection, rendering pipeline, state machine |
| `src/components/games/FlappyKonectr.tsx` | Client component: full-viewport canvas, input handling, idle/playing/gameover overlays |

### Game Mechanics

| Feature | Details |
|---------|---------|
| Player | Konectr stick-figure mascot (sunset orange, ring head, K-shaped flying pose) |
| Controls | Tap / Click / Spacebar / Enter |
| Gravity | 0.45 px/frame², flap force -7.5, terminal velocity 10 |
| Obstacles | Top/bottom pillar pairs (Sunset Orange top, Solar Amber bottom) with rounded caps |
| Scoring | +1 per pillar pair passed, +3 for collecting floating activity emojis |
| Difficulty | Speed increases + gap narrows over time, caps at score 50 |
| Collectibles | Activity emojis from category_reference.dart, 40% of pillar pairs |
| High score | `localStorage` key: `"flappy-konectr-high-score"` |

### Visual Layers (per frame, back to front)

1. Sky gradient (warm peach light / deep navy dark)
2. Clouds (parallax, 30% scroll speed)
3. City skyline silhouette (parallax, 60% scroll speed)
4. Greenery (grass strip, procedural bushes + trees, scrolls with ground)
5. Pillars with rounded caps
6. Emoji collectibles (bobbing)
7. Ground strip with movement dashes
8. Player (stick figure with velocity-based tilt rotation)
9. Score (top-center, Satoshi font)
10. Hit flash

### Game States

| State | Display |
|-------|---------|
| Idle | "404 Page Not Found" + bobbing mascot + "Tap to Fly" button + high score + "Go back home" link |
| Playing | Full-screen canvas game + score overlay |
| Game Over | Blurred overlay card with score, high score, "New High Score!" indicator, "Play Again" + "Go Home" buttons |

### Technical Details

- **Rendering**: HTML5 Canvas with `requestAnimationFrame`, delta-time normalized for 60Hz/120Hz
- **Full-viewport**: Dynamic design width computed from canvas aspect ratio (height=700 reference, width stretches)
- **Responsive**: `ResizeObserver` + `devicePixelRatio` capped at 2x
- **Dark mode**: `matchMedia` + `MutationObserver` on `<html>` class (no ThemeProvider)
- **Keyboard**: Window-level `keydown` listener (Safari-compatible, not relying on canvas focus)
- **Accessibility**: `aria-label` on canvas, `aria-live` score, `prefers-reduced-motion` support
- **Performance**: Off-screen culling, array filtering, capped DPR, no memory leaks

### Stick-Figure Mascot

The player character is a branded stick figure drawn with canvas paths (no external assets):
- Ring/donut head (thick sunset orange outline, cream center)
- Thick rounded strokes (~4px, round lineCap) — marker/brush style
- Organic curves (`quadraticCurveTo`) for all limbs
- Joyful flying pose: arms spread upward in V, legs trailing below
- Matches the Konectr brand mascot style

---

## Static Images

### Homepage (`public/images/homepage/`)

| File | Usage |
|------|-------|
| `hero.jpg` | Homepage hero section |
| `before.jpg` | The Shift section (before) |
| `after.jpg` | The Shift section (after) |
| `step-1.jpg` | How It Works - Step 1 |
| `step-2.jpg` | How It Works - Step 2 |
| `step-3.jpg` | How It Works - Step 3 |

### About Page (`public/images/about/`)

| File | Usage |
|------|-------|
| `our-story.jpg` | Our Story section (landscape) |

---

## Category Emojis (Synced with Mobile)

All emojis match `konectr_mobile/lib/constants/category_reference.dart`:

### Hero Section - Venue Categories (6 pills)

| Emoji | Label | Key |
|-------|-------|-----|
| ☕ | Cafe | cafe |
| 🍽️ | Restaurant | restaurant |
| 🍻 | Bar | bar |
| 💪 | Fitness | fitness |
| ⛰️ | Outdoors | outdoors |
| 🎭 | Entertainment | entertainment |

### Find Your Vibe - Activity Categories (6 cards)

| Emoji | Card Title | Category |
|-------|------------|----------|
| ☕ | Cafe Culture | Chill |
| 💪 | Fitness & Wellness | Active |
| 🎉 | Social Games | Social |
| ⛰️ | Nature & Adventure | Adventure |
| 🍽️ | Foodie Adventures | Restaurant |
| 🎨 | Arts & Culture | Creative |

---

## Waitlist (Tally Form)

**Live URL**: https://konectr.app/#waitlist
**Tally Form ID**: `mY1xRq`
**Dashboard**: https://tally.so (manage form, view submissions)

### Implementation

The waitlist form is embedded via iframe in `CTAFooter.tsx`:

```tsx
<iframe
  src="https://tally.so/embed/mY1xRq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
  width="100%"
  height="500"
  frameBorder="0"
  title="Konectr Waitlist"
  style={{ minHeight: '500px' }}
/>
```

### Form Fields (Collected by Tally)

| Field | Type | Required |
|-------|------|----------|
| Email | Input | Yes |
| First Name | Input | Yes |
| Phone | Input (+60 Malaysia) | Yes |
| Gender | Dropdown | Yes |
| Areas | Multi-select (10 KL locations) | Yes |
| Age Range | Dropdown (18-25, 26-35, 36-45, 45+) | Yes |
| Activities/Sports | Text | No |
| Consent Checkboxes | 3 checkboxes | Yes |
| CAPTCHA | Verification | Yes |

### Key Files

| File | Purpose |
|------|---------|
| `src/components/sections/CTAFooter.tsx` | Waitlist form embed |
| `src/config/brand.ts` | Tally form ID + embed URL config |

### Webhook Integration (ACTIVE - Fixed Feb 9, 2026)

Tally form submissions are synced to Supabase for conversion tracking:

| Component | Details |
|-----------|---------|
| **Webhook URL** | `https://rsrplvdtbycqcxjlyeju.supabase.co/functions/v1/tally-webhook` |
| **Edge Function** | `supabase/functions/tally-webhook/index.ts` (v2) |
| **Target Table** | `waitlist_users` |
| **Status** | Active - syncing to Supabase (fixed Feb 9, 2026) |
| **Security** | HMAC-SHA256 signature verification via `tally-signature` header |
| **Secret** | `TALLY_WEBHOOK_SECRET` (set in Supabase edge function secrets) |
| **Backfill** | 24 historical signups imported (Sep 2025 - Feb 2026) |

**Data Flow**:
```
Tally Form → Webhook → waitlist_users table → Auto-link on app signup
```

**Conversion Tracking**: When a waitlist user signs up for the app with the same email, triggers automatically:
1. Link `profiles.waitlist_user_id` to waitlist record
2. Set `waitlist_users.converted_at` timestamp
3. Track `onboarding_completed_at` and `first_activity_at`

**Analytics Queries** (run in Supabase):
```sql
SELECT * FROM get_waitlist_funnel_stats(90);
SELECT * FROM v_waitlist_conversion_status;
```

---

## Analytics (Contentsquare/Hotjar)

**Dashboard**: https://app.contentsquare.com

### Integration

Script added to `src/app/layout.tsx`:
```tsx
<Script
  src="https://t.contentsquare.net/uxa/10ec7463f1940.js"
  strategy="lazyOnload"
/>
```

### Features Available

- Heatmaps (click, scroll, attention)
- Session Replay
- AI Frustration Score
- User behavior analytics

---

## Feedback Board (2025-12-27)

**Live URL**: https://konectr.app/feedback

### Purpose

Public feedback board for viewing feature requests, bug reports, and suggestions submitted through the mobile app. **View-only on web** - voting is only available in the Konectr mobile app.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/feedback/page.tsx` | Feedback board page wrapper |
| `src/app/[locale]/feedback/FeedbackBoardContent.tsx` | Main board with filters, sorting, ticket list |
| `src/app/[locale]/feedback/[id]/page.tsx` | Ticket detail page wrapper |
| `src/app/[locale]/feedback/[id]/FeedbackTicketDetailContent.tsx` | Full ticket detail view |
| `src/app/[locale]/feedback/components/FeedbackTicketCard.tsx` | View-only ticket card |
| `src/app/[locale]/feedback/components/CategoryFilter.tsx` | Category filter chips |
| `src/lib/feedback-api.ts` | API functions for fetching tickets |
| `src/types/feedback.ts` | TypeScript types, category/status metadata |

### Navigation

- **NOT in top navigation** - kept minimal
- **In footer** - Resources section (after FAQs)
- Footer translations in all 8 locales (`footer.links.feedback`)

### Features

| Feature | Description |
|---------|-------------|
| Category Filter | Filter by: Feature Request, Bug Report, Improvement, General |
| Sort Options | Newest, Most Voted, Trending |
| Ticket Cards | Show vote count, title, category, status, submitter |
| Detail View | Full description, attachments, admin response |
| Lightbox | Click attachments to view full-size |

### Category Metadata

| Category | Emoji | Color |
|----------|-------|-------|
| feature_request | 💡 | Blue |
| bug_report | 🐛 | Red |
| improvement | ✨ | Purple |
| general | 💬 | Gray |

### Status Metadata

| Status | Label | Color |
|--------|-------|-------|
| open | Open | Yellow |
| in_progress | In Progress | Blue |
| planned | Planned | Purple |
| completed | Completed | Green |
| declined | Declined | Red |

### Web vs Mobile

| Feature | Web | Mobile |
|---------|-----|--------|
| View tickets | ✅ | ✅ |
| Submit feedback | ❌ | ✅ |
| Vote on tickets | ❌ | ✅ |
| View attachments | ✅ | ✅ |

### Design Notes

- Cards show vote count as read-only badge (no up/down buttons)
- "Download Konectr App" CTA for voting
- Framer Motion animations on ticket cards
- Responsive grid for attachments
- Lightbox modal for image viewing

---

## Activity Share Links (2025-12-27)

**Live URL**: https://konectr.app/a/{shareCode}

### Purpose

Web fallback page for activity share links. When users share activities, recipients without the app see a preview page with download CTAs.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/a/[code]/page.tsx` | Activity preview page (server-rendered) |
| `src/app/r/[code]/page.tsx` | Referral landing page (server-rendered) |
| `src/lib/supabase.ts` | Supabase client + `getActivityByShareCode()` helper |
| `src/lib/smartLink.ts` | Smart Download CTA helper (deep-link + store fallback) |
| `src/components/SmartDownloadLink.tsx` | Client-only `<a>` wrapper for use in server components |
| `public/logos/konectr-icon-orange.svg` | Orange Konectr icon for header |
| `public/.well-known/apple-app-site-association` | iOS Universal Links |
| `public/.well-known/assetlinks.json` | Android App Links |

### Smart Download CTAs (2026-04-16)

Download buttons on `/a/[code]` and `/r/[code]` attempt the Konectr deep link first
(`konectr://activity/{code}` / `konectr://referral/{code}`), falling back to the
platform store after 2s if the app isn't installed. Visibility-change listener
cancels the fallback once the app takes focus.

Env vars (optional — set once app is live on stores):

| Variable | Fallback | Platform |
|----------|----------|----------|
| `NEXT_PUBLIC_IOS_STORE_URL` | `https://konectr.app/#waitlist` | iOS |
| `NEXT_PUBLIC_ANDROID_STORE_URL` | `https://konectr.app/#waitlist` | Android |

Desktop visitors always route to the waitlist page — there's no app to download on desktop.

### Page States

| State | Trigger | Content |
|-------|---------|---------|
| Active | Valid code, future activity | Activity card + "Download on App Store" + "Open in Konectr" deep link |
| Ended | Valid code, past activity | "This activity has ended" + download CTA |
| Not Found | Invalid code | "Activity not found" + download CTA |

### Activity Card Content (Minimal)

- 🏷️ Activity name with category emoji
- 👤 Hosted by {creator_name}
- 📅 Date & time of day
- 📍 Venue name

### Design

| Element | Light Mode |
|---------|------------|
| Header BG | Solid Sunset Orange (#FF774D) |
| Logo | White pill with orange Konectr icon |
| Card | White with activity details |
| Footer | "konectr.app · The Offline First App" |

### Tagline (Short Form)

**"The Offline First App"** - Use when character-limited.

---

## Venue Discovery Interview (2026-02-28)

**Live URL**: https://konectr.app/venue-interview
**Hidden**: `noindex, nofollow` — not in sitemap or navigation
**Purpose**: Mobile-optimized form for face-to-face venue partner interviews across KL. Target: 100 venues (~2/week). Submissions save directly to Notion database.

### Architecture

| Component | Details |
|-----------|---------|
| **Form** | 6-step wizard, 33 fields, localStorage auto-save |
| **API** | `POST /api/venue-interview` → Notion `pages.create()` |
| **Database** | Notion "Venue Discovery Interviews" (`1018decf-0484-4a9f-8a82-717ce756ec8b`) |
| **Middleware** | Excluded from next-intl locale routing |
| **Env Vars** | `NOTION_API_KEY`, `NOTION_INTERVIEW_DATABASE_ID` (Vercel production) |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/venue-interview/page.tsx` | Server wrapper with noindex metadata |
| `src/app/venue-interview/VenueInterviewForm.tsx` | Client component — multi-step form wizard |
| `src/app/venue-interview/interview-data.ts` | Field definitions, steps, options (33 fields, 6 steps) |
| `src/app/api/venue-interview/route.ts` | POST handler — maps form → Notion properties |

### Form Flow (6 Steps — designed for 15-min conversations)

| Step | Title | Fields | When | Type |
|------|-------|--------|------|------|
| 1 | Before You Walk In | 7 | Pre-research | Prep |
| 2 | Who You're Meeting | 4 | First minute | Taps |
| 3 | How's Business? | 6 | 4–5 min | Taps |
| 4 | Community & Konectr | 5 | 4–5 min (pitch) | Taps |
| 5 | Wrapping Up | 3 | 1–2 min (close) | Taps |
| 6 | After You Leave | 8 | Debrief (solo) | 5 taps + 3 text |

### Design Principles

- **During conversation**: All taps (selects/multi-selects) — no typing while talking
- **After leaving**: Text boxes for qualitative capture (key quote, slow periods, notes)
- **Labels as conversation guides**: Each label tells the interviewer what to ask
- **Hints as scripts**: Quoted text the interviewer can say verbatim
- **Auto-save**: localStorage preserves draft if connection drops mid-interview

### Notion Property Mapping

| Form Type | Notion Type | Fields |
|-----------|-------------|--------|
| title | title | Venue Name |
| select | select | Venue Type, Neighborhood, Role, Google Rating, Years Operating, Daily Foot Traffic, Demographic, Monthly Marketing Spend, Hosted Events Before, Open to Meetups, Dashboard Interest, WiFi + Group Seating, Perk Willingness, Partner Interest, Vibe Check, Partner Tier, Enthusiasm |
| multi_select | multi_select | Top Challenges, Marketing Channels, Top Value Props |
| number | number | Seating Capacity, Repeat % (÷100), Ambiance Score |
| rich_text | rich_text | Person Interviewed, Key Quote, Slow Periods, Notes |
| phone_number | phone_number | Contact, Follow-Up Phone |
| email | email | Follow-Up Email |
| url | url | Instagram |
| date | date | Interview Date |

### Environment Variables (Vercel)

| Variable | Scope | Notes |
|----------|-------|-------|
| `NOTION_API_KEY` | Production + Preview | Internal Notion integration token |
| `NOTION_INTERVIEW_DATABASE_ID` | Production + Preview | UUID without hyphens |

**Important**: Use `printf` (not `echo`) when piping values to `vercel env add` — `echo` appends `\n` which corrupts HTTP headers and UUID validation.

---

## SEO

### Structured Data (JSON-LD)

| Schema | Location | Purpose |
|--------|----------|---------|
| Organization | `src/app/[locale]/layout.tsx` | Company info + social links |
| WebSite | `src/app/[locale]/layout.tsx` | Site name + URL |
| SoftwareApplication | `src/app/[locale]/layout.tsx` | App metadata for rich results |
| FAQPage | `src/app/[locale]/faq/page.tsx` | 54 Q&As for Google Rich Results |
| BlogPosting | `src/app/[locale]/blog/[slug]/page.tsx` | Per-post metadata (Person author) |
| BreadcrumbList | All sub-pages (`about`, `how-it-works`, etc.) | Navigation breadcrumb rich results |
| HowTo | `src/app/[locale]/how-it-works/page.tsx` | 3-step process rich results |

### SEO Utilities

| File | Contents |
|------|----------|
| `src/lib/seo.ts` | `generateBreadcrumbSchema()`, `generateHowToSchema()`, `APP_STRUCTURED_DATA` |

### Meta Descriptions

Each page has a unique keyword-targeted meta description (not shared from layout):

| Page | Primary Keywords |
|------|-----------------|
| Homepage | meet new people, Kuala Lumpur, real activities |
| About | social app, real friends in KL, founded by expat |
| How It Works | make friends in 3 steps, small groups, public venue |
| Safety | phone-verified, public venues only, 3-strike policy |
| FAQ | 55+ answers, meeting people, Kuala Lumpur |
| Blog | making friends as adult, expat guides, friendship recession |
| Gamification | earn badges, build streaks, 6 tiers |
| Contact | partnerships, press, Konectr team |
| Feedback | feature requests, community feedback, transparent |

### Social Sharing

| Feature | File | Details |
|---------|------|---------|
| OG Image (marketing pages) | `public/og-image.jpg` | 1200x630, derived from hero.jpg; fallback inside `buildPageMetadata()` |
| OG Image (shared links) | `public/og-share.jpg` | 1200x630, 131 KB. Used by `/a/[code]` + `/r/[code]` via `SHARE_OG_IMAGE` |
| Twitter Card | `src/app/[locale]/layout.tsx` | summary_large_image, @konectrapp |
| theme-color | `src/app/layout.tsx` | Light: #FAFAFA, Dark: #1F1F1F |

> 🔴 **`og:image` on `/a/[code]` and `/r/[code]` MUST be an absolute URL.** `metadataBase` is set
> only in `[locale]/layout.tsx`, and those two routes sit outside that layout — a site-relative
> path is never resolved, and WhatsApp/iMessage drop a non-absolute `og:image` **silently**. The
> tag will look correct in the rendered HTML and the preview will still have no image. Always go
> through `SHARE_OG_IMAGE` in `src/lib/metadata.ts`, which hardcodes the apex host.
>
> These two URLs are the only ones the mobile app ever puts on a share sheet, so they are the
> only OG tags that affect real users. Any new no-locale route that gets shared needs the same
> treatment — `buildPageMetadata()` does **not** reach outside `[locale]`.
>
> **2026-09-08:** `/hyrox` and `/leaderboard` had exactly this bug — no `og:image`, grey box in every chat
> app — fixed with `SHARE_OG_IMAGE`. Checklist for **every** no-locale route: `images: [SHARE_OG_IMAGE]`,
> a `sitemap.ts` entry, an internal link (via `next/link`, never the i18n `Link` — that emits
> `/{locale}/…` and 404s), and its own JSON-LD if it wants rich results (Organization/WebSite live in
> `[locale]/layout.tsx` and do not reach here). `/leaderboard` is still not linked from anywhere on the site (the app's Settings → Community tile opens it in-app since build 65).

### Crawling

| Feature | File | Details |
|---------|------|---------|
| robots.txt | `src/app/robots.ts` | Allow all + sitemap reference |
| Sitemap | `src/app/sitemap.ts` | All pages + blog posts, 8 locales |
| **Root `/` → `/en` 308** | `next.config.ts` `redirects()` | 🔴 MUST stay `permanent: true`. next-intl's middleware 307s the root; a 307 made Google canonicalise `konectr.app/` over `/en` and refuse the homepage as a duplicate (GSC URL Inspection 2026-09-08). Runs before middleware. Root no longer content-negotiates; deep paths still do. |
| GSC | DNS TXT on `konectr.app` | Domain property, verified — `dig +short TXT konectr.app`. `NEXT_PUBLIC_GSC_VERIFICATION` in `src/app/layout.tsx` is dead code. Sitemap Success, 163 URLs (2026-09-08). |

---

## Performance

### Image Optimization

All homepage images compressed with `sips` (82% JPEG quality, max 1920px wide):

| Image | Before | After | Savings |
|-------|--------|-------|---------|
| step-3.jpg | 6.8MB | 678KB | 90% |
| step-1.jpg | 4.6MB | 525KB | 89% |
| before.jpg | 3.2MB | 298KB | 91% |
| our-story.jpg | 3.2MB | 696KB | 78% |
| step-2.jpg | 1.3MB | 390KB | 70% |

Next.js image optimization enabled (AVIF/WebP formats, responsive sizes).

### Font Self-Hosting

Satoshi font self-hosted from `public/fonts/` (replaces Fontshare CDN). Eliminates render-blocking external request. `@font-face` declarations in `globals.css`.

### Analytics Deferral

Contentsquare script changed from `afterInteractive` to `lazyOnload` for faster TTI.

---

## Lessons Learned

### Third-Party Embeds in Dynamic Components (CRITICAL)

**Problem**: Third-party embeds (Tally, Typeform, etc.) that use `data-*-src` attributes require JavaScript initialization. When the embed is inside a dynamically imported component (`dynamic()` in Next.js), there's a **race condition**:

1. The third-party script loads and scans the DOM
2. The dynamic component hasn't mounted yet (iframe not in DOM)
3. Script finishes → iframe never activates
4. OR component mounts, calls `loadEmbeds()` → script already ran

**Solution**: Use direct `src` attribute instead of `data-*-src`:

```tsx
// ❌ WRONG - Requires JavaScript initialization (race condition risk)
<iframe data-tally-src="https://tally.so/embed/xyz" />

// ✅ CORRECT - Loads immediately, no JavaScript dependency
<iframe src="https://tally.so/embed/xyz" />
```

**Applies to**: Tally, Typeform, Calendly, HubSpot forms, any embed using progressive enhancement.

### iframe Height for Forms

Forms with many fields need adequate height. A form with 9+ fields needs at least 500px:

```tsx
<iframe
  src="..."
  height="500"
  style={{ minHeight: '500px' }}
/>
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-10-13 | **Hashtag default photos on `/a/[code]`, batch 1 (11 tags)** | Founder rule 2026-10-12: every hashtag (58, app `lib/constants/activity_hashtags.dart`) has one standard default photo, named `public/images/activities/<slug>.jpg`; a Captain cover (PF-12) overrides it in the app only. `activity-images.ts` gains `HASHTAG_IMAGE` (slug → photo, 29 tags) and an optional `tags` input checked before keywords. It is wired through `SharedActivity.tags`, but `get_activity_by_share_code` does not return `tags` yet, so live pages still match keywords until that RPC change (Dev-run SQL). Tag lookup uses `Object.hasOwn`, because tags are free text any signed-in user can write. New photos, all Unsplash License, 1200 wide, q82: pickleball `1gOtJQQyN04` (Jon Matthews), padel `ScuN2Puav48` (Vincenzo Morelli), golf `UYFkm2L4QqQ` (kaleb tapp), movies `AtPWnYNDJnM` (Krists Luhaers), streetfood `gF62_RY6kh4` (Yoav Aziz), brunch `NfO0dUwM-iE` (Andrii Solok), gokart `HHeu1d2hpNM` (SLR Lounge), tabletennis `bjHlX7UCge0` (Quilia), dragonboat `v3pkHWvlrIU` (cheng feng), kayaking `TgJIWOAL278` (Tommy Shen), photowalk `rzYNrA9XK0c` (ran liwen). Padel and golf show one woman each and join `WOMEN_ONLY_SAFE`. Keyword rules added for all 11 plus board games (`games.jpg`, which was unused until now). Padel stops borrowing tennis. Brunch moves ahead of cafe, table tennis ahead of tennis, and kayak/rafting out of hike. Movies needs "movie", "cinema" or "film night/screening", never a bare "film". Dry run over 670 plans (last 45 days): 34 change (16 pickleball, 9 brunch, 3 photo walk, 2 go-kart, 2 street food, 1 board games, 1 golf). Still gaps: karaoke (the only good stock set carries a karaoke-app logo), escape room and laser tag (no usable stock; ask Breakout or Laser Battle for photos), plus 25 long-tail tags. Vitest 135 pass, tsc 0, ESLint 0. |
| 2026-10-12 | **Bowling hero on `/a/[code]` + title-first image matching** | New `bowling` rule in `activity-images.ts` (`bowling\|ten-?pin\|🎳\|mega ?lanes\|cosmic/supreme bowl\|superbowl`; never bare "bowl", since live plans say "a bowl of ramen" and "acai bowls") and new `public/images/activities/bowling.jpg` (1200×1500, ~230 KB, q82). Source: Unsplash `MdN5h3QCiTw` by Brittani Burns, Unsplash License (free commercial use, no attribution required), a group cheering a bowler, portrait so it survives both hero crops. Shows men, so it is NOT in `WOMEN_ONLY_SAFE`. Matching is now two passes: venue + title first, then purpose + category. "STRIKES, SPARES & NEW FRIENDS!" @ Supreme Bowl (`34F50405`) showed the restaurant photo because its purpose said "dinner after", and its twin `8995C545` showed the cafe photo via its category; a bowling rule alone could not fix both without the bar hunt `40DCB4C3` ("skipped bowling? join anyway") turning into bowling. Dry run over 670 plans from the last 45 days: 9 change (3 bowling, 5 better title matches, 1 arguable: "COFEEE WITH MERDEKA 118" @ Makamakan cafe → restaurant). Mobile app still maps bowling → `play.jpg` (`activity_image_resolver.dart`). Vitest 114 pass, tsc 0, ESLint 0; rendered locally at 390 and 1440 wide. |
| 2026-09-23 | **UI/UX + conversion audit → fixes (deploy 2026-09-26)** | Live audit (Lighthouse, traces, `share_link_views`). 🔴 **PostHog recorded ZERO web events for 30d**: the snippet is `cookieless_mode: 'always'` but project 281996 had `cookieless_server_hash_mode = 0`, so every event was dropped — check `$pageview` exists before trusting any web funnel. Real `/a/[code]` 30d: 2,015 human views (iOS 936 / Android 801 / desktop 274) → 99 RSVPs (4.9%) → 2 claimed; **23% of views land on an ENDED plan** (dead end, no next plan). Fixes: new `src/lib/usePrimaryCta.ts` — hero, nav and "Download the app" share one platform-aware destination (nav + section CTA sent iPhone users to the waitlist of a live beta); nav CTA visible on mobile; hero h1/sub/CTAs no longer start at opacity 0 (LCP render delay 1353→789 ms local, slow-4G ×4 CPU); hero `pt-28` (logo sat under the nav pill on phones); pills/vibe cards lose fake hover affordance; 3 solid-black avatar files dropped; footer social `aria-label`s + 44px; Tally iframe `loading="lazy"`. **Contrast:** `--primary-foreground` + every `bg-[#FF774D]`/`bg-primary` `text-white` → graphite (white on orange 2.63:1 fails AA; graphite 6.28:1) — own commit, revertable. RSVP: "Add phone"/"Open in the app" 44px targets, WHERE tile wraps 2 lines. **Hardening:** `next.config.ts` `headers()` — nosniff, Referrer-Policy, `frame-ancestors 'self' https://tally.so`, Permissions-Policy (no HSTS override: subdomains unaudited); API 500s return a generic message (raw Postgres/Notion text was echoed). Local Lighthouse mobile a11y 93→100. Open: `/api/venue-interview` is unauthenticated → Notion (founder decision); copy drafts (hero/stats/footer CTA/ended-plan state) pending founder review. |
| 2026-09-10 | **`/leaderboard` ranks by completed activities** | `82e94dd`. Row headline is now the completed-activity count (label DONE), points secondary; glance, WhatsApp summary, empty state, legend and meta description say "completed activities" not "verified meetups". Mirrors `get_public_leaderboard` (migration `20260910110000`: `verified_meetups` = `COUNT(DISTINCT activity_id)` credited to the user, rank by count then points; test accounts excluded). Board stays opt-in; an opt-out default was tried and reversed the same hour. Still orphaned from internal links. |
| 2026-09-09 | **`/a/[code]` poster heading = activity title (parity with the app)** | The Kinetic redesign set the hero `<h1>` to the venue name ("heading auto = venue name"), so the same activity read as "The Exchange TRX" on web and "JOM LUNCH — TRX MALL!" in the app — founder flagged it as inconsistent. `ActivityRsvpPage.tsx` now derives `heading = title \|\| venue` and passes it via a new optional `heading` prop on `ClaimScreen`/`ChattingScreen`; `venueName` on those screens is now strictly the real venue, because `WhenWhereTiles` reuses it as the Google/Apple Maps search query and the directions-sheet label (switching the single prop would have sent people searching maps for the activity title). WHERE tile, directions, OG/`<title>` metadata (already title-based) unchanged. `tsc` 0, ESLint 0. |
| 2026-09-09 | **TRX Tower hero on `/a/[code]`** | `activity-images.ts` gains a `\btrx\b\|tun razak exchange` → `trx` keyword rule (above the restaurant rule) so "JOM LUNCH — TRX MALL!" @ The Exchange TRX (share `5BFC41EC`, Restaurant category) shows the landmark instead of the generic restaurant photo; other lunches unchanged. New `public/images/activities/trx.jpg` (1200×1470, ~234 KB, JPEG q82 via sharp) is a founder-supplied Exchange 106 tower shot, portrait so the tower survives both hero crops. Rule shipped one commit ahead of the asset on the feature branch (`410e111`), never on `main`. |
| 2026-09-09 | **Baseball batting-cage hero on `/a/[code]`** | `activity-images.ts` gains a `baseball\|softball\|batting` → `baseball` keyword rule (above the racquet rules) so "SWING FOR IT — BASEBALL CAGE!" @ Swing! Batting Centre (share `28674DB3`, Entertainment category) no longer falls through to the generic `social` vibe photo. New `public/images/activities/baseball.jpg` (1200×1200, ~220 KB, JPEG q82 via sharp) is a founder-supplied indoor batting-cage photo (batter mid-swing on turf, pitching machine, netting) — square crop survives both the mobile wide hero and the desktop tall rail under `object-cover`. First push shipped an SVG-rendered illustration as a stopgap because no stock host was reachable from the sandbox; replaced same day. Resolver checked on the live RPC fields; padel/cafe/fallback unchanged; `tsc` 0, ESLint 0. |
| 2026-09-08 | **Search was closed at the valve: root 308, sitemap gaps, orphan hubs, `og:image`, `html lang`** | Four commits, all verified live. `8f3d1d6`: `og:image` (`SHARE_OG_IMAGE`) on `/hyrox` + `/leaderboard` — both no-locale, so no `metadataBase` and every chat share unfurled as a grey box; `<html lang="en">` on the root layout (was bare `<html>` sitewide — `[locale]/layout.tsx` sets `lang` on an inner div, which crawlers/AT ignore); `/child-safety` ×8 + `/cookies` added to `sitemap.ts` (154 → 163). `498653d`: the founder's 2026-08-30 copy-correctness commit (47 files, unpushed for 9 days) — one FAQ conflict resolved against prod `badges.category` (7 families, 53 rows). `e3e6f21`: **HYROX footer link** (`Footer.tsx`, Resources column, `next/link`) under a freeze override — GSC said "URL is unknown to Google · Referring page: None detected" and a grep found zero internal links to `/hyrox` or `/leaderboard`. `5257112`: **`/` → `/en` as a permanent 308** in `next.config.ts` `redirects()` — GSC had `/en` as "Duplicate, Google chose different canonical than user" because next-intl's 307 is temporary and Google kept `konectr.app/`; verified on a local prod build (root 308 even with `Accept-Language: ms`, deep paths still 307-detect). Also found: GSC was DNS-verified all along (`dig +short TXT konectr.app`); the Aug-6 sitemap submission had a trailing dot. **Measured, not fixed:** PSI mobile `/en` = 40, LCP 19.1 s on the Framer-Motion-animated hero `<h1>`; Tally iframe eagerly loads ~1.2 MB below the fold. |
| 2026-09-02 | **Referral landing `/r/[code]` carries the invite code across the install (mobile buglog 2026-09 item 8b)** | A referral link could never attribute a signup: `konectr://referral/{code}` only fires when the app is already installed, there is no deferred deep link on either store, and prod had 77 referral codes and 0 `referrals` rows. The page now leads with the code (large, monospace, upper-cased), a client-side **Copy code** button (`src/app/r/[code]/CopyCodeButton.tsx`: Clipboard API with a textarea/execCommand fallback for WhatsApp/Instagram in-app browsers, "Copied" state, `referral_code_copied` PostHog event) and a 3-step "How to use it" list: install (existing SmartDownloadLink; TestFlight link when `NEXT_PUBLIC_TESTFLIGHT_URL` is set), open the app, tap "Have an invite code?" then Paste (the app gained a Paste button in the same batch). Deep-link "Open in Konectr" and all metadata/OG untouched. `NEXT_PUBLIC_IOS_STORE_URL` / `NEXT_PUBLIC_ANDROID_STORE_URL` are still unset (founder action). `tsc` 0, lint 0 errors (6 pre-existing `<img>` warnings elsewhere), `next build` exit 0 with placeholder Supabase env. |
| 2026-08-22 | **Paid-ads infra: UTM attribution + consent-gated pixels (spend gated on Play production)** | First-touch `utm_*`/`gclid`/`fbclid` capture (`src/lib/attribution.ts` + snippet in root layout, sessionStorage) flows through `/api/rsvp`, `/api/testflight-request`, `/api/android-waitlist` into the extended RPCs (mobile-repo migration `20260821120000`, applied). New `AdsConsent.tsx` in root layout: consent banner + Meta Pixel + Google tag, rendered ONLY when `NEXT_PUBLIC_META_PIXEL_ID`/`NEXT_PUBLIC_GOOGLE_ADS_ID` are set AND the visitor opts in — site is byte-identical until the ad accounts exist. New no-locale routes `/thanks` (Tally redirect-on-completion target; fires PostHog `waitlist_joined` + Meta CompleteRegistration + `NEXT_PUBLIC_GADS_CONVERSION_SIGNUP`, retry-until-tracker-loads, once per session) and `/cookies` (policy page; both excluded in `middleware.ts`). `download_click` event in all 4 `smartLink.ts` builders. Privacy §12 rewritten to truthfully name Contentsquare/PostHog/consent-gated pixels (old copy denied all tracking). 🔴 Pixels are web-only — never add ad SDKs to the mobile app (ATT / Play data-safety cascade). Founder must set the Tally form `mY1xRq` redirect to `https://konectr.app/thanks` or the waitlist conversion never fires. Playbook: mobile repo `docs/marketing/ads-launch-playbook.md`. Codex-reviewed; tsc/lint/build clean. |
| 2026-08-08 | **Shared links now unfurl with a preview card (`43aecf4`, deployed)** | `/a/[code]` and `/r/[code]` — the only two URLs the mobile app ever shares — were the only routes on the site with **no `og:image` at all**. Both hand-roll `generateMetadata` and never set `images`, so they also miss the `/og-image.jpg` fallback in `buildPageMetadata()`; with `openGraph` deliberately absent from `[locale]/layout.tsx` since the Aug-06 remediation there was nothing to inherit, and every invite pasted into WhatsApp rendered text-only. New `SHARE_OG_IMAGE` in `src/lib/metadata.ts` + `images`/`twitter` blocks on both routes **and** on the activity-not-found branch (a dead share code still gets pasted into a chat). 🔴 The URL is absolute on purpose — `metadataBase` lives only in the locale layout, and these routes are outside it, so a relative path is silently dropped by WhatsApp/iMessage. New asset `public/og-share.jpg` (1200×630, 131 KB): founder-approved variant C from a 3-way HTML mockup — `images/email/cafe-friends.jpg` under a graphite scrim with the mark + Satoshi wordmark, composition **centred** so it survives a centre-square crop (the left-anchored draft clipped to "ectr"). Carries no activity name by design: `generateShareMessage` already puts title/venue/time/spots in the message body. `tsc` 0, `next build` exit 0; verified live on a real share code, `/r/`, and the not-found branch (all → `https://konectr.app/og-share.jpg`, asset 200 `image/jpeg`). Held: per-activity photos are ~1 line away (`activityImage()` already exists in `a/[code]/redesign/` and `generateMetadata` already has the activity object). |
| 2026-08-08 | **Analytics + AEO: PostHog pageviews (cookieless) + Track A artifacts live in repo** | Root `layout.tsx` gets the official PostHog snippet — gated on `NEXT_PUBLIC_POSTHOG_KEY` (Vercel env, not yet set) AND `VERCEL_ENV === 'production'`, `cookieless_mode: 'always'` (no cookie banner needed; requires "Cookieless server hash mode" toggled in PostHog project settings; `identify()`/`alias()` don't work in this mode — web→app conversion attribution stays server-side via `waitlist_users.converted_at`). The two long-dead CTA captures (`Hero.tsx` `clicked_testflight_cta`, `TestFlightRequestCTA.tsx` `clicked_beta_cta`) start firing with zero changes once the key lands. **AEO Track A deployed from mobile-repo `docs/seo/`**: `public/llms.txt` (FI-26 placeholder → TestFlight link), `public/BingSiteAuth.xml`, AI-crawler `robots.ts` (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Applebot-Extended, …), `APP_STRUCTURED_DATA` upgraded to `MobileApplication` (TestFlight install URL, MYR, no fake aggregateRating). GSC ownership pre-wired: `metadata.verification.google` reads `NEXT_PUBLIC_GSC_VERIFICATION` — founder pastes the token into Vercel env, no code change. Analytics status in this file's "Analytics" section is Contentsquare only until the PostHog key is set. Guarded by `scripts/analytics-audit.sh` in the mobile repo (ship-it gate). `tsc` 0, lint 0 new, build exit 0. |
| 2026-08-06 | **SEO remediation — sitewide canonical/OG bug fixed (branch `claude/konectr-seo-remediation-j4ngno`, awaiting deploy)** | Root cause of the Aug-2026 audit's "whole site is a duplicate of the homepage": `[locale]/layout.tsx` `generateMetadata` set `alternates.canonical = /{locale}` + homepage `openGraph`/`twitter`, and Next.js metadata merging made every page inherit them wholesale (pages only overrode `title`/`description`). **Fix**: new `src/lib/metadata.ts` `buildPageMetadata()` (apex canonical, path-correct hreflang, page-specific og/twitter); layout stripped to `metadataBase` + title template + robots — 🔴 **never re-add `alternates`/`openGraph` to the locale layout, that recreates the bug**. All 13 `[locale]` pages converted to `generateMetadata` with self-canonicals + approved keyword titles (homepage: "Konectr — Meet New People in Kuala Lumpur \| Real Activities"). Blog posts: per-slug canonical, `og:type=article`, `article:published_time`, per-post og image, `mainEntityOfPage` in BlogPosting. **Internal-link hygiene**: 13 client components swapped `next/link` → next-intl `Link` so no internal href triggers the middleware's 307 locale redirect (BlogCard was the worst offender). **Host consolidation**: `next.config.ts` `redirects()` now 308s www + all 6 alt hostnames → apex at app level (runs before middleware) as a safety net under the Vercel domain-level redirects; dead `vercel.json` `redirects` block deleted. **Sitemap**: Notion-first blog slugs (static fallback — Notion-only posts were previously missing), `lastModified` from post dates, + `/delete-account` (8 locales) + `/leaderboard`; `robots.ts` disallows `/api/`. Audit corrections for the record: site is on **Vercel not Netlify**, and structured data (Org/WebSite/SoftwareApplication/FAQPage/BlogPosting/Breadcrumb/HowTo) already existed — the audit's "none anywhere" finding was false; only `mainEntityOfPage` + `sameAs` drift (now derived from `brand.social`) were real gaps. BlogPosting author stays `Person: Deepak Porwal` (Feb-2026 E-E-A-T decision). Verified: `tsc` 0, build exit 0, rendered heads inspected for `/en`, `/en/blog`, 2 posts, `/en/about`; sitemap 154 URLs. **Founder actions post-deploy**: `vercel --prod`, curl-verify www/konectrapp.com single-hop 308s, GSC domain property + sitemap submit + URL-inspect homepage/blog/7 posts, Bing import, re-share a blog link to confirm OG preview. |
| 2026-07-07 | **RSVP share page (`/a/[code]`) redesigned on Kinetic design system — LIVE** | Full rebuild of the web RSVP page on a unified component system across mobile + desktop, grounded in the canonical no-host model (withdraw your OWN intent; heading auto = venue name; match on Vibe · Venue · Time). **One shell, three states** via new `src/app/a/[code]/redesign/RsvpLayout.tsx` (mobile hero-sheet ↔ desktop split-rail at `lg`): **Claim** (poster + When/Where tiles + "Here for…" 2-line-clamp + expand chevron + crew + controlled name/phone/email form, multi-country), **Chatting** (`You're in` + calendar/share + live `WebChatPanel` slot + quiet withdraw), **Withdraw** (`WithdrawSheet` bottom-sheet/dialog mirroring `cancel_web_rsvp` phases + 24h-lockout copy: seat held + crew notified inside 24h). New components: `RsvpLayout`, `ClaimScreen`, `ChattingScreen`, `WithdrawSheet`, `KineticUI` (logo/VibeChip/WhenWhereTiles/HereFor/CrewStack/TrustLine), `vibes.ts` (6-vibe taxonomy + `resolveVibe`), `activity-images.ts` (hero keys to the *activity* — padel/cafe/hike/… — vibe locked; 16 curated images in `public/images/activities/`). `ActivityRsvpPage.tsx` became the controller (−234 LOC net); **every conversion feature preserved** (TestFlight beta CTA, Android waitlist, deep link, claim-code fallback, 5s teaser poll, optional email). **Correctness fix:** dropped fake pravatar avatars → honest **initials** (web guests are name-only, never public). **Hardening:** hero = `next/image priority` + responsive srcset (LCP; was CSS bg), loading skeleton (no claim-form flash for returning RSVP'd users), `WithdrawSheet` `role=dialog`/focus-trap/Esc/body-scroll-lock, muted greys → ≥4.5:1. Includes the coupled **P2 web cancel flow** (`page.tsx` `withinLock`, `cancelWebRsvp` helper, `/api/rsvp/cancel` route, `/a/[code]/cancel` landing). `tsc`/ESLint clean, `next build` 0. Committed `d76adb6d` on `claude/rsvp-redesign` + pushed; **deployed via `vercel --prod`, verified live on konectr.app** (real activities, mobile + desktop, HTTP 200, hero through image optimizer). Follow-ups: real padel photo (tennis proxy now), remove noindex `/a/preview-lab` harness, device testing (iOS Safari / VoiceOver on dialog), open PR into `main`. |
| 2026-06-28 | **Design refinement Batch C (consistency + shared-component polish)** | Audit-first homepage refinement (`docs/DESIGN_REFINEMENT_AUDIT.md`); no layout/structure changes, emojis preserved. (1) FindYourVibe download CTA: raw `<a>` → `Button`. (2) Hero: collapsed the two near-identical TestFlight/waitlist CTA branches into one computed `primaryCta`. (3) Navigation (G6): removed the `mounted` gate so the nav is present in SSR markup; `suppressHydrationWarning` guards the scrolled-refresh edge (verified `<nav>` in server HTML + 0 hydration errors). (4) JoinMovement glass card: 1px inner-edge refraction highlight; removed dead `defaultTransition` import. (5) G8 + completes G2: shared `Heading` + `SectionHeader` (last inline-Satoshi holdouts) → `font-heading` token + `tracking-tight`, applied site-wide. Browser-verified (Playwright light/dark/scroll); tsc + ESLint clean; 0 console errors. Shipped on `claude/web-design-refinement` (split off `main`, design-only). |
| 2026-06-28 | **Design refinement Batches A + B (homepage polish, no redesign)** | Audit-first refinement pass — no layout/structure changes, emoji brand voice preserved. **Batch A (P0 bug fixes):** (1) Hero `min-h-screen` → `min-h-[100dvh]` (iOS Safari layout jump). (2) Removed inline `style={{ fontFamily: "'Satoshi'" }}` on 3 headings → `font-heading` token (restores Inter/system-ui fallback). (3) Navigation scrolled-pill bg was hardcoded white → bright white on scroll in dark mode; now theme-aware via `useTheme()`. (4) CTAFooter `bg-gradient-radial` (no-op class) → real `bg-[radial-gradient(...)]`. **Batch B (materiality + tactility):** (5) Brand-tinted elevation tokens `--shadow-brand`/`--shadow-brand-lg` on orange CTAs over light backgrounds (Hero CTA + step cards left neutral by design). (6) `button.tsx`: `transform` in transition allowlist + global `active:scale-[0.98]`. (7) Decorative `→` glyphs → `lucide` `ArrowRight` (Hero, TheShift). Browser-verified; tsc + ESLint clean; 0 console errors. |
| 2026-06-14 | iOS beta CTA: "Konectr App (beta)" request flow on `/a/[code]` | **Replaces the iOS "Download Konectr" buttons on the share-link RSVP page with a TestFlight beta-request flow** (interim, until the TestFlight public link goes live ~Jun 24). New `src/app/a/[code]/TestFlightRequestCTA.tsx` renders a black **"Konectr App (beta)"** button across all 4 iOS CTA sites (post-RSVP, pre-RSVP "or" block, activity-full, ended/not-found `SimpleStateLayout`). **Auto-switching by `NEXT_PUBLIC_TESTFLIGHT_URL`** (same env var the Hero uses): when UNSET (now), the button expands an inline 🧪 "Request beta access" panel that captures an email → `POST /api/testflight-request`; when SET (Jun 24), the same button opens the TestFlight public link directly with a `clicked_beta_cta` PostHog event — no code change needed to flip. New `src/app/api/testflight-request/route.ts` mirrors `/api/android-waitlist` (anon Supabase client → `register_testflight_request` RPC, email-validated, idempotent). New mobile-repo migration `supabase/migrations/20260614010000_register_testflight_request_rpc.sql` (SECURITY DEFINER, granted to anon) writes to `waitlist_users` with `referral_source='ios_testflight_request'`, `utm_source='share_link'`, `utm_campaign=<share_code>` for viral attribution. Submitted state persists in `localStorage` (`konectr_testflight_request_email`). Removed now-dead `DownloadButton`/`AppleIcon`/`getSmartDownloadProps` import from `ActivityRsvpPage.tsx`; ended-state subtitle copy "Download Konectr" → "Join the Konectr beta". `tsc --noEmit` 0 errors; ESLint 0 errors (1 pre-existing `formatDate` warning). **Deployed 2026-06-14** via `vercel --prod` (migration applied via Dashboard SQL Editor on live `Konectr-App`). Live API smoke-tested: 400 on bad/missing email, 200 + `waitlist_users` row insert on valid request. Deploy hygiene: before shipping, the in-progress web-visual-polish working-tree edits (24 files) were stashed so only the committed beta-CTA + RSVP work went out; the root `.vercelignore` (excludes stray non-source dirs `/Development`, `/Marketing`, `/https:`, `/konectr_mobile`, `/lib`, `/konectr-web`, etc.) is now committed so future `vercel --prod` deploys stay clean. Query requesters: `select email, created_at, utm_campaign from waitlist_users where referral_source = 'ios_testflight_request' order by created_at desc;`. Android path unchanged. |
| 2026-06-14 | Web RSVP phone required + two-way web chat live (cap 10) | **Hardens the WhatsApp-circle → web-RSVP flow** (founder creates activity in-app, shares `/a/[code]` to the WA group, members RSVP + chat on web without the app). **Phone now REQUIRED**: `src/app/api/rsvp/route.ts` rejects RSVPs without a valid phone (`400 "Phone number is required"`; E.164 digit check + hashing unchanged). `src/app/a/[code]/ActivityRsvpPage.tsx` — phone field (country-code select + number) pulled out of the "+ Add phone or email" disclosure and made **always-visible + required** with `required`/`aria-required`; submit gated on name + ≥7-digit phone (`canSubmit`). Email kept optional behind a renamed "+ Add email" toggle; autofill effect only expands the disclosure when a saved email exists. **Two-way web chat enabled + cap 5 → 10**: server flag `web_chat_write_enabled` flipped true (Supabase migration `20260614000000_web_chat_enable_writes_cap10.sql` in the mobile repo) — web RSVP guests can now post into Activity Chatter, not just read. `WebChatPanel.tsx` default `messagesRemaining` 5 → 10 + "used all 10 messages" copy; `src/app/api/chat/history/route.ts` fallback `messages_remaining` 5 → 10. `tsc --noEmit` 0 errors; ESLint 0 errors (1 pre-existing `formatDate` unused-var warning). **Awaits deploy:** `vercel --prod --yes` (web) + `supabase db push` (flag/RPC migration). |
| 2026-05-22 | RSVP page redesign + Hero TestFlight CTA + participants dropdown | **`/a/[code]` shared-activity page got a brand-fit redesign.** Hero replaced with photo backdrop (category-mapped to `/images/email/{cafe-friends,fitness-class,asian-friends-park,friends-group}.jpg` — reuses the marketing-grade email hero photos for cross-channel feel) + "Let's make it real" tagline overlay + activity title set over the photo gradient + new compact "TODAY"/"TONIGHT"/"TOMORROW"/weekday chip in Sunset Orange. Card lifts up 16px over the hero edge. **Datetime card** moved out of the meta stack onto a right-aligned bordered card (`min-w-[112px]`) showing 3 lines: relative day phrase ("This Friday" / "Tonight" / "Tomorrow"), short date ("May 22"), and time in `#FF774D` ("7:00 PM"). New `getRelativeDayPhrase()` + `formatShortDate()` helpers. **Form compressed**: name input becomes the focal action; phone + country code + email collapse behind a "+ Add phone or email" disclosure that expands inline into a `#FAFAFA` panel. Saves 3 visible form fields' worth of friction for the most common 1-tap submit. **Participants dropdown**: `🙋 Sam, Maya are in` row now an aria-expandable `<button>` showing the 2 most recent signups; tap reveals a vertically-stacked `<ul>` with all names (one per row, orange dot bullet) ordered by recency-DESC. Chevron rotates 180° on expand. **Backend migration** `teaser_returns_all_names_recency_ordered` applied to `get_activity_rsvp_teaser`: removed the `LIMIT 3` cap and added `ORDER BY signed_up_at DESC` (uses `activity_participants.joined_at` and `web_rsvps.created_at`), so the dropdown gets the full list, recency-ordered. **Landing-page Hero (`src/components/sections/Hero.tsx`)** now reads `NEXT_PUBLIC_TESTFLIGHT_URL`: when set, badge flips to "🧪 TestFlight beta is live · iPhone only for now" + primary CTA becomes "Open the beta on iPhone" → TestFlight (iPhone visitors only; Android/desktop keep the waitlist CTA). Defensive `window.posthog?.capture('clicked_testflight_cta', { platform, source: 'home_hero' })` fires on click — no-ops until the PostHog SDK lands in konectr-web. New CTA-context line appears under the buttons on iPhone: "Installs via Apple TestFlight · ~30 seconds · Android coming next". Unset env var = unchanged hero behavior. **`.env.example` updated** with `NEXT_PUBLIC_TESTFLIGHT_URL` block. All conversion infrastructure preserved verbatim (claim_token round-trip, localStorage auto-fill, 5s teaser polling, `WebChatPanel`, `AndroidWaitlistCTA`, `getSmartDownloadProps`, `detectPlatform`). 0 TS errors. Deployed manually via `vercel --prod --yes` (3 deploys: initial → datetime card → dropdown). |
| 2026-04-30 | V1.0 polish pass — safety i18n + unsubscribe Tailwind + dead-code | **Safety page (`/safety`) wired to next-intl across all 8 locales** (en/ms/zh-HK/de/th/ko/ja/vi). The existing `safety.json` had stale `features.items` keys (`identityVerification`/`vettedVenues`/`safetyTeam`/`zeroTolerance`) that no longer matched the deployed component — replaced with the actually-rendered 6: `phoneVerified`, `publicVenuesOnly`, `quickReporting`, `threeStrikeSystem`, `privateMessaging`, `photoVerification` (+ `comingSoonLabel`). `SafetyContent.tsx` now uses `useTranslations('safety')` + `t.raw()` for guideline/tip arrays; structural metadata (icon, comingSoon flag) stayed in TS. Coming Soon badge switched from hardcoded `bg-[#FFC845]` to `bg-secondary` for dark-mode safety. Real translations into 7 non-EN locales is a separate task (English fallback shipped). **Unsubscribe page (`/unsubscribe`) Tailwind-ified** — removed all inline hex (`#FF774D`/`#1F1F1F`/`white`/`#444`/`#888`); now uses brand CSS-var classes (`bg-background`, `bg-card`, `text-foreground`, `text-primary`, `border-border`). Page is outside `[locale]` so ThemeProvider doesn't reach it — renders consistent light theme via brand vars; true dark-mode for out-of-locale routes is a future follow-up. **Dead-code cleanup**: removed `console.log("Form submitted:", ...)` in `ContactContent.tsx`; dropped iframe `height="500"` in `CTAFooter.tsx` (was conflicting with `dynamicHeight=1`); removed `quality={100}` + `unoptimized` flags in `HowItWorks.tsx` (now goes through Next.js AVIF/WebP pipeline with proper `sizes` prop). Deleted 5 unused Next.js scaffolding SVGs (`vercel/next/file/globe/window`) from `public/` and stale `src/app/[locale]/faq/_archive/` folder. **Verified live**: `npm run build` exit 0, all 8 locale safety pages prerender clean, deployed via `vercel --prod --yes`. Smoke-tested konectr.app — safety page renders all 6 i18n'd features, unsubscribe shows brand classes in HTML, all 5 deleted SVGs return 404. **Out of scope** (deferred for founder review): 5 fresh blog post drafts to replace the 7 stale Jan-2025 static fallbacks in `src/content/blog/index.ts`. |
| 2026-04-29 | Email infra: /unsubscribe + /api/calendar/[code] + /images/email/ | New `src/app/unsubscribe/page.tsx` — token-based one-click unsubscribe (uses `unsubscribe_by_token` Supabase RPC, flips `profiles.email_notifications_enabled` to FALSE on token match). New `src/app/api/calendar/[code]/route.ts` — fetches activity via `get_activity_by_share_code` and returns RFC 5545 `.ics` file (Content-Type: text/calendar). Both routes excluded from `next-intl` locale routing in `src/middleware.ts`. New `public/images/email/` directory with 5 assets: `logo.png` (500×500 Konectr "K" mark from Design folder), `cafe-friends.jpg` (cafe-chill, ~256KB), `asian-friends-park.jpg` (KL friends, ~340KB), `friends-group.jpg` (celebration, ~160KB), `fitness-class.jpg` (workouts, ~270KB). Powers the marketing-grade email templates in `Development/supabase/functions/send-email/index.ts` v10. All photos compressed via `sips -Z 1200 -s formatOptions 75`. |
| 2026-04-27 | Launch date deployed + auto-deploy issue flagged | Manual `vercel --prod` to push `launchDate: "April 2026"` live. Discovered git auto-deploy from `nextjs-website` had been silently broken for ~9 days — push from Apr 26 never triggered a build. CLAUDE.md updated with warning + manual deploy as default. Verified konectr.app now shows "Launching April 2026". |
| 2026-04-26 | Launch date source change | `src/config/brand.ts` — `launchDate` "February 2026" → "April 2026" to match locked Public Beta date (Apr 28, 2026). Pushed via git (deploy did not auto-trigger — see 04-27 entry). |
| 2026-04-17 | Web RSVP Bridge — Phase 3 (Web Chat Write + Digest) | `ActivityRsvpPage` post-RSVP state now renders a new `WebChatPanel` (polling every 15s) that lets any web RSVP guest (iOS, Android, desktop) post into the Activity Chatter group chat — 5-message cap per RSVP enforced server-side. New API routes `/api/chat/send` + `/api/chat/history` wrap `post_web_chat_message` / `get_web_chat_messages` RPCs. Panel shows "X left" counter, orange self-bubbles, "via web" badge on other guests' messages. After 5 messages, input disables with "coming soon" CTA. Protected by `feature_flags.web_chat_write_enabled` kill switch (server-side). 2 new API routes + 1 new component + `ActivityRsvpPage.tsx` wiring. |
| 2026-04-17 | Web RSVP Bridge — Phase 2 (Email Lifecycle) | Optional email field added to RSVP form. `/api/rsvp` accepts email, passes to new 5-param `create_web_rsvp` RPC overload. Universal Brevo email sequence: confirmation immediate, 24h reminder if >25h out, day-of 3h before start, change/cancellation when host edits activity. `src/lib/supabase.ts:createWebRsvp` signature extended with `email` param. Applies to ALL platforms (iOS, Android, desktop) — removes "dark after confirmation" problem. 3 modified files, 0 breaking changes for non-email callers. |
| 2026-04-17 | Android Web RSVP Bridge — Phase 1 | Android users on `/a/[code]` share links now see "Coming soon to Android — get notified" CTA with email capture instead of a broken App Store button. 5 CTA render sites branch on platform (post-RSVP, pre-RSVP, Not Found, Ended, Activity Full). New `AndroidWaitlistCTA.tsx` component (email input + success state + localStorage persistence). New `/api/android-waitlist` POST route → `register_android_waitlist` RPC (SECURITY DEFINER, idempotent on email, writes to `waitlist_users` with `referral_source='android_rsvp_bridge'`, `utm_campaign=share_code` for viral attribution). `smartLink.ts` now exports `detectPlatform` + `Platform` type for component use. SSR renders iOS fallback (hydration-safe); client-side `useEffect` swaps to Android CTA on mount. iOS flow unchanged, no regression. Phases 2 (Brevo email sequence for all web RSVPs) + 3 (web chat write into Activity Chatter with 5-msg cap + digest) deferred to follow-up sprints. 1 new migration, 2 new + 2 modified files, 0 new TS errors. |
| 2026-04-16 | Smart Download CTAs (WA Funnel Branch 1) | Fixed 3 dead `href="#"` placeholders on `/a/[code]` and `/r/[code]` Download buttons. New `src/lib/smartLink.ts` helper attempts `konectr://activity\|referral/{code}` deep link first, falls back to platform store after 2s with a visibility-change cancel so users with the app don't get bumped to the store. New `src/components/SmartDownloadLink.tsx` client-only wrapper for use in server components. Env vars `NEXT_PUBLIC_IOS_STORE_URL` / `NEXT_PUBLIC_ANDROID_STORE_URL` configurable (default: waitlist). 2 new + 2 modified + CLAUDE.md, 0 errors. |
| 2026-03-01 | FAQ v3 Content Review | Comprehensive content audit: removed 4 duplicates, fixed 6 accuracy issues (E2E encryption claim, photo verification qualifier, strike thresholds, hosting gate, matching flow, Circle description), added 9 new questions (Pulse, referrals, profile completeness, Terms/Privacy, in-progress activities, XP, tiers, sharing referral link, feedback board), rewrote 5 answers. Added Terms of Service + Privacy Policy to helpful resources. 54 → 58 questions. Archived v2 state. 1 new file, 2 modified, 0 build errors. |
| 2026-02-28 | Venue Discovery Interview | Mobile-optimized 6-step form for face-to-face venue interviews. 33 fields (selects during conversation, text boxes in debrief). Submissions → Notion database via API route. localStorage auto-save. Conversational labels with script hints. Hidden from search/navigation. New "Slow Periods" field for scheduling intelligence. 4 new files, 1 modified (middleware). |
| 2026-02-27 | SEO, AEO & Marketing Optimization | 3 new structured data types (SoftwareApplication, BreadcrumbList, HowTo). 9 keyword-targeted meta descriptions. Blog author → Person (E-E-A-T). 8 new AEO FAQ questions (46→54). SEO utility file (`src/lib/seo.ts`). 6 marketing strategy docs in `Marketing/seo/`. 12 files modified, 1 new, 0 build errors. |
| 2026-02-20 | 404 Page — Flappy Konectr | Flappy Bird-style mini-game as custom 404 page. HTML5 Canvas, branded stick-figure mascot, pillar obstacles, emoji collectibles, parallax layers, greenery, high score persistence, dark mode, full-viewport responsive, Safari keyboard fix. 4 new files, 0 modified. |
| 2026-02-17 | Micro Font Bugfix | Replaced `transition-all` with explicit property lists across 9 files to prevent `tw-animate-css` scale properties from being animated during hover/scroll reflow. Added `hover:text-white` overrides on outline buttons over coral backgrounds. Root cause: `transition-all` + `tw-animate-css` custom properties (`--tw-enter-scale`, `--tw-exit-scale`) + Framer Motion nav padding animation. |
| 2026-02-15 | SEO & Performance | JSON-LD structured data (Organization, WebSite, FAQPage, BlogPosting), OG image for social sharing, robots.txt, sitemap fix (+/faq, /feedback), theme-color meta. Image compression (~18MB savings), self-hosted Satoshi font, AVIF/WebP formats, deferred analytics. FAQ data extracted to shared file. |
| 2026-02-14 | Gamification Page | Marketing showcase for mobile gamification system — 7 sections (tiers, badges, streaks, daily rewards, XP, stats, CTA). Footer navigation, all 8 locales, emoji/color/text design |
| 2026-01-06 | Waitlist Fix | Fixed Tally form race condition - changed data-tally-src to direct src, increased height to 500px |
| 2026-01-03 | Universal Links v2 | Added `/activity/*`, `/join/*` paths to AASA, updated assetlinks.json placeholder |
| 2025-12-28 | Favicon v1 | Branded favicon set (6 files), Vercel badge removal script |
| 2025-12-27 | Feedback Board v1 | Public view-only feedback board, category filters, vote display, footer navigation |
| 2025-12-27 | Share Links v1 | Activity share page with minimal card, iOS-only download, deep linking |
| 2025-12-23 | Safety v2 | Updated safety features to match deployed MVP (6 cards), added Coming Soon badge for Photo Verification |
| 2025-12-23 | Analytics | Added Contentsquare (Hotjar) tracking for heatmaps and session replay |
| 2025-12-23 | Emoji Sync | Homepage pills (6 venue categories), Vibes cards (6 activity emojis), "Download the app" CTA |
| 2025-12-23 | About v1 | New "Our Story" image (landscape), local image storage |
| 2025-12-22 | Images v1 | Local images for How It Works (step-1, step-2, step-3), updated before.jpg |
| 2025-12-22 | FAQ v1 | 46 questions, 8 categories, concise answers, emoji sync with mobile |
| 2025-12-22 | Launch | Website deployed to konectr.app |

---

**Last Deployed**: 2026-09-08 (**automatic on push** — `5257112`, root `/` → `/en` 308; preceded the same evening by `e3e6f21` HYROX footer link, `8f3d1d6` og:image/lang/sitemap, `498653d` copy-correctness)
**Deployment Method**: ✅ Push to `main` — Vercel builds and promotes it. `vercel --prod --yes` only for uncommitted local work. (The long-standing "manual only" note was stale; see Deployment Commands.)

---

## Konectr Ecosystem

Full checkpoint documentation available at:
**`/Users/devsmac/Konectr/Development/KONECTR_CHECKPOINT_2025-12-26.md`**

| Project | Status |
|---------|--------|
| Mobile App | Phase 11/13 |
| **Website** | Production Live |
| Analytics | Live |
| Venue Portal | Phase 1 |

---

**Last Updated**: 2026-03-01 by Claude Code
