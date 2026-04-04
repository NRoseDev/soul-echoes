import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlwaysOnListening } from "@/hooks/use-always-on-listening";

interface AIGuideIndicatorProps {
  inputMethod?: string;
  currentRoom?: string;
  onNavigate?: (path: string) => void;
  onDistress?: () => void;
}

type IndicatorState = "idle" | "suggest" | "important" | "distress";

const ROOM_SUGGESTIONS: Record<string, { text: string; card: string; emoji: string }[]> = {
  "/": [
    { text: "Would you like to breathe first?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Ready to do some shadow work?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Something unspoken? I can help.", card: "Take me to Unspoken", emoji: "🌊" },
  ],
  "/breathe": [
    { text: "Great work. Want to journal this?", card: "Take me to Journal", emoji: "📓" },
    { text: "Ready to go deeper?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/shadow-work": [
    { text: "Heavy work. Want to breathe?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Want support from a healer?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/journal": [
    { text: "Want to explore this deeper?", card: "Take me to Shadow Work", emoji: "🌑" },
    { text: "Need support?", card: "Connect to a Healer", emoji: "💆" },
  ],
  "/unspoken": [
    { text: "Want to breathe through this?", card: "Take me to Breathe", emoji: "🌬️" },
    { text: "Ready for healer support?", card: "Connect to a Healer", emoji: "💆" },
  ],
};

const DISTRESS_CARD = {
  text: "I'm here. You are safe. Do you need help?",
  card: "Get Crisis Support",
  emoji: "🆘",
};

export default function AIGuideIndicator({
  inputMethod = "speak",
  currentRoom = "/",
  onNavigate,
  onDistress,
}: AIGuideIndicatorProps) {
  const [indicatorState, setIndicatorState] = useState<IndicatorState>("idle");
  const [expanded, setExpanded] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<{
    text: string;
    card: string;
    emoji: string;
  } | null>(null);
  const [spokenResponse, setSpokenResponse] = useState<string | null>(null);
  const suggestionIndexRef = useRef(0);
  const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasDistressRef = useRef(false);

  // speak helper
  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }, []);

  // rotate suggestions every 2 minutes
  useEffect(() => {
    const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];
    suggestionTimerRef.current = setTimeout(() => {
      const idx = suggestionIndexRef.current % suggestions.length;
      setCurrentSuggestion(suggestions[idx]);
      suggestionIndexRef.current++;
      setIndicatorState("suggest");
    }, 120000);
    return () => {
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    };
  }, [currentRoom]);

  // handle distress
  const handleDistress = useCallback(() => {
    if (hasDistressRef.current) return;
    hasDistressRef.current = true;
    setIndicatorState("distress");
    setCurrentSuggestion(DISTRESS_CARD);
    setExpanded(true);
    onDistress?.();
    if (inputMethod === "speak") speak(DISTRESS_CARD.text);
  }, [inputMethod, onDistress, speak]);

  // handle transcript
  const handleTranscript = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];

    // check for help phrases
    if (["tired", "exhausted", "overwhelmed", "can't breathe", "breaking down"].some(p => lower.includes(p))) {
      const idx = suggestionIndexRef.current % suggestions.length;
      setCurrentSuggestion(suggestions[idx]);
      setIndicatorState("important");
      setExpanded(false);
      if (inputMethod === "speak") {
        setTimeout(() => speak("I noticed something. Tap the star when you're ready."), 1000);
      }
    }
  }, [currentRoom, inputMethod, speak]);

  useAlwaysOnListening({
    onDistress: handleDistress,
    onTranscript: handleTranscript,
    enabled: true,
  });

  // user taps the indicator
  const handleTap = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      if (indicatorState === "idle") {
        const suggestions = ROOM_SUGGESTIONS[currentRoom] || ROOM_SUGGESTIONS["/"];
        const idx = suggestionIndexRef.current % suggestions.length;
        setCurrentSuggestion(suggestions[idx]);
        suggestionIndexRef.current++;
      }
      if (inputMethod === "speak" && currentSuggestion) {
        speak(currentSuggestion.text);
      }
      if (inputMethod === "point" && currentSuggestion) {
        setSpokenResponse(currentSuggestion.text);
      }
    } else {
      setExpanded(false);
      setSpokenResponse(null);
      if (indicatorState !== "distress") setIndicatorState("idle");
    }
  }, [expanded, indicatorState, currentRoom, inputMethod, currentSuggestion, speak]);

  // user selects suggestion card
  const handleCardSelect = useCallback((card: string) => {
    setExpanded(false);
    setIndicatorState("idle");
    setSpokenResponse(null);
    hasDistressRef.current = false;
    if (card === "Connect to a Healer" || card === "Get Crisis Support") {
      onNavigate?.("/practitioner");
    } else {
      const roomMap: Record<string, string> = {
        "Take me to Breathe": "/breathe",
        "Take me to Shadow Work": "/shadow-work",
        "Take me to Journal": "/journal",
        "Take me to Unspoken": "/unspoken",
      };
      if (roomMap[card]) onNavigate?.(roomMap[card]);
    }
  }, [onNavigate]);

  // indicator colors
  const stateStyles = {
    idle:      { bg: "bg-white/10",      border: "border-white/20",    text: "text-white/40",  glow: "" },
    suggest:   { bg: "bg-purple-500/20", border: "border-purple-400/40", text: "text-purple-300", glow: "shadow-purple-500/30 shadow-lg" },
    important: { bg: "bg-yellow-500/20", border: "border-yellow-400/40", text: "text-yellow-300", glow: "shadow-yellow-500/40 shadow-lg" },
    distress:  { bg: "bg-red-500/20",    border: "border-red-400/60",   text: "text-red-300",  glow: "shadow-red-500/50 shadow-xl" },
  };

  const style = stateStyles[indicatorState];

  const pulseVariants = {
    idle:      { scale: [1, 1], opacity: [0.4, 0.4] },
    suggest:   { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7], transition: { duration: 2, repeat: Infinity } },
    important: { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], transition: { duration: 1.5, repeat: Infinity } },
    distress:  { scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9], transition: { duration: 0.8, repeat: Infinity } },
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">

      {/* Expanded suggestion panel */}
      <AnimatePresence>
        {expanded && currentSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-64 rounded-2xl border border-white/20 bg-background/90 backdrop-blur-md p-4 shadow-2xl space-y-3"
          >
            {/* text or card based on input method */}
            {(inputMethod === "speak" || inputMethod === "type") && (
              <p className="text-sm text-foreground text-center leading-relaxed">
                {currentSuggestion.text}
              </p>
            )}

            {(inputMethod === "point" || inputMethod === "sign") && spokenResponse && (
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">Soul Echoes suggests:</p>
                <p className="text-sm text-foreground leading-relaxed">{currentSuggestion.text}</p>
              </div>
            )}

            {/* action card — always shown */}
            <button
              onClick={() => handleCardSelect(currentSuggestion.card)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <span className="text-2xl">{currentSuggestion.emoji}</span>
              <span className="text-sm font-medium text-foreground">{currentSuggestion.card}</span>
            </button>

            {/* stay option */}
            <button
              onClick={() => { setExpanded(false); setSpokenResponse(null); }}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
            >
              I'll stay here for now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The ✨ indicator button */}
      <motion.button
        variants={pulseVariants}
        animate={indicatorState}
        onClick={handleTap}
        aria-label="AI Guide — tap for suggestion"
        className={`
          w-12 h-12 rounded-full border-2 flex items-center justify-center
          backdrop-blur-md transition-all cursor-pointer
          ${style.bg} ${style.border} ${style.glow}
        `}
      >
        <span className={`text-xl ${style.text}`}>✨</span>
      </motion.button>

    </div>
  );
}
