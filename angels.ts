export interface AngelProfile {
  id: string;
  name: string;
  description: string;
  gifts: string[];
}

export const angels: AngelProfile[] = [
  {
    id: "archangel_michael",
    name: "Archangel Michael",
    description:
      "Protector, warrior of light, and remover of fear. Supports courage, strength, and grounding.",
    gifts: ["protection", "courage", "strength", "truth"],
  },
  {
    id: "archangel_uriel",
    name: "Archangel Uriel",
    description:
      "Bringer of wisdom, clarity, and divine insight. Helps illuminate your path.",
    gifts: ["clarity", "wisdom", "insight", "guidance"],
  },
  {
    id: "archangel_azrael",
    name: "Archangel Azrael",
    description:
      "Angel of transition, comfort, and emotional release. Supports grounding and peace.",
    gifts: ["comfort", "release", "transition", "peace"],
  },
  {
    id: "archangel_gabriel",
    name: "Archangel Gabriel",
    description:
      "Messenger angel of communication, creativity, and divine expression.",
    gifts: ["communication", "creativity", "expression", "clarity"],
  },
  {
    id: "archangel_haniel",
    name: "Archangel Haniel",
    description:
      "Angel of emotional flow, intuition, and feminine energy.",
    gifts: ["intuition", "emotion", "flow", "grace"],
  },
  {
    id: "archangel_jophiel",
    name: "Archangel Jophiel",
    description:
      "Angel of beauty, joy, and positive thoughts. Helps uplift your energy.",
    gifts: ["joy", "beauty", "positivity", "confidence"],
  },
  {
    id: "archangel_ariel",
    name: "Archangel Ariel",
    description:
      "Angel of manifestation, nature, and personal power.",
    gifts: ["manifestation", "courage", "purpose", "empowerment"],
  },
  {
    id: "archangel_raphael",
    name: "Archangel Raphael",
    description:
      "Angel of healing, restoration, and heart expansion.",
    gifts: ["healing", "love", "compassion", "restoration"],
  },
  {
    id: "archangel_chamuel",
    name: "Archangel Chamuel",
    description:
      "Angel of unconditional love, relationships, and emotional harmony.",
    gifts: ["love", "peace", "compassion", "forgiveness"],
  },
  {
    id: "archangel_zadkiel",
    name: "Archangel Zadkiel",
    description:
      "Angel of mercy, forgiveness, and emotional transmutation.",
    gifts: ["forgiveness", "mercy", "clarity", "transmutation"],
  },
  {
    id: "archangel_raziel",
    name: "Archangel Raziel",
    description:
      "Keeper of divine mysteries, intuition, and psychic insight.",
    gifts: ["intuition", "psychic", "insight", "wisdom"],
  },
  {
    id: "archangel_metatron",
    name: "Archangel Metatron",
    description:
      "Angel of ascension, higher consciousness, and soul purpose.",
    gifts: ["ascension", "purpose", "records", "higher self"],
  },
  {
    id: "archangel_sandalphon",
    name: "Archangel Sandalphon",
    description:
      "Angel of divine connection, grounding, and spiritual music.",
    gifts: ["connection", "grounding", "music", "prayer"],
  },
  {
    id: "archangel_jeremiel",
    name: "Archangel Jeremiel",
    description:
      "Angel of life review, destiny, and soul reflection.",
    gifts: ["destiny", "reflection", "vision", "records"],
  },
];
