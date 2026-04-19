import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
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
import { encryptSignal } from "@/lib/encryption";
import angelMichaelImg from "@/assets/angel-michael.png";
import angelFaithImg from "@/assets/angel-faith.png";

const SIGNAL_QUEUE_KEY = "soul-echoes-signal-queue";
const INTRO_SEEN_KEY   = "soul-echoes-beacon-intro-seen";

/* ─── 144 Distress Code Reference ───────────────────────────────────────── */
interface CodeEntry    { code: string; label: string }
interface CodeCategory { name: string; angel: "michael" | "faith"; codes: CodeEntry[] }

const CODE_CATEGORIES: CodeCategory[] = [
  /* ── Archangel Michael ── */
  {
    name: "Immediate Danger", angel: "michael",
    codes: [
      { code: "M-101", label: "I am in immediate danger" },
      { code: "M-102", label: "I need help right now" },
      { code: "M-103", label: "Someone is threatening me" },
      { code: "M-104", label: "I am being followed" },
      { code: "M-105", label: "I feel unsafe where I am" },
      { code: "M-106", label: "I am being watched" },
      { code: "M-107", label: "I am afraid to leave" },
      { code: "M-108", label: "I need you to call me" },
      { code: "M-109", label: "Send someone to check on me" },
      { code: "M-110", label: "I cannot speak freely" },
      { code: "M-111", label: "Someone is listening" },
      { code: "M-112", label: "Act normal when you respond" },
    ],
  },
  {
    name: "Physical Violence", angel: "michael",
    codes: [
      { code: "M-201", label: "I am being hurt physically" },
      { code: "M-202", label: "I have been assaulted" },
      { code: "M-203", label: "I need medical help — injury" },
      { code: "M-204", label: "I am in pain" },
      { code: "M-205", label: "Someone hit me" },
      { code: "M-206", label: "I have been choked or strangled" },
      { code: "M-207", label: "I have been kicked or beaten" },
      { code: "M-208", label: "I need to get out now" },
      { code: "M-209", label: "I was hurt with a weapon" },
      { code: "M-210", label: "I cannot move safely" },
      { code: "M-211", label: "I am hiding" },
      { code: "M-212", label: "I am injured but stable" },
    ],
  },
  {
    name: "Captivity & Control", angel: "michael",
    codes: [
      { code: "M-301", label: "I am being held against my will" },
      { code: "M-302", label: "I cannot leave freely" },
      { code: "M-303", label: "My phone is being monitored" },
      { code: "M-304", label: "I am being financially controlled" },
      { code: "M-305", label: "My documents have been taken" },
      { code: "M-306", label: "I am locked in" },
      { code: "M-307", label: "I have no money or access" },
      { code: "M-308", label: "I cannot contact my family" },
      { code: "M-309", label: "I am being isolated" },
      { code: "M-310", label: "I cannot go where I want" },
      { code: "M-311", label: "Someone controls my every movement" },
      { code: "M-312", label: "I need to be rescued" },
    ],
  },
  {
    name: "Trafficking & Exploitation", angel: "michael",
    codes: [
      { code: "M-401", label: "I am being trafficked" },
      { code: "M-402", label: "I was forced into this" },
      { code: "M-403", label: "I need to escape" },
      { code: "M-404", label: "I am being sold or traded" },
      { code: "M-405", label: "I am being sexually exploited" },
      { code: "M-406", label: "Someone took my identity documents" },
      { code: "M-407", label: "I am in an unknown location" },
      { code: "M-408", label: "I need immigration assistance" },
      { code: "M-409", label: "I was brought here under false pretenses" },
      { code: "M-410", label: "I am being forced to work" },
      { code: "M-411", label: "I was lured here with a false offer" },
      { code: "M-412", label: "I need legal protection now" },
    ],
  },
  {
    name: "Domestic & Family", angel: "michael",
    codes: [
      { code: "M-501", label: "My partner is hurting me" },
      { code: "M-502", label: "I need to leave home safely" },
      { code: "M-503", label: "My children are in danger" },
      { code: "M-504", label: "A family member is violent" },
      { code: "M-505", label: "I need a safe place to stay tonight" },
      { code: "M-506", label: "I am being stalked by an ex-partner" },
      { code: "M-507", label: "A restraining order is being violated" },
      { code: "M-508", label: "My abuser is nearby right now" },
      { code: "M-509", label: "I need emergency shelter" },
      { code: "M-510", label: "I fear for my children's safety" },
      { code: "M-511", label: "My children were taken without consent" },
      { code: "M-512", label: "I need a welfare check at my address" },
    ],
  },
  {
    name: "Emergency Response", angel: "michael",
    codes: [
      { code: "M-601", label: "Call 911 for me" },
      { code: "M-602", label: "I need police — send, do not call" },
      { code: "M-603", label: "I need an ambulance" },
      { code: "M-604", label: "There is a fire" },
      { code: "M-605", label: "I need crisis intervention" },
      { code: "M-606", label: "Send law enforcement discreetly" },
      { code: "M-607", label: "Do not announce your arrival" },
      { code: "M-608", label: "Come to my location quietly" },
      { code: "M-609", label: "I need a wellness check" },
      { code: "M-610", label: "My attacker is still present" },
      { code: "M-611", label: "I need emergency housing tonight" },
      { code: "M-612", label: "I need a safe escort out of this place" },
    ],
  },
  /* ── Angel Faith ── */
  {
    name: "Suicidal Crisis", angel: "faith",
    codes: [
      { code: "F-101", label: "I am having thoughts of ending my life" },
      { code: "F-102", label: "I am in a suicidal crisis" },
      { code: "F-103", label: "I have a plan to hurt myself" },
      { code: "F-104", label: "I am not safe right now" },
      { code: "F-105", label: "I need immediate crisis support" },
      { code: "F-106", label: "I have harmed myself" },
      { code: "F-107", label: "I need someone to talk me through this" },
      { code: "F-108", label: "I feel like I am on the edge" },
      { code: "F-109", label: "I need a crisis counselor now" },
      { code: "F-110", label: "I feel like giving up entirely" },
      { code: "F-111", label: "I have attempted before — I feel that pull again" },
      { code: "F-112", label: "Please do not leave me alone right now" },
    ],
  },
  {
    name: "Mental Health Emergency", angel: "faith",
    codes: [
      { code: "F-201", label: "I am having a mental breakdown" },
      { code: "F-202", label: "I am dissociating and cannot function" },
      { code: "F-203", label: "I am in a psychotic episode" },
      { code: "F-204", label: "I cannot stop the thoughts" },
      { code: "F-205", label: "I am experiencing extreme paranoia" },
      { code: "F-206", label: "I feel like I am losing my mind" },
      { code: "F-207", label: "I am unable to care for myself" },
      { code: "F-208", label: "I need emergency psychiatric help" },
      { code: "F-209", label: "I am having a panic attack I cannot stop" },
      { code: "F-210", label: "I need hospitalization" },
      { code: "F-211", label: "I do not know where I am" },
      { code: "F-212", label: "I need someone to take over for me right now" },
    ],
  },
  {
    name: "Emotional Overwhelm", angel: "faith",
    codes: [
      { code: "F-301", label: "I am overwhelmed and cannot cope" },
      { code: "F-302", label: "I am in emotional freefall" },
      { code: "F-303", label: "I am grief-stricken and alone" },
      { code: "F-304", label: "I cannot stop crying" },
      { code: "F-305", label: "I feel completely numb" },
      { code: "F-306", label: "I am in a deep shame spiral" },
      { code: "F-307", label: "I am having a trauma flashback" },
      { code: "F-308", label: "I cannot leave my bed" },
      { code: "F-309", label: "I need someone to check on me" },
      { code: "F-310", label: "I am triggered and need grounding" },
      { code: "F-311", label: "I feel like I am disappearing" },
      { code: "F-312", label: "I need a soft place to land right now" },
    ],
  },
  {
    name: "Spiritual Crisis", angel: "faith",
    codes: [
      { code: "F-401", label: "I am in a spiritual emergency" },
      { code: "F-402", label: "I feel completely abandoned by God or the universe" },
      { code: "F-403", label: "My faith has collapsed" },
      { code: "F-404", label: "I feel I am under spiritual attack" },
      { code: "F-405", label: "I need intercessory prayer urgently" },
      { code: "F-406", label: "I am in a dark night of the soul" },
      { code: "F-407", label: "I am in spiritual despair" },
      { code: "F-408", label: "I feel cursed or spiritually oppressed" },
      { code: "F-409", label: "I need someone to pray with me now" },
      { code: "F-410", label: "I feel lost and cannot hear anything divine" },
      { code: "F-411", label: "I am in a crisis of meaning" },
      { code: "F-412", label: "I need spiritual accompaniment right now" },
    ],
  },
  {
    name: "Trauma Response", angel: "faith",
    codes: [
      { code: "F-501", label: "I am in a trauma response I cannot exit" },
      { code: "F-502", label: "I am frozen — I cannot move or speak" },
      { code: "F-503", label: "My body is in full shutdown" },
      { code: "F-504", label: "I am hyperventilating from fear" },
      { code: "F-505", label: "I am reliving a traumatic memory" },
      { code: "F-506", label: "I am having body memories of past abuse" },
      { code: "F-507", label: "I cannot stop shaking" },
      { code: "F-508", label: "I feel unsafe in my own body" },
      { code: "F-509", label: "I am in fight, flight, freeze, or fawn" },
      { code: "F-510", label: "I need somatic grounding support now" },
      { code: "F-511", label: "I cannot feel my body" },
      { code: "F-512", label: "I am in a PTSD episode" },
    ],
  },
  {
    name: "Check-In & Support", angel: "faith",
    codes: [
      { code: "F-601", label: "Please check on me in 30 minutes" },
      { code: "F-602", label: "Please check on me in 1 hour" },
      { code: "F-603", label: "I need daily check-ins this week" },
      { code: "F-604", label: "I am okay but I need to feel seen" },
      { code: "F-605", label: "I am struggling but not in crisis" },
      { code: "F-606", label: "I need someone to hold space for me" },
      { code: "F-607", label: "I need encouragement right now" },
      { code: "F-608", label: "I am in withdrawal and need support" },
      { code: "F-609", label: "I need accountability today" },
      { code: "F-610", label: "I want someone to know I exist" },
      { code: "F-611", label: "I need a companion for the next hour" },
      { code: "F-612", label: "Please send a kind word to me today" },
    ],
  },
];

