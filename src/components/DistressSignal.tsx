import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSafetySettings,
  MICHAEL_SITUATIONS,
  FAITH_SITUATIONS,
  type AngelType,
} from "@/lib/safetySettings";
import GlitterBurst from "@/components/GlitterBurst";
import angelMichaelImg from "@/assets/angel-michael.png";
import angelFaithImg from "@/assets/angel-faith.png";

const SIGNAL_QUEUE_KEY = "soul-echoes-signal-queue";

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
  const [phase, setPhase] = useState<"closed" | "verify" | "angel" | "situation" | "sent">("closed");
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

  // Voice trigger — listen for "angel" keyword
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        if (transcript.includes("angel")) {
          setPhase("verify");
        }
      }
    };

    recognition.onerror = () => {
      setTimeout(() => { try { recognition.start(); } catch {} }, 5000);
    };
    recognition.onend = () => {
      setTimeout(() => { try { recognition.start(); } catch {} }, 1000);
    };

    try { recognition.start(); } catch {}
    return () => { try { recognition.abort(); } catch {} };
  }, []);

  const verifyAccess = useCallback(() => {
    if (!safety.setupComplete) {
      // No safety setup yet, go directly
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

    // Get GPS if possible
    let gpsLat: number | undefined;
    let gpsLng: number | undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      gpsLat = pos.coords.latitude;
      gpsLng = pos.coords.longitude;
    } catch { /* no GPS available */ }

    const signal: DistressSignalData = {
      angel: selectedAngel,
      situationCode: code,
      situationLabel: label,
      timestamp: new Date().toISOString(),
      gpsLat,
      gpsLng,
      offlineFlag: !navigator.onLine,
    };

    // Queue locally (works offline)
    queueSignal(signal);

    // Try to send to backend
    try {
      if (navigator.onLine) {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("distress_signals").insert({
          angel: signal.angel,
          situation_code: signal.situationCode,
          situation_label: signal.situationLabel,
          gps_lat: signal.gpsLat,
          gps_lng: signal.gpsLng,
          offline_flag: signal.offlineFlag,
        });
      }
    } catch { /* will retry later */ }

    setGlitterCount((c) => c + 1);

    // Vibrate confirmation pattern
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    setTimeout(() => {
      setPhase("closed");
      setAccessInput("");
      setSelectedAngel(null);
    }, 1200);
  };

  const situations = selectedAngel === "michael" ? MICHAEL_SITUATIONS : FAITH_SITUATIONS;
  const angelLabel = selectedAngel === "michael" ? "MICHAEL ⚔️" : "FAITH 🕊️";

  return (
    <>
      <GlitterBurst trigger={glitterCount} />

      {/* Unicorn icon — always visible */}
      <button
        onClick={() => setPhase("verify")}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Safety angel — get help"
        title="🦄"
        style={{ fontSize: "1.75rem" }}
      >
        🦄
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

              {/* VERIFY phase */}
              {phase === "verify" && (
                <div className="space-y-6 text-center">
                  <p className="text-2xl">🦄</p>
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
                      <Button onClick={verifyAccess} size="lg" className="w-full rounded-2xl text-lg py-6">
                        Continue
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground">Your safety angel is here.</p>
                      <Button onClick={() => setPhase("angel")} size="lg" className="w-full rounded-2xl text-lg py-6">
                        Continue
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* ANGEL selection */}
              {phase === "angel" && (
                <div className="space-y-6 text-center">
                  <p className="font-display text-xl font-bold text-foreground">Choose your angel</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => selectAngel("michael")}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
                      aria-label="Michael — physical safety"
                    >
                      <img src={angelMichaelImg} alt="Michael" className="w-24 h-24 object-contain" />
                      <span className="font-display font-bold text-foreground">Michael ⚔️</span>
                      <span className="text-xs text-muted-foreground">Physical Safety</span>
                    </button>
                    <button
                      onClick={() => selectAngel("faith")}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-card hover:border-secondary/50 hover:bg-secondary/5 transition-all"
                      aria-label="Faith — inner crisis"
                    >
                      <img src={angelFaithImg} alt="Faith" className="w-24 h-24 object-contain" />
                      <span className="font-display font-bold text-foreground">Faith 🕊️</span>
                      <span className="text-xs text-muted-foreground">Inner Crisis</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SITUATION grid */}
              {phase === "situation" && selectedAngel && (
                <div className="space-y-4">
                  <p className="font-display text-lg font-bold text-foreground text-center">{angelLabel}</p>
                  <div className="space-y-2">
                    {situations.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => selectSituation(s.code, s.label)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left"
                        aria-label={s.label}
                      >
                        <span className="text-2xl shrink-0">{s.color}</span>
                        <span className="text-2xl shrink-0">{s.emoji}</span>
                        <span className="font-body text-base text-foreground leading-tight">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
