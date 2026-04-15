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
const INTRO_SEEN_KEY = "soul-echoes-beacon-intro-seen";

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

export default function DistressSignal() {
  const [phase, setPhase] = useState<"closed" | "intro" | "codes" | "first-angel" | "verify" | "angel" | "situation" | "sent" | "confirmed">("closed");
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [selectedAngel, setSelectedAngel] = useState<AngelType | null>(null);
  const [glitterCount, setGlitterCount] = useState(0);
  const shakeRef = useRef({ last: 0, count: 0 });

  const safety = getSafetySettings();

  // Shake detection
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

  // Voice trigger
  useEffect(() => {
    const handleDistress = () => {
      if (phase === "closed") setPhase("verify");
    };
    window.addEventListener("soul-echoes-distress-trigger", handleDistress);
    return () => window.removeEventListener("soul-echoes-distress-trigger", handleDistress);
  }, [phase]);

  const verifyAccess = useCallback(() => {
    if (!safety.setupComplete) {
      setPhase("angel");
      return;
    }
    if (accessInput === safety.accessValue) {
      setAccessError(false);
      setPhase("angel");
    } else {
      setAccessError(true);
    }
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
      angel: selectedAngel,
      situationCode: code,
      situationLabel: label,
      timestamp: new Date().toISOString(),
      gpsLat,
      gpsLng,
      offlineFlag: !navigator.onLine,
    };

    const signalPayload = JSON.stringify({
      angel: signal.angel,
      situationCode: signal.situationCode,
      situationLabel: signal.situationLabel,
      gpsLat: signal.gpsLat,
      gpsLng: signal.gpsLng,
    });
    let encryptedPayload: string;
    try {
      encryptedPayload = await encryptSignal(signalPayload);
    } catch {
      encryptedPayload = signalPayload;
    }

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
    } catch { /* will retry */ }

    setGlitterCount((c) => c + 1);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

    setPhase("confirmed");
    setTimeout(() => {
      setPhase("closed");
      setAccessInput("");
      setSelectedAngel(null);
    }, 2500);
  };

  const situations = selectedAngel === "michael" ? MICHAEL_SITUATIONS : FAITH_SITUATIONS;
  const angelLabel = selectedAngel === "michael" ? "MICHAEL ⚔️" : "FAITH 🕊️";
  const angelAccent = selectedAngel === "michael" ? "text-blue-400" : "text-purple-400";

  return (
    <>
      <GlitterBurst trigger={glitterCount} />

      {/* Floating angel button — green, left side, above bottom nav */}
      <button
        onClick={() => {
          const seen = localStorage.getItem(INTRO_SEEN_KEY);
          setPhase(seen ? "verify" : "intro");
        }}
        className="fixed bottom-24 left-4 z-50 h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-green-500/20 backdrop-blur-sm border-2 border-green-400/50 shadow-[0_0_18px_rgba(74,222,128,0.35)]"
        aria-label="Angel safety beacon"
      >
        <AngelIcon className="h-6 w-6 text-green-400" />
      </button>

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
                  onClick={() => { setPhase("closed"); setAccessInput(""); setAccessError(false); }}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* INTRO — first tap only */}
              {phase === "intro" && (
                <div className="space-y-6 text-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 14 }}
                    className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-green-400/30 to-emerald-500/30 border border-green-400/40 flex items-center justify-center shadow-[0_0_32px_rgba(74,222,128,0.4)]"
                  >
                    <AngelIcon className="h-10 w-10 text-green-400" />
                  </motion.div>
                  <div className="space-y-3">
                    <p className="font-display text-xl font-bold text-foreground">
                      Your Private Safety Beacon
                    </p>
                    <p className="text-foreground/80 leading-relaxed text-base">
                      This is your private silent safety beacon.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Only you know what it does. Tap your angel icon any time — choose a code and a dispatcher on call will receive it and respond.
                    </p>
                  </div>
                  <Button
                    onClick={() => setPhase("codes")}
                    size="lg"
                    className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0"
                  >
                    Show Me How It Works
                  </Button>
                </div>
              )}

              {/* CODES — distress codes explained */}
              {phase === "codes" && (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <p className="font-display text-lg font-bold text-foreground">Your Silent Distress Codes</p>
                    <p className="text-xs text-muted-foreground">Tap the angel, choose your guide, then tap a code — no words needed. A dispatcher receives it instantly.</p>
                  </div>

                  {/* Michael codes */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚔️</span> Archangel Michael — Physical Safety
                    </p>
                    {MICHAEL_SITUATIONS.map((s) => (
                      <div key={s.code} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 to-teal-500/10 border border-sky-500/20">
                        <span className="shrink-0 text-lg">{s.color}</span>
                        <span className="shrink-0 text-lg">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-sky-400 mr-2">{s.code}</span>
                          <span className="text-sm text-foreground">{s.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Faith codes */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🕊️</span> Angel Faith — Inner Crisis
                    </p>
                    {FAITH_SITUATIONS.map((s) => (
                      <div key={s.code} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 to-teal-500/10 border border-teal-500/20">
                        <span className="shrink-0 text-lg">{s.color}</span>
                        <span className="shrink-0 text-lg">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-teal-400 mr-2">{s.code}</span>
                          <span className="text-sm text-foreground">{s.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setPhase("first-angel")}
                    size="lg"
                    className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 border-0"
                  >
                    Choose Your Angel
                  </Button>
                </div>
              )}

              {/* FIRST-ANGEL — preference */}
              {phase === "first-angel" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <p className="font-display text-lg font-bold text-foreground leading-snug">
                      Who do you feel most comfortable calling on?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose based on personal comfort. You can always use either when you need help.
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
                      <span className="text-xs text-muted-foreground">Physical Safety</span>
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
                      <span className="text-xs text-muted-foreground">Inner Crisis</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem(INTRO_SEEN_KEY, "1");
                      setPhase("closed");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    I'll decide later
                  </button>
                </div>
              )}

              {/* VERIFY */}
              {phase === "verify" && (
                <div className="space-y-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-green-500/20 border border-green-400/40 flex items-center justify-center">
                    <AngelIcon className="h-8 w-8 text-green-400" />
                  </div>
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
                      {accessError && (
                        <p className="text-destructive text-sm">That doesn't match. Try again.</p>
                      )}
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

              {/* ANGEL selection */}
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

              {/* SITUATION grid */}
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

              {/* CONFIRMED */}
              {phase === "confirmed" && (
                <div className="space-y-6 text-center py-8">
                  <p className="text-6xl animate-pulse">🦄</p>
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
