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
      <div aria-hidden className="absolute inset-0 bg-black/72" />
      <div aria-hidden className="field-glow absolute inset-0 opacity-70" />
      <div aria-hidden className="yard-lines absolute inset-0 opacity-[0.16]" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 hidden w-[320px] -translate-y-1/2 opacity-20 sm:block md:right-0 md:w-[380px] lg:w-[460px] lg:opacity-[0.22]"
      >
        <Image
          src="/images/payson-lions-logo.png"
          alt=""
          width={460}
          height={568}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      <div className="relative mx-auto flex min-h-[300px] w-full max-w-6xl flex-col justify-start px-4 pb-8 pt-6 sm:min-h-[380px] sm:justify-center sm:px-6 sm:pb-10 sm:pt-8 md:min-h-[420px] lg:min-h-[440px]">
        <div className="motion-safe:hero-rise flex items-center gap-2.5">
          <BrandLogo size="lg" priority />
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.22em] text-[#C8CDD0]">
            Payson Lions Football
          </p>
        </div>

        <h1 className="motion-safe:hero-rise mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.92] tracking-tight sm:text-5xl md:text-[3.4rem]">
          One Town.
          <br />
          One Team.
          <br />
          One Pride.
        </h1>

        <div className="metal-edge motion-safe:hero-rise mt-3 h-px w-16" />

        <p className="motion-safe:hero-rise mt-3 max-w-md text-sm leading-relaxed text-[#F3F4F4]/90 sm:max-w-lg sm:text-base">
          Schedules and game-day information for every Payson Lions football team.
        </p>
      </div>
    </section>
  );
}
