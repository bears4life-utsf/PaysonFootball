"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { AwayVenueList } from "@/components/away-venue-list";
import { EmptyScheduleState } from "@/components/empty-schedule-state";
import { NextGamePanel } from "@/components/next-game-panel";
import { ScheduleCardList } from "@/components/schedule-card-list";
import {
  ScheduleViewTabs,
  type ScheduleViewMode,
} from "@/components/schedule-view-tabs";
import { ScheduleTable } from "@/components/schedule-table";
import { TeamSelect } from "@/components/team-select";
import { WeekScheduleView } from "@/components/week-schedule-view";
import { teams, type Team } from "@/data/schedules";
import { flattenScheduledGames } from "@/lib/schedule-filters";
import { getAwayVenues, getNextUpcomingGame, getSeasonState } from "@/lib/schedule-utils";
import {
  formatWeekKey,
  getInitialWeekKey,
  getWeekMonday,
  isValidWeekKey,
  shiftWeekKey,
} from "@/lib/week-utils";

const DEFAULT_TEAM_ID = "varsity";
const DEFAULT_VIEW: ScheduleViewMode = "team";

function getSelectedTeam(selectedTeamId: string): Team {
  return teams.find((team) => team.id === selectedTeamId) ?? teams[0];
}

function parseView(value: string | null): ScheduleViewMode {
  return value === "week" ? "week" : DEFAULT_VIEW;
}

function parseTeamId(value: string | null): string {
  if (!value) return DEFAULT_TEAM_ID;
  return teams.some((team) => team.id === value) ? value : DEFAULT_TEAM_ID;
}

export function ScheduleSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allGames = useMemo(() => flattenScheduledGames(teams, "all"), []);
  const defaultWeekKey = useMemo(
    () => getInitialWeekKey(allGames) ?? formatWeekKey(getWeekMonday(new Date())),
    [allGames],
  );

  const view = parseView(searchParams.get("view"));
  const selectedTeamId = parseTeamId(searchParams.get("team"));
  const weekParam = searchParams.get("week");
  const weekKey =
    weekParam && isValidWeekKey(weekParam) ? weekParam : defaultWeekKey;

  const selectedTeam = getSelectedTeam(selectedTeamId);
  const nextGame = useMemo(
    () => getNextUpcomingGame(selectedTeam.games),
    [selectedTeam.games],
  );
  const awayVenues = useMemo(() => getAwayVenues(selectedTeam), [selectedTeam]);
  const seasonState = useMemo(
    () => getSeasonState(selectedTeam.games),
    [selectedTeam.games],
  );

  const updateParams = useCallback(
    (patch: { view?: ScheduleViewMode; team?: string; week?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextView = patch.view ?? parseView(params.get("view"));

      params.set("view", nextView);

      if (nextView === "team") {
        const nextTeam = parseTeamId(patch.team ?? params.get("team"));
        params.set("team", nextTeam);
        params.delete("week");
      } else {
        const nextWeek =
          patch.week && isValidWeekKey(patch.week)
            ? patch.week
            : params.get("week") && isValidWeekKey(params.get("week")!)
              ? params.get("week")!
              : defaultWeekKey;
        params.set("week", nextWeek);
        params.delete("team");
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [defaultWeekKey, pathname, router, searchParams],
  );

  return (
    <section id="schedule" className="relative w-full">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight text-[#090A0A] sm:text-5xl">
          Schedule
        </h2>

        <div className="mt-5">
          <ScheduleViewTabs
            view={view}
            onChange={(nextView) => updateParams({ view: nextView })}
          />
        </div>

        {view === "team" ? (
          <div className="mt-6">
            {/* Future “My Teams” multi-select can replace/extend TeamSelect here. */}
            <TeamSelect
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelect={(teamId) => updateParams({ view: "team", team: teamId })}
            />
          </div>
        ) : null}
      </div>

      {view === "team" ? (
        <div
          role="tabpanel"
          id="schedule-panel-team"
          aria-labelledby="schedule-view-team"
          className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
        >
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A] sm:text-4xl">
              {selectedTeam.seasonLabel} {selectedTeam.name} Schedule
            </h3>
            <p className="mt-2 text-sm text-[#4f5854]">
              <span className="font-semibold text-[#090A0A]">REGION</span> marks region games.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {selectedTeam.games.length === 0 ? (
              <EmptyScheduleState teamName={selectedTeam.name} />
            ) : (
              <>
                {seasonState === "complete" ? (
                  <section className="rounded border border-[#C8CDD0] bg-white p-5 sm:p-6">
                    <h4 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
                      Season Complete
                    </h4>
                    <p className="mt-2 text-[#4f5854]">
                      The season has ended. The full schedule remains available below.
                    </p>
                  </section>
                ) : nextGame ? (
                  <NextGamePanel game={nextGame} />
                ) : null}

                <ScheduleTable games={selectedTeam.games} nextGameId={nextGame?.id} />
                <ScheduleCardList
                  games={selectedTeam.games}
                  nextGameId={nextGame?.id}
                />
                <AwayVenueList venues={awayVenues} />
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          role="tabpanel"
          id="schedule-panel-week"
          aria-labelledby="schedule-view-week"
          className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
        >
          <WeekScheduleView
            games={allGames}
            weekKey={weekKey}
            onWeekChange={(nextWeek) => updateParams({ view: "week", week: nextWeek })}
            onShiftWeek={(delta) =>
              updateParams({ view: "week", week: shiftWeekKey(weekKey, delta) })
            }
            onThisWeek={() =>
              updateParams({
                view: "week",
                week: formatWeekKey(getWeekMonday(new Date())),
              })
            }
          />
        </div>
      )}
    </section>
  );
}
