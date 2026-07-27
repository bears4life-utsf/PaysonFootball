import type { Game } from "@/data/schedules";
import { buildMapLink, formatMatchup } from "@/lib/schedule-utils";

type ScheduleCardListProps = {
  games: Game[];
  nextGameId?: string;
};

export function ScheduleCardList({ games, nextGameId }: ScheduleCardListProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {games.map((game) => {
        const mapLink = buildMapLink(game);
        const isNext = game.id === nextGameId;
        return (
          <li key={game.id} className="rounded-sm border border-[#C8CDD0] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-display)] text-xl uppercase text-[#090A0A]">
                {game.displayDate}
              </p>
              <span className="text-sm text-[#4f5854]">{game.time}</span>
              {isNext ? (
                <span className="rounded-full bg-[#075C35] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Next
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
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
                <span className="rounded-full bg-[#C8CDD0] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#090A0A]">
                  REGION
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-lg font-semibold text-[#090A0A]">{formatMatchup(game)}</p>
            <p className="mt-1 text-sm text-[#313a36]">{game.venueName}</p>
            {game.homeAway === "away" && game.address ? (
              <p className="mt-1 text-sm text-[#4f5854]">
                {[game.address, game.city, game.state, game.zip].filter(Boolean).join(", ")}
              </p>
            ) : null}
            {game.homeAway === "away" && mapLink ? (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring mt-4 inline-flex rounded-sm border border-[#090A0A] px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#090A0A] hover:bg-[#090A0A] hover:text-white"
              >
                Get Directions
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
