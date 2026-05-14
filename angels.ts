export interface AngelSpiritualTools {
  crystal: string;
  association: string;
  halo: string;
}

export interface AngelProfile {
  id: string;
  name: string;
  description: string;
  gifts: string[];
  ancestralConnections?: string[];
  spiritualTools?: AngelSpiritualTools;
}

export const angels: AngelProfile[] = [
  {
    id: "archangel_michael",
    name: "Archangel Michael",
    description:
      "Protector, warrior of light, and remover of fear. Supports courage, strength, and grounding.",
    gifts: ["protection", "courage", "strength", "truth"],
        ancestralConnections: [
      "Lineage Protector: Guarded the ancient patriarchs across generations.",
      "Defender of the Bloodline: Shields family lines from inherited or generational fear."
    ],
    spiritualTools: {
      crystal: "Sugilite",
      association: "Sephirah Chesed (Mercy/Loving-kindness)",
      halo: "Cobalt Blue"
    },
  },
  {
    id: "archangel_uriel",
    name: "Archangel Uriel",
    description:
      "Bringer of wisdom, clarity, and divine insight. Helps illuminate your path.",
    gifts: ["clarity", "wisdom", "insight", "guidance"],
        ancestralConnections: [
      "Illuminator of Ancestral Wisdom: Brought divine law and prophetic light to Noah and Enoch.",
      "Mindset Shifter: Clears confusion and intellectual blocks deeply rooted in family history."
    ],
    spiritualTools: {
      crystal: "Amber",
      association: "Sephirah Malkuth (The Kingdom/Earth)",
      halo: "Ruby and Gold"
    },
  },
  {
    id: "archangel_azrael",
    name: "Archangel Azrael",
    description:
      "Angel of transition, comfort, and emotional release. Supports grounding and peace.",
    gifts: ["comfort", "release", "transition", "peace"],
        ancestralConnections: [
      "Guide of Transitioned Ancestors: Ushers souls safely out of the earthly plane back to Source.",
      "Grief Comforter: Heals the lingering weight of unspoken or unresolved grief in your lineage."
    ],
    spiritualTools: {
      crystal: "Yellow Calcite",
      association: "The Void / Transition Realm",
      halo: "Cream and Vanilla"
    },
  },
  {
    id: "archangel_gabriel",
    name: "Archangel Gabriel",
    description:
      "Messenger angel of communication, creativity, and divine expression.",
    gifts: ["communication", "creativity", "expression", "clarity"],
        ancestralConnections: [
      "Lineage Messenger: Announced sacred births and divine callings to the ancestors.",
      "Keeper of the Divine Word: Preserves the original spiritual decrees of your bloodline."
    ],
    spiritualTools: {
      crystal: "Clear Quartz",
      association: "Sephirah Yesod (The Foundation)",
      halo: "Copper and Pure White"
    },
  },
  {
    id: "archangel_haniel",
    name: "Archangel Haniel",
    description:
      "Angel of emotional flow, intuition, and feminine energy.",
    gifts: ["intuition", "emotion", "flow", "grace"],
        ancestralConnections: [
      "Guardian of Intuitive Lineages: Aligned ancestral matriarchs with cosmic timing and natural rhythms.",
      "Awakener of Grace: Restores ancient spiritual gifts that were hidden or suppressed by ancestors."
    ],
    spiritualTools: {
      crystal: "Moonstone",
      association: "Sephirah Netzach (Victory/Endurance)",
      halo: "Bluish-White"
    },
  },
  {
    id: "archangel_jophiel",
    name: "Archangel Jophiel",
    description:
      "Angel of beauty, joy, and positive thoughts. Helps uplift your energy.",
    gifts: ["joy", "beauty", "positivity", "confidence"],
        ancestralConnections: [
      "Beautifier of the Soul's History: Clears ancestral mental clutter, heavy thoughts, and negativity.",
      "Restorer of Divine Perspective: Helps you see the beauty and lessons embedded in your family tree."
    ],
    spiritualTools: {
      crystal: "Rubellite",
      association: "Sephirah Chokhmah (Wisdom)",
      halo: "Deep Pink"
    },
  },
  {
    id: "archangel_ariel",
    name: "Archangel Ariel",
    description:
      "Angel of manifestation, nature, and personal power.",
    gifts: ["manifestation", "courage", "purpose", "empowerment"],
        ancestralConnections: [
      "Steward of Earthly Lineages: Supported ancestral survival through nature, harvest, and resources.",
      "Provider of Elements: Aligns your present life with the elemental grace your ancestors relied on."
    ],
    spiritualTools: {
      crystal: "Rose Quartz",
      association: "Nature and Elemental Realms",
      halo: "Pale Pink"
    },
  },
  {
    id: "archangel_raphael",
    name: "Archangel Raphael",
    description:
      "Angel of healing, restoration, and heart expansion.",
    gifts: ["healing", "love", "compassion", "restoration"],
        ancestralConnections: [
      "Lineage Healer: Restores the health, vitality, and energetic blueprints of family lines.",
      "Guardian of Generational Vitality: Mends historical vulnerabilities passed down the tree."
    ],
    spiritualTools: {
      crystal: "Emerald",
      association: "Sephirah Tiphereth (Beauty/Harmony)",
      halo: "Emerald Green"
    },
  },
  {
    id: "archangel_chamuel",
    name: "Archangel Chamuel",
    description:
      "Angel of unconditional love, relationships, and emotional harmony.",
    gifts: ["love", "peace", "compassion", "forgiveness"],
        ancestralConnections: [
      "Restorer of Family Bonds: Heals historical rifts, estrangements, and heartbreaks between ancestors.",
      "Heart Awakener: Reopens the capacity for love that may have been shut down in your lineage."
    ],
    spiritualTools: {
      crystal: "Fluorite",
      association: "Sephirah Gevurah (Strength/Severity)",
      halo: "Pale Green"
    },
  },
  {
    id: "archangel_zadkiel",
    name: "Archangel Zadkiel",
    description:
      "Angel of mercy, forgiveness, and emotional transmutation.",
    gifts: ["forgiveness", "mercy", "clarity", "transmutation"],
        ancestralConnections: [
      "Transmuter of Generational Guilt: Releases ancestral shame and blame using the violet flame.",
      "Lineage Liberator: Dissolves unforgiveness that has bound family members together for decades."
    ],
    spiritualTools: {
      crystal: "Amethyst",
      association: "Sephirah Chesed (Mercy/Loving-kindness)",
      halo: "Deep Violet"
    },
  },
  {
    id: "archangel_raziel",
    name: "Archangel Raziel",
    description:
      "Keeper of divine mysteries, intuition, and psychic insight.",
    gifts: ["intuition", "psychic", "insight", "wisdom"],
        ancestralConnections: [
      "Primordial Ancestor: Passed to Adam to find his way back to divine grace.",
      "Lineage of Wisdom: Guided Enoch, Noah, and King Solomon through generations.",
      "Bloodline Healing: Clears family karma, past-life traumas, and inherited soul vows."
    ],
    spiritualTools: {
      crystal: "Clear Quartz",
      association: "Sephirah Chokhmah (Wisdom)",
      halo: "Rainbow-hued spectrum of divine light"
    },

  },
  {
    id: "archangel_metatron",
    name: "Archangel Metatron",
    description:
      "Angel of ascension, higher consciousness, and soul purpose.",
    gifts: ["ascension", "purpose", "records", "higher self"],
        ancestralConnections: [
      "Scribe of the Lineage: Anchors sacred geometry and records the complete ascension history of your family.",
      "Ascension Guide: Uses Metatron's Cube to clear dense, lower-vibrational patterns out of your DNA."
    ],
    spiritualTools: {
      crystal: "Watermelon Tourmaline",
      association: "Sephirah Keter (The Crown)",
      halo: "Green and Pink"
    },
  },
  {
    id: "archangel_sandalphon",
    name: "Archangel Sandalphon",
    description:
      "Angel of divine connection, grounding, and spiritual music.",
    gifts: ["connection", "grounding", "music", "prayer"],
        ancestralConnections: [
      "Deliverer of Ancestral Prayers: Carries the silent cries and heart prayers of your entire lineage to Source.",
      "Harmonic Weaver: Intertwines the musical and prayerful legacy of your ancestors into your life."
    ],
    spiritualTools: {
      crystal: "Turquoise",
      association: "Sephirah Malkuth (The Kingdom/Earth)",
      halo: "Turquoise"
    },
  },
  {
    id: "archangel_jeremiel",
    name: "Archangel Jeremiel",
    description:
      "Angel of life review, destiny, and soul reflection.",
    gifts: ["destiny", "reflection", "vision", "records"],
        ancestralConnections: [
      "Reviewer of Lineage History: Conducts life reviews for souls and reveals the deeper meaning of family trials.",
      "Prophetic Visionary: Helps you look back at ancestral suffering to extract the gold and spiritual triumph."
    ],
    spiritualTools: {
      crystal: "Amethyst",
      association: "Soul Records and Reviews",
      halo: "Purple"
    },
  },
];
