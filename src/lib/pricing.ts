/**
 * Centralized pricing & discount engine.
 *
 * Single source of truth. Do NOT hardcode discount percentages
 * anywhere else in the app — import from here.
 *
 * Allowed discount tiers (the ONLY valid values):
 *   11%  — default for small items
 *   22%  — cart contains 3 or more small items
 *   33%  — cart contains a book or a premium single item
 *   44%  — cart contains a mix of product types (bundle)
 *
 * Rule: only one discount applies at a time. Always pick the
 * HIGHEST valid tier for the given cart.
 */

export const DISCOUNT_TIERS = [11, 22, 33, 44] as const;
export type DiscountTier = (typeof DISCOUNT_TIERS)[number];

export type PricingCategory = "books" | "crystals" | "oils" | "cleansing";
export type PricingKind = "individual" | "set";

export interface PricingItem {
  id: string;
  category: PricingCategory;
  kind: PricingKind;
  /** Retail price in dollars (pre-discount). */
  retailPrice: number;
  qty?: number;
}

/** A "small item" is an individual (non-set), non-book product. */
export function isSmallItem(item: Pick<PricingItem, "category" | "kind">): boolean {
  return item.kind === "individual" && item.category !== "books";
}

/** A "premium single item" is a curated set / bundle SKU, or a book. */
export function isPremiumOrBook(item: Pick<PricingItem, "category" | "kind">): boolean {
  return item.category === "books" || item.kind === "set";
}

/**
 * Item-level tier when the product is viewed in isolation (e.g. on a
 * product card before it's added to a cart).
 */
export function itemBaseTier(item: Pick<PricingItem, "category" | "kind">): DiscountTier {
  if (isPremiumOrBook(item)) return 33;
  return 11;
}

/**
 * Cart-level tier. Returns the HIGHEST valid tier for the cart.
 * Empty cart returns 11 (the floor).
 */
export function cartTier(items: PricingItem[]): DiscountTier {
  if (!items.length) return 11;

  const distinctCategories = new Set(items.map((i) => i.category)).size;
  const hasBookOrPremium = items.some(isPremiumOrBook);
  const smallCount = items.reduce(
    (n, i) => n + (isSmallItem(i) ? Math.max(1, i.qty ?? 1) : 0),
    0,
  );

  const candidates: DiscountTier[] = [11];
  if (smallCount >= 3) candidates.push(22);
  if (hasBookOrPremium) candidates.push(33);
  if (distinctCategories >= 2) candidates.push(44);

  return candidates.reduce((max, t) => (t > max ? t : max), 11 as DiscountTier);
}

/** Apply a tier to a retail price and return the discounted price (2 dp). */
export function applyTier(retailPrice: number, tier: DiscountTier): number {
  const raw = retailPrice * (1 - tier / 100);
  return Math.round(raw * 100) / 100;
}

/** Convenience: discounted price for a single item using its base tier. */
export function itemMemberPrice(item: PricingItem): number {
  return applyTier(item.retailPrice, itemBaseTier(item));
}

/** Convenience: totals for a cart at the cart-level tier. */
export function cartTotals(items: PricingItem[]) {
  const tier = cartTier(items);
  const retailTotal = items.reduce(
    (sum, i) => sum + i.retailPrice * Math.max(1, i.qty ?? 1),
    0,
  );
  const memberTotal = Math.round(retailTotal * (1 - tier / 100) * 100) / 100;
  return {
    tier,
    retailTotal: Math.round(retailTotal * 100) / 100,
    memberTotal,
    savings: Math.round((retailTotal - memberTotal) * 100) / 100,
  };
}
