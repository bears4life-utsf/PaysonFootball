"use client";

import { useEffect, useState } from "react";

import type { Game } from "@/data/schedules";
import { getCountdownParts } from "@/lib/calendar";

type GameCountdownProps = {
  game: Game;
};

export function GameCountdown({ game }: GameCountdownProps) {
  const [now, setNow] = useState(() => new Date());
  const parts = getCountdownParts(game, now);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (parts.isLiveOrPast) {
    return (
      <div className="rounded-md border border-[#075C35]/20 bg-[#075C35]/5 px-4 py-3">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
          Kickoff
        </p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase text-[#090A0A]">
          Game Day
        </p>
      </div>
    );
  }

  const blocks = [
    { label: "Days", value: parts.days },
    { label: "Hours", value: parts.hours },
    { label: "Minutes", value: parts.minutes },
  ];

  return (
    <div className="rounded-md border border-[#075C35]/20 bg-[#075C35]/5 px-4 py-3">
      <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
        Countdown to Kickoff
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {blocks.map((block) => (
          <div key={block.label} className="rounded-md bg-white px-2 py-2 text-center shadow-sm">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[#090A0A] sm:text-3xl">
              {block.value}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5a6660]">
              {block.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
