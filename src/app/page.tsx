import { Suspense } from "react";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ScheduleSection } from "@/components/schedule-section";
import { SiteFooter } from "@/components/site-footer";

function ScheduleFallback() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight text-[#090A0A]">
        Schedule
      </h2>
      <p className="mt-3 text-[#313a36]">Loading schedules…</p>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F4]">
      <Header />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<ScheduleFallback />}>
          <ScheduleSection />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
