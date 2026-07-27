import { Navigation } from "lucide-react";

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
    <section className="rounded border border-[#075C35]/20 bg-white p-5 shadow-[0_8px_24px_rgba(9,10,10,0.06)] sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.2em] text-[#075C35]">
            Next Game
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight text-[#090A0A] sm:text-5xl">
            {formatMatchup(game)}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <HomeAwayBadge homeAway={game.homeAway} />
            {game.isRegionGame ? <RegionBadge /> : null}
          </div>

          <dl className="mt-5 space-y-2 text-sm text-[#1e2522]">
            <div className="flex gap-3">
              <dt className="w-16 font-semibold text-[#4f5854]">Date</dt>
              <dd>{game.displayDate}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 font-semibold text-[#4f5854]">Time</dt>
              <dd>{game.time}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 font-semibold text-[#4f5854]">Venue</dt>
              <dd>{game.venueName}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <GameWeather game={game} variant="detailed" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {game.homeAway === "away" && mapLink ? (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded bg-black px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1a1a1a]"
              >
                <Navigation size={15} aria-hidden />
                Directions
              </a>
            ) : null}
            <AddToCalendarButton game={game} />
          </div>
        </div>

        <GameCountdown game={game} />
      </div>
    </section>
  );
}
