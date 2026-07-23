/**
 * Centralized HEALER SESSION engine.
 *
 * Third independent system, fully separate from:
 *   • Commerce  (`src/lib/pricing.ts`)   — physical products only
 *   • Experience (`src/lib/access.ts`)   — in-app content unlocks
 *
 * Healer sessions are 1:1 bookings with a human practitioner.
 * They are NOT products (no angel-number discounts) and NOT content
 * (no tier gating). Do not import from pricing.ts or access.ts here,
 * and do not import this file from those engines.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  PRICING RULES
 * ─────────────────────────────────────────────────────────────────────
 *  • Standard hourly rate MUST be within $33–$55/hr.
 *  • Absolute ceiling: $99/hr (never exceed, for any session or package).
 *  • Multi-session packages MAY offer a per-session discount, but the
 *    effective per-hour rate must still respect the $99 cap and cannot
 *    fall below a sane floor ($11/hr) to prevent abuse in the other
 *    direction.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  USER CONTROL RULES
 * ─────────────────────────────────────────────────────────────────────
 *  • Users can pause a package at any time.
 *  • Users can cancel remaining sessions at any time.
 *  • No forced continuation, no lock-in, no auto-renew.
 *  • Remaining sessions must always be visible to the user.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  PLATFORM SAFETY RULES
 * ─────────────────────────────────────────────────────────────────────
 *  • All bookings and payments happen inside the app.
 *  • Healers may not redirect users off-platform or advertise
 *    external pricing / side deals. Message/bio content is scanned
 *    for contact handoffs and blocked.
 */

// ── Pricing ─────────────────────────────────────────────────────────

export const HEALER_RATE = {
  /** Minimum standard hourly rate (USD). */
  standardMin: 33,
  /** Maximum standard hourly rate (USD). */
  standardMax: 55,
  /** Absolute ceiling — nothing on the platform may exceed this. */
  absoluteMax: 99,
  /** Floor used for package math to prevent nonsensical values. */
  floor: 11,
} as const;

export type HealerRateValidation =
  | { ok: true }
  | { ok: false; reason: string; code: "below_min" | "above_standard" | "above_ceiling" | "invalid" };

/** Validate a healer's advertised standard hourly rate. */
export function validateHourlyRate(rate: number): HealerRateValidation {
  if (!Number.isFinite(rate) || rate <= 0) {
    return { ok: false, code: "invalid", reason: "Rate must be a positive number." };
  }
  if (rate < HEALER_RATE.standardMin) {
    return {
      ok: false,
      code: "below_min",
      reason: `Standard sessions must be at least $${HEALER_RATE.standardMin}/hr.`,
    };
  }
  if (rate > HEALER_RATE.absoluteMax) {
    return {
      ok: false,
      code: "above_ceiling",
      reason: `Rate cannot exceed the platform ceiling of $${HEALER_RATE.absoluteMax}/hr.`,
    };
  }
  if (rate > HEALER_RATE.standardMax) {
    return {
      ok: false,
      code: "above_standard",
      reason: `Standard rate must be within $${HEALER_RATE.standardMin}–$${HEALER_RATE.standardMax}/hr.`,
    };
  }
  return { ok: true };
}

/** Clamp any incoming rate to the legal standard window. */
export function clampToStandardRate(rate: number): number {
  if (!Number.isFinite(rate)) return HEALER_RATE.standardMin;
  return Math.min(HEALER_RATE.standardMax, Math.max(HEALER_RATE.standardMin, Math.round(rate)));
}

// ── Packages ────────────────────────────────────────────────────────

export interface HealerPackage {
  /** Number of 1-hour sessions in the package. */
  sessions: number;
  /** Discount applied to the per-session price, 0–0.30 (max 30%). */
  perSessionDiscount?: number;
  /** Healer's standard hourly rate. */
  hourlyRate: number;
}

export interface PackageQuote {
  sessions: number;
  effectiveHourlyRate: number;
  perSessionPrice: number;
  totalPrice: number;
  discountApplied: number;
}

/** Compute a package quote while enforcing all pricing rules. */
export function quotePackage(pkg: HealerPackage): PackageQuote {
  const clampedRate = clampToStandardRate(pkg.hourlyRate);
  const discount = Math.min(0.3, Math.max(0, pkg.perSessionDiscount ?? 0));
  const sessions = Math.max(1, Math.floor(pkg.sessions));

  let effective = clampedRate * (1 - discount);
  // Never below floor, never above absolute ceiling (paranoia guard).
  effective = Math.min(HEALER_RATE.absoluteMax, Math.max(HEALER_RATE.floor, effective));

  const perSessionPrice = Math.round(effective * 100) / 100;
  const totalPrice = Math.round(perSessionPrice * sessions * 100) / 100;

  return {
    sessions,
    effectiveHourlyRate: perSessionPrice,
    perSessionPrice,
    totalPrice,
    discountApplied: discount,
  };
}

// ── User-controlled booking state ───────────────────────────────────

export type BookingStatus = "active" | "paused" | "cancelled" | "completed";

export interface HealerBooking {
  id: string;
  healerId: string;
  userId: string;
  totalSessions: number;
  sessionsUsed: number;
  status: BookingStatus;
}

export function remainingSessions(b: Pick<HealerBooking, "totalSessions" | "sessionsUsed">): number {
  return Math.max(0, b.totalSessions - b.sessionsUsed);
}

/** Users can pause any active booking at any time. Never blocked. */
export function pauseBooking(b: HealerBooking): HealerBooking {
  if (b.status === "cancelled" || b.status === "completed") return b;
  return { ...b, status: "paused" };
}

/** Users can resume a paused booking at any time. */
export function resumeBooking(b: HealerBooking): HealerBooking {
  if (b.status !== "paused") return b;
  return { ...b, status: "active" };
}

/**
 * Users can cancel remaining sessions at any time — no lock-in.
 * Returns the updated booking; refund logic lives in the payment layer.
 */
export function cancelBooking(b: HealerBooking): HealerBooking {
  return { ...b, status: "cancelled" };
}

// ── Platform safety: off-platform redirect detection ────────────────

/**
 * Scan healer-authored text (bio, messages, package descriptions) for
 * attempts to move users off-platform or advertise external pricing.
 * Returns the list of violations found; empty array = safe to publish.
 */
export function detectOffPlatformHandoff(text: string): string[] {
  if (!text) return [];
  const violations: string[] = [];
  const t = text.toLowerCase();

  const patterns: Array<{ re: RegExp; label: string }> = [
    { re: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, label: "phone number" },
    { re: /[\w.+-]+@[\w-]+\.[\w.-]+/, label: "email address" },
    { re: /\b(venmo|cashapp|cash app|zelle|paypal|patreon|onlyfans|stripe\.me)\b/, label: "external payment handle" },
    { re: /\b(whatsapp|telegram|signal|wechat|discord|instagram|ig\b|snapchat|tiktok)\b/, label: "external messaging platform" },
    { re: /\b(dm me|text me|call me|email me|reach me at|off[- ]?platform|off[- ]?app)\b/, label: "off-platform contact request" },
    { re: /https?:\/\//, label: "external URL" },
    { re: /\bpay(?:\s+me)?\s+directly\b|\bcash only\b|\bside deal\b/, label: "external pricing / side deal" },
  ];

  for (const { re, label } of patterns) {
    if (re.test(t)) violations.push(label);
  }
  return violations;
}

/** True when the text is safe to display / publish on-platform. */
export function isOnPlatformSafe(text: string): boolean {
  return detectOffPlatformHandoff(text).length === 0;
}
