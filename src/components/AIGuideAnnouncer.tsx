import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, X } from "lucide-react";

/**
 * AI Guide Announcer — speaks instructions aloud AND displays them as text on screen.
 * Ensures deaf/HoH users always see what the guide says.
 * Use the global announce() function to trigger announcements from anywhere.
 */

interface Announcement {
  id: number;
  text: string;
}

let globalAnnounce: (text: string) => void = () => {};

/** Call this from anywhere to make the AI guide speak and display a message */
export function announceGuide(text: string) {
  globalAnnounce(text);
}

const PREFERRED_VOICES = ["samantha", "karen", "moira", "google uk english female", "google us english female", "microsoft zira"];

function getSoftVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() || [];
  for (const pref of PREFERRED_VOICES) {
    const match = voices.find(v => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }
  return voices.find(v => v.lang.startsWith("en") && /female|zira|samantha|karen/i.test(v.name)) || null;
}

export default function AIGuideAnnouncer() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const idRef = useRef(0);
  const dismissTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const announce = useCallback((text: string) => {
    const id = ++idRef.current;

    // Add to visible announcements
    setAnnouncements(prev => [...prev.slice(-2), { id, text }]); // keep max 3

    // Speak it aloud
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = getSoftVoice();
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }

    // Auto-dismiss after duration based on text length
    const duration = Math.max(5000, text.length * 60 + 3000);
    const timer = setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      dismissTimersRef.current.delete(id);
    }, duration);
    dismissTimersRef.current.set(id, timer);
  }, []);

  // Register global announce function
  useEffect(() => {
    globalAnnounce = announce;
    return () => { globalAnnounce = () => {}; };
  }, [announce]);

  // Clean up timers
  useEffect(() => {
    return () => {
      dismissTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const dismiss = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    const timer = dismissTimersRef.current.get(id);
    if (timer) { clearTimeout(timer); dismissTimersRef.current.delete(id); }
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[90] w-full max-w-md px-4 pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {announcements.map(a => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl px-4 py-3 shadow-lg flex items-start gap-3"
          >
            <div className="shrink-0 mt-0.5">
              <Volume2 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-foreground font-body flex-1 leading-relaxed" role="status" aria-live="polite">
              {a.text}
            </p>
            <button
              onClick={() => dismiss(a.id)}
              className="shrink-0 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
