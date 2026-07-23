import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Tier } from "@/lib/access";

/**
 * Returns the current user's Experience-system tier (1–4).
 *
 * This hook is the ONLY approved way for UI to read the user's tier for
 * content gating. It never mixes with commerce pricing.
 *
 * Current implementation: reads a lightweight `tier` value from
 * localStorage (set by the membership flow) and defaults to Tier 1.
 * When the backend membership table is wired up, swap the internals
 * here — every consumer keeps working unchanged.
 */
export function useUserTier(): Tier {
  const [tier, setTier] = useState<Tier>(1);

  useEffect(() => {
    let cancelled = false;

    const read = () => {
      try {
        const raw = localStorage.getItem("soul-echoes.user-tier");
        const n = raw ? parseInt(raw, 10) : 1;
        const clamped = (n >= 1 && n <= 4 ? n : 1) as Tier;
        if (!cancelled) setTier(clamped);
      } catch {
        if (!cancelled) setTier(1);
      }
    };

    read();

    // Re-read on auth changes so tier can refresh after sign-in.
    const { data: sub } = supabase.auth.onAuthStateChange(() => read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "soul-echoes.user-tier") read();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return tier;
}
