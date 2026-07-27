type GameWeatherProps = {
  temperatureF?: number;
  condition?: string;
};

/** Static placeholder structured for a future weather API. */
export function GameWeather({
  temperatureF = 72,
  condition = "Sunny",
}: GameWeatherProps) {
  return (
    <div
      className="rounded-md border border-[#C8CDD0] bg-white/80 px-4 py-3"
      data-weather-placeholder="true"
    >
      <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-[#5a6660]">
        Weather
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[#090A0A]">
        {temperatureF}°
      </p>
      <p className="text-sm text-[#4f5854]">{condition}</p>
    </div>
  );
}
