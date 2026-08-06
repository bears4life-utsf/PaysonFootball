"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { RosterPlayer, TeamProfile } from "@/data/team-profiles";

type SortKey = "number" | "firstName" | "lastName" | "grade";
type SortDir = "asc" | "desc";

const GRADE_RANK: Record<string, number> = {
  "Fr.": 1,
  Freshman: 1,
  "So.": 2,
  Sophomore: 2,
  "Jr.": 3,
  Junior: 3,
  "Sr.": 4,
  Senior: 4,
};

function nameParts(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    first: (parts[0] ?? name).toLocaleLowerCase(),
    last: (parts[parts.length - 1] ?? name).toLocaleLowerCase(),
  };
}

function comparePlayers(a: RosterPlayer, b: RosterPlayer, key: SortKey, dir: SortDir) {
  const sign = dir === "asc" ? 1 : -1;
  if (key === "number") return (a.number - b.number) * sign;
  if (key === "grade") {
    const gradeDiff =
      (GRADE_RANK[a.grade] ?? 99) - (GRADE_RANK[b.grade] ?? 99);
    if (gradeDiff !== 0) return gradeDiff * sign;
    return (a.number - b.number) * sign;
  }

  const aParts = nameParts(a.name);
  const bParts = nameParts(b.name);
  const nameDiff =
    key === "firstName"
      ? aParts.first.localeCompare(bParts.first, "en")
      : aParts.last.localeCompare(bParts.last, "en");
  if (nameDiff !== 0) return nameDiff * sign;
  return (a.number - b.number) * sign;
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.14em] transition ${
        active ? "text-[#075C35]" : "text-[#4f5854] hover:text-[#090A0A]"
      }`}
      aria-pressed={active}
    >
      {label}
      <span aria-hidden className="inline-block w-3 text-[10px]">
        {active ? (dir === "asc" ? "↑" : "↓") : ""}
      </span>
    </button>
  );
}

type TeamRosterProps = {
  players: RosterPlayer[];
};

function TeamRoster({ players }: TeamRosterProps) {
  const [sortKey, setSortKey] = useState<SortKey>("number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(
    () =>
      [...players].sort((a, b) => comparePlayers(a, b, sortKey, sortDir)),
    [players, sortKey, sortDir],
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  const nameSortActive = sortKey === "firstName" || sortKey === "lastName";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
            2026–27 Roster
          </h3>
          <p className="mt-1 text-sm text-[#4f5854]">
            {players.length} players · sort by number, first name, last name, or
            grade
          </p>
        </div>
        <div
          className="flex flex-wrap gap-1 rounded border border-[#C8CDD0] bg-[#F3F4F4] p-1"
          role="group"
          aria-label="Sort roster"
        >
          <SortButton
            label="Number"
            active={sortKey === "number"}
            dir={sortDir}
            onClick={() => toggleSort("number")}
          />
          <SortButton
            label="First"
            active={sortKey === "firstName"}
            dir={sortDir}
            onClick={() => toggleSort("firstName")}
          />
          <SortButton
            label="Last"
            active={sortKey === "lastName"}
            dir={sortDir}
            onClick={() => toggleSort("lastName")}
          />
          <SortButton
            label="Grade"
            active={sortKey === "grade"}
            dir={sortDir}
            onClick={() => toggleSort("grade")}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded border border-[#C8CDD0] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#C8CDD0] bg-[#E8EAEB]">
            <tr>
              <th scope="col" className="px-3 py-2.5 sm:px-4">
                <SortButton
                  label="#"
                  active={sortKey === "number"}
                  dir={sortDir}
                  onClick={() => toggleSort("number")}
                />
              </th>
              <th scope="col" className="px-3 py-2.5 sm:px-4">
                <div className="flex flex-wrap items-center gap-1">
                  <SortButton
                    label="First"
                    active={sortKey === "firstName"}
                    dir={sortDir}
                    onClick={() => toggleSort("firstName")}
                  />
                  <span className="text-[#C8CDD0]" aria-hidden>
                    /
                  </span>
                  <SortButton
                    label="Last"
                    active={sortKey === "lastName"}
                    dir={sortDir}
                    onClick={() => toggleSort("lastName")}
                  />
                  {!nameSortActive ? (
                    <span className="sr-only">Name</span>
                  ) : null}
                </div>
              </th>
              <th scope="col" className="px-3 py-2.5 sm:px-4">
                <span className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.14em] text-[#4f5854]">
                  Pos.
                </span>
              </th>
              <th scope="col" className="px-3 py-2.5 sm:px-4">
                <SortButton
                  label="Gr."
                  active={sortKey === "grade"}
                  dir={sortDir}
                  onClick={() => toggleSort("grade")}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((player, index) => (
              <tr
                key={`${player.number}-${player.name}`}
                className={`border-b border-[#E8EAEB] last:border-b-0 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F8F9F9]"
                }`}
              >
                <td className="px-3 py-2.5 font-[family-name:var(--font-display)] text-base tabular-nums text-[#075C35] sm:px-4">
                  {player.number}
                </td>
                <td className="px-3 py-2.5 font-medium text-[#090A0A] sm:px-4">
                  {player.name}
                </td>
                <td className="px-3 py-2.5 text-[#4f5854] sm:px-4">
                  {player.positions}
                </td>
                <td className="px-3 py-2.5 text-[#313a36] sm:px-4">
                  {player.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type TeamsDirectoryProps = {
  team: TeamProfile;
};

export function TeamsDirectory({ team }: TeamsDirectoryProps) {
  const scheduleHref = `/?view=team&team=${encodeURIComponent(team.scheduleTeamId)}#schedule`;
  const roster = team.roster ?? [];

  return (
    <section
      aria-labelledby={`team-heading-${team.id}`}
      className="hero-rise overflow-hidden rounded border border-[#C8CDD0] bg-white"
    >
      <div className="border-b border-[#C8CDD0] bg-[linear-gradient(135deg,#043D25_0%,#075C35_55%,#0a7a46_100%)] px-5 py-6 text-white sm:px-8 sm:py-7">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.2em] text-white/75">
          {team.level}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2
            id={`team-heading-${team.id}`}
            className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight sm:text-5xl"
          >
            {team.name}
          </h2>
          <Link
            href={scheduleHref}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded bg-white px-4 py-2.5 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide text-[#043D25] transition hover:bg-[#F3F4F4]"
          >
            View schedule
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
          {team.description}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)]">
        <aside className="space-y-6 border-b border-[#C8CDD0] bg-[#F8F9F9] px-5 py-6 sm:px-6 lg:border-b-0 lg:border-r">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] text-[#4f5854]">
              Head Coach
            </h3>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
              {team.headCoach.name}
            </p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] text-[#4f5854]">
              Assistant Coaches
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[#313a36]">
              {team.assistantCoaches.map((coach) => (
                <li key={coach.name}>
                  <span className="sr-only">{coach.role}: </span>
                  {coach.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="px-5 py-6 sm:px-6 sm:py-7">
          {roster.length > 0 ? (
            <TeamRoster players={roster} />
          ) : (
            <p className="text-[#4f5854]">Roster coming soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}
