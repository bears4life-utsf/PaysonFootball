import { MapPinned } from "lucide-react";

import type { AwayVenue } from "@/lib/schedule-utils";

type AwayVenueListProps = {
  venues: AwayVenue[];
};

export function AwayVenueList({ venues }: AwayVenueListProps) {
  if (venues.length === 0) return null;

  return (
    <section className="rounded-sm border border-[#C8CDD0] bg-white p-5 sm:p-6">
      <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
        Away Game Travel
      </h3>
      <p className="mt-2 text-sm text-[#4f5854]">
        Quick links for away-game venues and directions.
      </p>
      <ul className="mt-5 space-y-3">
        {venues.map((venue) => (
          <li key={`${venue.venueName}-${venue.fullAddress}`} className="border-t border-[#E5E7E7] pt-3 first:border-0 first:pt-0">
            <p className="font-semibold text-[#090A0A]">{venue.opponent}</p>
            <p className="text-sm text-[#313a36]">{venue.venueName}</p>
            <p className="text-sm text-[#4f5854]">{venue.fullAddress}</p>
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring mt-2 inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[#075C35] underline"
            >
              <MapPinned size={15} />
              Get Directions
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
