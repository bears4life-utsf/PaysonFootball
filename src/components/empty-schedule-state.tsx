import { Shield } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";

type EmptyScheduleStateProps = {
  teamName: string;
};

export function EmptyScheduleState({ teamName }: EmptyScheduleStateProps) {
  return (
    <section className="rounded-sm border border-[#C8CDD0] bg-white p-6 text-center sm:p-8">
      <div className="mx-auto mb-4 flex w-fit items-center gap-3">
        <BrandLogo size="sm" />
        <Shield className="text-[#075C35]" />
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A]">
        Schedule Coming Soon
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-[#313a36]">
        The 2026 {teamName} schedule will be posted here as soon as it is finalized.
      </p>
      <p className="mt-2 text-sm text-[#4f5854]">
        Check back for game dates, times, opponents, and locations.
      </p>
    </section>
  );
}
