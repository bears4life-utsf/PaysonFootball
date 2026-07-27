import type { Game } from "@/data/schedules";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isLiveOrPast: boolean;
};

function parseKickoff(game: Game): Date | null {
  if (!game.date) return null;
  if (!game.time || game.time.toUpperCase() === "TBA") {
    return new Date(`${game.date}T19:00:00`);
  }

  const match = game.time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return new Date(`${game.date}T19:00:00`);

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return new Date(`${game.date}T${hh}:${mm}:00`);
}

export function getKickoffDate(game: Game): Date | null {
  return parseKickoff(game);
}

export function getCountdownParts(game: Game, now = new Date()): CountdownParts {
  const kickoff = parseKickoff(game);
  if (!kickoff) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isLiveOrPast: true };
  }

  const totalMs = kickoff.getTime() - now.getTime();
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isLiveOrPast: true };
  }

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return { days, hours, minutes, seconds, totalMs, isLiveOrPast: false };
}

export function buildGoogleCalendarUrl(game: Game): string {
  const kickoff = parseKickoff(game) ?? new Date(`${game.date}T19:00:00`);
  const end = new Date(kickoff.getTime() + 3 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const title = encodeURIComponent(`Payson Lions Football ${game.homeAway === "home" ? "vs" : "at"} ${game.opponent}`);
  const details = encodeURIComponent("Payson Lions Football game");
  const location = encodeURIComponent(
    [game.venueName, game.address, game.city, game.state, game.zip].filter(Boolean).join(", "),
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(kickoff)}/${fmt(end)}&details=${details}&location=${location}`;
}

export function buildOutlookCalendarUrl(game: Game): string {
  const kickoff = parseKickoff(game) ?? new Date(`${game.date}T19:00:00`);
  const end = new Date(kickoff.getTime() + 3 * 60 * 60 * 1000);
  const title = encodeURIComponent(`Payson Lions Football ${game.homeAway === "home" ? "vs" : "at"} ${game.opponent}`);
  const location = encodeURIComponent(
    [game.venueName, game.address, game.city, game.state, game.zip].filter(Boolean).join(", "),
  );

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${kickoff.toISOString()}&enddt=${end.toISOString()}&location=${location}&body=${encodeURIComponent("Payson Lions Football game")}`;
}

export function buildAppleCalendarIcs(game: Game): string {
  const kickoff = parseKickoff(game) ?? new Date(`${game.date}T19:00:00`);
  const end = new Date(kickoff.getTime() + 3 * 60 * 60 * 1000);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const title = `Payson Lions Football ${game.homeAway === "home" ? "vs" : "at"} ${game.opponent}`;
  const location = [game.venueName, game.address, game.city, game.state, game.zip]
    .filter(Boolean)
    .join(", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Payson Lions Football//EN",
    "BEGIN:VEVENT",
    `UID:${game.id}@paysonfootball.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(kickoff)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "DESCRIPTION:Payson Lions Football game",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