/* ─── Signal Queue ───────────────────────────────────────────────────────── */
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

/* ─── Codes Reference Panel (used inside the first-time flow) ────────────── */
function CodesReference() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (name: string) =>
    setExpanded((prev) => (prev === name ? null : name));

  const michaelCats = CODE_CATEGORIES.filter((c) => c.angel === "michael");
  const faithCats   = CODE_CATEGORIES.filter((c) => c.angel === "faith");

  const renderSection = (cats: CodeCategory[], accentCode: string, accentBg: string, accentBorder: string, accentText: string, accentHdr: string) =>
    cats.map((cat) => {
      const open = expanded === cat.name;
      return (
        <div key={cat.name} className={`rounded-xl border ${accentBorder} overflow-hidden`}>
          <button
            onClick={() => toggle(cat.name)}
            className={`w-full flex items-center justify-between px-3 py-2.5 ${accentBg} text-left`}
          >
            <span className={`text-xs font-semibold ${accentHdr} uppercase tracking-wide`}>{cat.name}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-muted-foreground">{cat.codes.length} codes</span>
              {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                transition={{ duration: 0.18 }} className="overflow-hidden"
              >
                <div className="divide-y divide-white/[0.04]">
                  {cat.codes.map((entry) => (
                    <div key={entry.code} className="flex items-start gap-3 px-3 py-2">
                      <span className={`shrink-0 text-[11px] font-bold font-mono ${accentCode} mt-0.5`}>{entry.code}</span>
                      <span className="text-xs text-foreground/80 leading-snug">{entry.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });

  return (
    <div className="space-y-4">
      {/* Michael section */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
          ⚔️ Archangel Michael — Physical Safety (72 codes)
        </p>
        {renderSection(michaelCats, "text-sky-400", "bg-sky-500/10", "border-sky-500/20", "bg-sky-500/10", "text-sky-300")}
      </div>

      {/* Faith section */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
          🕊️ Angel Faith — Inner Crisis (72 codes)
        </p>
        {renderSection(faithCats, "text-teal-400", "bg-violet-500/10", "border-violet-500/20", "bg-violet-500/10", "text-violet-300")}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function DistressSignal() {
  const [phase, setPhase] = useState<
    "closed" | "welcome" | "explain" | "codes" | "first-angel" |
    "verify" | "angel" | "situation" | "sent" | "confirmed"
  >("closed");
  const [accessInput, setAccessInput]     = useState("");
  const [accessError, setAccessError]     = useState(false);
  const [selectedAngel, setSelectedAngel] = useState<AngelType | null>(null);
  const [glitterCount, setGlitterCount]   = useState(0);
  const shakeRef = useRef({ last: 0, count: 0 });

  const safety = getSafetySettings();

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

  const verifyAccess = useCallback(() => {
    if (!safety.setupComplete) { setPhase("angel"); return; }
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
      angel: selectedAngel, situationCode: code, situationLabel: label,
      timestamp: new Date().toISOString(), gpsLat, gpsLng,
      offlineFlag: !navigator.onLine,
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

  const situations  = selectedAngel === "michael" ? MICHAEL_SITUATIONS : FAITH_SITUATIONS;
  const angelLabel  = selectedAngel === "michael" ? "MICHAEL ⚔️" : "FAITH 🕊️";
  const angelAccent = selectedAngel === "michael" ? "text-blue-400" : "text-purple-400";

  return (
    <>
      <GlitterBurst trigger={glitterCount} />

      {/* ── Floating angel button — green glow, left side, above bottom nav ── */}
      <button
        onClick={() => {
          const seen = localStorage.getItem(INTRO_SEEN_KEY);
          setPhase(seen ? "verify" : "welcome");
        }}
        className="fixed bottom-24 left-4 z-50 h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-green-500/20 backdrop-blur-sm border-2 border-green-400/50 shadow-[0_0_20px_rgba(74,222,128,0.5),0_0_40px_rgba(74,222,128,0.2)]"
        aria-label="Angel safety beacon"
      >
        <span className="text-2xl" aria-hidden="true">👼</span>
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
                <button
                  onClick={close}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                  aria-label="Close"
                >
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
                    className="w-28 h-28 mx-auto rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.6),0_0_80px_rgba(74,222,128,0.2)]"
                  >
                    <span className="text-6xl" aria-hidden="true">👼</span>
                  </motion.div>
                  <div className="space-y-3">
                    <p className="font-display text-2xl font-bold text-foreground">
                      You found something sacred.
                    </p>
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

              {/* ══ EXPLAIN — what the feature does ══ */}
              {phase === "explain" && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center shadow-[0_0_24px_rgba(74,222,128,0.4)]">
                      <span className="text-3xl" aria-hidden="true">👼</span>
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">
                      Your Private Silent Distress Beacon
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-400/20">
                      <span className="text-lg shrink-0 mt-0.5">🔒</span>
                      <p>Only you know what the green angel icon does. To everyone else, it is invisible.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-400/20">
                      <span className="text-lg shrink-0 mt-0.5">📡</span>
                      <p>When you tap it and choose a code, a dispatcher on call receives your signal silently and responds — no voice call required, no explanation needed.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-500/10 border border-teal-400/20">
                      <span className="text-lg shrink-0 mt-0.5">🌍</span>
                      <p>Works anywhere in the app, from any room. Your location is captured automatically if permitted. It also queues offline and sends when you reconnect.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                      <span className="text-lg shrink-0 mt-0.5">👼</span>
                      <p>You will choose a guardian angel — one for physical safety, one for inner crisis. You can always use either when you need help.</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setPhase("codes")}
                    size="lg"
                    className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0"
                  >
                    See the 144 Codes
                  </Button>
                </div>
              )}

              {/* ══ CODES — 144 distress code reference ══ */}
              {phase === "codes" && (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <p className="font-display text-lg font-bold text-foreground">
                      Your 144 Distress Codes
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      These are your silent codes. Tap a category to expand it. Your dispatcher knows every one.
                    </p>
                  </div>

                  {/* Scrollable codes list */}
                  <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1">
                    <CodesReference />
                  </div>

                  <Button
                    onClick={() => setPhase("first-angel")}
                    size="lg"
                    className="w-full rounded-2xl text-base py-6 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 border-0"
                  >
                    Choose Your Guardian Angel
                  </Button>
                </div>
              )}

              {/* ══ FIRST-ANGEL — choose preferred angel ══ */}
              {phase === "first-angel" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <p className="font-display text-lg font-bold text-foreground leading-snug">
                      Who do you feel most comfortable calling on?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose based on personal comfort — male or female presence. You can always use either when you need help.
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

              {/* ══ VERIFY ══ */}
              {phase === "verify" && (
                <div className="space-y-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.4)]">
                    <span className="text-2xl" aria-hidden="true">👼</span>
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
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="text-7xl block"
                  >
                    👼
                  </motion.span>
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
