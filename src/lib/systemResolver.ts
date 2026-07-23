/**
 * SYSTEM RESOLVER — final enforcement layer.
 *
 * Only ONE system may apply to any given transaction. This module is the
 * single place that decides which one, and it NEVER stacks discounts
 * across systems.
 *
 * Priority (highest → lowest):
 *   1. Energy Exchange    — private agreement, no pricing logic at all
 *   2. Healer Sessions    — healerSessions.ts rules only
 *   3. Experience (Tier)  — content access only; may discount healer
 *                           sessions (never commerce)
 *   4. Commerce           — pricing.ts only; never touched by tier/healer
 *
 * This file is allowed to import from the three engines. The engines
 * themselves MUST NOT import each other or this resolver.
 */
import {
  quotePackage,
  type HealerPackage,
  type PackageQuote,
} from "./healerSessions";
import type { Tier } from "./access";
import {
  cartTotals,
  type PricingItem,
} from "./pricing";

// ── Session resolution ──────────────────────────────────────────────

export type SessionResolution =
  | {
      system: "energy-exchange";
      note: "Private agreement — no pricing logic applied.";
      totalPrice: 0;
      isPrivateAgreement: true;
    }
  | {
      system: "healer-sessions";
      quote: PackageQuote;
      tierDiscountApplied: 0 | 0.11 | 0.22 | 0.33;
      bundleDiscountApplied: number; // 0–0.44
      totalPrice: number;
    };

export interface SessionResolveInput {
  energyExchange: boolean;
  package: HealerPackage;
  /** User's Experience tier — only used to discount healer sessions. */
  userTier?: Tier | null;
}

/** Tier → healer-session discount. Tier 4 is content-only, no cash discount. */
function tierHealerDiscount(tier: Tier | null | undefined): 0 | 0.11 | 0.22 | 0.33 {
  switch (tier) {
    case 1:
      return 0.11;
    case 2:
      return 0.22;
    case 3:
      return 0.33;
    default:
      return 0;
  }
}

/**
 * Resolve a session booking to exactly one system with exactly one
 * effective price. No stacking across systems.
 */
export function resolveSession(input: SessionResolveInput): SessionResolution {
  // 1. Energy Exchange overrides everything.
  if (input.energyExchange) {
    return {
      system: "energy-exchange",
      note: "Private agreement — no pricing logic applied.",
      totalPrice: 0,
      isPrivateAgreement: true,
    };
  }

  // 2. Healer Sessions engine, with tier discount folded into the SAME
  //    engine call (never applied on top of a separate discount).
  const tierDisc = tierHealerDiscount(input.userTier);
  const bundleDisc = Math.min(0.44, Math.max(0, input.package.perSessionDiscount ?? 0));
  // Use the HIGHER of the two — never stack.
  const effectiveDiscount = Math.max(tierDisc, bundleDisc);

  const quote = quotePackage({
    ...input.package,
    perSessionDiscount: effectiveDiscount,
  });

  return {
    system: "healer-sessions",
    quote,
    tierDiscountApplied: tierDisc,
    bundleDiscountApplied: bundleDisc,
    totalPrice: quote.totalPrice,
  };
}

// ── Commerce resolution ─────────────────────────────────────────────

export interface CommerceResolution {
  system: "commerce";
  tier: number;
  retailTotal: number;
  memberTotal: number;
  savings: number;
}

/**
 * Commerce is fully isolated: tiers and healer logic MUST NOT influence
 * it. This wrapper exists so callers use the resolver uniformly.
 */
export function resolveCommerce(items: PricingItem[]): CommerceResolution {
  const totals = cartTotals(items);
  return { system: "commerce", ...totals };
}
