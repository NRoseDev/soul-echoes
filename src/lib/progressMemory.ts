/**
 * AI Guide — Progress Memory
 *
 * Persists the user's last active location (room, tool, session) and a
 * rolling activity trail. Restored on app open so the guide can offer to
 * return the user to where they left off. Never a dead end.
 *
 * Storage: localStorage (per-browser). Independent of commerce, tier,
 * and healer systems.
 */

const LOCATION_KEY = "soul-echoes.progress.location";
const TRAIL_KEY = "soul-echoes.progress.trail";
const TRAIL_MAX = 25;

export interface ProgressLocation {
  /** Route path, e.g. "/journal/daily-check-in". */
  path: string;
  /** Human-readable label shown to the user in the resume prompt. */
  label: string;
  /** Optional room / tool id for analytics + AI guide context. */
  roomId?: string;
  toolId?: string;
  sessionId?: string;
  updatedAt: number;
}

export interface ProgressEvent {
  path: string;
  label?: string;
  roomId?: string;
  toolId?: string;
  at: number;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export function saveLocation(loc: Omit<ProgressLocation, "updatedAt">): void {
  try {
    const payload: ProgressLocation = { ...loc, updatedAt: Date.now() };
    localStorage.setItem(LOCATION_KEY, JSON.stringify(payload));
    const trail = getTrail();
    trail.unshift({
      path: loc.path,
      label: loc.label,
      roomId: loc.roomId,
      toolId: loc.toolId,
      at: payload.updatedAt,
    });
    localStorage.setItem(
      TRAIL_KEY,
      JSON.stringify(trail.slice(0, TRAIL_MAX)),
    );
  } catch {
    /* localStorage unavailable — silently skip */
  }
}

export function getLastLocation(): ProgressLocation | null {
  if (typeof window === "undefined") return null;
  return safeParse<ProgressLocation>(localStorage.getItem(LOCATION_KEY));
}

export function getTrail(): ProgressEvent[] {
  if (typeof window === "undefined") return [];
  return safeParse<ProgressEvent[]>(localStorage.getItem(TRAIL_KEY)) ?? [];
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(LOCATION_KEY);
    localStorage.removeItem(TRAIL_KEY);
  } catch { /* noop */ }
}
