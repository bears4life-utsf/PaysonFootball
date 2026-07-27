"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";

export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 transition-[padding] duration-300 sm:px-6 ${
          compact ? "py-2" : "py-3"
        }`}
      >
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-2.5 rounded">
          <BrandLogo size="sm" priority />
          <p className="truncate font-[family-name:var(--font-display)] text-base uppercase tracking-wide sm:text-lg">
            Payson Lions Football
          </p>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
          <a
            href="#schedule"
            className="focus-ring rounded text-sm font-medium text-white/85 transition hover:text-white"
          >
            Schedule
          </a>
          <a
            href="#teams"
            className="focus-ring rounded text-sm font-medium text-white/85 transition hover:text-white"
          >
            Teams
          </a>
        </nav>
      </div>
    </header>
  );
}
