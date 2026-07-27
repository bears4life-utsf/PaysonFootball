type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  return (
    <span
      aria-label="Payson Lions logo"
      className={`relative inline-flex ${sizeMap[size]} items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#043D25] font-semibold text-white ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-95"
        style={{ backgroundImage: "url('/images/payson-lions-logo.png')" }}
      />
      <span className="relative font-[family-name:var(--font-display)] tracking-wide">
        PL
      </span>
    </span>
  );
}
