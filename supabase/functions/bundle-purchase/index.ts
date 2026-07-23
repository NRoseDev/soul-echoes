// Bundle purchase transaction split.
//
// Discount tiers are now sourced from the centralized rule-based system:
//   11%, 22%, 33%, 44% — highest valid tier wins.
// A "bundle" purchase by definition mixes product types, so tier = 44.
//
// User pays:      sellerAsking * (1 - tier/100)
// Seller receives: sellerAsking (full asking price — discount is subsidised)
// Platform kickback: sellerAsking * 0.05 (processing fee, not a discount)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BundleRequest {
  bundleId: string;
  bundleTitle: string;
  sellerId?: string;
  sellerAskingPrice: number; // full asking price in USD (dollars)
}

const ALLOWED_TIERS = [11, 22, 33, 44] as const;
const BUNDLE_TIER = 44; // bundles mix product types → highest tier
const PLATFORM_KICKBACK_RATE = 0.05;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as BundleRequest;
    const { bundleId, bundleTitle, sellerId, sellerAskingPrice } = body ?? {};

    if (
      !bundleId ||
      typeof sellerAskingPrice !== "number" ||
      sellerAskingPrice <= 0
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid bundle payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const tier = BUNDLE_TIER;
    const userCharge = round2(sellerAskingPrice * (1 - tier / 100));
    const sellerPayout = round2(sellerAskingPrice);
    const platformKickback = round2(sellerAskingPrice * PLATFORM_KICKBACK_RATE);

    const split = {
      bundleId,
      bundleTitle,
      sellerId: sellerId ?? null,
      currency: "USD",
      sellerAskingPrice: round2(sellerAskingPrice),
      userCharge,
      sellerPayout,
      platformKickback,
      discountTier: tier,
      allowedTiers: ALLOWED_TIERS,
      platformKickbackRate: PLATFORM_KICKBACK_RATE,
      recordedAt: new Date().toISOString(),
    };

    console.log("bundle-purchase split", split);

    return new Response(JSON.stringify({ ok: true, split }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("bundle-purchase error", err);
    return new Response(
      JSON.stringify({ error: "Could not process bundle purchase" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
