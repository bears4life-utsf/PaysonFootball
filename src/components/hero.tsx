import Image from "next/image";

import { BrandLogo } from "@/components/brand-logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div aria-hidden className="absolute inset-0 bg-[#043D25]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/payson-football-hero.jpg')",
          backgroundPosition: "center 30%",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/70" />
      <div aria-hidden className="field-glow absolute inset-0" />
      <div aria-hidden className="yard-lines absolute inset-0 opacity-30" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-1/2 hidden w-[280px] -translate-y-1/2 opacity-[0.14] sm:block md:right-6 md:w-[340px] lg:w-[400px]"
      >
        <Image
          src="/images/payson-lions-logo.png"
          alt=""
          width={400}
          height={494}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      <div className="relative mx-auto flex h-[420px] w-full max-w-6xl flex-col justify-center px-4 py-8 sm:h-[470px] sm:px-6 md:h-[520px] lg:h-[560px]">
        <div className="motion-safe:hero-rise flex items-center gap-3">
          <BrandLogo size="xl" priority />
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.24em] text-[#C8CDD0]">
            Payson Lions Football
          </p>
        </div>

        <h1 className="motion-safe:hero-rise mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          One Town.
          <br />
          One Team.
          <br />
          One Pride.
        </h1>

        <div className="metal-edge motion-safe:hero-rise mt-4 h-px w-20" />

        <p className="motion-safe:hero-rise mt-4 max-w-lg text-base leading-relaxed text-[#F3F4F4]/90 sm:text-lg">
          Schedules and game-day information for every Payson Lions football team.
        </p>

        <div className="motion-safe:hero-rise mt-6">
          <a
            href="#schedule"
            className="focus-ring inline-flex min-h-11 items-center rounded bg-[#075C35] px-5 py-3 font-[family-name:var(--font-display)] text-base uppercase tracking-wide transition hover:bg-[#087247]"
          >
            View Schedule
          </a>
        </div>
      </div>
    </section>
  );
}
