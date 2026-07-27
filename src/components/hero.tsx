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
      <div aria-hidden className="yard-lines absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-[45vh] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:min-h-[48vh] sm:px-6 sm:py-14">
        <div className="motion-safe:hero-rise flex items-center gap-3">
          <BrandLogo size="md" priority />
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.24em] text-[#C8CDD0]">
            Payson Lions Football
          </p>
        </div>

        <h1 className="motion-safe:hero-rise mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          One Town.
          <br />
          One Team.
          <br />
          One Pride.
        </h1>

        <div className="metal-edge motion-safe:hero-rise mt-5 h-px w-24" />

        <p className="motion-safe:hero-rise mt-5 max-w-xl text-base leading-relaxed text-[#F3F4F4]/90 sm:text-lg">
          Schedules and game-day information for every Payson Lions football team.
        </p>

        <div className="motion-safe:hero-rise mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#schedule"
            className="focus-ring inline-flex min-h-12 items-center rounded-md bg-[#075C35] px-5 py-3 font-[family-name:var(--font-display)] text-base uppercase tracking-wide transition hover:-translate-y-0.5 hover:bg-[#087247]"
          >
            🏈 View Varsity Schedule
          </a>
          <a
            href="#teams"
            className="focus-ring inline-flex min-h-12 items-center rounded-md border border-white/45 bg-white/5 px-5 py-3 font-[family-name:var(--font-display)] text-base uppercase tracking-wide backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Choose Team
          </a>
        </div>
      </div>

      <div aria-hidden className="relative">
        <div className="h-3 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.35))]" />
        <div className="metal-edge h-0.5 w-full" />
        <div className="h-4 bg-[#F3F4F4]" />
      </div>
    </section>
  );
}
