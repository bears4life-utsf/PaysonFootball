import { CalendarDays, Clock3, MapPin } from "lucide-react";

import type { Game } from "@/data/schedules";
import { buildMapLink, formatMatchup } from "@/lib/schedule-utils";

type NextGamePanelProps = {
  game: Game;
};

export function NextGamePanel({ game }: NextGamePanelProps) {
  const mapLink = buildMapLink(game);

  return (
    <section className="rounded-sm border border-[#075C35]/20 bg-white p-5 shadow-sm sm:p-6">
      <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.18em] text-[#075C35]">
        Next Game
      </p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A]">
        {formatMatchup(game)}
      </h3>
      <div className="mt-4 grid gap-3 text-sm text-[#1e2522] sm:grid-cols-3">
        <p className="flex items-center gap-2">
          <CalendarDays size={17} className="text-[#075C35]" />
          <span>{game.displayDate}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock3 size={17} className="text-[#075C35]" />
          <span>{game.time}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={17} className="text-[#075C35]" />
          <span>{game.venueName}</span>
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            game.homeAway === "home"
              ? "bg-[#075C35] text-white"
              : "border border-[#090A0A]/40 text-[#090A0A]"
          }`}
        >
          {game.homeAway === "home" ? "HOME" : "AWAY"}
        </span>
        {game.isRegionGame ? (
          <span className="rounded-full bg-[#C8CDD0] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#090A0A]">
            REGION
          </span>
        ) : null}
        {game.homeAway === "away" && mapLink ? (
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring rounded-sm bg-[#090A0A] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Directions
          </a>
        ) : null}
      </div>
    </section>
  );
}
