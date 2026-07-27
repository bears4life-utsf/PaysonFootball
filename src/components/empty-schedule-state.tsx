import { BrandLogo } from "@/components/brand-logo";

type EmptyScheduleStateProps = {
  teamName: string;
};

export function EmptyScheduleState({ teamName }: EmptyScheduleStateProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#C8CDD0] bg-white text-center shadow-sm">
      <div className="h-1.5 bg-[#075C35]" />
      <div className="px-6 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto mb-5 flex w-fit justify-center rounded-md bg-black p-3">
          <BrandLogo size="md" />
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A] sm:text-4xl">
          Schedule Coming Soon
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-base text-[#313a36]">
          The 2026 {teamName} schedule will be posted as soon as it becomes available.
        </p>
        <p className="mt-2 text-sm text-[#4f5854]">
          Check back for game dates, times, opponents, and locations.
        </p>
      </div>
    </section>
  );
}
