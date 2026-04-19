import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, X } from "lucide-react";

interface Announcement {
  id: number;
  text: string;
}

let globalAnnounce: (text: string) => void = () => {};

export function announceGuide(text: string) {
  globalAnnounce(text);
}

function getSoftVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() || [];
  try {
    const raw = localStorage.getItem("soul-echoes-voice-settings");
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.voiceURI) {
        const match = voices.find(v => v.voiceURI === settings.voiceURI);
        if (match) return match;
      }
    }
  } catch {}
  return voices.find(v => v.lang.startsWith("en")) || null;
}

export default function AIGuideAnnouncer() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const idRef = useRef(0);
  const dismissTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const announce = useCallback((text: string) => {
    const id = ++idRef.current;
    setAnnouncements(prev => [...prev.slice(-2), { id, text }]);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = getSoftVoice();
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
    const duration = Math.max(5000, text.length * 60 + 3000);
    const timer = setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      dismissTimersRef.current.delete(id);
    }, duration);
    dismissTimersRef.current.set(id, timer);
  }, []);

  useEffect(() => {
    globalAnnounce = announce;
    return () => { globalAnnounce = () => {}; };
  }, [announce]);

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
