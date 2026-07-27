"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { WeekAgenda } from "@/lib/week-utils";
import { formatWeekRange, getWeekMonday } from "@/lib/week-utils";

type WeekNavigatorProps = {
  weekKey: string;
  weeksWithGames: WeekAgenda[];
  onPrevious: () => void;
  onNext: () => void;
  onThisWeek: () => void;
  onSelectWeek: (weekKey: string) => void;
};

export function WeekNavigator({
  weekKey,
  weeksWithGames,
  onPrevious,
  onNext,
  onThisWeek,
  onSelectWeek,
}: WeekNavigatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          className="focus-ring inline-flex min-h-11 items-center gap-1 rounded-md border border-[#C8CDD0] bg-white px-3 py-2 text-sm font-semibold text-[#090A0A] transition hover:border-[#075C35]/40"
          aria-label="Previous week"
        >
          <ChevronLeft size={16} aria-hidden />
          <span className="hidden sm:inline">Previous Week</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <button
          type="button"
          onClick={onThisWeek}
          className="focus-ring inline-flex min-h-11 items-center rounded-md bg-black px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1a1a1a]"
        >
          This Week
        </button>

        <button
          type="button"
          onClick={onNext}
          className="focus-ring inline-flex min-h-11 items-center gap-1 rounded-md border border-[#C8CDD0] bg-white px-3 py-2 text-sm font-semibold text-[#090A0A] transition hover:border-[#075C35]/40"
          aria-label="Next week"
        >
          <span className="hidden sm:inline">Next Week</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      {weeksWithGames.length > 0 ? (
        <div>
          <label htmlFor="week-jump" className="sr-only">
            Jump to a scheduled week
          </label>
          <select
            id="week-jump"
            value={weeksWithGames.some((week) => week.weekKey === weekKey) ? weekKey : ""}
            onChange={(event) => {
              if (event.target.value) onSelectWeek(event.target.value);
            }}
            className="focus-ring min-h-11 w-full max-w-md rounded-md border border-[#C8CDD0] bg-white px-3 py-2 text-sm font-medium text-[#090A0A]"
          >
            <option value="" disabled>
              Jump to scheduled week
            </option>
            {weeksWithGames.map((week) => (
              <option key={week.weekKey} value={week.weekKey}>
                Week {week.weekNumber} · {week.rangeLabel} ({week.gameCount})
              </option>
            ))}
          </select>
          {!weeksWithGames.some((week) => week.weekKey === weekKey) ? (
            <p className="mt-2 text-sm text-[#4f5854]">
              Viewing {formatWeekRange(getWeekMonday(weekKey))}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
