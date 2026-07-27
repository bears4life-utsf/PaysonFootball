import type { ScheduledGame } from "@/lib/schedule-filters";

export type WeekDayGroup = {
  date: string;
  label: string;
  games: ScheduledGame[];
};

export type WeekAgenda = {
  weekKey: string;
  weekNumber: number;
  monday: Date;
  sunday: Date;
  rangeLabel: string;
  gameCount: number;
  days: WeekDayGroup[];
};

const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function asLocalDate(date: string | Date): Date {
  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseKickoffMinutes(time: string): number | null {
  if (!time || time.toUpperCase() === "TBA") return null;
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/** Monday (local) for the week containing the given date. */
export function getWeekMonday(date: string | Date): Date {
  const local = asLocalDate(date);
  const day = local.getDay(); // 0 Sun ... 6 Sat
  const offset = day === 0 ? -6 : 1 - day;
  local.setDate(local.getDate() + offset);
  return local;
}

/** Sunday (local) for a Monday-based week. */
export function getWeekSunday(monday: Date): Date {
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
  sunday.setDate(sunday.getDate() + 6);
  return sunday;
}

export function formatWeekKey(monday: Date): string {
  return toIsoDate(getWeekMonday(monday));
}

export function isValidWeekKey(weekKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) return false;
  const monday = getWeekMonday(weekKey);
  return formatWeekKey(monday) === weekKey;
}

export function formatWeekRange(mondayInput: Date | string): string {
  const monday = getWeekMonday(mondayInput);
  const sunday = getWeekSunday(monday);
  const sameMonth = monday.getMonth() === sunday.getMonth();

  if (sameMonth) {
    return `${MONTH_LABELS[monday.getMonth()]} ${monday.getDate()}–${sunday.getDate()}`;
  }

  return `${MONTH_LABELS[monday.getMonth()]} ${monday.getDate()} – ${MONTH_LABELS[sunday.getMonth()]} ${sunday.getDate()}`;
}

export function formatDayLabel(date: string): string {
  const local = asLocalDate(date);
  return `${WEEKDAY_LABELS[local.getDay()]}, ${MONTH_LABELS[local.getMonth()]} ${local.getDate()}`;
}

export function sortGamesByKickoff(games: ScheduledGame[]): ScheduledGame[] {
  return [...games].sort((a, b) => {
    const dateDiff = asLocalDate(a.date).getTime() - asLocalDate(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;

    const aMinutes = parseKickoffMinutes(a.time);
    const bMinutes = parseKickoffMinutes(b.time);
    if (aMinutes === null && bMinutes === null) {
      return a.teamName.localeCompare(b.teamName);
    }
    if (aMinutes === null) return 1;
    if (bMinutes === null) return -1;
    if (aMinutes !== bMinutes) return aMinutes - bMinutes;
    return a.teamName.localeCompare(b.teamName);
  });
}

export function groupGamesByDay(games: ScheduledGame[]): WeekDayGroup[] {
  const byDate = new Map<string, ScheduledGame[]>();

  for (const game of sortGamesByKickoff(games)) {
    const list = byDate.get(game.date) ?? [];
    list.push(game);
    byDate.set(game.date, list);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayGames]) => ({
      date,
      label: formatDayLabel(date),
      games: dayGames,
    }));
}

export function groupGamesByWeek(games: ScheduledGame[]): WeekAgenda[] {
  const byWeek = new Map<string, ScheduledGame[]>();

  for (const game of games) {
    const key = formatWeekKey(getWeekMonday(game.date));
    const list = byWeek.get(key) ?? [];
    list.push(game);
    byWeek.set(key, list);
  }

  const keys = [...byWeek.keys()].sort();

  return keys.map((weekKey, index) => {
    const monday = getWeekMonday(weekKey);
    const weekGames = byWeek.get(weekKey) ?? [];
    return {
      weekKey,
      weekNumber: index + 1,
      monday,
      sunday: getWeekSunday(monday),
      rangeLabel: formatWeekRange(monday),
      gameCount: weekGames.length,
      days: groupGamesByDay(weekGames),
    };
  });
}

export function shiftWeekKey(weekKey: string, deltaWeeks: number): string {
  const monday = getWeekMonday(weekKey);
  monday.setDate(monday.getDate() + deltaWeeks * 7);
  return formatWeekKey(monday);
}

export function getGamesForWeek(
  games: ScheduledGame[],
  weekKey: string,
): ScheduledGame[] {
  const key = isValidWeekKey(weekKey) ? weekKey : formatWeekKey(getWeekMonday(weekKey));
  return sortGamesByKickoff(
    games.filter((game) => formatWeekKey(getWeekMonday(game.date)) === key),
  );
}

export function getNextUpcomingScheduledGame(
  games: ScheduledGame[],
  now = new Date(),
): ScheduledGame | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = sortGamesByKickoff(
    games.filter((game) => {
      const gameDate = asLocalDate(game.date);
      return gameDate >= today && game.status !== "canceled";
    }),
  );
  return upcoming[0] ?? null;
}

/**
 * Initial week selection:
 * - current week if it has games during the season window
 * - else week of next upcoming game
 * - else first scheduled week before season
 * - else final scheduled week after season
 */
export function getInitialWeekKey(
  games: ScheduledGame[],
  now = new Date(),
): string | null {
  const weeks = groupGamesByWeek(games);
  if (weeks.length === 0) return null;

  const currentKey = formatWeekKey(getWeekMonday(now));
  const currentWeekHasGames = weeks.some((week) => week.weekKey === currentKey);
  if (currentWeekHasGames) return currentKey;

  const nextGame = getNextUpcomingScheduledGame(games, now);
  if (nextGame) return formatWeekKey(getWeekMonday(nextGame.date));

  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  if (asLocalDate(now).getTime() < first.monday.getTime()) return first.weekKey;
  return last.weekKey;
}

export function getWeekNumberLabel(
  weeks: WeekAgenda[],
  weekKey: string,
): string {
  const match = weeks.find((week) => week.weekKey === weekKey);
  if (match) return `Week ${match.weekNumber}`;
  return "Week";
}
