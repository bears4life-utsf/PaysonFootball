export type Venue = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  /** Required for Open-Meteo game-time weather. */
  latitude?: number;
  /** Required for Open-Meteo game-time weather. */
  longitude?: number;
};

/**
 * Shared venue registry so games reuse the same coordinates.
 * TODO: Add latitude/longitude for any new venue before weather can render.
 */
export const knownVenues: Venue[] = [
  {
    name: "Payson",
    address: "1050 S Main St",
    city: "Payson",
    state: "UT",
    zip: "84651",
    latitude: 40.0290558,
    longitude: -111.7347086,
  },
  {
    name: "Juab High School",
    address: "802 N 650 E",
    city: "Nephi",
    state: "UT",
    zip: "84648",
    latitude: 39.7204478,
    longitude: -111.8229274,
  },
  {
    name: "Maple Mountain High School",
    address: "51 N Spanish Fork Parkway",
    city: "Spanish Fork",
    state: "UT",
    zip: "84660",
    latitude: 40.1099075,
    longitude: -111.6149559,
  },
  {
    name: "Springville High School",
    address: "500 S Red Devil Drive",
    city: "Springville",
    state: "UT",
    zip: "84663",
    latitude: 40.1549741,
    longitude: -111.5883031,
  },
  {
    name: "Layton Christian Academy",
    address: "2352 E Highway 193",
    city: "Layton",
    state: "UT",
    zip: "84040",
    latitude: 41.1042895,
    longitude: -111.9218578,
  },
  {
    name: "Pleasant Grove High School",
    address: "700 E 200 S",
    city: "Pleasant Grove",
    state: "UT",
    zip: "84062",
    latitude: 40.3592141,
    longitude: -111.7252788,
  },
];

export function findVenueByName(name: string): Venue | undefined {
  const normalized = name.trim().toLowerCase();
  return knownVenues.find((venue) => venue.name.toLowerCase() === normalized);
}

export function resolveGameVenue(venueName: string): Venue | undefined {
  return findVenueByName(venueName);
}

export function venueHasCoordinates(
  venue: Venue | undefined,
): venue is Venue & { latitude: number; longitude: number } {
  return (
    !!venue &&
    typeof venue.latitude === "number" &&
    typeof venue.longitude === "number" &&
    Number.isFinite(venue.latitude) &&
    Number.isFinite(venue.longitude)
  );
}
