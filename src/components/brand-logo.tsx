import Image from "next/image";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
};

/** Intrinsic logo ratio after crop: 456 x 564 */
const ASPECT = 456 / 564;

const sizeMap = {
  sm: { height: 36 },
  md: { height: 52 },
  lg: { height: 72 },
  xl: { height: 88 },
} as const;

export function BrandLogo({
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const height = sizeMap[size].height;
  const width = Math.round(height * ASPECT);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-black ${className}`}
      style={{ width, height, backgroundColor: "#000000" }}
    >
      <Image
        src="/images/payson-lions-logo.png"
        alt="Payson Lions logo"
        width={width}
        height={height}
        className="h-full w-full object-contain"
        priority={priority}
      />
    </span>
  );
}
