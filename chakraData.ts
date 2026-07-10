export interface ChakraProfile {
  id: string;
  name: string;
  shortName: string;
  theme: string;
  gifts: string[];
  keywords: string[];
  element: string;
  position: string;
}

export const chakraData: ChakraProfile[] = [
  {
    id: "root",
    name: "Root Chakra",
    shortName: "Root",
    theme: "Grounding, safety, stability",
    gifts: ["protection", "grounding", "strength"],
    keywords: [
      "root",
      "safety",
      "security",
      "grounding",
      "survival",
      "stability",
      "strength",
      "courage",
      "earth"
    ],
    element: "Earth",
    position: "Base of spine",
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    shortName: "Sacral",
    theme: "Creativity, emotions, flow",
    gifts: ["creativity", "emotions", "relationships"],
    keywords: [
      "sacral",
      "creativity",
      "emotion",
      "relationships",
      "pleasure",
      "joy",
      "water"
    ],
    element: "Water",
    position: "Below the navel",
  },
  {
    id: "solar_plexus",
    name: "Solar Plexus Chakra",
    shortName: "Solar Plexus",
    theme: "Confidence, purpose, empowerment",
    gifts: ["confidence", "purpose", "willpower"],
    keywords: [
      "solar plexus",
      "confidence",
      "purpose",
      "willpower",
      "empowerment",
      "fire"
    ],
    element: "Fire",
    position: "Upper abdomen",
  },
  {
    id: "heart",
    name: "Heart Chakra",
    shortName: "Heart",
    theme: "Healing, love, compassion",
    gifts: ["healing", "love", "compassion", "forgiveness"],
    keywords: [
      "heart",
      "healing",
      "love",
      "compassion",
      "forgiveness",
      "air"
    ],
    element: "Air",
    position: "Center of chest",
  },
  {
    id: "throat",
    name: "Throat Chakra",
    shortName: "Throat",
    theme: "Truth, communication, clarity",
    gifts: ["truth", "communication", "clarity"],
    keywords: [
      "throat",
      "truth",
      "communication",
      "clarity",
      "expression",
      "guidance",
      "sound"
    ],
    element: "Sound",
    position: "Throat",
  },
  {
    id: "third_eye",
    name: "Third Eye Chakra",
    shortName: "Third Eye",
    theme: "Intuition, insight, wisdom",
    gifts: ["intuition", "insight", "wisdom"],
    keywords: [
      "third eye",
      "intuition",
      "insight",
      "psychic",
      "vision",
      "prophecy",
      "light"
    ],
    element: "Light",
    position: "Center of forehead",
  },
  {
    id: "crown",
    name: "Crown Chakra",
    shortName: "Crown",
    theme: "Ascension, divinity, higher consciousness",
    gifts: ["ascension", "divinity", "higher consciousness"],
    keywords: [
      "crown",
      "ascension",
      "divinity",
      "higher consciousness",
      "spirit",
      "cosmic"
    ],
    element: "Cosmic",
    position: "Top of head",
  },
  {
    id: "soul_star",
    name: "Soul Star Chakra",
    shortName: "Soul Star",
    theme: "Mission, destiny, higher self",
    gifts: ["mission", "destiny", "records", "higher self"],
    keywords: [
      "soul star",
      "mission",
      "destiny",
      "akashic",
      "records",
      "higher self",
      "cosmic"
    ],
    element: "Cosmic",
    position: "Above the crown",
  },
];
