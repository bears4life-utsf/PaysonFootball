export type HomeAway = "home" | "away";
export type GameStatus = "scheduled" | "final" | "postponed" | "canceled";

export type Venue = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type Game = {
  id: string;
  date: string;
  displayDate: string;
  time: string;
  opponent: string;
  homeAway: HomeAway;
  isRegionGame: boolean;
  venueName: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  status: GameStatus;
  score?: string;
  mapUrl?: string;
};

export type Team = {
  id: string;
  name: string;
  ageGroupLabel: string;
  seasonLabel: string;
  venues: Venue[];
  games: Game[];
};

export const teams: Team[] = [
  {
    id: "varsity",
    name: "Varsity",
    ageGroupLabel: "High School",
    seasonLabel: "2026",
    venues: [
      { name: "Payson", city: "Payson", state: "UT" },
      {
        name: "Juab High School",
        address: "802 N 650 E",
        city: "Nephi",
        state: "UT",
        zip: "84648",
      },
      {
        name: "Maple Mountain High School",
        address: "51 N Spanish Fork Parkway",
        city: "Spanish Fork",
        state: "UT",
        zip: "84660",
      },
      {
        name: "Springville High School",
        address: "500 S Red Devil Drive",
        city: "Springville",
        state: "UT",
        zip: "84663",
      },
      {
        name: "Layton Christian Academy",
        address: "2352 E Highway 193",
        city: "Layton",
        state: "UT",
        zip: "84040",
      },
      {
        name: "Pleasant Grove High School",
        address: "700 E 200 S",
        city: "Pleasant Grove",
        state: "UT",
        zip: "84062",
      },
    ],
    games: [
      {
        id: "v-1",
        date: "2026-08-14",
        displayDate: "Aug 14",
        time: "7:00 PM",
        opponent: "Mountain View",
        homeAway: "home",
        isRegionGame: false,
        venueName: "Payson",
        status: "scheduled",
      },
      {
        id: "v-2",
        date: "2026-08-21",
        displayDate: "Aug 21",
        time: "7:00 PM",
        opponent: "Juab",
        homeAway: "away",
        isRegionGame: false,
        venueName: "Juab High School",
        address: "802 N 650 E",
        city: "Nephi",
        state: "UT",
        zip: "84648",
        status: "scheduled",
      },
      {
        id: "v-3",
        date: "2026-08-28",
        displayDate: "Aug 28",
        time: "7:00 PM",
        opponent: "Kearns",
        homeAway: "home",
        isRegionGame: false,
        venueName: "Payson",
        status: "scheduled",
      },
      {
        id: "v-4",
        date: "2026-09-04",
        displayDate: "Sep 4",
        time: "7:00 PM",
        opponent: "Timpview",
        homeAway: "home",
        isRegionGame: true,
        venueName: "Payson",
        status: "scheduled",
      },
      {
        id: "v-5",
        date: "2026-09-11",
        displayDate: "Sep 11",
        time: "7:00 PM",
        opponent: "Maple Mountain",
        homeAway: "away",
        isRegionGame: true,
        venueName: "Maple Mountain High School",
        address: "51 N Spanish Fork Parkway",
        city: "Spanish Fork",
        state: "UT",
        zip: "84660",
        status: "scheduled",
      },
      {
        id: "v-6",
        date: "2026-09-18",
        displayDate: "Sep 18",
        time: "7:00 PM",
        opponent: "Springville",
        homeAway: "away",
        isRegionGame: true,
        venueName: "Springville High School",
        address: "500 S Red Devil Drive",
        city: "Springville",
        state: "UT",
        zip: "84663",
        status: "scheduled",
      },
      {
        id: "v-7",
        date: "2026-09-24",
        displayDate: "Sep 24",
        time: "7:00 PM",
        opponent: "Spanish Fork",
        homeAway: "home",
        isRegionGame: true,
        venueName: "Payson",
        status: "scheduled",
      },
      {
        id: "v-8",
        date: "2026-10-02",
        displayDate: "Oct 2",
        time: "TBA",
        opponent: "Layton Christian Academy",
        homeAway: "away",
        isRegionGame: false,
        venueName: "Layton Christian Academy",
        address: "2352 E Highway 193",
        city: "Layton",
        state: "UT",
        zip: "84040",
        status: "scheduled",
      },
      {
        id: "v-9",
        date: "2026-10-08",
        displayDate: "Oct 8",
        time: "7:00 PM",
        opponent: "Orem",
        homeAway: "home",
        isRegionGame: true,
        venueName: "Payson",
        status: "scheduled",
      },
      {
        id: "v-10",
        date: "2026-10-14",
        displayDate: "Oct 14",
        time: "7:00 PM",
        opponent: "Pleasant Grove",
        homeAway: "away",
        isRegionGame: true,
        venueName: "Pleasant Grove High School",
        address: "700 E 200 S",
        city: "Pleasant Grove",
        state: "UT",
        zip: "84062",
        status: "scheduled",
      },
    ],
  },
  {
    id: "jv",
    name: "JV",
    ageGroupLabel: "High School",
    seasonLabel: "2026",
    venues: [],
    games: [],
  },
  {
    id: "freshman",
    name: "Freshman",
    ageGroupLabel: "High School",
    seasonLabel: "2026",
    venues: [],
    games: [],
  },
  {
    id: "6th-grade",
    name: "6th Grade",
    ageGroupLabel: "Youth Tackle",
    seasonLabel: "2026",
    venues: [],
    games: [],
  },
  {
    id: "4th-grade",
    name: "4th Grade",
    ageGroupLabel: "Youth Tackle",
    seasonLabel: "2026",
    venues: [],
    games: [],
  },
  {
    id: "2nd-grade",
    name: "2nd Grade",
    ageGroupLabel: "Youth Flag",
    seasonLabel: "2026",
    venues: [],
    games: [],
  },
];
