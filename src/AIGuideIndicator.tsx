import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlwaysOnListening } from "@/hooks/use-always-on-listening";

type IndicatorState = "idle" | "suggest" | "important" | "distress";

const ROOM_SUGGESTIONS: Record<string, { text: string; card: string; emoji: string }[]> = {
  onboarding: [
    { text: "Take your time. I'm here with you.", card: "Continue", emoji: "💙" },
  ],
  "/": [
    { text: "Would you like to Flow first?", card: "Take me to Flow", emoji: "🌬️" },
    { text: "Ready to do some shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Something unspoken? I can help.", card: "Take me to Unspoken", emoji: "🌊" },
    { text: "Want to explore some wisdom today?", card: "Take me to Wisdom", emoji: "✨" },
  ],
  "/flow": [
    { text: "Great work. Want to journal this feeling?", card: "Take me to Journal", emoji: "📓" },
    { text: "Ready to go deeper with shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Want support from a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/shadow-work": [
    { text: "Heavy work. Want to Flow through it?", card: "Take me to Flow", emoji: "🌬️" },
    { text: "Want to journal what's coming up?", card: "Take me to Journal", emoji: "📓" },
    { text: "Want support from a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/journal": [
    { text: "Want to explore this deeper in shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Need to Flow before continuing?", card: "Take me to Flow", emoji: "🌬️" },
    { text: "Want healer support for what you wrote?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/unspoken": [
    { text: "Want to Flow through what's unspoken?", card: "Take me to Flow", emoji: "🌬️" },
    { text: "Ready to explore this in shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Want a healer to hold space for this?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/wisdom": [
    { text: "Want to apply this wisdom with a healer?", card: "Connect to a Healer", emoji: "💆" },
    { text: "Ready to explore your shadow with this insight?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Want to journal these insights?", card: "Take me to Journal", emoji: "📓" },
  ],
  "/tools": [
    { text: "Want to ground yourself with Flow practices?", card: "Take me to Flow", emoji: "🌬️" },
    { text: "Ready to journal your spiritual practice?", card: "Take me to Journal", emoji: "📓" },
    { text: "Want to deepen this with a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/community": [
    { text: "Want to connect with a healer one-on-one?", card: "Connect to a Healer", emoji: "💆" },
    { text: "Ready to share what you've been journaling?", card: "Take me to Journal", emoji: "📓" },
    { text: "Need to Flow first?", card: "Take me to Flow", emoji: "🌬️" },
  ],
  "/practitioner": [
    { text: "You're taking a powerful step. I'm proud of you.", card: "Take me to Flow", emoji: "🌬️" },
    { text: "While you wait, want to Flow together?", card: "Take me to Flow", emoji: "🌬️" },
  ],
  "/crisis": [
    { text: "You are not alone. I am right here with you.", card: "Take me to Flow", emoji: "🌬️" },
    { text: "Let's Flow together right now.", card: "Take me to Flow", emoji: "🌬️" },
  ],
};

const DISTRESS_CARD = {
  text: "I'm here. You are safe. Do you need help?",
  card: "Get Crisis Support",
  emoji: "🆘",
};

const ROOM_MAP: Record<string, string> = {
  "Take me to Flow": "/flow",
  "Take me to Shadow Work": "/shadow-work",
  "Take me to Journal": "/journal",
  "Take me to Unspoken": "/unspoken",
  "Take me to Wisdom": "/wisdom",
  "Take me to Tools": "/tools",
  "Take me to Community": "/community",
  "Connect to a Healer": "/practitioner",
  "Get Crisis Support": "/crisis",
};

interface AIGuideIndicatorProps {
  inputMethod?: string;
}

export default function AIGuideIndicator({ inputMethod = "speak" }: AIGuideIndicatorProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoom = location.pathname;

  const [indicatorState, setIndicatorState] = useState<IndicatorState>("idle");
  const [expanded, setExpanded] = useState(false);
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

  // Rotate suggestions on a 2-minute timer when room changes
  useEffect(() => {
    suggestionIndexRef.current = 0;
    setIndicatorState("idle");
    setExpanded(false);
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
    setExpanded(true);
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

  useAlwaysOnListening({
    onDistress: handleDistress,
    onTranscript: handleTranscript,
    enabled: true,
  });

  const handleTap = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      if (!currentSuggestion) {
        const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];
        const idx = suggestionIndexRef.current % suggestions.length;
        setCurrentSuggestion(suggestions[idx]);
        suggestionIndexRef.current++;
      }
      if (inputMethod === "speak" && currentSuggestion) speak(currentSuggestion.text);
    } else {
      setExpanded(false);
      if (indicatorState !== "distress") setIndicatorState("idle");
    }
  }, [expanded, indicatorState, currentRoom, inputMethod, currentSuggestion, speak]);

  const handleCardSelect = useCallback((card: string) => {
    setExpanded(false);
    setIndicatorState("idle");
    hasDistressRef.current = false;
    const path = ROOM_MAP[card];
    if (path) navigate(path);
  }, [navigate]);

  const stateStyles = {
    idle:      { bg: "bg-white/10",      border: "border-white/20",      glow: "" },
    suggest:   { bg: "bg-purple-500/20", border: "border-purple-400/40", glow: "shadow-purple-500/30 shadow-lg" },
    important: { bg: "bg-yellow-500/20", border: "border-yellow-400/40", glow: "shadow-yellow-500/40 shadow-lg" },
    distress:  { bg: "bg-red-500/20",    border: "border-red-400/60",    glow: "shadow-red-500/50 shadow-xl" },
  };

  const style = stateStyles[indicatorState];

  const pulseVariants: Record<string, any> = {
    idle:      { scale: 1, opacity: 0.4 },
    suggest:   { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7], transition: { duration: 2, repeat: Infinity } },
    important: { scale: [1, 1.2, 1],  opacity: [0.8, 1, 0.8], transition: { duration: 1.5, repeat: Infinity } },
    distress:  { scale: [1, 1.3, 1],  opacity: [0.9, 1, 0.9], transition: { duration: 0.8, repeat: Infinity } },
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && currentSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-64 rounded-2xl border border-white/20 bg-background/90 backdrop-blur-md p-4 shadow-2xl space-y-3"
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
              onClick={() => setExpanded(false)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
            >
              I'll stay here for now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        variants={pulseVariants}
        animate={indicatorState}
        onClick={handleTap}
        aria-label="AI Guide — tap for suggestion"
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${style.bg} ${style.border} ${style.glow}`}
      >
        <span className="text-xl">✨</span>
      </motion.button>
    </div>
  );
}
