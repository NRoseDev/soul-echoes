/**
 * Centralized ACCESS CONTROL engine for the Experience system.
 *
 * Single source of truth for what app content (meditations, breathwork,
 * sound healing, guided journeys, advanced practices…) a user can unlock.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  HARD SEPARATION FROM COMMERCE
 * ─────────────────────────────────────────────────────────────────────
 *  • Digital / experiential content is NEVER sold as a product.
 *  • Product discounts (see `src/lib/pricing.ts`, 11/22/33/44) do NOT
 *    apply here and MUST NOT be referenced.
 *  • Physical products (see `src/lib/pricing.ts`) do NOT unlock content.
 *  • The two systems coexist but never share logic.
 *
 * Access is governed by the user's membership TIER (1 → 4).
 * Higher tiers unlock strictly more of the content library.
 */

export const TIERS = [1, 2, 3, 4] as const;
export type Tier = (typeof TIERS)[number];

/** Coarse content categories used by the Experience system. */
export type ContentCategory =
  | "meditation"
  | "breathwork"
  | "sound-healing"
  | "journal-prompt"
  | "shadow-work"
  | "wisdom"
  | "spiritual-tool"
  | "guided-journey"
  | "premium-practice";

/** Depth of a piece of content. Drives the minimum tier required. */
export type ContentLevel = "basic" | "expanded" | "full" | "premium";

/** Minimum tier required for each content level. */
const LEVEL_MIN_TIER: Record<ContentLevel, Tier> = {
  basic: 1,
  expanded: 2,
  full: 3,
  premium: 4,
};

/** Human-readable tier labels (shown in UI copy). */
export const TIER_LABEL: Record<Tier, string> = {
  1: "Tier 1 — Foundations",
  2: "Tier 2 — Expanded Library",
  3: "Tier 3 — Full Access",
  4: "Tier 4 — Premium & Advanced",
};

/** One-line summary of what each tier unlocks. */
export const TIER_SUMMARY: Record<Tier, string> = {
  1: "Limited / basic content — a soft entry into the practice.",
  2: "Expanded library across meditation, breathwork and journaling.",
  3: "Full access to most of the healing content library.",
  4: "Full access + premium and advanced practices.",
};

export interface ContentItem {
  id: string;
  category: ContentCategory;
  level: ContentLevel;
}

/**
 * Categories that are ALWAYS available at every tier, including Tier 1.
 * Journaling is baseline access — a user's own reflections and entries
 * are never gated behind a tier and must never be lost.
 */
export const ALWAYS_AVAILABLE_CATEGORIES: ReadonlySet<ContentCategory> =
  new Set<ContentCategory>(["journal-prompt"]);

/** Minimum tier required to unlock a specific piece of content. */
export function minTierFor(item: Pick<ContentItem, "level" | "category">): Tier {
  if (item.category && ALWAYS_AVAILABLE_CATEGORIES.has(item.category)) return 1;
  return LEVEL_MIN_TIER[item.level];
}

/** Does the given user tier unlock this content? */
export function canAccess(
  userTier: Tier | null | undefined,
  item: Pick<ContentItem, "level" | "category">,
): boolean {
  if (item.category && ALWAYS_AVAILABLE_CATEGORIES.has(item.category)) return true;
  if (!userTier) return item.level === "basic"; // logged-out / unknown → basic only
  return userTier >= minTierFor(item);
}


/** Filter a list of content items down to what the user can access. */
export function accessibleContent<T extends Pick<ContentItem, "level" | "category">>(
  userTier: Tier | null | undefined,
  items: T[],
): T[] {
  return items.filter((i) => canAccess(userTier, i));
}

/**
 * Explain — for UI copy — why an item is locked and which tier unlocks it.
 * Returns null when the item is already accessible.
 */
export function lockReason(
  userTier: Tier | null | undefined,
  item: Pick<ContentItem, "level" | "category">,
): { requiredTier: Tier; label: string } | null {
  if (canAccess(userTier, item)) return null;
  const req = minTierFor(item);
  return { requiredTier: req, label: TIER_LABEL[req] };
}

