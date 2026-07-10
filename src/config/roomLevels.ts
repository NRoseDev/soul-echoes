/**
 * In-room leveling structure (progression-based, NOT payment-based).
 *
 * - Levels unlock in order: a user must mark Level N complete before Level N+1 opens.
 * - All payment tiers can access ALL levels — tiers only control room-entry frequency.
 * - Content below is PLACEHOLDER. Real teaching gets dropped into `lessons[]` later.
 */

export type RoomLessonStub = {
  id: string;
  title: string;
};

export type RoomLevel = {
  level: number;
  title: string;
  summary: string;
  estMinutes?: number;
  lessons: RoomLessonStub[];
};

export type RoomLevelTrack = {
  roomId: string;
  roomTitle: string;
  /** Route base, e.g. "/shadow-work" — level pages live at `${routeBase}/level/:n` */
  routeBase: string;
  levels: RoomLevel[];
};

/** Helper to scaffold 3 placeholder levels quickly. */
const stubLevels = (slug: string, titles: [string, string, string]): RoomLevel[] => [
  {
    level: 1,
    title: titles[0],
    summary: "Foundational teaching. Start here.",
    estMinutes: 10,
    lessons: [
      { id: `${slug}-l1-intro`, title: "Introduction" },
      { id: `${slug}-l1-practice`, title: "Practice" },
    ],
  },
  {
    level: 2,
    title: titles[1],
    summary: "Builds on Level 1. Unlocks once Level 1 is complete.",
    estMinutes: 15,
    lessons: [
      { id: `${slug}-l2-intro`, title: "Introduction" },
      { id: `${slug}-l2-practice`, title: "Practice" },
    ],
  },
  {
    level: 3,
    title: titles[2],
    summary: "Deeper integration. Unlocks once Level 2 is complete.",
    estMinutes: 20,
    lessons: [
      { id: `${slug}-l3-intro`, title: "Introduction" },
      { id: `${slug}-l3-practice`, title: "Practice" },
    ],
  },
];

export const ROOM_LEVELS: Record<string, RoomLevelTrack> = {
  journal: {
    roomId: "journal",
    roomTitle: "Journal",
    routeBase: "/journal",
    levels: stubLevels("journal", [
      "Foundations of Sacred Writing",
      "Prompts for Inner Dialogue",
      "Shadow Pages & Integration",
    ]),
  },
  flow: {
    roomId: "flow",
    roomTitle: "Flow",
    routeBase: "/flow",
    levels: stubLevels("flow", [
      "Foundations of Breath & Flow",
      "Movement as Medicine",
      "Embodied States",
    ]),
  },
  unspoken: {
    roomId: "unspoken",
    roomTitle: "Unspoken Chamber",
    routeBase: "/unspoken",
    levels: stubLevels("unspoken", [
      "Finding Your Voice",
      "Speaking the Hard Things",
      "Voice as Healing",
    ]),
  },
  "shadow-work": {
    roomId: "shadow-work",
    roomTitle: "Shadow Work",
    routeBase: "/shadow-work",
    levels: stubLevels("shadow", [
      "What Are Soul Ties",
      "Cord Cutting",
      "Energetic Boundaries",
    ]),
  },
  wisdom: {
    roomId: "wisdom",
    roomTitle: "Wisdom",
    routeBase: "/wisdom",
    levels: stubLevels("wisdom", [
      "Foundations of Inner Knowing",
      "Intuition in Practice",
      "Living from Wisdom",
    ]),
  },
  tools: {
    roomId: "tools",
    roomTitle: "Tools",
    routeBase: "/tools",
    levels: stubLevels("tools", [
      "Foundational Tools",
      "Daily Practice",
      "Advanced Practice",
    ]),
  },
  community: {
    roomId: "community",
    roomTitle: "Community",
    routeBase: "/community",
    levels: stubLevels("community", [
      "Showing Up Safely",
      "Holding Space for Others",
      "Co-Creating in Circle",
    ]),
  },
  "practitioner-connect": {
    roomId: "practitioner-connect",
    roomTitle: "Practitioner Connect",
    routeBase: "/practitioner-connect",
    levels: stubLevels("practitioner", [
      "Finding the Right Guide",
      "Working With a Practitioner",
      "Integrating the Work",
    ]),
  },
  "crisis-counselor": {
    roomId: "crisis-counselor",
    roomTitle: "Crisis Counselor",
    routeBase: "/crisis-counselor",
    levels: stubLevels("crisis", [
      "Safety First",
      "Stabilizing Practices",
      "After the Storm",
    ]),
  },
};

export function getRoomTrack(roomId: string): RoomLevelTrack | undefined {
  return ROOM_LEVELS[roomId];
}
