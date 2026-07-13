// Bundle purchase transaction split.
// User pays: sellerAsking * 0.67  (hidden 33% platform-funded discount)
// Seller receives: sellerAsking (full asking price)
// Platform kickback: sellerAsking * 0.05 (5% processing fee tracked separately)
//
// Note: The 33% discount is subsidised by the platform / promotional budget.
// This function is the authoritative source of the split math and records the
// intent so downstream ledger / payout tooling has a trail.

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

const DISCOUNT_RATE = 0.33;
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

    const userCharge = round2(sellerAskingPrice * (1 - DISCOUNT_RATE));
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
      discountRate: DISCOUNT_RATE,
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
