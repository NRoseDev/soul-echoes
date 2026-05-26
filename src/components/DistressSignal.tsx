import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSafetySettings,
  saveSafetySettings,
  MICHAEL_SITUATIONS,
  type AngelType,
} from "@/lib/safetySettings";
import GlitterBurst from "@/components/GlitterBurst";
import AngelIcon from "@/components/AngelIcon";
// Note: distress signal labels are stored as plaintext in the database.
// Client-side encryption was removed because hardcoded keys in a public
// bundle provided no real confidentiality.

// Safe asset string pointing straight to your premium golden wings image
const sosWingsAsset = "/src/assets/icons/Icon-sos.png";

import michaelHeadshot from "@/assets/icons/Michaelheadshot.jpg";
import arielHeadshot from "@/assets/icons/Arielheadshot.jpg";
import jeremialHeadshot from "@/assets/icons/Jermialheadshot.jpg";

const angelImg = {
  michael: michaelHeadshot,
  ariel: arielHeadshot,
  jeremial: jeremialHeadshot,
};
const SIGNAL_QUEUE_KEY = "soul-echoes-signal-queue";
const INTRO_SEEN_KEY = "soul-echoes-beacon-intro-seen";

/* ─── The 22 distress codes ───────────────────────────────────────────────── */
const DISTRESS_CODES = [
  { symbol: "", label: "General emergency", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-400/25" },
  { symbol: "🔴", label: "Physical danger / Assault", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/25" },
  { symbol: "👶", label: "Child abuse / Endangerment", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/25" },
  { symbol: "⚕️", label: "Medical emergency", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-400/25" },
  { symbol: "🚨", label: "Human trafficking / Captivity", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-400/25" },
  { symbol: "⚡", label: "Sexual assault", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/25" },
  { symbol: "🏠", label: "Domestic violence / Abuse", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-400/25" },
  { symbol: "🧠", label: "Mental health crisis / Panic", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-400/25" },
  { symbol: "💰", label: "Financial abuse / Extortion", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-400/25" },
  { symbol: "🕊️", label: "Elder abuse / Vulnerable adult", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-400/25" },
  { symbol: "🐾", label: "Animal abuse / Pet threat", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/25" },
  { symbol: "🕶️", label: "Stalking / Active surveillance", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-400/25" },
  { symbol: "💻", label: "Cyberstalking / Doxxing / Leak", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-400/25" },
  { symbol: "🤫", label: "Blackmail / Coercion", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-400/25" },
  { symbol: "🔥", label: "Arson / Fire hazard safety", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/25" },
  { symbol: "💊", label: "Forced drugging / Poisoning", color: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-400/25" },
  { symbol: "🗺️", label: "Kidnapping / Abduction attempt", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-400/25" },
  { symbol: "🔏", label: "Identity theft / Legal fraud", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-400/25" },
  { symbol: "📣", label: "Hate crime / Harassment", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-400/25" },
  { symbol: "🛑", label: "False imprisonment / Trapped", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/25" },
  { symbol: "🌧️", label: "Natural disaster shelter emergency", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-400/25" },
  { symbol: "⚠️", label: "Immediate safe house relocation", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/25" }
] as const;

interface DistressSignalData {
  angel: AngelType | string;
  situationCode: string;
  situationLabel: string;
  timestamp: string;
  gpsLat?: number;
  gpsLng?: number;
  offlineFlag: boolean;
}

function queueSignal(signal: DistressSignalData) {
  try {
    const existing = JSON.parse(localStorage.getItem(SIGNAL_QUEUE_KEY) || "[]");
    existing.push(signal);
    localStorage.setItem(SIGNAL_QUEUE_KEY, JSON.stringify(existing));
  } catch {
    /* ignore */
  }
}

/* ─── Wings button used in the modal ────────────────────────────────────── */
function WingsGlow({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-32 h-32" : "w-16 h-16";
  const glow =
    size === "lg"
      ? "shadow-[0_0_52px_rgba(74,222,128,0.7),0_0_100px_rgba(74,222,128,0.3)]"
      : "shadow-[0_0_28px_rgba(74,222,128,0.55),0_0_56px_rgba(74,222,128,0.22)]";
  return (
    <div
      className={`${dim} mx-auto bg-green-500/15 border-2 border-green-400/40 ${glow}`}
      style={{
        overflow: "hidden",
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={sosWingsAsset}
        alt="SOS Wings"
        className="filter drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          borderRadius: "9999px",
        }}
      />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function DistressSignal() {
  const [phase, setPhase] = useState<
    "closed" | "welcome" | "explain" | "first-angel" | "verify" | "angel" | "situation" | "sent" | "confirmed"
  >("closed");
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [selectedAngel, setSelectedAngel] = useState<AngelType | string | null>(null);
  const [glitterCount, setGlitterCount] = useState(0);
  const [unicornCount, setUnicornCount] = useState(0);
  const shakeRef = useRef({ last: 0, count: 0 });
  const unicornFiredRef = useRef(false);
  const safety = getSafetySettings();

  /* ── Supabase real-time: fire unicorn when responder acknowledges ── */
  useEffect(() => {
    let channel: any = null;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        channel = (supabase as any)
          .channel("distress-received")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "distress_signals", filter: `user_id=eq.${user.id}` },
            (payload: { new: Record<string, unknown> }) => {
              const status = payload.new?.status as string | undefined;
              if ((status === "received" || status === "acknowledged") && !unicornFiredRef.current) {
                unicornFiredRef.current = true;
                setUnicornCount((c) => c + 1);
              }
            }
          )
          .subscribe();
      } catch {
        /* supabase not available offline */
      }
    })();
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  /* ── Shake detection ── */
  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const total = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
      if (total > 25) {
        const now = Date.now();
        if (now - shakeRef.current.last < 1000) {
          shakeRef.current.count++;
          if (shakeRef.current.count >= 2) {
            setPhase("verify");
            shakeRef.current.count = 0;
          }
        } else {
          shakeRef.current.count = 1;
        }
        shakeRef.current.last = now;
      }
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  /* ── Voice trigger ── */
  useEffect(() => {
    const handleDistress = () => {
      if (phase === "closed") setPhase("verify");
    };
    window.addEventListener("soul-echoes-distress-trigger", handleDistress);
    return () => window.removeEventListener("soul-echoes-distress-trigger", handleDistress);
  }, [phase]);

  /* ── External open trigger (from FloatingHub) ── */
  useEffect(() => {
    const handleOpen = () => {
      if (phase !== "closed") return;
      const seen = localStorage.getItem(INTRO_SEEN_KEY);
      setPhase(seen ? "verify" : "welcome");
    };
    window.addEventListener("soul-echoes-open-sos", handleOpen);
    return () => window.removeEventListener("soul-echoes-open-sos", handleOpen);
  }, [phase]);

  const verifyAccess = useCallback(() => {
    if (!safety.setupComplete) {
      setPhase("angel");
      return;
    }
    if (accessInput === safety.accessValue) {
      setAccessError(false);
      setPhase("situation");
    } else {
      setAccessError(true);
    }
  }, [accessInput, safety]);

  const selectAngel = (angel: string) => {
    setSelectedAngel(angel);
    setGlitterCount((c) => c + 1);
    setTimeout(() => setPhase("situation"), 800);
  };

  const selectSituation = async (code: string, label: string) => {
    if (!selectedAngel) return;
    let gpsLat: number | undefined;
    let gpsLng: number | undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      gpsLat = pos.coords.latitude;
      gpsLng = pos.coords.longitude;
    } catch {
      /* no GPS */
    }
    const signal: DistressSignalData = {
      angel: selectedAngel,
      situationCode: code,
      situationLabel: label,
      timestamp: new Date().toISOString(),
      gpsLat,
      gpsLng,
      offlineFlag: !navigator.onLine,
    };
    queueSignal(signal);
    try {
      if (navigator.onLine) {
        const { supabase } = await import("@/integrations/supabase/client");
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any).from("distress_signals").insert({
            user_id: user.id,
            angel: signal.angel,
            situation_code: signal.situationCode,
            situation_label: signal.situationLabel,
            gps_lat: signal.gpsLat,
            gps_lng: signal.gpsLng,
            offline_flag: signal.offlineFlag,
          });
        }
      }
    } catch {
      /* will retry */
    }
    setGlitterCount((c) => c + 1);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setPhase("confirmed");
    setTimeout(() => {
      setPhase("closed");
      setAccessInput("");
      setSelectedAngel(null);
    }, 2500);
  };

  const close = () => {
    setPhase("closed");
    setAccessInput("");
    setAccessError(false);
  };

  const situations = MICHAEL_SITUATIONS;
  const angelLabel = selectedAngel === "michael" ? "MICHAEL ⚔️" : selectedAngel === "ariel" ? "ARIEL 🌿" : "JEREMIAL 💜";
  const angelAccent = selectedAngel === "michael" ? "text-blue-400" : selectedAngel === "ariel" ? "text-emerald-400" : "text-purple-400";

  return (
    <>
      <GlitterBurst trigger={glitterCount} />
      <GlitterBurst trigger={unicornCount} unicorn />
      <AnimatePresence>
        {phase !== "closed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md space-y-4"
            >
              {/* Close */}
              <div className="flex justify-end">
                <button
                  onClick={close}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ══ WELCOME ══ */}
              {phase === "welcome" && (
                <div className="space-y-8 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 14 }}
                  >
                    <WingsGlow size="lg" />
                  </motion.div>
                  <div className="space-y-3">
                    <p className="font-display text-2xl font-bold text-foreground">You found something sacred.</p>
                    <p className="text-muted-foreground leading-relaxed">
                      This is a private safety feature built into Soul Echoes. Only you know it exists.
                    </p>
                  </div>
                  <Button
                    onClick={() => setPhase("explain")}
                    size="lg"
                    className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* ══ EXPLAIN ══ */}
              {phase === "explain" && (
                <div className="space-y-5">
                  <div className="text-center space-y-3">
                    <WingsGlow size="sm" />
                    <p className="font-display text-lg font-bold text-foreground">Your Private Silent Safety Beacon</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      This is your private silent safety beacon. Only you know what it does. If you are ever in danger,{" "}
                      <span className="font-semibold text-green-300">
                        type, speak, or sign the code <span className="font-mono">144</span> followed by a symbol
                      </span>
                      .
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">The codes</p>
                    {DISTRESS_CODES.map((c) => (
                      <div
                        key={c.symbol || "general"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${c.border} ${c.bg}`}
                      >
                        <span className={`shrink-0 font-mono font-bold text-sm ${c.color}`}>144{c.symbol}</span>
                        <span className="text-sm text-foreground/90">{c.label}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setPhase("first-angel")}
                    size="lg"
                    className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0"
                  >
                    Choose Your Guardian Angel
                  </Button>
                </div>
              )}

              {/* ══ FIRST-ANGEL ══ */}
              {phase === "first-angel" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <p className="font-display text-lg font-bold text-foreground leading-snug">
                      Who do you feel safest calling on?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose an archangel presence framework to support you when you need help.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        saveSafetySettings({ angel: "michael" });
                        localStorage.setItem(INTRO_SEEN_KEY, "1");
                        setPhase("closed");
                      }}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 hover:border-blue-400 text-left transition-all"
                      aria-label="Archangel Michael"
                    >
                      <img src={angelImg.michael} alt="Archangel Michael" className="w-20 h-20 object-cover rounded-full shrink-0 border border-white/20" />
                      <div>
                        <span className="font-display font-bold text-blue-300 text-sm block">Archangel Michael ⚔️</span>
                        <span className="text-xs text-muted-foreground">Male presence · Physical Safety</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        saveSafetySettings({ angel: "ariel" });
                        localStorage.setItem(INTRO_SEEN_KEY, "1");
                        setPhase("closed");
                      }}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400 text-left transition-all"
                      aria-label="Archangel Ariel"
                    >
                      <img src={angelImg.ariel} alt="Archangel Ariel" className="w-20 h-20 object-cover rounded-full shrink-0 border border-white/20" />
                      <div>
                        <span className="font-display font-bold text-emerald-300 text-sm block">Archangel Ariel 🌿</span>
                        <span className="text-xs text-muted-foreground">Nature presence · Courage & Support</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        saveSafetySettings({ angel: "jeremial" });
                        localStorage.setItem(INTRO_SEEN_KEY, "1");
                        setPhase("closed");
                      }}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 hover:border-purple-400 text-left transition-all"
                      aria-label="Archangel Jeremial"
                    >
                      <img src={angelImg.jeremial} alt="Archangel Jeremial" className="w-20 h-20 object-cover rounded-full shrink-0 border border-white/20" />
                      <div>
                        <span className="font-display font-bold text-purple-300 text-sm block">Archangel Jeremial 💜</span>
                        <span className="text-xs text-muted-foreground">Divine presence · Emotional Healing</span>
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem(INTRO_SEEN_KEY, "1");
                      setPhase("closed");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 block mx-auto"
                  >
                    I'll decide later
                  </button>
                </div>
              )}

              {/* ══ VERIFY ══ */}
              {phase === "verify" && (
                <div className="space-y-6 text-center">
                  <WingsGlow size="sm" />
                  {safety.setupComplete ? (
                    <>
                      <p className="font-display text-lg text-foreground">
                        Enter your{" "}
                        {safety.accessMethod === "pin"
                          ? "PIN"
                          : safety.accessMethod === "codeword"
                          ? "code word"
                          : "access code"}
                      </p>
                      <Input
                        type={safety.accessMethod === "pin" ? "password" : "text"}
                        value={accessInput}
                        onChange={(e) => {
                          setAccessInput(e.target.value);
                          setAccessError(false);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && verifyAccess()}
                        placeholder={safety.accessMethod === "pin" ? "● ● ● ●" : "Enter your code…"}
                        className="text-center text-xl h-14"
                        autoFocus
                        aria-label="Access code"
                      />
                      {accessError && <p className="text-destructive text-sm">That doesn't match. Try again.</p>}
                      <Button
                        onClick={verifyAccess}
                        size="lg"
                        className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-sky-600 to-teal-600 border-0"
                      >
                        Continue
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground">Your safety angel is here.</p>
                      <Button
                        onClick={() => setPhase("angel")}
                        size="lg"
                        className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-sky-600 to-teal-600 border-0"
                      >
                        Continue
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* ══ ANGEL SELECTION DURING RUNTIME ══ */}
              {phase === "angel" && (
                <div className="space-y-6 text-center">
                  <p className="font-display text-xl font-bold text-foreground">Choose Your Guide</p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => selectAngel("michael")}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 hover:border-blue-400 text-left transition-all"
                      aria-label="Michael — physical safety"
                    >
                      <img src={angelImg.michael} alt="Michael" className="w-20 h-20 object-cover rounded-full shrink-0 border border-white/20" />
                      <div>
                        <span className="font-display font-bold text-blue-300 block">Michael ⚔️</span>
                        <span className="text-xs text-muted-foreground">Physical Safety</span>
                      </div>
                    </button>
                    <button
                      onClick={() => selectAngel("ariel")}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400 text-left transition-all"
                      aria-label="Ariel — courage and nature"
                    >
                      <img src={angelImg.ariel} alt="Ariel" className="w-20 h-20 object-cover rounded-full shrink-0 border border-white/20" />
                      <div>
                        <span className="font-display font-bold text-emerald-300 block">Ariel 🌿</span>
                        <span className="text-xs text-muted-foreground">Courage &amp; Support</span>
                      </div>
                    </button>
                    <button
                      onClick={() => selectAngel("jeremial")}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 hover:border-purple-400 text-left transition-all"
                      aria-label="Jeremial — emotional healing"
                    >
                      <img src={angelImg.jeremial} alt="Jeremial" className="w-20 h-20 object-cover rounded-full shrink-0 border border-white/20" />
                      <div>
                        <span className="font-display font-bold text-purple-300 block">Jeremial 💜</span>
                        <span className="text-xs text-muted-foreground">Emotional Healing</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ══ SITUATION GRID ══ */}
              {phase === "situation" && selectedAngel && (
                <div className="space-y-4">
                  <p className={`font-display text-lg font-bold text-center ${angelAccent}`}>{angelLabel}</p>
                  <p className="text-xs text-center text-muted-foreground">
                    Choose a code — your dispatcher will receive it and respond.
                  </p>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {situations.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => selectSituation(s.code, s.label)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-teal-500/10 hover:from-sky-500/20 hover:to-teal-500/20 transition-all text-left"
                        aria-label={s.label}
                      >
                        <span className="text-2xl shrink-0">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold mr-2 text-sky-400">{s.code}</span>
                          <span className="text-sm text-foreground leading-tight">{s.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ CONFIRMED ══ */}
              {phase === "confirmed" && (
                <div className="space-y-6 text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <WingsGlow size="lg" />
                  </motion.div>
                  <p className="font-display text-lg font-bold text-foreground">Signal received.</p>
                  <p className="text-sm text-muted-foreground">Help is on the way.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
