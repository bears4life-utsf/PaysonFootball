# Payson Lions Football

Production-ready one-page website for **paysonfootball.com** with team schedule switching and away-game travel links.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Schedule data

Edit all teams and games in `src/data/schedules.ts`.

Both **By Team** and **By Week** views read from this same file. Do not create a second weekly dataset.

Shareable URL examples:

- `/?view=team&team=varsity`
- `/?view=week&week=2026-08-10`
- `/teams` for team and coaching profiles
- `/?view=team&team=jv#schedule` from a Teams “View Schedule” link

Week keys are the Monday date (`YYYY-MM-DD`) for that football week.

### 1) Add the Payson logo and hero image

Put these files in `public/images`:

- `payson-lions-logo.png`
- `payson-football-hero.jpg`

The site already references those exact paths.

### 2) Add or edit a team

In `src/data/schedules.ts`, update the `teams` array:

- `id`: unique stable key
- `name`: label shown in selector tabs
- `ageGroupLabel`: small descriptor
- `seasonLabel`: season heading year

You can add, remove, rename, or reorder teams without changing UI components.

### 3) Add games

Add entries to a team `games` array in `src/data/schedules.ts`.

Each game supports:

- `id`, `date`, `displayDate`, `time`
- `opponent`, `homeAway`, `isRegionGame`
- `venueName`, `address`, `city`, `state`, `zip`
- `notes`, `status`, `score`, `mapUrl`

### 4) Enter an away-game address

For away games, fill:

- `address`
- `city`
- `state`
- `zip`

If all are present, directions links are generated automatically.

### 5) How Google Maps links are generated

`src/lib/schedule-utils.ts` builds links using:

`https://www.google.com/maps/search/?api=1&query=ENCODED_ADDRESS`

If a game has `mapUrl`, that value is used directly.

### 6) Game-time weather (Open-Meteo)

Weather uses [Open-Meteo](https://open-meteo.com/) because:

- No API key is required for noncommercial use
- Hourly forecasts include temperature, conditions, precipitation chance, and wind
- Forecasts are available up to 16 days ahead

Weather only appears when:

- The game is upcoming
- Kickoff time is known (not TBA)
- The venue has `latitude` and `longitude`
- The game falls inside the 16-day forecast window
- Open-Meteo returns a valid hourly forecast

Venue coordinates live in `src/data/venues.ts` (`knownVenues`).

To add weather for a new venue:

1. Add the venue to `knownVenues` with `latitude` and `longitude`
2. Use that venue name on games via `venueName`
3. Do not geocode addresses at runtime

Weather codes are translated in `src/lib/weather-codes.ts`.

The API route `/api/weather` fetches and normalizes forecasts. Responses are cached/revalidated about every 30 minutes (`revalidate = 1800`). Matching venue/date/time requests are also deduplicated in the browser.

## Parade waiver

Parents sign the Santaquin Orchard Days parade waiver at `/parade-waiver` (also linked as **Waiver** in the header).

Signed PDFs are stored in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob). Staff export them from a secret admin URL.

### Setup

1. In the Vercel project, create a **Blob** store and connect it to this project.
2. Vercel should add `BLOB_STORE_ID` (and related Blob vars) automatically. Newer stores use OIDC auth — you do **not** need `BLOB_READ_WRITE_TOKEN` on Vercel.
3. Create a long random admin secret for `WAIVER_ADMIN_TOKEN` (for example `openssl rand -hex 32`).
4. Add `WAIVER_ADMIN_TOKEN` under **Settings → Environment Variables** for Production.
5. **Redeploy** after connecting Blob / adding env vars.
6. Open the admin list at:

`/admin/waivers?token=YOUR_WAIVER_ADMIN_TOKEN`

From there you can download individual PDFs or **Download all (ZIP)**.

### Files

- Blank template: `public/waivers/parade-waiver-2026.pdf`
- Signing page: `/parade-waiver`
- Submit API: `POST /api/waivers`
- Admin export API: `GET /api/waivers/export?token=...`

## Deploy to Vercel and connect the domain

1. Push to GitHub.
2. Import this repo in Vercel and deploy.
3. In Vercel project settings, add custom domain `paysonfootball.com` (and `www` if desired).
4. In Porkbun DNS, point the domain records to the Vercel values shown during domain setup.
5. Wait for DNS propagation and verify SSL is active.
