import { HomeAwayBadge, RegionBadge } from "@/components/game-badges";
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
          <li
            key={game.id}
            className={`rounded-lg border bg-white p-4 shadow-sm transition ${
              isNext ? "border-[#075C35]/35" : "border-[#C8CDD0]"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-display)] text-xl uppercase text-[#090A0A]">
                {game.displayDate}
              </p>
              <span className="text-sm font-medium text-[#4f5854]">{game.time}</span>
              {isNext ? (
                <span className="rounded-full bg-[#075C35] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Next
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <HomeAwayBadge homeAway={game.homeAway} />
              {game.isRegionGame ? <RegionBadge /> : null}
            </div>

            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
              {formatMatchup(game)}
            </p>
            <p className="mt-1 text-sm font-medium text-[#313a36]">{game.venueName}</p>
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
                className="focus-ring mt-4 inline-flex min-h-11 items-center rounded-md border border-black px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-black hover:text-white"
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
