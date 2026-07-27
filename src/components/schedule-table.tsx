import { HomeAwayBadge, RegionBadge } from "@/components/game-badges";
import { GameWeather } from "@/components/game-weather";
import type { Game } from "@/data/schedules";
import { buildMapLink, formatMatchup } from "@/lib/schedule-utils";

type ScheduleTableProps = {
  games: Game[];
  nextGameId?: string;
};

export function ScheduleTable({ games, nextGameId }: ScheduleTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-[#C8CDD0] md:block">
      <table className="w-full border-collapse">
        <thead className="bg-black text-left text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-4 py-3.5">Date & Time</th>
            <th className="px-4 py-3.5">Home/Away</th>
            <th className="px-4 py-3.5">Opponent</th>
            <th className="px-4 py-3.5">Region</th>
            <th className="px-4 py-3.5">Venue</th>
            <th className="px-4 py-3.5">Game Info</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const mapLink = buildMapLink(game);
            const isNext = game.id === nextGameId;
            return (
              <tr
                key={game.id}
                className={`border-t border-[#E5E7E7] transition hover:bg-[#F7F8F8] ${
                  isNext ? "bg-[#F3F4F4]" : "bg-white"
                }`}
              >
                <td className="px-4 py-4">
                  <p className="font-[family-name:var(--font-display)] text-lg uppercase text-[#090A0A]">
                    {game.displayDate}
                  </p>
                  <p className="text-sm text-[#4f5854]">{game.time}</p>
                </td>
                <td className="px-4 py-4">
                  <HomeAwayBadge homeAway={game.homeAway} />
                </td>
                <td className="px-4 py-4">
                  <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[#090A0A]">
                    {formatMatchup(game)}
                  </p>
                  <GameWeather game={game} variant="compact" className="mt-1" />
                </td>
                <td className="px-4 py-4">
                  {game.isRegionGame ? (
                    <RegionBadge />
                  ) : (
                    <span className="text-sm text-[#6b716e]">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-[#090A0A]">{game.venueName}</p>
                  {game.homeAway === "away" && game.address ? (
                    <p className="mt-0.5 text-sm text-[#4f5854]">
                      {[game.address, game.city, game.state, game.zip].filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {isNext ? (
                      <span className="rounded bg-[#075C35] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                        Next
                      </span>
                    ) : null}
                    {game.homeAway === "away" && mapLink ? (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="focus-ring inline-flex min-h-10 items-center rounded-md border border-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-black transition hover:bg-black hover:text-white"
                      >
                        Get Directions
                      </a>
                    ) : (
                      <span className="text-sm text-[#6b716e]">Home Game</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
