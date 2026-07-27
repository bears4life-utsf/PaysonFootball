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

## Deploy to Vercel and connect the domain

1. Push to GitHub.
2. Import this repo in Vercel and deploy.
3. In Vercel project settings, add custom domain `paysonfootball.com` (and `www` if desired).
4. In Porkbun DNS, point the domain records to the Vercel values shown during domain setup.
5. Wait for DNS propagation and verify SSL is active.
