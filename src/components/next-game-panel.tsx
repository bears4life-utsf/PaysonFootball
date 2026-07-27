import { CalendarDays, Clock3, MapPin, Navigation } from "lucide-react";

import { AddToCalendarButton } from "@/components/add-to-calendar";
import { HomeAwayBadge, RegionBadge } from "@/components/game-badges";
import { GameCountdown } from "@/components/game-countdown";
import { GameWeather } from "@/components/game-weather";
import type { Game } from "@/data/schedules";
import { buildMapLink, formatMatchup } from "@/lib/schedule-utils";

type NextGamePanelProps = {
  game: Game;
};

export function NextGamePanel({ game }: NextGamePanelProps) {
  const mapLink = buildMapLink(game);

  return (
    <section className="overflow-hidden rounded-lg border border-[#075C35]/25 bg-white shadow-[0_10px_30px_rgba(9,10,10,0.08)]">
      <div className="h-1.5 bg-[#075C35]" />
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.2em] text-[#075C35]">
            Next Game
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight text-[#090A0A] sm:text-5xl">
            {formatMatchup(game)}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <HomeAwayBadge homeAway={game.homeAway} />
            {game.isRegionGame ? <RegionBadge /> : null}
          </div>

          <div className="mt-5 grid gap-3 text-sm text-[#1e2522] sm:grid-cols-3">
            <p className="flex items-center gap-2 rounded-md bg-[#F3F4F4] px-3 py-2.5">
              <CalendarDays size={17} className="shrink-0 text-[#075C35]" aria-hidden />
              <span className="font-semibold">{game.displayDate}</span>
            </p>
            <p className="flex items-center gap-2 rounded-md bg-[#F3F4F4] px-3 py-2.5">
              <Clock3 size={17} className="shrink-0 text-[#075C35]" aria-hidden />
              <span className="font-semibold">{game.time}</span>
            </p>
            <p className="flex items-center gap-2 rounded-md bg-[#F3F4F4] px-3 py-2.5">
              <MapPin size={17} className="shrink-0 text-[#075C35]" aria-hidden />
              <span className="font-semibold">{game.venueName}</span>
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {game.homeAway === "away" && mapLink ? (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#1a1a1a]"
              >
                <Navigation size={15} aria-hidden />
                Directions
              </a>
            ) : null}
            <AddToCalendarButton game={game} />
          </div>
        </div>

        <div className="grid gap-3 content-start">
          <GameCountdown game={game} />
          <GameWeather />
        </div>
      </div>
    </section>
  );
}
