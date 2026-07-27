import { ageGroups } from "@/data/schedules";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="relative overflow-hidden bg-field-deep text-chalk">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0, transparent calc(12.5% - 1px), rgba(232,239,228,0.18) calc(12.5% - 1px), rgba(232,239,228,0.18) 12.5%, transparent 12.5%),
              linear-gradient(180deg, rgba(20,54,32,0.2), transparent 45%),
              radial-gradient(ellipse 80% 60% at 70% 20%, rgba(47,107,60,0.55), transparent 60%)
            `,
            backgroundSize: "100% 100%, 100% 100%, 100% 100%",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-5xl flex-col justify-end px-6 pb-16 pt-10 sm:px-8 sm:pb-20">
          <p className="animate-rise font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.28em] text-chalk/75">
            Payson, Utah
          </p>
          <h1 className="animate-rise-delay mt-3 max-w-3xl font-[family-name:var(--font-display)] text-6xl font-extrabold uppercase leading-[0.92] tracking-tight text-chalk sm:text-8xl">
            Payson Football
          </h1>
          <div className="animate-yard-line mt-5 h-1 w-28 bg-accent" />
          <p className="animate-rise-late mt-6 max-w-xl text-lg leading-relaxed text-chalk/85 sm:text-xl">
            One place for every age-group schedule — kickoff times, opponents,
            and fields across the city.
          </p>
          <div className="animate-rise-late mt-10">
            <a
              href="#schedules"
              className="inline-flex items-center bg-accent px-6 py-3 font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              View schedules
            </a>
          </div>
        </div>
      </header>

      <main id="schedules" className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:px-8 sm:py-20">
        <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold uppercase tracking-tight text-field-deep sm:text-5xl">
          Age groups
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Pick a division to see games. Schedules will be updated as the season
          is finalized.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ageGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="group border border-field/15 bg-white/70 p-5 transition hover:border-field/40 hover:bg-white"
            >
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {group.ages}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-tight text-field-deep group-hover:text-turf">
                {group.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {group.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-field">
                {group.games.length === 0
                  ? "Schedule coming soon"
                  : `${group.games.length} games posted`}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-20 space-y-16">
          {ageGroups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-8">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-field/15 pb-4">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {group.ages}
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-4xl font-bold uppercase tracking-tight text-field-deep">
                    {group.name}
                  </h3>
                </div>
              </div>

              {group.games.length === 0 ? (
                <p className="mt-6 text-muted">
                  No games posted yet. Check back once the season schedule is
                  released.
                </p>
              ) : (
                <ul className="mt-6 divide-y divide-field/10">
                  {group.games.map((game) => (
                    <li
                      key={`${game.date}-${game.time}-${game.home}-${game.away}`}
                      className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr_1fr]"
                    >
                      <div>
                        <p className="font-semibold text-field-deep">
                          {game.date}
                        </p>
                        <p className="text-sm text-muted">{game.time}</p>
                      </div>
                      <p className="text-foreground">
                        <span className="font-semibold">{game.home}</span>
                        <span className="mx-2 text-muted">vs</span>
                        <span className="font-semibold">{game.away}</span>
                      </p>
                      <p className="text-sm text-muted sm:text-right">
                        {game.location}
                        {game.note ? ` · ${game.note}` : null}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-field/10 bg-chalk/60 px-6 py-8 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wide text-field-deep">
            Payson Football
          </p>
          <p className="text-sm text-muted">
            Community schedules for Payson, Utah · paysonfootball.com
          </p>
        </div>
      </footer>
    </div>
  );
}
