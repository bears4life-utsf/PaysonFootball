"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";

export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between px-4 transition-all sm:px-6 ${
          compact ? "py-2.5" : "py-4"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 focus-ring rounded-sm">
          <BrandLogo size="sm" priority />
          <div className="leading-tight">
            <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide">
              Payson Lions Football
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          <a href="#schedule" className="focus-ring rounded-sm text-sm font-medium">
            Schedule
          </a>
          <a href="#teams" className="focus-ring rounded-sm text-sm font-medium">
            Teams
          </a>
        </nav>

        <a
          href="#schedule"
          className="focus-ring rounded-sm bg-[#075C35] px-4 py-2 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide transition hover:bg-[#087247]"
        >
          View Schedule
        </a>
      </div>
    </header>
  );
}
