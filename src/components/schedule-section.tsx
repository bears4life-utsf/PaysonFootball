"use client";

import { useMemo, useState } from "react";

import { AwayVenueList } from "@/components/away-venue-list";
import { EmptyScheduleState } from "@/components/empty-schedule-state";
import { NextGamePanel } from "@/components/next-game-panel";
import { ScheduleCardList } from "@/components/schedule-card-list";
import { ScheduleTable } from "@/components/schedule-table";
import { TeamSelector } from "@/components/team-selector";
import { teams, type Team } from "@/data/schedules";
import { getAwayVenues, getNextUpcomingGame, getSeasonState } from "@/lib/schedule-utils";

const defaultTeamId = "varsity";

function getSelectedTeam(selectedTeamId: string): Team {
  return teams.find((team) => team.id === selectedTeamId) ?? teams[0];
}

export function ScheduleSection() {
  const [selectedTeamId, setSelectedTeamId] = useState(defaultTeamId);
  const selectedTeam = getSelectedTeam(selectedTeamId);
  const nextGame = useMemo(() => getNextUpcomingGame(selectedTeam.games), [selectedTeam.games]);
  const awayVenues = useMemo(() => getAwayVenues(selectedTeam), [selectedTeam]);
  const seasonState = useMemo(() => getSeasonState(selectedTeam.games), [selectedTeam.games]);

  return (
    <>
      <TeamSelector teams={teams} selectedTeamId={selectedTeamId} onSelect={setSelectedTeamId} />
      <section
        id="schedule"
        className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12"
      >
        <div
          role="tabpanel"
          id={`team-panel-${selectedTeam.id}`}
          aria-labelledby={`team-tab-${selectedTeam.id}`}
        >
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight text-[#090A0A] sm:text-5xl">
              {selectedTeam.seasonLabel} {selectedTeam.name} Schedule
            </h2>
            <p className="mt-3 text-[#313a36]">
              Schedules and game-day details for players, parents, coaches, and fans.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#4f5854]">
              <span className="rounded-full border border-[#C8CDD0] bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#090A0A]">
                REGION
              </span>
              Region badge marks region games.
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {selectedTeam.games.length === 0 ? (
              <EmptyScheduleState teamName={selectedTeam.name} />
            ) : (
              <>
                {seasonState === "complete" ? (
                  <section className="rounded-lg border border-[#C8CDD0] bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
                      Season Complete
                    </h3>
                    <p className="mt-2 text-[#4f5854]">
                      The season has ended. The full schedule remains available below.
                    </p>
                  </section>
                ) : nextGame ? (
                  <NextGamePanel game={nextGame} />
                ) : null}

                <ScheduleTable games={selectedTeam.games} nextGameId={nextGame?.id} />
                <ScheduleCardList games={selectedTeam.games} nextGameId={nextGame?.id} />
                <AwayVenueList venues={awayVenues} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
