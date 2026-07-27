type EmptyWeekStateProps = {
  onPrevious: () => void;
  onNext: () => void;
  onReturnToNextScheduled: () => void;
  hasNextScheduled: boolean;
};

export function EmptyWeekState({
  onPrevious,
  onNext,
  onReturnToNextScheduled,
  hasNextScheduled,
}: EmptyWeekStateProps) {
  return (
    <section className="rounded-lg border border-[#C8CDD0] bg-white p-6 text-center shadow-sm sm:p-8">
      <h3 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A]">
        No Games Scheduled
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-[#313a36]">
        There are currently no Payson Lions games scheduled for this week.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          className="focus-ring min-h-11 rounded-md border border-[#C8CDD0] bg-white px-4 py-2 text-sm font-semibold text-[#090A0A]"
        >
          Previous Week
        </button>
        <button
          type="button"
          onClick={onNext}
          className="focus-ring min-h-11 rounded-md border border-[#C8CDD0] bg-white px-4 py-2 text-sm font-semibold text-[#090A0A]"
        >
          Next Week
        </button>
        {hasNextScheduled ? (
          <button
            type="button"
            onClick={onReturnToNextScheduled}
            className="focus-ring min-h-11 rounded-md bg-[#075C35] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Return to Next Scheduled Week
          </button>
        ) : null}
      </div>
    </section>
  );
}
