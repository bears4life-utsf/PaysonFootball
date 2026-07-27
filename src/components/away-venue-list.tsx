import { MapPinned } from "lucide-react";

import type { AwayVenue } from "@/lib/schedule-utils";

type AwayVenueListProps = {
  venues: AwayVenue[];
};

export function AwayVenueList({ venues }: AwayVenueListProps) {
  if (venues.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-lg border border-[#C8CDD0] bg-white shadow-sm">
      <div className="border-b border-[#E5E7E7] px-5 py-4 sm:px-6">
        <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
          Away Game Travel
        </h3>
        <p className="mt-1 text-sm text-[#4f5854]">
          Quick links for away-game venues and directions.
        </p>
      </div>
      <ul className="divide-y divide-[#E5E7E7]">
        {venues.map((venue) => (
          <li key={`${venue.venueName}-${venue.fullAddress}`} className="px-5 py-4 sm:px-6">
            <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-[#090A0A]">
              {venue.opponent}
            </p>
            <p className="mt-0.5 text-sm font-medium text-[#313a36]">{venue.venueName}</p>
            <p className="text-sm text-[#4f5854]">{venue.fullAddress}</p>
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring mt-2 inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm font-bold text-[#075C35] underline-offset-2 transition hover:underline"
            >
              <MapPinned size={15} aria-hidden />
              Get Directions
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
