import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Hardcoded allowed redirect bases — do NOT trust the request Origin header.
const ALLOWED_REDIRECT_ORIGINS = [
  "https://soul-echoes-for-all.lovable.app",
  "https://id-preview--4ec12b64-4410-45eb-a733-9b97005a18d5.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];
const DEFAULT_REDIRECT_ORIGIN = "https://soul-echoes-for-all.lovable.app";

function resolveRedirectOrigin(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_REDIRECT_ORIGINS.includes(origin)) return origin;
  return DEFAULT_REDIRECT_ORIGIN;
}

const PRICE_MAP: Record<string, { amount: number; name: string }> = {
  individual_seed: { amount: 100, name: "Soul Echoes — Seed ($1/mo)" },
  individual_bloom: { amount: 300, name: "Soul Echoes — Bloom ($3/mo)" },
  individual_radiance: { amount: 500, name: "Soul Echoes — Radiance ($5/mo)" },
  individual_sanctuary: { amount: 700, name: "Soul Echoes — Sanctuary ($7/mo)" },
  individual_ultimate: { amount: 900, name: "Soul Echoes — Ultimate ($9/mo)" },
  pro_roots: { amount: 200, name: "Soul Echoes Pro — Roots ($2/mo)" },
  pro_growth: { amount: 400, name: "Soul Echoes Pro — Growth ($4/mo)" },
  pro_flourish: { amount: 600, name: "Soul Echoes Pro — Flourish ($6/mo)" },
  pro_abundance: { amount: 800, name: "Soul Echoes Pro — Abundance ($8/mo)" },
  pro_legacy: { amount: 1000, name: "Soul Echoes Pro — Legacy ($10/mo)" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AUTH: require a valid JWT ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const user = userData.user;

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const body = await req.json();
    const { priceId, energyExchange, donationAmount } = body;

    if (!priceId || typeof priceId !== "string" || !PRICE_MAP[priceId]) {
      return new Response(
        JSON.stringify({ error: "Invalid plan selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const donation = typeof donationAmount === "number" && donationAmount > 0
      ? Math.min(Math.round(donationAmount * 100), 1100)
      : 0;

    const tier = PRICE_MAP[priceId];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          recurring: { interval: "month" },
          product_data: {
            name: tier.name,
            description: energyExchange
              ? "Includes Energy Exchange Agreement 🙏"
              : "Funding Rise Up Healing nonprofit 💜",
          },
          unit_amount: tier.amount,
        },
        quantity: 1,
      },
    ];

    if (donation > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          recurring: { interval: "month" },
          product_data: {
            name: "Pay It Forward Donation 💚",
            description: "Monthly donation to fund healing for others",
          },
          unit_amount: donation,
        },
        quantity: 1,
      });
    }

    const origin = resolveRedirectOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      customer_email: user.email ?? undefined,
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        priceId,
        energyExchange: energyExchange ? "true" : "false",
        donationAmount: String(donation),
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(
      JSON.stringify({ error: "Could not create checkout session" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
