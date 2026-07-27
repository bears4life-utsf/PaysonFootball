"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatWeekRange, getWeekMonday } from "@/lib/week-utils";

type WeekNavigatorProps = {
  weekKey: string;
  onPrevious: () => void;
  onNext: () => void;
  onThisWeek: () => void;
};

export function WeekNavigator({
  weekKey,
  onPrevious,
  onNext,
  onThisWeek,
}: WeekNavigatorProps) {
  return (
    <div className="space-y-3">
      <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.16em] text-[#075C35]">
        Week of {formatWeekRange(getWeekMonday(weekKey))}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          className="focus-ring inline-flex min-h-11 items-center gap-1 rounded border border-[#C8CDD0] bg-white px-3 py-2 text-sm font-semibold text-[#090A0A] transition hover:border-[#075C35]/50"
          aria-label="Previous week"
        >
          <ChevronLeft size={16} aria-hidden />
          <span className="hidden sm:inline">Previous Week</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <button
          type="button"
          onClick={onThisWeek}
          className="focus-ring inline-flex min-h-11 items-center rounded bg-black px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1a1a1a]"
        >
          This Week
        </button>

        <button
          type="button"
          onClick={onNext}
          className="focus-ring inline-flex min-h-11 items-center gap-1 rounded border border-[#C8CDD0] bg-white px-3 py-2 text-sm font-semibold text-[#090A0A] transition hover:border-[#075C35]/50"
          aria-label="Next week"
        >
          <span className="hidden sm:inline">Next Week</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
