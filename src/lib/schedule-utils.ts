import type { Game, Team } from "@/data/schedules";

export type AwayVenue = {
  opponent: string;
  venueName: string;
  fullAddress: string;
  mapUrl: string;
};

function asDateOnly(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function toAddressParts(game: Game): string[] {
  return [game.address, game.city, game.state, game.zip].filter(Boolean) as string[];
}

export function buildMapLink(game: Game): string | null {
  if (game.mapUrl) return game.mapUrl;
  const address = toAddressParts(game).join(", ");
  if (!address) return null;
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getNextUpcomingGame(games: Game[], now = new Date()): Game | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = games
    .filter((game) => {
      const gameDate = asDateOnly(game.date);
      return gameDate >= today && game.status !== "canceled";
    })
    .sort((a, b) => asDateOnly(a.date).getTime() - asDateOnly(b.date).getTime());
  return upcoming[0] ?? null;
}

export function getSeasonState(games: Game[], now = new Date()): "upcoming" | "complete" {
  return getNextUpcomingGame(games, now) ? "upcoming" : "complete";
}

export function getAwayVenues(team: Team): AwayVenue[] {
  const seen = new Set<string>();
  const awayGames = team.games.filter((game) => game.homeAway === "away");
  const venues: AwayVenue[] = [];

  for (const game of awayGames) {
    const fullAddress = toAddressParts(game).join(", ");
    if (!fullAddress) continue;
    const key = `${game.venueName}|${fullAddress}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const mapUrl = buildMapLink(game);
    if (!mapUrl) continue;

    venues.push({
      opponent: game.opponent,
      venueName: game.venueName,
      fullAddress,
      mapUrl,
    });
  }

  return venues;
}

export function formatMatchup(game: Game): string {
  return game.homeAway === "home" ? `vs ${game.opponent}` : `at ${game.opponent}`;
}
