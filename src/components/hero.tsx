import { ChevronDown } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#043D25] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/payson-football-hero.jpg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/65 to-[#090A0A]"
      />

      <div className="relative mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-20">
        <div className="motion-safe:hero-rise flex items-center gap-3">
          <BrandLogo size="md" />
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.22em] text-[#C8CDD0]">
            Payson Lions Football
          </p>
        </div>
        <h1 className="motion-safe:hero-rise mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl uppercase tracking-tight sm:text-7xl">
          One Town. One Team. One Pride.
        </h1>
        <p className="motion-safe:hero-rise mt-5 max-w-2xl text-lg text-[#F3F4F4] sm:text-xl">
          Schedules and game-day information for every Payson Lions football team.
        </p>
        <div className="motion-safe:hero-rise mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#schedule"
            className="focus-ring rounded-sm bg-[#075C35] px-5 py-3 font-[family-name:var(--font-display)] text-base uppercase tracking-wide transition hover:bg-[#087247]"
          >
            View Varsity Schedule
          </a>
          <a
            href="#teams"
            className="focus-ring rounded-sm border border-white/40 px-5 py-3 font-[family-name:var(--font-display)] text-base uppercase tracking-wide transition hover:bg-white/10"
          >
            Choose a Team
          </a>
        </div>
      </div>

      <div aria-hidden className="relative h-8 bg-[#F3F4F4]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#075C35]" />
        <ChevronDown className="mx-auto mt-2 text-[#075C35]" />
      </div>
    </section>
  );
}
