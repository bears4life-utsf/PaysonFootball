type HomeAwayBadgeProps = {
  homeAway: "home" | "away";
  className?: string;
};

export function HomeAwayBadge({ homeAway, className = "" }: HomeAwayBadgeProps) {
  const isHome = homeAway === "home";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        isHome
          ? "bg-[#075C35] text-white"
          : "border border-black/70 bg-black text-white"
      } ${className}`}
    >
      {isHome ? "HOME" : "AWAY"}
    </span>
  );
}

export function RegionBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#C8CDD0] bg-[#F3F4F4] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#090A0A] ${className}`}
    >
      REGION
    </span>
  );
}
