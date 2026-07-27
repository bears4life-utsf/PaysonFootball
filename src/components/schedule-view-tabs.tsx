"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";

export type ScheduleViewMode = "team" | "week";

type ScheduleViewTabsProps = {
  view: ScheduleViewMode;
  onChange: (view: ScheduleViewMode) => void;
};

const OPTIONS: Array<{ id: ScheduleViewMode; label: string }> = [
  { id: "team", label: "Team Schedule" },
  { id: "week", label: "Weekly Schedule" },
];

export function ScheduleViewTabs({ view, onChange }: ScheduleViewTabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + OPTIONS.length) % OPTIONS.length;
    onChange(OPTIONS[nextIndex].id);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Schedule view"
      className="flex w-full border-b border-[#D5D9DA]"
    >
      {OPTIONS.map((option, index) => {
        const active = option.id === view;
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={`schedule-view-${option.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`schedule-panel-${option.id}`}
            tabIndex={active ? 0 : -1}
            onKeyDown={(event) => onKeyDown(event, index)}
            onClick={() => onChange(option.id)}
            className={`focus-ring min-h-11 flex-1 px-3 py-3 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide transition sm:flex-none sm:px-5 ${
              active
                ? "border-b-2 border-[#075C35] text-[#075C35]"
                : "border-b-2 border-transparent text-[#4f5854] hover:text-[#090A0A]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** @deprecated Prefer ScheduleViewTabs */
export const ScheduleViewToggle = ScheduleViewTabs;
