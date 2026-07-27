import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide">
              Payson Lions Football
            </p>
            <p className="text-sm text-[#C8CDD0]">Payson, Utah</p>
          </div>
        </div>
        <div className="text-sm text-[#C8CDD0] md:text-right">
          <p>© 2026 Payson Lions Football</p>
          <p>Schedules are subject to change.</p>
        </div>
      </div>
    </footer>
  );
}
