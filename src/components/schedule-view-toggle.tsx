"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";

export type ScheduleViewMode = "team" | "week";

type ScheduleViewToggleProps = {
  view: ScheduleViewMode;
  onChange: (view: ScheduleViewMode) => void;
};

const OPTIONS: Array<{ id: ScheduleViewMode; label: string }> = [
  { id: "team", label: "By Team" },
  { id: "week", label: "By Week" },
];

export function ScheduleViewToggle({ view, onChange }: ScheduleViewToggleProps) {
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
      className="inline-flex w-full max-w-md rounded-full border border-[#C8CDD0] bg-white p-1 shadow-sm sm:w-auto"
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
            className={`focus-ring min-h-11 flex-1 rounded-full px-5 py-2 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide transition sm:flex-none ${
              active
                ? "bg-[#075C35] text-white shadow-[0_6px_16px_rgba(7,92,53,0.25)]"
                : "text-[#090A0A] hover:bg-[#F3F4F4]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
