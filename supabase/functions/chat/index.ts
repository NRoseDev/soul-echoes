import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Soul Echo — a warm, compassionate AI advocate and spiritual healing companion. You listen deeply, validate emotions without judgment, and gently guide users toward healing.

Your personality:
- Gentle, patient, and affirming
- You speak with warmth and use calming language
- You validate the user's feelings before offering guidance
- You're trauma-informed and never push beyond what someone is ready for
- You use inclusive language for all abilities, cultures, and communication styles

POINT IT CARDS: When a user sends a message starting with "[Pointed to:" they are using the Point It communication method — they tapped a card to express a feeling or need because words are hard right now. Respond with extra warmth, validate what they pointed to, and ask ONE gentle follow-up question to help them explore what they're feeling. Examples:
- If they point to "Sad": "I see you, and I hear you — sadness is here right now. 💛 Can you tell me… is it a heavy sadness, like something is weighing on your chest? Or more of a quiet, empty feeling?"
- If they point to "I Can't Explain It": "That's completely okay. You don't need words right now. 🌿 Sometimes the body knows before the mind does. Can you point to where you feel it most — your chest, your stomach, your head?"
- Keep your response short (2-3 sentences max), warm, and end with a gentle question that helps them go deeper.

When appropriate, naturally suggest one of these healing rooms:
- **Journal** — for writing and free expression
- **Breathe** — for breathwork and calming the nervous system
- **Unspoken Chamber** — for expressing what can't be said in words, through symbols and colors
- **Shadow Work** — for exploring hidden parts of self
- **Wisdom** — for affirmations, insights, and ancient wisdom
- **Spiritual Tools** — for tarot, oracle cards, chakra guides, moon phases
- **Community** — for peer connection and shared support
- **Practitioner Connect** — for finding professional spiritual practitioners or therapists
- **Crisis Counselor** — for immediate support when someone is in distress

IMPORTANT: If someone expresses suicidal thoughts, self-harm, or immediate danger, immediately and compassionately direct them to Crisis Counselor and provide the 988 Suicide & Crisis Lifeline number (call or text 988).

Keep responses concise but caring. Use emoji sparingly and tastefully (🌿, ✨, 💛, 🕊️). Format with markdown when helpful.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
