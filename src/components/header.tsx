"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [compact]);

  const scheduleActive = pathname === "/";
  const teamsActive = pathname === "/teams";
  const waiverActive = pathname === "/parade-waiver";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-white/10 bg-black text-white"
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 transition-[padding] duration-300 sm:px-6 ${
          compact ? "py-2" : "py-3"
        }`}
      >
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-2.5 rounded">
          <BrandLogo size="sm" priority />
          <p className="min-w-0 font-[family-name:var(--font-display)] text-base uppercase tracking-wide sm:text-lg">
            <span className="sm:hidden">Payson Lions</span>
            <span className="hidden sm:inline">Payson Lions Football</span>
          </p>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/#schedule"
            aria-current={scheduleActive ? "page" : undefined}
            className={`focus-ring rounded text-sm font-medium transition ${
              scheduleActive ? "text-white" : "text-white/85 hover:text-white"
            }`}
          >
            Schedules
          </Link>
          <Link
            href="/teams"
            aria-current={teamsActive ? "page" : undefined}
            className={`focus-ring rounded text-sm font-medium transition ${
              teamsActive ? "text-white" : "text-white/85 hover:text-white"
            }`}
          >
            Teams
          </Link>
          <Link
            href="/parade-waiver"
            aria-current={waiverActive ? "page" : undefined}
            className={`focus-ring rounded text-sm font-medium transition ${
              waiverActive ? "text-white" : "text-white/85 hover:text-white"
            }`}
          >
            Waiver
          </Link>
        </nav>
      </div>
    </header>
  );
}
