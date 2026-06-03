# In-Room Leveling System — Structure Proposal

Goal: add a progression-based **Level** structure inside each healing room. Payment tiers (frequency/feature access) stay **completely untouched**. Levels are about depth of content and unlock as the user completes the previous one.

## Concepts

- **Room** — existing 9 rooms (Journal, Breathe, Unspoken, Shadow Work, Wisdom, Spiritual Tools, Community, Practitioner Connect, Crisis Counselor).
- **Level** — an ordered chapter inside a room. `Level 1` foundational → `Level 2` builds on it → and so on.
- **Lesson / Section** — what lives inside a level (existing detail pages slot in here).
- **Completion** — a user marks a level complete (or auto-completes via finishing its lessons). The next level unlocks.
- All levels available to all payment tiers. Tiers only gate **how often** a user can enter a room — that logic is not touched.

## Data shape (placeholders, no real content yet)

Static config per room:
```ts
// src/config/roomLevels.ts
export type RoomLevel = {
  level: number;          // 1, 2, 3…
  title: string;          // "Foundations of Soul Ties"
  summary: string;        // 1–2 sentence teaser
  estMinutes?: number;
  lessons: { id: string; title: string }[]; // placeholders
};

export type RoomLevelTrack = {
  roomId: string;         // "shadow-work", "wisdom", etc.
  levels: RoomLevel[];
};

export const ROOM_LEVELS: Record<string, RoomLevelTrack> = {
  "shadow-work": { roomId: "shadow-work", levels: [
    { level: 1, title: "What Are Soul Ties", summary: "Foundation…", lessons: [{id:"st-intro",title:"Intro"}] },
    { level: 2, title: "Cord Cutting", summary: "Builds on Level 1…", lessons: [{id:"cc-intro",title:"Intro"}] },
    { level: 3, title: "Energetic Boundaries", summary: "Deeper…", lessons: [{id:"eb-intro",title:"Intro"}] },
  ]},
  // …Journal, Breathe, Unspoken, Wisdom, Tools, Community, Practitioner, Crisis — all stubbed
};
```

Every room gets 3 placeholder levels so the UI works end-to-end. Real content gets filled in later.

## Progress persistence (Lovable Cloud)

New table `room_level_progress` (separate from any tier/billing table):
```
id, user_id, room_id, level, status('locked'|'in_progress'|'completed'),
started_at, completed_at
```
RLS: user can only read/write their own rows. A `has_completed(user_id, room_id, level)` helper drives unlocking.

If the user prefers, I can start with **localStorage-only** progress first and migrate to the DB later — let me know.

## UI structure

1. **Room landing page** (e.g. `ShadowWorkRoom.tsx`) gets a new **Level Path** section above the existing content:
   ```
   ┌─ Level 1: What Are Soul Ties      ✓ completed   [Review]
   ├─ Level 2: Cord Cutting            ● in progress [Continue]
   ├─ Level 3: Energetic Boundaries    🔒 locked     (complete L2 to unlock)
   ```
2. **Level detail page** — new route `/<room>/level/:n` that renders the level's lessons (placeholder content for now) and a **Mark Level Complete** button.
3. Locked levels show a soft, encouraging message — not a paywall — making clear it's progression, not payment.

## Reusable pieces

- `<LevelPath roomId="…" />` — renders the list with lock/progress states.
- `<LevelGate roomId level>` — wraps level detail content, redirects/locks if prereq not done.
- `useRoomProgress(roomId)` hook — reads/writes progress.

## What this plan does NOT touch

- `Pricing.tsx`, tier definitions, frequency caps, paid feature gates — untouched.
- Existing room detail pages (`ShadowWorkDetail`, `WisdomDetail`, etc.) — they become Level 1 lessons; no rewrite.
- Brain Dump access (always free/unlimited) — untouched.

## Build order (after you approve)

1. Add `roomLevels.ts` config with 3 placeholder levels per room.
2. Add progress storage (DB table + RLS, or localStorage first — your call).
3. Build `<LevelPath>`, `<LevelGate>`, `useRoomProgress`.
4. Drop `<LevelPath>` into each room landing page.
5. Add `/<room>/level/:n` route with placeholder lesson shell + "Mark Complete".

## Questions before I build

- **Progress storage:** start with **Lovable Cloud DB** (syncs across devices) or **localStorage** (faster, no auth needed)?
- **Levels per room:** 3 placeholders each, or a different number for specific rooms?
- **Auto-complete vs manual:** auto-complete when all lessons in a level are viewed, or require explicit "Mark Complete"?
