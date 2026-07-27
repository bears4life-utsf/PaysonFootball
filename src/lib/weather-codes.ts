import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Snowflake,
  Sun,
} from "lucide-react";

export type WeatherCondition = {
  label: string;
  icon: LucideIcon;
};

/** Translate Open-Meteo WMO weather codes into parent-friendly labels. */
export function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0) return { label: "Clear", icon: Sun };
  if (code === 1) return { label: "Mostly Clear", icon: Sun };
  if (code === 2) return { label: "Partly Cloudy", icon: CloudSun };
  if (code === 3) return { label: "Cloudy", icon: Cloud };
  if (code === 45 || code === 48) return { label: "Fog", icon: CloudFog };
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return { label: "Light Rain", icon: CloudRain };
  }
  if (code === 61 || code === 63 || code === 66 || code === 80 || code === 81) {
    return { label: "Rain", icon: CloudRain };
  }
  if (code === 65 || code === 67 || code === 82) {
    return { label: "Heavy Rain", icon: CloudRain };
  }
  if (code === 71 || code === 73 || code === 77 || code === 85) {
    return { label: "Snow", icon: Snowflake };
  }
  if (code === 75 || code === 86) return { label: "Heavy Snow", icon: CloudSnow };
  if (code === 95 || code === 96 || code === 99) {
    return { label: "Thunderstorms", icon: CloudLightning };
  }
  return { label: "Cloudy", icon: Cloud };
}
