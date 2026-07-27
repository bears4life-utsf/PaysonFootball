"use client";

import { CalendarPlus, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { Game } from "@/data/schedules";
import {
  buildAppleCalendarIcs,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
} from "@/lib/calendar";

type AddToCalendarButtonProps = {
  game: Game;
};

export function AddToCalendarButton({ game }: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const downloadApple = () => {
    const ics = buildAppleCalendarIcs(game);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payson-lions-${game.id}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border border-black/80 bg-white px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-[#F3F4F4]"
      >
        <CalendarPlus size={16} aria-hidden />
        Add to Calendar
        <ChevronDown size={15} aria-hidden className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-20 mt-2 min-w-44 overflow-hidden rounded-md border border-[#C8CDD0] bg-white shadow-lg"
        >
          <a
            role="menuitem"
            href={buildGoogleCalendarUrl(game)}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring block px-4 py-3 text-sm font-medium text-[#090A0A] transition hover:bg-[#F3F4F4]"
            onClick={() => setOpen(false)}
          >
            Google
          </a>
          <button
            role="menuitem"
            type="button"
            className="focus-ring block w-full px-4 py-3 text-left text-sm font-medium text-[#090A0A] transition hover:bg-[#F3F4F4]"
            onClick={downloadApple}
          >
            Apple
          </button>
          <a
            role="menuitem"
            href={buildOutlookCalendarUrl(game)}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring block px-4 py-3 text-sm font-medium text-[#090A0A] transition hover:bg-[#F3F4F4]"
            onClick={() => setOpen(false)}
          >
            Outlook
          </a>
        </div>
      ) : null}
    </div>
  );
}
