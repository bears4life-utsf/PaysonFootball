import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { TeamProfileCard } from "@/components/team-profile-card";
import { teamProfiles } from "@/data/team-profiles";

export const metadata: Metadata = {
  title: "Teams",
  description:
    "Meet the Payson Lions football teams and coaching staffs in Payson, Utah.",
};

export default function TeamsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F4]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-black text-white">
          <div aria-hidden className="absolute inset-0 bg-[#043D25]" />
          <div aria-hidden className="field-glow absolute inset-0 opacity-60" />
          <div aria-hidden className="yard-lines absolute inset-0 opacity-[0.12]" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 top-1/2 hidden w-[240px] -translate-y-1/2 opacity-20 sm:block md:right-4 md:w-[280px]"
          >
            <Image
              src="/images/payson-lions-logo.png"
              alt=""
              width={280}
              height={346}
              className="h-auto w-full object-contain"
              priority
            />
          </div>

          <div className="relative mx-auto flex h-[220px] w-full max-w-6xl flex-col justify-center px-4 sm:h-[260px] sm:px-6 md:h-[280px]">
            <h1 className="font-[family-name:var(--font-display)] text-5xl uppercase tracking-tight sm:text-6xl">
              Teams
            </h1>
            <p className="mt-3 max-w-xl text-base text-[#F3F4F4]/90 sm:text-lg">
              Meet the Payson Lions football teams and coaching staffs.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="mb-6 text-sm text-[#6b716e]">
            Coaching names below are placeholders for layout and will be replaced with official
            staff information.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {teamProfiles.map((team) => (
              <TeamProfileCard key={team.id} team={team} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
