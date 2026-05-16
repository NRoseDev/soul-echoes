import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Heart, Users, Sparkles } from "lucide-react";
import ASLSignInput from "@/components/ASLSignInput";
import { useAlwaysOnListening } from "@/hooks/use-always-on-listening";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Safe static asset paths that do not crash the bundler
const aiNavigatorIcon = "/Icon-AI%20navigator.png";
const aslIcon = "/Icon-ASL.png";
const voiceIcon = "/Icon-voice.png";
const sosIcon = "/Icon-sos.png";
const prayerIcon = "/Icon-prayer.png";
const portalIcon = "/Icon-portal.png";

type IndicatorState = "idle" | "suggest" | "important" | "distress";

const ROOM_SUGGESTIONS: Record<string, { text: string; card: string; emoji: string }[]> = {
  "/": [
    { text: "Would you like to breathe first?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Ready to do some shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Something unspoken? I can help.", card: "Take me to Unspoken", emoji: "🌊" },
    { text: "Want to explore some wisdom today?", card: "Take me to Wisdom", emoji: "✨" },
  ],
  "/breathe": [
    { text: "Great work. Want to journal this feeling?", card: "Take me to Journal", emoji: "📓" },
    { text: "Ready to go deeper with shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Want support from a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/shadow-work": [
    { text: "Heavy work. Want to breathe through it?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Want to journal what's coming up?", card: "Take me to Journal", emoji: "📓" },
    { text: "Want support from a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/journal": [
    { text: "Want to explore this deeper in shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Need a breath before continuing?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Want healer support for what you wrote?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/unspoken": [
    { text: "Want to breathe through what's unspoken?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Ready to explore this in shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Want a healer to hold space for this?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/wisdom": [
    { text: "Want to apply this wisdom with a healer?", card: "Connect to a Healer", emoji: "💆" },
    { text: "Ready to explore your shadow with this insight?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Want to journal these insights?", card: "Take me to Journal", emoji: "📓" },
  ],
  "/spiritual-tools": [
    { text: "Want to ground yourself with breathwork?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Ready to journal your spiritual practice?", card: "Take me to Journal", emoji: "📓" },
    { text: "Want to deepen this with a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
};

const DISTRESS_CARD = { text: "I'm here. You are safe. Do you need help?", card: "Get Crisis Support", emoji: "🆘" };

const ROOM_MAP: Record<string, string> = {
  "Take me to Breathe": "/breathe",
  "Take me to Shadow Work": "/shadow-work",
  "Take me to Journal": "/journal",
  "Take me to Unspoken": "/unspoken",
  "Take me to Wisdom": "/wisdom",
  "Take me to Spiritual Tools": "/spiritual-tools",
  "Connect to a Healer": "/shop",
  "Get Crisis Support": "/shop",
};

interface FloatingHubProps {
  inputMethod?: string;
}

export default function FloatingHub({ inputMethod = "type" }: FloatingHubProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoom = location.pathname;
  const [hubOpen, setHubOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"ai" | "asl" | null>(null);
  const [intercessorOpen, setIntercessorOpen] = useState(false);
  const [indicatorState, setIndicatorState] = useState<IndicatorState>("idle");
  const [currentSuggestion, setCurrentSuggestion] = useState<{ text: string; card: string; emoji: string } | null>(null);
  const suggestionIndexRef = useRef(0);
  const hasDistressRef = useRef(false);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }, []);

  useEffect(() => {
    suggestionIndexRef.current = 0;
    setIndicatorState("idle");
    setHubOpen(false);
    setActivePanel(null);
    setCurrentSuggestion(null);
    hasDistressRef.current = false;

    const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];
    const timer = setTimeout(() => {
      const idx = suggestionIndexRef.current % suggestions.length;
      setCurrentSuggestion(suggestions[idx]);
      suggestionIndexRef.current++;
      setIndicatorState("suggest");
    }, 120000);

    return () => clearTimeout(timer);
  }, [currentRoom]);

  const handleDistress = useCallback(() => {
    if (hasDistressRef.current) return;
    hasDistressRef.current = true;
    setIndicatorState("distress");
    setCurrentSuggestion(DISTRESS_CARD);
    setHubOpen(true);
    setActivePanel("ai");
  }, []);

  const handleTranscript = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];
    if (["tired", "exhausted", "overwhelmed", "can't breathe", "breaking down", "falling apart"].some(p => lower.includes(p))) {
      const idx = suggestionIndexRef.current % suggestions.length;
      setCurrentSuggestion(suggestions[idx]);
      suggestionIndexRef.current++;
      setIndicatorState("important");
    }
  }, [currentRoom]);

  useAlwaysOnListening({ onDistress: handleDistress, onTranscript: handleTranscript, enabled: true });

  const handleCardSelect = useCallback((card: string) => {
    setHubOpen(false);
    setActivePanel(null);
    setIndicatorState("idle");
    hasDistressRef.current = false;
    const path = ROOM_MAP[card];
    if (path) navigate(path);
  }, [navigate]);

  const openSOS = () => {
    setHubOpen(false);
    setActivePanel(null);
    window.dispatchEvent(new CustomEvent("soul-echoes-open-sos"));
  };

  const openAI = () => {
    setActivePanel(activePanel === "ai" ? null : "ai");
    if (!currentSuggestion) {
      const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];
      const idx = suggestionIndexRef.current % suggestions.length;
      setCurrentSuggestion(suggestions[idx]);
      suggestionIndexRef.current++;
    }
    if (inputMethod === "speak" && currentSuggestion) speak(currentSuggestion.text);
  };

  const openASL = () => {
    setActivePanel(activePanel === "asl" ? null : "asl");
  };

  const handleASLSend = (text: string) => {
    toast.success(`Sent: ${text}`, { duration: 2500 });
    navigate("/");
  };

  const stateStyles = {
    idle: { bg: "bg-white/10", border: "border-white/20", glow: "" },
    suggest: { bg: "bg-purple-500/20", border: "border-purple-400/40", glow: "shadow-purple-500/30 shadow-lg" },
    important: { bg: "bg-yellow-500/20", border: "border-yellow-400/40", glow: "shadow-yellow-500/40 shadow-lg" },
    distress: { bg: "bg-red-500/20", border: "border-red-400/60", glow: "shadow-red-500/50 shadow-xl" },
  };

  const style = stateStyles[indicatorState];

  const pulseVariants: Record<string, any> = {
    idle: { scale: 1, opacity: 0.7 },
    suggest: { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7], transition: { duration: 2, repeat: Infinity } },
    important: { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], transition: { duration: 1.5, repeat: Infinity } },
    distress: { scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9], transition: { duration: 0.8, repeat: Infinity } },
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {hubOpen && activePanel === "ai" && currentSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-1 w-64 rounded-2xl border border-white/20 bg-background/90 backdrop-blur-md p-4 shadow-2xl space-y-3"
          >
            <p className="text-sm text-foreground text-center leading-relaxed">{currentSuggestion.text}</p>
            <button
              onClick={() => handleCardSelect(currentSuggestion.card)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <span className="text-2xl">{currentSuggestion.emoji}</span>
              <span className="text-sm font-medium text-foreground">{currentSuggestion.card}</span>
            </button>
            <button
              onClick={() => setActivePanel(null)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
            >
              I'll stay here for now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hubOpen && activePanel === "asl" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-1 w-80 max-h-[60vh] overflow-y-auto rounded-2xl border border-white/20 bg-background/95 backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-sm font-semibold text-foreground">ASL Cards &amp; Camera</p>
              <button
                onClick={() => setActivePanel(null)}
                className="h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <ASLSignInput onSend={handleASLSend} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hubOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-end gap-2"
          >
            <button
              onClick={openASL}
              aria-label="ASL cards and camera"
              title="ASL sign cards and camera"
              className={`h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-sm border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden ${
                activePanel === "asl" ? "bg-teal-500/30 border-teal-400/60" : "bg-white/10 border-white/20"
              }`}
            >
              <img src={aslIcon} alt="ASL" loading="eager" decoding="async" className="w-full h-full object-cover rounded-full" />
            </button>

            <button
              onClick={() => {
                setHubOpen(false);
                setActivePanel(null);
                navigate("/voice-settings");
              }}
              aria-label="Voice settings"
              title="Voice settings"
              className="h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-sm border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden bg-white/10 border-white/20"
            >
              <img src={voiceIcon} alt="Voice" loading="eager" decoding="async" className="w-full h-full object-cover rounded-full" />
            </button>

            <button
              onClick={openSOS}
              aria-label="SOS — angel safety beacon"
              title="SOS — connect to intercessor or healer"
              className="h-11 w-11 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm border-2 border-blue-300/60 shadow-[0_0_18px_rgba(147,197,253,0.55)] hover:scale-110 active:scale-95 transition-all overflow-hidden"
            >
              <img src={sosIcon} alt="SOS" loading="eager" decoding="async" className="w-full h-full object-cover rounded-full" />
            </button>

            <button
              onClick={() => {
                setHubOpen(false);
                setActivePanel(null);
                setIntercessorOpen(true);
              }}
              aria-label="Intercessors and prayer"
              title="Intercessors and prayer"
              className="h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-sm border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden bg-white/10 border-white/20"
            >
              <img src={prayerIcon} alt="Prayer" loading="eager" decoding="async" className="w-full h-full object-cover rounded-full" />
            </button>

            <button
              onClick={() => {
                setHubOpen(false);
                setActivePanel(null);
                navigate("/shop");
              }}
              aria-label="Healer portal and shop"
              title="Healer portal and shop"
              className="h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-sm border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden bg-white/10 border-white/20"
            >
              <img src={portalIcon} alt="Portal" loading="eager" decoding="async" className="w-full h-full object-cover rounded-full" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        variants={pulseVariants}
        animate={indicatorState}
        onClick={() => {
          setHubOpen((o) => !o);
          if (hubOpen) setActivePanel(null);
        }}
        aria-label="Soul Echoes guide — tap to open"
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${style.bg} ${style.border} ${style.glow}`}
      >
        <AnimatePresence mode="wait">
          {hubOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5 text-foreground/70" />
            </motion.span>
          ) : (
            <motion.img
              key="ai-nav"
              src={aiNavigatorIcon}
              alt="Soul Echoes"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
