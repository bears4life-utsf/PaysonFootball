"use client";

import type { Team } from "@/data/schedules";

type TeamSelectProps = {
  teams: Team[];
  selectedTeamId: string;
  onSelect: (teamId: string) => void;
};

export function TeamSelect({ teams, selectedTeamId, onSelect }: TeamSelectProps) {
  return (
    <div id="teams" className="w-full max-w-md">
      <label
        htmlFor="team-select"
        className="mb-2 block font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] text-[#4f5854]"
      >
        Team
      </label>
      <select
        id="team-select"
        value={selectedTeamId}
        onChange={(event) => onSelect(event.target.value)}
        className="focus-ring min-h-11 w-full appearance-none rounded border border-[#C8CDD0] bg-white px-3 py-2.5 pr-10 text-base font-medium text-[#090A0A]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23090A0A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
        }}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}
