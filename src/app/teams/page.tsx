import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { TeamsDirectory } from "@/components/teams-directory";
import { teamProfiles } from "@/data/team-profiles";

export const metadata: Metadata = {
  title: "Teams",
  description:
    "Meet the Payson Lions Varsity football team, coaching staff, and roster in Payson, Utah.",
};

const varsityTeam = teamProfiles.find((team) => team.id === "varsity");

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

          <div className="relative mx-auto flex h-[200px] w-full max-w-6xl flex-col justify-center px-4 sm:h-[240px] sm:px-6">
            <h1 className="hero-rise font-[family-name:var(--font-display)] text-5xl uppercase tracking-tight sm:text-6xl">
              Teams
            </h1>
            <p
              className="hero-rise mt-3 max-w-xl text-base text-[#F3F4F4]/90 sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              Varsity coaching staff and 2026–27 roster.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          {varsityTeam ? <TeamsDirectory team={varsityTeam} /> : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
