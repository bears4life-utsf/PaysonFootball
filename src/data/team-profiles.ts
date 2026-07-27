// Placeholder coaching data — replace with official names later.

export type Coach = {
  name: string;
  role: "Head Coach" | "Assistant Coach";
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
};

export const teamProfiles: TeamProfile[] = [
  {
    id: "varsity",
    name: "Varsity",
    level: "High School",
    description:
      "The Varsity Lions represent the highest level of Payson football and compete with pride, discipline, and toughness.",
    headCoach: { name: "Coach Marcus Reed", role: "Head Coach" },
    assistantCoaches: [
      { name: "Coach Tyler Brooks", role: "Assistant Coach" },
      { name: "Coach Daniel Hayes", role: "Assistant Coach" },
      { name: "Coach Chris Morgan", role: "Assistant Coach" },
    ],
    scheduleTeamId: "varsity",
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
