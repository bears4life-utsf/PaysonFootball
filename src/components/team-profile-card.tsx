import Link from "next/link";

import type { TeamProfile } from "@/data/team-profiles";

type TeamProfileCardProps = {
  team: TeamProfile;
};

export function TeamProfileCard({ team }: TeamProfileCardProps) {
  const scheduleHref = `/?view=team&team=${encodeURIComponent(team.scheduleTeamId)}#schedule`;

  return (
    <article className="flex h-full flex-col rounded border border-[#C8CDD0] bg-white p-5 shadow-[0_8px_24px_rgba(9,10,10,0.04)] sm:p-6">
      <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
        {team.level}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A]">
        {team.name}
      </h2>

      <div className="mt-5 space-y-4 text-sm text-[#313a36]">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] text-[#4f5854]">
            Head Coach
          </h3>
          <p className="mt-1 text-base font-semibold text-[#090A0A]">{team.headCoach.name}</p>
        </div>

        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] text-[#4f5854]">
            Assistant Coaches
          </h3>
          <ul className="mt-1 space-y-1">
            {team.assistantCoaches.map((coach) => (
              <li key={coach.name}>
                <span className="sr-only">{coach.role}: </span>
                {coach.name}
              </li>
            ))}
          </ul>
        </div>

        <p className="leading-relaxed text-[#4f5854]">{team.description}</p>
      </div>

      <div className="mt-6 pt-1">
        <Link
          href={scheduleHref}
          className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded bg-[#075C35] px-4 py-2.5 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide text-white transition hover:bg-[#087247] sm:w-auto"
        >
          View {team.name} Schedule
        </Link>
      </div>
    </article>
  );
}
