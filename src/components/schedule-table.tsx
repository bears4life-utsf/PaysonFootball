import type { Game } from "@/data/schedules";
import { buildMapLink, formatMatchup } from "@/lib/schedule-utils";

type ScheduleTableProps = {
  games: Game[];
  nextGameId?: string;
};

export function ScheduleTable({ games, nextGameId }: ScheduleTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-sm border border-[#C8CDD0] md:block">
      <table className="w-full border-collapse">
        <thead className="bg-[#090A0A] text-left text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-4 py-3">Date & Time</th>
            <th className="px-4 py-3">Home/Away</th>
            <th className="px-4 py-3">Opponent</th>
            <th className="px-4 py-3">Region</th>
            <th className="px-4 py-3">Venue</th>
            <th className="px-4 py-3">Game Info</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const mapLink = buildMapLink(game);
            const isNext = game.id === nextGameId;
            return (
              <tr
                key={game.id}
                className={`border-t border-[#E5E7E7] ${isNext ? "bg-[#F3F4F4]" : "bg-white"}`}
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-[#090A0A]">{game.displayDate}</p>
                  <p className="text-sm text-[#4f5854]">{game.time}</p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      game.homeAway === "home"
                        ? "bg-[#075C35] text-white"
                        : "border border-[#090A0A]/40 text-[#090A0A]"
                    }`}
                  >
                    {game.homeAway === "home" ? "HOME" : "AWAY"}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold text-[#090A0A]">{formatMatchup(game)}</td>
                <td className="px-4 py-4">
                  {game.isRegionGame ? (
                    <span className="rounded-full bg-[#C8CDD0] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#090A0A]">
                      REGION
                    </span>
                  ) : (
                    <span className="text-sm text-[#6b716e]">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-[#090A0A]">{game.venueName}</p>
                  {game.homeAway === "away" && game.address ? (
                    <p className="text-sm text-[#4f5854]">
                      {[game.address, game.city, game.state, game.zip].filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  {isNext ? (
                    <span className="mr-2 rounded-full bg-[#075C35] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Next
                    </span>
                  ) : null}
                  {game.homeAway === "away" && mapLink ? (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="focus-ring rounded-sm border border-[#090A0A] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#090A0A] hover:bg-[#090A0A] hover:text-white"
                    >
                      Get Directions
                    </a>
                  ) : (
                    <span className="text-sm text-[#6b716e]">Home Game</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
