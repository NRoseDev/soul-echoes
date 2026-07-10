export const chakraColorMap = {
  root: {
    name: "Root",
    colors: ["#FF0000", "#B30000"],
    gifts: ["protection", "grounding", "survival", "strength", "courage"],
  },
  sacral: {
    name: "Sacral",
    colors: ["#FF7A00", "#CC5F00"],
    gifts: ["creativity", "emotions", "relationships", "pleasure", "joy"],
  },
  solar_plexus: {
    name: "Solar Plexus",
    colors: ["#FFD500", "#CCAA00"],
    gifts: ["confidence", "purpose", "willpower", "empowerment"],
  },
  heart: {
    name: "Heart",
    colors: ["#00CC66", "#FFB7C5"],
    gifts: ["healing", "love", "compassion", "forgiveness"],
  },
  throat: {
    name: "Throat",
    colors: ["#3399FF", "#0066CC"],
    gifts: ["truth", "communication", "clarity", "guidance", "faith"],
  },
  third_eye: {
    name: "Third Eye",
    colors: ["#4B0082", "#2E0059"],
    gifts: ["intuition", "insight", "psychic", "prophecy", "wisdom"],
  },
  crown: {
    name: "Crown",
    colors: ["#9933FF", "#FFFFFF"],
    gifts: ["ascension", "divinity", "higher consciousness"],
  },
  soul_star: {
    name: "Soul Star",
    colors: ["#FFD700", "#FFFFFF"],
    gifts: ["mission", "destiny", "records", "higher self"],
  },
} as const;

export type ChakraKey = keyof typeof chakraColorMap;
