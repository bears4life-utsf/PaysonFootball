import type { Game, Team } from "@/data/schedules";

/** Game enriched with team identity at runtime from the shared teams data source. */
export type ScheduledGame = Game & {
  teamId: string;
  teamName: string;
};

/**
 * Filter helpers for current single-team browsing and a future “My Teams” selector.
 * Accepts one team ID, multiple team IDs, or all teams.
 * Future “My Teams” UI can connect here without changing schedule data.
 */
export function filterTeamsByIds(
  allTeams: Team[],
  teamIds: string[] | "all",
): Team[] {
  if (teamIds === "all") return allTeams;
  if (teamIds.length === 0) return [];
  const allowed = new Set(teamIds);
  return allTeams.filter((team) => allowed.has(team.id));
}

export function flattenScheduledGames(
  allTeams: Team[],
  teamIds: string[] | "all" = "all",
): ScheduledGame[] {
  return filterTeamsByIds(allTeams, teamIds).flatMap((team) =>
    team.games.map((game) => ({
      ...game,
      teamId: team.id,
      teamName: team.name,
    })),
  );
}

export function filterScheduledGames(
  games: ScheduledGame[],
  teamIds: string[] | "all",
): ScheduledGame[] {
  if (teamIds === "all") return games;
  if (teamIds.length === 0) return [];
  const allowed = new Set(teamIds);
  return games.filter((game) => allowed.has(game.teamId));
}
