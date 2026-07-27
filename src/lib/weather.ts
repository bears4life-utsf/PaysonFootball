import { mapWeatherCode } from "@/lib/weather-codes";

export const OPEN_METEO_FORECAST_DAYS = 16;

export type OpenMeteoHourlyResponse = {
  latitude: number;
  longitude: number;
  timezone?: string;
  hourly?: {
    time: string[];
    temperature_2m?: Array<number | null>;
    apparent_temperature?: Array<number | null>;
    precipitation_probability?: Array<number | null>;
    weather_code?: Array<number | null>;
    wind_speed_10m?: Array<number | null>;
    wind_gusts_10m?: Array<number | null>;
    precipitation?: Array<number | null>;
    rain?: Array<number | null>;
    snowfall?: Array<number | null>;
  };
};

export type NormalizedGameWeather = {
  temperatureF: number;
  apparentTemperatureF: number | null;
  conditionLabel: string;
  weatherCode: number;
  precipitationProbability: number | null;
  windSpeedMph: number | null;
  windGustsMph: number | null;
  precipitationIn: number | null;
  rainIn: number | null;
  snowfallIn: number | null;
  forecastTimeLocal: string;
};

export type WeatherApiStatus =
  | "ok"
  | "hidden"
  | "unavailable"
  | "out_of_range"
  | "tba"
  | "missing_coords"
  | "past";

export type WeatherApiResponse = {
  status: WeatherApiStatus;
  weather?: NormalizedGameWeather;
};

export type WeatherRequestInput = {
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  now?: Date;
};

export function parseKickoffClock(
  time: string,
): { hours: number; minutes: number } | null {
  if (!time || time.trim().toUpperCase() === "TBA") return null;
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return { hours, minutes };
}

function asLocalDateOnly(date: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isGameDateInForecastWindow(date: string, now = new Date()): boolean {
  const gameDate = asLocalDateOnly(date);
  if (!gameDate) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const max = new Date(today);
  // forecast_days=16 includes today through today+15.
  max.setDate(max.getDate() + (OPEN_METEO_FORECAST_DAYS - 1));
  return gameDate >= today && gameDate <= max;
}

export function isFutureGameDate(date: string, now = new Date()): boolean {
  const gameDate = asLocalDateOnly(date);
  if (!gameDate) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return gameDate >= today;
}

export function evaluateWeatherEligibility(
  input: WeatherRequestInput,
): WeatherApiStatus {
  const { latitude, longitude, date, time, now = new Date() } = input;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return "missing_coords";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "hidden";
  if (!isFutureGameDate(date, now)) return "past";
  if (!parseKickoffClock(time)) return "tba";
  if (!isGameDateInForecastWindow(date, now)) return "out_of_range";
  return "ok";
}

function parseHourMinuteFromLocalIso(value: string): number | null {
  const match = value.match(/T(\d{2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function selectClosestHourlyIndex(
  times: string[],
  kickoffHours: number,
  kickoffMinutes: number,
): number {
  const target = kickoffHours * 60 + kickoffMinutes;
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const minutes = parseHourMinuteFromLocalIso(time);
    if (minutes === null) return;
    const diff = Math.abs(minutes - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export function normalizeOpenMeteoHour(
  raw: OpenMeteoHourlyResponse,
  index: number,
): NormalizedGameWeather | null {
  const hourly = raw.hourly;
  if (!hourly?.time?.[index]) return null;

  const temperature = hourly.temperature_2m?.[index];
  const weatherCode = hourly.weather_code?.[index];
  if (typeof temperature !== "number" || typeof weatherCode !== "number") {
    return null;
  }

  const condition = mapWeatherCode(weatherCode);

  return {
    temperatureF: Math.round(temperature),
    apparentTemperatureF:
      typeof hourly.apparent_temperature?.[index] === "number"
        ? Math.round(hourly.apparent_temperature[index] as number)
        : null,
    conditionLabel: condition.label,
    weatherCode,
    precipitationProbability:
      typeof hourly.precipitation_probability?.[index] === "number"
        ? Math.round(hourly.precipitation_probability[index] as number)
        : null,
    windSpeedMph:
      typeof hourly.wind_speed_10m?.[index] === "number"
        ? Math.round(hourly.wind_speed_10m[index] as number)
        : null,
    windGustsMph:
      typeof hourly.wind_gusts_10m?.[index] === "number"
        ? Math.round(hourly.wind_gusts_10m[index] as number)
        : null,
    precipitationIn:
      typeof hourly.precipitation?.[index] === "number"
        ? Number((hourly.precipitation[index] as number).toFixed(2))
        : null,
    rainIn:
      typeof hourly.rain?.[index] === "number"
        ? Number((hourly.rain[index] as number).toFixed(2))
        : null,
    snowfallIn:
      typeof hourly.snowfall?.[index] === "number"
        ? Number((hourly.snowfall[index] as number).toFixed(2))
        : null,
    forecastTimeLocal: hourly.time[index],
  };
}

export async function fetchOpenMeteoGameWeather(
  input: WeatherRequestInput,
): Promise<WeatherApiResponse> {
  const eligibility = evaluateWeatherEligibility(input);
  if (eligibility !== "ok") {
    return { status: eligibility };
  }

  const clock = parseKickoffClock(input.time);
  if (!clock) return { status: "tba" };

  const params = new URLSearchParams({
    latitude: String(input.latitude),
    longitude: String(input.longitude),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
      "wind_gusts_10m",
      "precipitation",
      "rain",
      "snowfall",
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: "auto",
    start_date: input.date,
    end_date: input.date,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      {
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const raw = (await response.json()) as OpenMeteoHourlyResponse;
    const times = raw.hourly?.time ?? [];
    if (times.length === 0) return { status: "unavailable" };

    const index = selectClosestHourlyIndex(times, clock.hours, clock.minutes);
    const weather = normalizeOpenMeteoHour(raw, index);
    if (!weather) return { status: "unavailable" };

    return { status: "ok", weather };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
