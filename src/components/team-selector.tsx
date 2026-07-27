"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";

import type { Team } from "@/data/schedules";

type TeamSelectorProps = {
  teams: Team[];
  selectedTeamId: string;
  onSelect: (teamId: string) => void;
};

export function TeamSelector({ teams, selectedTeamId, onSelect }: TeamSelectorProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + teams.length) % teams.length;
    const nextTeam = teams[nextIndex];
    onSelect(nextTeam.id);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div
      id="teams"
      className="sticky top-[58px] z-40 border-y border-[#C8CDD0] bg-[#F3F4F4]/95 py-2 backdrop-blur"
    >
      <div
        role="tablist"
        aria-label="Team schedule selector"
        className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 sm:px-6"
      >
        {teams.map((team, index) => {
          const active = team.id === selectedTeamId;
          return (
            <button
              key={team.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              id={`team-tab-${team.id}`}
              role="tab"
              aria-selected={active}
              aria-controls={`team-panel-${team.id}`}
              tabIndex={active ? 0 : -1}
              onKeyDown={(event) => onKeyDown(event, index)}
              onClick={() => onSelect(team.id)}
              className={`focus-ring whitespace-nowrap rounded-sm border px-4 py-2 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide transition ${
                active
                  ? "border-[#075C35] bg-[#075C35] text-white"
                  : "border-[#C8CDD0] bg-white text-[#090A0A] hover:border-[#075C35]/50"
              }`}
            >
              {team.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
