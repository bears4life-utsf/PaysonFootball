import { NextRequest, NextResponse } from "next/server";

import {
  fetchOpenMeteoGameWeather,
  type WeatherApiResponse,
} from "@/lib/weather";

export const revalidate = 1800;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lon"));
  const date = searchParams.get("date") ?? "";
  const time = searchParams.get("time") ?? "";

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return badRequest("Valid lat and lon are required.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return badRequest("Valid date (YYYY-MM-DD) is required.");
  }
  if (!time.trim()) {
    return badRequest("Kickoff time is required.");
  }

  try {
    const result: WeatherApiResponse = await fetchOpenMeteoGameWeather({
      latitude,
      longitude,
      date,
      time,
    });
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { status: "unavailable" } satisfies WeatherApiResponse,
      { status: 200 },
    );
  }
}
