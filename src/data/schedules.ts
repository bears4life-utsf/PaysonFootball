export type Game = {
  date: string;
  time: string;
  home: string;
  away: string;
  location: string;
  note?: string;
};

export type AgeGroup = {
  id: string;
  name: string;
  ages: string;
  description: string;
  games: Game[];
};

/** Placeholder schedule data — replace with the official Payson season once available. */
export const ageGroups: AgeGroup[] = [
  {
    id: "flag",
    name: "Flag",
    ages: "Ages 5–6",
    description: "Non-contact flag football for the youngest players.",
    games: [],
  },
  {
    id: "pee-wee",
    name: "Pee Wee",
    ages: "Ages 7–8",
    description: "Introductory tackle football.",
    games: [],
  },
  {
    id: "junior-pee-wee",
    name: "Junior Pee Wee",
    ages: "Ages 9–10",
    description: "Developing fundamentals and game awareness.",
    games: [],
  },
  {
    id: "freshman",
    name: "Freshman",
    ages: "Ages 11–12",
    description: "Competitive tackle football for middle grades.",
    games: [],
  },
  {
    id: "junior",
    name: "Junior",
    ages: "Ages 13–14",
    description: "Advanced youth football preparing for high school.",
    games: [],
  },
];
