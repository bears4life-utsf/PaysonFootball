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
      <div className="border-l border-[#075C35]/30 pl-4 sm:pl-6">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
          Kickoff
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase text-[#090A0A]">
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
    <div className="border-l border-[#075C35]/30 pl-4 sm:pl-6">
      <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
        Countdown
      </p>
      <div className="mt-3 flex gap-5 sm:gap-6">
        {blocks.map((block) => (
          <div key={block.label}>
            <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums leading-none text-[#090A0A] sm:text-4xl">
              {block.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#5a6660]">
              {block.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
