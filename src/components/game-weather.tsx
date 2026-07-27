"use client";

import { useEffect, useState } from "react";

import type { Game } from "@/data/schedules";
import { resolveGameVenue, venueHasCoordinates } from "@/data/venues";
import { mapWeatherCode } from "@/lib/weather-codes";
import {
  evaluateWeatherEligibility,
  type NormalizedGameWeather,
  type WeatherApiResponse,
  type WeatherApiStatus,
} from "@/lib/weather";

type GameWeatherProps = {
  game: Pick<Game, "date" | "time" | "venueName" | "status">;
  variant?: "compact" | "detailed";
  className?: string;
};

const inflight = new Map<string, Promise<WeatherApiResponse>>();
const resolved = new Map<string, WeatherApiResponse>();

function cacheKey(lat: number, lon: number, date: string, time: string) {
  return `${lat.toFixed(4)},${lon.toFixed(4)},${date},${time.trim().toUpperCase()}`;
}

async function loadWeather(
  lat: number,
  lon: number,
  date: string,
  time: string,
): Promise<WeatherApiResponse> {
  const key = cacheKey(lat, lon, date, time);
  const cached = resolved.get(key);
  if (cached) return cached;

  const existing = inflight.get(key);
  if (existing) return existing;

  const request = fetch(
    `/api/weather?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
  )
    .then(async (response) => {
      if (!response.ok) {
        return { status: "unavailable" } as WeatherApiResponse;
      }
      return (await response.json()) as WeatherApiResponse;
    })
    .catch(() => ({ status: "unavailable" }) as WeatherApiResponse)
    .then((result) => {
      resolved.set(key, result);
      inflight.delete(key);
      return result;
    });

  inflight.set(key, request);
  return request;
}

function WeatherCopy({ weather }: { weather: NormalizedGameWeather }) {
  const rain =
    weather.precipitationProbability === null
      ? null
      : `${weather.precipitationProbability}% chance of rain`;
  const wind =
    weather.windSpeedMph === null ? null : `Wind ${weather.windSpeedMph} mph`;

  return (
    <span className="sr-only">
      {weather.temperatureF} degrees Fahrenheit, {weather.conditionLabel}
      {rain ? `, ${rain}` : ""}
      {wind ? `, ${wind}` : ""}
    </span>
  );
}

function getStaticStatus(
  game: GameWeatherProps["game"],
  latitude: number | null,
  longitude: number | null,
): WeatherApiStatus | "fetch" {
  if (game.status === "canceled" || game.status === "final") return "hidden";
  if (latitude === null || longitude === null) return "missing_coords";

  const eligibility = evaluateWeatherEligibility({
    latitude,
    longitude,
    date: game.date,
    time: game.time,
  });

  return eligibility === "ok" ? "fetch" : eligibility;
}

export function GameWeather({
  game,
  variant = "compact",
  className = "",
}: GameWeatherProps) {
  const venue = resolveGameVenue(game.venueName);
  const latitude = venueHasCoordinates(venue) ? venue.latitude : null;
  const longitude = venueHasCoordinates(venue) ? venue.longitude : null;
  const staticStatus = getStaticStatus(game, latitude, longitude);

  const [fetched, setFetched] = useState<WeatherApiResponse | null>(null);

  useEffect(() => {
    if (staticStatus !== "fetch" || latitude === null || longitude === null) {
      return;
    }

    let cancelled = false;
    loadWeather(latitude, longitude, game.date, game.time).then((response) => {
      if (!cancelled) setFetched(response);
    });

    return () => {
      cancelled = true;
    };
  }, [staticStatus, latitude, longitude, game.date, game.time]);

  if (staticStatus !== "fetch") {
    return null;
  }

  if (!fetched) {
    return (
      <div className={`min-h-5 text-xs text-transparent ${className}`} aria-hidden>
        Loading weather
      </div>
    );
  }

  if (fetched.status !== "ok" || !fetched.weather) {
    if (fetched.status === "unavailable") {
      return (
        <p className={`text-xs text-[#6b716e] ${className}`}>
          Forecast temporarily unavailable
        </p>
      );
    }
    return null;
  }

  const weather = fetched.weather;
  const Icon = mapWeatherCode(weather.weatherCode).icon;

  if (variant === "detailed") {
    return (
      <div className={className}>
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#075C35]">
          Game-Time Weather
        </p>
        <div className="mt-2 flex items-start gap-2 text-[#090A0A]">
          <Icon size={18} className="mt-0.5 text-[#075C35]" aria-hidden />
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl leading-none">
              {weather.temperatureF}°F
              <span className="ml-2 text-base font-normal text-[#313a36]">
                · {weather.conditionLabel}
              </span>
            </p>
            <p className="mt-2 text-sm text-[#4f5854]">
              {weather.precipitationProbability === null
                ? "Precipitation chance unavailable"
                : `${weather.precipitationProbability}% chance of rain`}
            </p>
            <p className="text-sm text-[#4f5854]">
              {weather.windSpeedMph === null
                ? "Wind unavailable"
                : `Wind ${weather.windSpeedMph} mph`}
            </p>
          </div>
        </div>
        <WeatherCopy weather={weather} />
      </div>
    );
  }

  return (
    <p className={`inline-flex items-center gap-1.5 text-sm text-[#4f5854] ${className}`}>
      <Icon size={15} className="text-[#075C35]" aria-hidden />
      <span>
        {weather.temperatureF}°F · {weather.conditionLabel}
        {weather.precipitationProbability !== null
          ? ` · Rain ${weather.precipitationProbability}%`
          : ""}
        {weather.windSpeedMph !== null ? ` · Wind ${weather.windSpeedMph} mph` : ""}
      </span>
      <WeatherCopy weather={weather} />
    </p>
  );
}
