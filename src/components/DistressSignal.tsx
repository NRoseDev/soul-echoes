import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSafetySettings, saveSafetySettings } from "@/lib/safetySettings";
import GlitterBurst from "@/components/GlitterBurst";
import { encryptSignal } from "@/lib/encryption";

// Safe asset string pointing straight to your premium golden wings image
const sosWingsAsset = "/src/assets/icons/Icon-sos.png";

const SIGNAL_QUEUE_KEY = "soul-echoes-signal-queue";
const INTRO_SEEN_KEY = "soul-echoes-beacon-intro-seen";

/* ─── The 9 distress codes ───────────────────────────────────────────────── */
const DISTRESS_CODES = [
  { symbol: "", label: "General emergency", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-400/25" },
  { symbol: "🔴", label: "Physical danger", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/25" },
  { symbol: "👶", label: "Child abuse", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/25" },
  { symbol: "⚕️", label: "Medical emergency", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-400/25" },
  { symbol: "🚨", label: "Trafficking", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-400/25" },
  { symbol: "⚡", label: "Sexual assault", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/25" },
  { symbol: "🏠", label: "Domestic violence", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-400/25" },
  { symbol: "🧠", label: "Mental health crisis", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-400/25" },
  { symbol: "💰", label: "Financial abuse", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-400/25" },
] as const;

interface DistressSignalData {
  angel: string;
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

/* ─── Premium Wings header component ────────────────────────────────────── */
function WingsGlow({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-40 h-40" : "w-20 h-20";
  return (
    <div className={`${dim} mx-auto rounded-full flex items-center justify-center overflow-hidden`}>
      <img 
        src={sosWingsAsset} 
        alt="SOS Safety Wings" 
        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
      />
    </div>
  );
}

export default function DistressSignal() {
  const [phase, setPhase] = useState<
    "closed" | "welcome" | "explain" | "first-angel" | "verify" | "angel" | "situation" | "confirmed"
  >("closed");
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [selectedAngel, setSelectedAngel] = useState<string | null>(null);
  const [glitterCount, setGlitterCount] = useState(0);
  const [unicornCount, setUnicornCount] = useState(0);
  const shakeRef = useRef({ last: 0, count: 0 });
  const unicornFiredRef = useRef(false);
  const safety = getSafetySettings();

  useEffect(() => {
    let channel: any = null;
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
            (payload: any) => {
              const status = payload.new?.status;
              if ((status === "received" || status === "acknowledged") && !unicornFiredRef.current) {
                unicornFiredRef.current = true;
                setUnicornCount((c) => c + 1);
              }
            }
          ).subscribe();
      } catch { /* ignore offline */ }
    })();
    return () => { channel?.unsubscribe(); };
  }, []);

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

  useEffect(() => {
    const handleDistress = () => { if (phase === "closed") setPhase("verify"); };
    window.addEventListener("soul-echoes-distress-trigger", handleDistress);
    return () => window.removeEventListener("soul-echoes-distress-trigger", handleDistress);
  }, [phase]);

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
    saveSafetySettings({ angel });
    localStorage.setItem(INTRO_SEEN_KEY, "1");
    setGlitterCount((c) => c + 1);
    setTimeout(() => setPhase("situation"), 800);
  };

  const selectSituation = async (code: string, label: string) => {
    const currentAngel = selectedAngel || safety.angel || "michael";
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
      angel: currentAngel,
      situationCode: code,
      situationLabel: label,
      timestamp: new Date().toISOString(),
      gpsLat,
      gpsLng,
      offlineFlag: !navigator.onLine,
    };

    const payload = JSON.stringify({ angel: signal.angel, situationCode: signal.situationCode, situationLabel: signal.situationLabel, gpsLat: signal.gpsLat, gpsLng: signal.gpsLng });
    let encryptedPayload: string;
    try { encryptedPayload = await encryptSignal(payload); } catch { encryptedPayload = payload; }
    queueSignal({ ...signal, situationLabel: encryptedPayload });

    try {
      if (navigator.onLine) {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any).from("distress_signals").insert({
            user_id: user.id,
            angel: signal.angel,
            situation_code: signal.situationCode,
            situation_label: encryptedPayload,
            gps_lat: signal.gpsLat,
            gps_lng: signal.gpsLng,
            offline_flag: signal.offlineFlag,
          });
        }
      }
    } catch { /* ignore offline */ }

    setGlitterCount((c) => c + 1);
    if (navigator.vibrate) navigator.vibrate();
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

  const angelLabel = selectedAngel === "michael" ? "MICHAEL ⚔️" : selectedAngel === "ariel" ? "ARIEL 🌿" : "JEREMIAL 💜";
  const angelAccent = selectedAngel === "michael" ? "text-blue-400" : selectedAngel === "ariel" ? "text-emerald-400" : "text-purple-400";

  return (
    <>
      <GlitterBurst trigger={glitterCount} />
      <GlitterBurst trigger={unicornCount} unicorn />
      <AnimatePresence>
        {phase !== "closed" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-md space-y-4" >
              <div className="flex justify-end">
                <button onClick={close} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ══ WELCOME ══ */}
              {phase === "welcome" && (
                <div className="space-y-8 text-center">
                  <WingsGlow size="lg" />
                  <div className="space-y-3">
                    <p className="font-display text-2xl font-bold text-foreground">You found something sacred.</p>
                    <p className="text-muted-foreground leading-relaxed">This is a private safety feature built into Soul Echoes. Only you know it exists.</p>
                  </div>
                  <Button onClick={() => setPhase("explain")} size="lg" className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-yellow-600 to-amber-600 border-0">
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
                    <p className="text-sm text-foreground/80 leading-relaxed">If you are ever in danger, type, speak, or sign the code <span className="font-mono font-bold text-amber-400">144</span> followed by a symbol.</p>
                  </div>
                  <div className="space-y-1.5">
                    {DISTRESS_CODES.map((c) => (
                      <div key={c.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${c.border} ${c.bg}`}>
                        <span className={`shrink-0 font-mono font-bold text-sm ${c.color}`}>144{c.symbol}</span>
                        <span className="text-sm text-foreground/90">{c.label}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setPhase("first-angel")} size="lg" className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-yellow-600 to-amber-600 border-0">
                    Choose Your Guardian Angel
                  </Button>
                </div>
              )}

              {/* ══ ANGEL SELECTION MENU ══ */}
              {(phase === "first-angel" || phase === "angel") && (
                <div className="space-y-6 text-center">
                  <p className="font-display text-xl font-bold text-foreground">Who do you feel safest calling on?</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => selectAngel("michael")} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 hover:border-blue-400 text-left transition-all">
                      <img src={sosWingsAsset} alt="Michael" className="w-12 h-12 object-contain" />
                      <div>
                        <p className="font-display font-bold text-blue-300 text-sm">Archangel Michael ⚔️</p>
                        <p className="text-xs text-muted-foreground">Male Presence · Protection & Physical Safety</p>
                      </div>
                    </button>
                    <button onClick={() => selectAngel("ariel")} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400 text-left transition-all">
                      <img src={sosWingsAsset} alt="Ariel" className="w-12 h-12 object-contain" />
                      <div>
                        <p className="font-display font-bold text-emerald-300 text-sm">Archangel Ariel 🌿</p>
                        <p className="text-xs text-muted-foreground">Nature Presence · Courage & Support</p>
                      </div>
                    </button>
                    <button onClick={() => selectAngel("jeremial")} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 hover:border-purple-400 text-left transition-all">
                      <img src={sosWingsAsset} alt="Jeremial" className="w-12 h-12 object-contain" />
                      <div>
                        <p className="font-display font-bold text-purple-300 text-sm">Archangel Jeremial 💜</p>
                        <p className="text-xs text-muted-foreground">Divine Presence · Emotional Healing & Vision</p>
                      </div>
                    </button>
                  </div>
                  {phase === "first-angel" && (
                    <button onClick={() => { localStorage.setItem(INTRO_SEEN_KEY, "1"); setPhase("closed"); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-2">
                      I'll decide later
                    </button>
                  )}
                </div>
              )}

              {/* ══ VERIFY PIN ══ */}
              {phase === "verify" && (
                <div className="space-y-6 text-center">
                  <WingsGlow size="sm" />
                  {safety.setupComplete ? (
                    <>
                      <p className="font-display text-lg text-foreground">Enter your secure access credentials</p>
                      <Input type="password" value={accessInput} onChange={(e) => { setAccessInput(e.target.value); setAccessError(false); }} onKeyDown={(e) => e.key === "Enter" && verifyAccess()} placeholder="● ● ● ●" className="text-center text-xl h-14" autoFocus />
                      {accessError && <p className="text-destructive text-sm">That doesn't match. Try again.</p>}
                      <Button onClick={verifyAccess} size="lg" className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-sky-600 to-teal-600 border-0">Continue</Button>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground">Your safety angel is here.</p>
                      <Button onClick={() => setPhase("angel")} size="lg" className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-sky-600 to-teal-600 border-0">Continue</Button>
                    </>
                  )}
                </div>
              )}

              {/* ══ SITUATION GRID ══ */}
              {phase === "situation" && selectedAngel && (
                <div className="space-y-4">
                  <p className={`font-display text-lg font-bold text-center ${angelAccent}`}>{angelLabel}</p>
                  <p className="text-xs text-center text-muted-foreground">Select a code — your dispatcher will receive it and respond instantly.</p>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {DISTRESS_CODES.map((c) => (
                      <button key={c.label} onClick={() => selectSituation(c.symbol, c.label)} className="w-full flex items-center justify-between p-4 rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-teal-500/10 hover:from-sky-500/20 hover:to-teal-500/20 transition-all text-left">
                        <span className="text-sm font-medium text-foreground">{c.label}</span>
                        <span className="text-xs font-mono font-bold text-amber-400">144{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ CONFIRMED ══ */}
              {phase === "confirmed" && (
                <div className="space-y-6 text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                    <WingsGlow size="lg" />
                  </motion.div>
                  <p className="font-display text-lg font-bold text-foreground">Signal received securely.</p>
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
