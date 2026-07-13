import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TOUR_HIGHLIGHT_EVENT = "sanctuary-tour-highlight";
export const TOUR_OPEN_EVENT = "sanctuary-tour-open";
const SEEN_KEY = "soul-echoes:tour-seen-v2";

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

type Step = {
  title: string;
  body: string;
  highlightPath?: string | null;
  navigateTo?: string;
};

const STEPS: Step[] = [
  {
    title: "Welcome to your Sanctuary 🌿",
    body:
      "This guided tour walks you through every healing room, voice configuration, and general setting so you never feel lost. Use Next / Back at your pace, or let it auto-play.",
    highlightPath: null,
  },
  {
    title: "Brain Dump — your AI Advocate 🧠",
    body:
      "Home base. Stream thoughts, speak, draw shapes and colors, or connect an AAC device. The trauma-informed Soul Echo AI interprets you gently — no prompt formatting required.",
    highlightPath: "/",
  },
  {
    title: "Journal 📓",
    body:
      "A private space to write, revisit, and reflect. Entries live only with you and support prompts when the page is blank.",
    highlightPath: "/journal",
  },
  {
    title: "Flow 🌬️",
    body:
      "Breathwork, vagus-nerve resets, all 13 chakras (Earth Star as Chakra 0) and Solfeggio frequencies — 8 scrollable practice cards.",
    highlightPath: "/flow",
  },
  {
    title: "Unspoken Chamber 🌊",
    body:
      "For what has no words yet — colors, symbols, and silent shapes become the message. The AI listens visually.",
    highlightPath: "/unspoken",
  },
  {
    title: "Shadow Work 🌑",
    body:
      "Guided descent into the parts you usually hide. Gentle prompts, safe pacing, and a clear exit ramp at every step.",
    highlightPath: "/shadow-work",
  },
  {
    title: "Wisdom ✨",
    body:
      "Readings, teachings, and integration text for every topic. Tap any card to open the full reading.",
    highlightPath: "/wisdom",
  },
  {
    title: "Tools 🧰",
    body:
      "Spiritual and practical instruments — grounding, energy work, mantras, and daily practice supports.",
    highlightPath: "/tools",
  },
  {
    title: "Community 👥",
    body:
      "Four healing circles — Physical, Mental & Emotional, Spiritual Awakening, Energy & Spirit. Share stories and submit feature requests here.",
    highlightPath: "/community",
  },
  {
    title: "Portal 🌀",
    body:
      "The creator shop and healer portal. Practitioner soundscapes, resources, and cross-links to Aurora and Size Me Up live here.",
    highlightPath: "/shop",
  },
  {
    title: "Voice Settings 🔊",
    body:
      "Choose your voice, speaking rate, and TTS provider. Everything the AI reads back to you flows through this panel.",
    highlightPath: "/voice-settings",
  },
  {
    title: "General Settings ⚙️",
    body:
      "Dyslexia-friendly fonts, Calm Tones background, language, safety, and accessibility toggles — all applied globally across the app.",
    highlightPath: "/settings",
  },
  {
    title: "Pricing & Access 📊",
    body:
      "Brain Dump stays free forever. The 33-day trial opens every room; paid tiers remove limits; Ultimate unlocks beta rooms.",
    highlightPath: "/pricing",
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function broadcastHighlight(path: string | null | undefined) {
  window.dispatchEvent(
    new CustomEvent(TOUR_HIGHLIGHT_EVENT, { detail: { path: path ?? null } }),
  );
}

export function SanctuaryTour({ open, onOpenChange }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  const step = useMemo(() => STEPS[index], [index]);
  const total = STEPS.length;

  // Broadcast highlight to sidebar for the current step
  useEffect(() => {
    if (!open) {
      broadcastHighlight(null);
      return;
    }
    broadcastHighlight(step.highlightPath);
    return () => broadcastHighlight(null);
  }, [open, step]);

  // Auto-play
  useEffect(() => {
    if (!open || !playing) return;
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1 < total ? i + 1 : i));
    }, 8500);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open, playing, index, total]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setPlaying(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    }
  }, [open]);

  const close = () => {
    markSeen();
    broadcastHighlight(null);
    onOpenChange(false);
  };

  const visitCurrent = () => {
    if (step.highlightPath) navigate(step.highlightPath);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="sanctuary-tour"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        role="dialog"
        aria-modal="false"
        aria-label="AI Tour and System Guide"
        className="fixed bottom-6 right-6 z-[9999] w-[360px] max-w-[92vw] rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        {/* Iridescent header */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-amber-400/25 via-fuchsia-500/25 to-violet-500/30 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-background/60 flex items-center justify-center ring-1 ring-primary/40">
              <Compass className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                AI Tour & System Guide
              </p>
              <h4 className="text-sm font-semibold text-foreground truncate">
                {step.title}
              </h4>
            </div>
            <button
              onClick={close}
              aria-label="Close tour"
              className="h-7 w-7 rounded-full hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm leading-relaxed text-foreground/90">{step.body}</p>

          {step.highlightPath && (
            <button
              onClick={visitCurrent}
              className="text-xs font-medium text-primary hover:underline"
            >
              Take me there →
            </button>
          )}

          {/* Progress dots */}
          <div className="flex flex-wrap gap-1 pt-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 bg-muted/20">
          <span className="text-[11px] text-muted-foreground font-medium">
            Step {index + 1} of {total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause auto-play" : "Auto-play tour"}
              className="h-8 w-8 rounded-lg border border-border hover:bg-muted flex items-center justify-center text-foreground/80"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous step"
              className="h-8 w-8 rounded-lg border border-border hover:bg-muted flex items-center justify-center text-foreground/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {index < total - 1 ? (
              <button
                onClick={() => setIndex((i) => i + 1)}
                className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={close}
                className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SanctuaryTour;
