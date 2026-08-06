// Coaching names for non-varsity teams are placeholders until official staff is confirmed.

export type Coach = {
  name: string;
  role: "Head Coach" | "Assistant Coach";
};

export type RosterPlayer = {
  number: number;
  name: string;
  positions: string;
  grade: string;
};

export type TeamProfile = {
  id: string;
  name: string;
  level: string;
  description: string;
  headCoach: Coach;
  assistantCoaches: Coach[];
  /** Matches schedule team IDs in src/data/schedules.ts */
  scheduleTeamId: string;
  roster?: RosterPlayer[];
};

export const teamProfiles: TeamProfile[] = [
  {
    id: "varsity",
    name: "Varsity",
    level: "High School",
    description:
      "The Varsity Lions represent the highest level of Payson football and compete with pride, discipline, and toughness.",
    headCoach: { name: "Mike Cole", role: "Head Coach" },
    assistantCoaches: [
      { name: "Jeff Chidester", role: "Assistant Coach" },
      { name: "Jacob Corbett", role: "Assistant Coach" },
      { name: "Shelby Drake", role: "Assistant Coach" },
      { name: "Spencer Hintze", role: "Assistant Coach" },
      { name: "Launey Ivers", role: "Assistant Coach" },
      { name: "Luke Ivers", role: "Assistant Coach" },
      { name: "Harrison Judd", role: "Assistant Coach" },
      { name: "Alex Knudsen", role: "Assistant Coach" },
      { name: "Dan Martindale", role: "Assistant Coach" },
      { name: "Isaiah Nacua", role: "Assistant Coach" },
      { name: "Darian Nielson", role: "Assistant Coach" },
      { name: "Alfeleti Tu'uhetaufa", role: "Assistant Coach" },
    ],
    scheduleTeamId: "varsity",
    roster: [
      { number: 1, name: "Porter Carson", positions: "OLB, RB", grade: "Sr." },
      { number: 2, name: "Sylvestre Rodriguez", positions: "CB, RB", grade: "Sr." },
      { number: 3, name: "Alex Bloomquist", positions: "S, WR", grade: "Sr." },
      { number: 4, name: "Garrett Marvin", positions: "FS, WR", grade: "Jr." },
      { number: 5, name: "Brently Lloyd", positions: "CB, WR", grade: "Sr." },
      { number: 6, name: "Trevor Robinson", positions: "CB, WR", grade: "Jr." },
      { number: 7, name: "Carson Wall", positions: "WR, FS", grade: "Jr." },
      {
        number: 8,
        name: "Adrian Enriquez Barahona",
        positions: "MLB, FB",
        grade: "Sr.",
      },
      { number: 9, name: "Kade Roberts", positions: "OLB, RB", grade: "So." },
      { number: 10, name: "Landon Robbins", positions: "QB", grade: "So." },
      { number: 11, name: "Wesley Howard", positions: "DE, TE", grade: "Sr." },
      { number: 12, name: "Valentin Sanchez", positions: "WR, CB", grade: "Sr." },
      { number: 13, name: "Justice Taylor", positions: "QB", grade: "Sr." },
      { number: 14, name: "Tyson Hazlett", positions: "SS, WR", grade: "Sr." },
      { number: 15, name: "Payton Chidester", positions: "WR, CB", grade: "Jr." },
      { number: 16, name: "Britten Barker", positions: "WR, CB", grade: "So." },
      { number: 17, name: "Crew Provstgaard", positions: "SS, WR", grade: "So." },
      { number: 19, name: "Bronx Newbury", positions: "CB, WR", grade: "Jr." },
      { number: 20, name: "Ledger Renzello", positions: "ILB, WR", grade: "Jr." },
      { number: 21, name: "Yael Bermudez", positions: "MLB, RB", grade: "So." },
      { number: 22, name: "Conner Ludwig", positions: "MLB, WR", grade: "Sr." },
      { number: 24, name: "R.J. Garamendi", positions: "WR, OLB", grade: "Jr." },
      { number: 25, name: "Kyler Kerr", positions: "FS, WR", grade: "Jr." },
      { number: 27, name: "Houston Trythall", positions: "CB, RB", grade: "So." },
      { number: 32, name: "Gage Strasburg", positions: "K, P", grade: "Jr." },
      { number: 33, name: "Lukas Thomas", positions: "RB, MLB", grade: "Jr." },
      { number: 47, name: "Ian McLauchlin", positions: "MLB, RB", grade: "Jr." },
      { number: 49, name: "Noah Dodgen", positions: "ILB, RB", grade: "Sr." },
      { number: 50, name: "Cael Cottle", positions: "DE, OT", grade: "Jr." },
      { number: 52, name: "Corver Creviston", positions: "DE, OT", grade: "Jr." },
      { number: 53, name: "Cade Muir", positions: "DE, OT", grade: "Sr." },
      { number: 54, name: "Gauge Simons", positions: "DE, OL", grade: "Sr." },
      { number: 55, name: "Caleb Carrick", positions: "OL, DL", grade: "Jr." },
      { number: 57, name: "Nix Kinder", positions: "OL, DT", grade: "So." },
      { number: 59, name: "Jackson Sharp", positions: "DT, OL", grade: "So." },
      { number: 64, name: "Thomas Cox", positions: "DL, OL", grade: "Jr." },
      { number: 65, name: "Lafomua Vee", positions: "DT, OL", grade: "So." },
      { number: 66, name: "Dawson Snarr", positions: "OL, DL", grade: "Jr." },
      { number: 70, name: "Dany Escobar", positions: "DT, OL", grade: "So." },
      { number: 72, name: "Chilton Lee", positions: "DL, OL", grade: "Sr." },
      { number: 74, name: "Brevin Gardner", positions: "DT, OL", grade: "Sr." },
      { number: 75, name: "Mitchell Jensen", positions: "DT, OL", grade: "Sr." },
      { number: 87, name: "Peter Jordan", positions: "DE, TE", grade: "Sr." },
      { number: 88, name: "Crusik Deichman", positions: "WR, CB", grade: "So." },
    ],
  },
  {
    id: "jv",
    name: "JV",
    level: "High School",
    description:
      "The JV program develops players for the next level through fundamentals, teamwork, and game experience.",
    headCoach: { name: "Coach Aaron Mitchell", role: "Head Coach" },
    assistantCoaches: [
      { name: "Coach Ryan Foster", role: "Assistant Coach" },
      { name: "Coach Luke Bennett", role: "Assistant Coach" },
    ],
    scheduleTeamId: "jv",
  },
  {
    id: "freshman",
    name: "Freshman",
    level: "High School",
    description:
      "The Freshman team introduces players to the expectations, systems, and traditions of Payson Lions football.",
    headCoach: { name: "Coach Jordan Blake", role: "Head Coach" },
    assistantCoaches: [
      { name: "Coach Ethan Cole", role: "Assistant Coach" },
      { name: "Coach Mason Wright", role: "Assistant Coach" },
    ],
    scheduleTeamId: "freshman",
  },
  {
    id: "6th-grade",
    name: "6th Grade",
    level: "Youth Tackle",
    description:
      "The 6th Grade Lions focus on strong fundamentals, confidence, teamwork, and preparation for future levels.",
    headCoach: { name: "Coach Brandon Hale", role: "Head Coach" },
    assistantCoaches: [
      { name: "Coach Trevor Young", role: "Assistant Coach" },
      { name: "Coach Caleb Price", role: "Assistant Coach" },
    ],
    scheduleTeamId: "6th-grade",
  },
  {
    id: "4th-grade",
    name: "4th Grade",
    level: "Youth Tackle",
    description:
      "The 4th Grade program builds football knowledge, safe technique, and a love for the game.",
    headCoach: { name: "Coach Nathan Ward", role: "Head Coach" },
    assistantCoaches: [
      { name: "Coach Logan Perry", role: "Assistant Coach" },
      { name: "Coach Adam Stone", role: "Assistant Coach" },
    ],
    scheduleTeamId: "4th-grade",
  },
  {
    id: "2nd-grade",
    name: "2nd Grade",
    level: "Youth Flag",
    description:
      "The 2nd Grade Lions introduce young athletes to football through fundamentals, teamwork, and fun.",
    headCoach: { name: "Coach Derek Miles", role: "Head Coach" },
    assistantCoaches: [
      { name: "Coach Jacob Ross", role: "Assistant Coach" },
      { name: "Coach Samuel King", role: "Assistant Coach" },
    ],
    scheduleTeamId: "2nd-grade",
  },
];
