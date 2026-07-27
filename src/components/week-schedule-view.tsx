import { EmptyWeekState } from "@/components/empty-week-state";
import { WeekNavigator } from "@/components/week-navigator";
import { WeeklyGameCard } from "@/components/weekly-game-card";
import type { ScheduledGame } from "@/lib/schedule-filters";
import {
  formatWeekRange,
  getGamesForWeek,
  getInitialWeekKey,
  getNextUpcomingScheduledGame,
  getWeekNumberLabel,
  groupGamesByDay,
  groupGamesByWeek,
  getWeekMonday,
} from "@/lib/week-utils";

type WeekScheduleViewProps = {
  games: ScheduledGame[];
  weekKey: string;
  onWeekChange: (weekKey: string) => void;
  onShiftWeek: (delta: number) => void;
  onThisWeek: () => void;
};

function isPastGame(game: ScheduledGame, now: Date): boolean {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const gameDate = new Date(`${game.date}T00:00:00`);
  return gameDate < today || game.status === "final";
}

export function WeekScheduleView({
  games,
  weekKey,
  onWeekChange,
  onShiftWeek,
  onThisWeek,
}: WeekScheduleViewProps) {
  const now = new Date();
  const weeksWithGames = groupGamesByWeek(games);
  const weekGames = getGamesForWeek(games, weekKey);
  const days = groupGamesByDay(weekGames);
  const nextGame = getNextUpcomingScheduledGame(games, now);
  const nextScheduledWeekKey = getInitialWeekKey(games, now);
  const weekLabel = getWeekNumberLabel(weeksWithGames, weekKey);
  const rangeLabel = formatWeekRange(getWeekMonday(weekKey));

  return (
    <div className="space-y-6">
      <WeekNavigator
        weekKey={weekKey}
        onPrevious={() => onShiftWeek(-1)}
        onNext={() => onShiftWeek(1)}
        onThisWeek={onThisWeek}
      />

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.16em] text-[#4f5854]">
            {weekLabel}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A]">
            {rangeLabel}
          </h3>
        </div>
        <p className="text-sm text-[#4f5854]">
          {weekGames.length} scheduled {weekGames.length === 1 ? "game" : "games"}
        </p>
      </div>

      {weekGames.length === 0 ? (
        <EmptyWeekState
          onPrevious={() => onShiftWeek(-1)}
          onNext={() => onShiftWeek(1)}
          onReturnToNextScheduled={() => {
            if (nextScheduledWeekKey) onWeekChange(nextScheduledWeekKey);
          }}
          hasNextScheduled={Boolean(nextScheduledWeekKey)}
        />
      ) : (
        <div className="space-y-7">
          {days.map((day) => (
            <section key={day.date} aria-labelledby={`day-${day.date}`}>
              <h4
                id={`day-${day.date}`}
                className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[#090A0A]"
              >
                {day.label}
              </h4>
              <ul className="mt-3 space-y-3">
                {day.games.map((game) => (
                  <li key={`${game.teamId}-${game.id}`}>
                    <WeeklyGameCard
                      game={game}
                      isNext={nextGame?.id === game.id && nextGame.teamId === game.teamId}
                      isPast={isPastGame(game, now)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
