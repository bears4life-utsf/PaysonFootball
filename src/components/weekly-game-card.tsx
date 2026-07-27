import { MapPin, Navigation } from "lucide-react";

import { HomeAwayBadge, RegionBadge } from "@/components/game-badges";
import type { ScheduledGame } from "@/lib/schedule-filters";
import { buildMapLink, formatMatchup } from "@/lib/schedule-utils";

type WeeklyGameCardProps = {
  game: ScheduledGame;
  isNext?: boolean;
  isPast?: boolean;
};

export function WeeklyGameCard({ game, isNext = false, isPast = false }: WeeklyGameCardProps) {
  const mapLink = buildMapLink(game);

  return (
    <article
      className={`rounded-lg border p-4 transition ${
        isNext
          ? "border-[#075C35]/40 bg-white shadow-[0_8px_20px_rgba(7,92,53,0.12)]"
          : isPast
            ? "border-[#E5E7E7] bg-[#F7F8F8] opacity-75"
            : "border-[#C8CDD0] bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-black px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {game.teamName}
        </span>
        <HomeAwayBadge homeAway={game.homeAway} />
        {game.isRegionGame ? <RegionBadge /> : null}
        {isNext ? (
          <span className="rounded-full bg-[#075C35] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Next Payson Game
          </span>
        ) : null}
      </div>

      <h4 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
        <span className="sr-only">{game.teamName} </span>
        {formatMatchup(game)}
      </h4>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#313a36]">
        <p>
          <span className="font-semibold text-[#090A0A]">Time:</span> {game.time}
        </p>
        <p className="inline-flex items-center gap-1">
          <MapPin size={14} className="text-[#075C35]" aria-hidden />
          <span>
            <span className="font-semibold text-[#090A0A]">Venue:</span> {game.venueName}
            {game.homeAway === "away" && game.city ? ` · ${game.city}` : null}
          </span>
        </p>
      </div>

      {game.homeAway === "away" && mapLink ? (
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer noopener"
          className="focus-ring mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md border border-black px-3 py-2 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-black hover:text-white"
        >
          <Navigation size={14} aria-hidden />
          Get Directions
        </a>
      ) : (
        <p className="mt-3 text-sm font-medium text-[#4f5854]">Home game</p>
      )}
    </article>
  );
}
