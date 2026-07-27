import Image from "next/image";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
};

const sizeMap = {
  sm: { className: "h-9 w-9", pixels: 36 },
  md: { className: "h-12 w-12", pixels: 48 },
  lg: { className: "h-16 w-16", pixels: 64 },
} as const;

export function BrandLogo({
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const { className: sizeClass, pixels } = sizeMap[size];

  return (
    <Image
      src="/images/payson-lions-logo.png"
      alt="Payson Lions logo"
      width={pixels}
      height={pixels}
      className={`${sizeClass} object-contain ${className}`}
      priority={priority}
    />
  );
}
