import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSafetySettings,
  saveSafetySettings,
  MICHAEL_SITUATIONS,
  FAITH_SITUATIONS,
  type AngelType,
} from "@/lib/safetySettings";
import GlitterBurst from "@/components/GlitterBurst";
import AngelIcon from "@/components/AngelIcon";
import { encryptSignal } from "@/lib/encryption";
import angelMichaelImg from "@/assets/angel-michael.png";
import angelFaithImg from "@/assets/angel-faith.png";

const SIGNAL_QUEUE_KEY = "soul-echoes-signal-queue";
const INTRO_SEEN_KEY   = "soul-echoes-beacon-intro-seen";

/* ─── The 9 distress codes ───────────────────────────────────────────────── */
const DISTRESS_CODES = [
  { symbol: "",   label: "General emergency",   color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-400/25"  },
  { symbol: "🔴", label: "Physical danger",      color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-400/25"    },
  { symbol: "👶", label: "Child abuse",          color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-400/25"  },
  { symbol: "⚕️", label: "Medical emergency",    color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-400/25"    },
  { symbol: "🚨", label: "Trafficking",          color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-400/25" },
  { symbol: "⚡", label: "Sexual assault",       color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/25" },
  { symbol: "🏠", label: "Domestic violence",    color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-400/25"   },
  { symbol: "🧠", label: "Mental health crisis", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-400/25" },
  { symbol: "💰", label: "Financial abuse",      color: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-400/25"   },
] as const;

/* ─── Signal queue ───────────────────────────────────────────────────────── */
interface DistressSignalData {
  angel: AngelType;
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
  } catch { /* ignore */ }
}

/* ─── Wings button used in the modal ────────────────────────────────────── */
function WingsGlow({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dim  = size === "lg" ? "w-32 h-32" : "w-16 h-16";
  const icon = size === "lg" ? "h-14 w-24" : "h-7 w-12";
  const glow = size === "lg"
    ? "shadow-[0_0_52px_rgba(74,222,128,0.7),0_0_100px_rgba(74,222,128,0.3)]"
    : "shadow-[0_0_28px_rgba(74,222,128,0.55),0_0_56px_rgba(74,222,128,0.22)]";
  return (
    <div className={`${dim} mx-auto rounded-full bg-green-500/15 border-2 border-green-400/40 flex items-center justify-center ${glow}`}>
      <AngelIcon className={icon} />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function DistressSignal() {
  const [phase, setPhase] = useState<
    "closed" | "welcome" | "explain" | "first-angel" |
    "verify" | "angel" | "situation" | "sent" | "confirmed"
  >("closed");
  const [accessInput, setAccessInput]     = useState("");
  const [accessError, setAccessError]     = useState(false);
  const [selectedAngel, setSelectedAngel] = useState<AngelType | null>(null);
  const [glitterCount, setGlitterCount]   = useState(0);
  const [unicornCount, setUnicornCount]   = useState(0);
  const shakeRef = useRef({ last: 0, count: 0 });
  const unicornFiredRef = useRef(false);

  const safety = getSafetySettings();

  /* ── Supabase real-time: fire unicorn when responder acknowledges ── */
  useEffect(() => {
    let channel: ReturnType<typeof import("@/integrations/supabase/client").supabase.channel> | null = null;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { user } } = await supabase.auth.getUser();
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
      } catch { /* supabase not available offline */ }
    })();
    return () => { channel?.unsubscribe(); };
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
          if (shakeRef.current.count >= 2) { setPhase("verify"); shakeRef.current.count = 0; }
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
    const handleDistress = () => { if (phase === "closed") setPhase("verify"); };
    window.addEventListener("soul-echoes-distress-trigger", handleDistress);
    return () => window.removeEventListener("soul-echoes-distress-trigger", handleDistress);
  }, [phase]);

  const verifyAccess = useCallback(() => {
    if (!safety.setupComplete) { setPhase("angel"); return; }
    if (accessInput === safety.accessValue) { setAccessError(false); setPhase("angel"); }
    else { setAccessError(true); }
  }, [accessInput, safety]);

  const selectAngel = (angel: AngelType) => {
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
    } catch { /* no GPS */ }

    const signal: DistressSignalData = {
      angel: selectedAngel, situationCode: code, situationLabel: label,
      timestamp: new Date().toISOString(), gpsLat, gpsLng, offlineFlag: !navigator.onLine,
    };
    const payload = JSON.stringify({
      angel: signal.angel, situationCode: signal.situationCode,
      situationLabel: signal.situationLabel, gpsLat: signal.gpsLat, gpsLng: signal.gpsLng,
    });
    let encryptedPayload: string;
    try { encryptedPayload = await encryptSignal(payload); }
    catch { encryptedPayload = payload; }
    queueSignal({ ...signal, situationLabel: encryptedPayload });

    try {
      if (navigator.onLine) {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any).from("distress_signals").insert({
            user_id: user.id, angel: signal.angel,
            situation_code: signal.situationCode, situation_label: encryptedPayload,
            gps_lat: signal.gpsLat, gps_lng: signal.gpsLng, offline_flag: signal.offlineFlag,
          });
        }
      }
    } catch { /* will retry */ }

    setGlitterCount((c) => c + 1);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setPhase("confirmed");
    setTimeout(() => { setPhase("closed"); setAccessInput(""); setSelectedAngel(null); }, 2500);
  };

  const close = () => { setPhase("closed"); setAccessInput(""); setAccessError(false); };

  const situations  = selectedAngel === "michael" ? MICHAEL_SITUATIONS : FAITH_SITUATIONS;
  const angelLabel  = selectedAngel === "michael" ? "MICHAEL ⚔️" : "FAITH 🕊️";
  const angelAccent = selectedAngel === "michael" ? "text-blue-400" : "text-purple-400";

  return (
    <>
      <GlitterBurst trigger={glitterCount} />
      <GlitterBurst trigger={unicornCount} unicorn />

      {/* ── Floating wings button — green glow, left side, above bottom nav ── */}
      <button
        onClick={() => {
          const seen = localStorage.getItem(INTRO_SEEN_KEY);
          setPhase(seen ? "verify" : "welcome");
        }}
        className="fixed bottom-24 left-4 z-50 h-14 w-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-green-500/15 backdrop-blur-sm border-2 border-green-400/40 shadow-[0_0_22px_rgba(74,222,128,0.55),0_0_44px_rgba(74,222,128,0.22)]"
        aria-label="Angel safety beacon"
      >
        <AngelIcon className="h-7 w-12" />
      </button>

      <AnimatePresence>
        {phase !== "closed" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md space-y-4"
            >
              {/* Close */}
              <div className="flex justify-end">
                <button onClick={close} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ══ WELCOME — first ever tap ══ */}
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

              {/* ══ EXPLAIN — full explanation + 9 codes ══ */}
              {phase === "explain" && (
                <div className="space-y-5">
                  <div className="text-center space-y-3">
                    <WingsGlow size="sm" />
                    <p className="font-display text-lg font-bold text-foreground">
                      Your Private Silent Safety Beacon
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      This is your private silent safety beacon. Only you know what it does.
                      If you are ever in danger, <span className="font-semibold text-green-300">type, speak, or sign the code <span className="font-mono">144</span> followed by a symbol</span>.
                    </p>
                  </div>

                  {/* Code list */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">The codes</p>
                    {DISTRESS_CODES.map((c) => (
                      <div
                        key={c.symbol || "general"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${c.border} ${c.bg}`}
                      >
                        <span className={`shrink-0 font-mono font-bold text-sm ${c.color}`}>
                          144{c.symbol}
                        </span>
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

              {/* ══ FIRST-ANGEL — who do you feel safest calling on ══ */}
              {phase === "first-angel" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <p className="font-display text-lg font-bold text-foreground leading-snug">
                      Who do you feel safest calling on?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose a male or female presence. You can always use either when you need help.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        saveSafetySettings({ angel: "michael" });
                        localStorage.setItem(INTRO_SEEN_KEY, "1");
                        setPhase("closed");
                      }}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 hover:border-blue-400/70 hover:bg-blue-500/20 transition-all"
                      aria-label="Archangel Michael"
                    >
                      <img src={angelMichaelImg} alt="Archangel Michael" className="w-24 h-24 object-contain" />
                      <span className="font-display font-bold text-blue-300 text-sm">Archangel Michael ⚔️</span>
                      <span className="text-xs text-muted-foreground">Male presence · Physical Safety</span>
                    </button>
                    <button
                      onClick={() => {
                        saveSafetySettings({ angel: "faith" });
                        localStorage.setItem(INTRO_SEEN_KEY, "1");
                        setPhase("closed");
                      }}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 hover:border-purple-400/70 hover:bg-purple-500/20 transition-all"
                      aria-label="Angel Faith"
                    >
                      <img src={angelFaithImg} alt="Angel Faith" className="w-24 h-24 object-contain" />
                      <span className="font-display font-bold text-purple-300 text-sm">Angel Faith 🕊️</span>
                      <span className="text-xs text-muted-foreground">Female presence · Inner Crisis</span>
                    </button>
                  </div>
                  <button
                    onClick={() => { localStorage.setItem(INTRO_SEEN_KEY, "1"); setPhase("closed"); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                        Enter your {safety.accessMethod === "pin" ? "PIN" : safety.accessMethod === "codeword" ? "code word" : "access code"}
                      </p>
                      <Input
                        type={safety.accessMethod === "pin" ? "password" : "text"}
                        value={accessInput}
                        onChange={(e) => { setAccessInput(e.target.value); setAccessError(false); }}
                        onKeyDown={(e) => e.key === "Enter" && verifyAccess()}
                        placeholder={safety.accessMethod === "pin" ? "● ● ● ●" : "Enter your code…"}
                        className="text-center text-xl h-14"
                        autoFocus
                        aria-label="Access code"
                      />
                      {accessError && <p className="text-destructive text-sm">That doesn't match. Try again.</p>}
                      <Button onClick={verifyAccess} size="lg" className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-sky-600 to-teal-600 border-0">
                        Continue
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground">Your safety angel is here.</p>
                      <Button onClick={() => setPhase("angel")} size="lg" className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-sky-600 to-teal-600 border-0">
                        Continue
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* ══ ANGEL selection ══ */}
              {phase === "angel" && (
                <div className="space-y-6 text-center">
                  <p className="font-display text-xl font-bold text-foreground">Choose Your Guide</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => selectAngel("michael")}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 hover:border-blue-400/70 hover:bg-blue-500/20 transition-all"
                      aria-label="Michael — physical safety"
                    >
                      <img src={angelMichaelImg} alt="Michael" className="w-24 h-24 object-contain" />
                      <span className="font-display font-bold text-blue-300">Michael ⚔️</span>
                      <span className="text-xs text-muted-foreground">Physical Safety</span>
                    </button>
                    <button
                      onClick={() => selectAngel("faith")}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 hover:border-purple-400/70 hover:bg-purple-500/20 transition-all"
                      aria-label="Faith — inner crisis"
                    >
                      <img src={angelFaithImg} alt="Faith" className="w-24 h-24 object-contain" />
                      <span className="font-display font-bold text-purple-300">Faith 🕊️</span>
                      <span className="text-xs text-muted-foreground">Inner Crisis</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ══ SITUATION grid ══ */}
              {phase === "situation" && selectedAngel && (
                <div className="space-y-4">
                  <p className={`font-display text-lg font-bold text-center ${angelAccent}`}>{angelLabel}</p>
                  <p className="text-xs text-center text-muted-foreground">Choose a code — your dispatcher will receive it and respond.</p>
                  <div className="space-y-2">
                    {situations.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => selectSituation(s.code, s.label)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-teal-500/10 hover:from-sky-500/20 hover:to-teal-500/20 transition-all text-left"
                        aria-label={s.label}
                      >
                        <span className="text-2xl shrink-0">{s.color}</span>
                        <span className="text-2xl shrink-0">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-bold mr-2 ${selectedAngel === "michael" ? "text-sky-400" : "text-teal-400"}`}>{s.code}</span>
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
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
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
