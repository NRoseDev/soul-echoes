import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Brain,
  Hand,
  Wind,
  ShieldAlert,
  Stethoscope,
  Crown,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Play,
  Pause,
} from "lucide-react";

export interface SanctuaryTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TourStep = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  /** Sidebar path to pulse-flash while this step is active. */
  highlightPath?: string;
  body: React.ReactNode;
  cta?: { label: string; path?: string; url?: string };
};

const STEPS: TourStep[] = [
  {
    id: "brain-dump",
    title: "The Brain Dump & AI Advocate",
    subtitle: "Step 1 of 8",
    icon: Brain,
    accent: "from-amber-400/30 to-rose-400/20",
    highlightPath: "/",
    body: (
      <>
        <p>
          The Brain Dump is your home base. Our trauma-informed{" "}
          <strong>Soul Echo AI</strong> listens to streaming thoughts, spoken
          audio, or nonverbal shapes and colors drawn on the expression
          canvas.
        </p>
        <p>
          You never have to worry about how to "prompt" or format anything —
          the AI interprets your choices with deep empathy and meets you
          where you are.
        </p>
      </>
    ),
    cta: { label: "Open Brain Dump", path: "/" },
  },
  {
    id: "communication",
    title: "Universal Communication Freedom",
    subtitle: "Step 2 of 8",
    icon: Hand,
    accent: "from-teal-400/30 to-sky-400/20",
    body: (
      <>
        <p>
          Switch between five input methods on the fly, inside any room,
          any time:
        </p>
        <ul className="grid grid-cols-1 gap-1.5 text-sm">
          <li>🗣️ <strong>Speak It</strong> — voice input & audio output</li>
          <li>🤟 <strong>Sign It</strong> — sign language with camera</li>
          <li>👆 <strong>Point It</strong> — tap pictures & cards</li>
          <li>⌨️ <strong>Type It</strong> — keyboard & text</li>
          <li>🔌 <strong>Connect Device</strong> — AAC hardware, eye-gaze
            trackers, Braille displays, or switches via Bluetooth, USB, or
            the 3.5mm audio port</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Tap the communication chip at the top-right of any page to switch.
        </p>
      </>
    ),
  },
  {
    id: "rooms",
    title: "Inside the Healing Rooms — the Flow Tour",
    subtitle: "Step 3 of 8",
    icon: Wind,
    accent: "from-sky-400/30 to-indigo-400/20",
    highlightPath: "/flow",
    body: (
      <>
        <p>
          Every room goes deep. The <strong>Flow</strong> space alone holds{" "}
          <strong>8 scrollable section cards</strong> that unpack:
        </p>
        <ul className="grid grid-cols-1 gap-1 text-sm">
          <li>• Meditation styles for every temperament</li>
          <li>• All <strong>13 chakras</strong> — including{" "}
            <strong>Earth Star as Chakra 0</strong></li>
          <li>• Breathwork techniques for grounding & release</li>
          <li>• Vagus nerve stimulation practices</li>
          <li>• Solfeggio frequencies & sound healing</li>
        </ul>
        <p>
          Journal, Wisdom, Unspoken Chamber, Shadow Work, and Tools all go
          just as deep.
        </p>
      </>
    ),
    cta: { label: "Enter Flow", path: "/flow" },
  },
  {
    id: "safety",
    title: "Hardened Safety & SOS Signals",
    subtitle: "Step 4 of 8",
    icon: ShieldAlert,
    accent: "from-rose-400/30 to-red-400/20",
    body: (
      <>
        <p>
          If an emotional crisis occurs, the system routes you instantly.
          Our secured backend logs <strong>distress_signals</strong>{" "}
          through a strict validation layer and dispatches immediate access
          to <strong>Intercessors on Call</strong> and human dispatchers to
          protect you in real time.
        </p>
        <p className="text-xs text-muted-foreground">
          The SOS beacon lives in the floating hub — always one tap away.
        </p>
      </>
    ),
    cta: { label: "Crisis Support", path: "/crisis-counselor" },
  },
  {
    id: "practitioners",
    title: "The Dual Professional Network",
    subtitle: "Step 5 of 8",
    icon: Stethoscope,
    accent: "from-emerald-400/30 to-teal-400/20",
    body: (
      <>
        <p>
          Verified holistic health specialists can securely log in to
          cross-sync metrics, review permitted client logs, and publish
          custom mindfulness soundscapes and resource cards straight into
          the ecosystem.
        </p>
        <p>You choose which healer to connect with — and what they can see.</p>
      </>
    ),
    cta: { label: "Practitioner Portal", path: "/practitioner-connect" },
  },
  {
    id: "tiers",
    title: "Understanding the Access Tiers",
    subtitle: "Step 6 of 8",
    icon: Crown,
    accent: "from-amber-400/30 to-yellow-400/20",
    highlightPath: "/pricing",
    body: (
      <>
        <ul className="grid gap-2 text-sm">
          <li>
            💛 <strong>Brain Dump</strong> — always <em>completely unlimited
            and free</em>.
          </li>
          <li>
            🌱 <strong>Individual Free Tier</strong> — 33-day full trial.
            After that, regular rooms limit to 1 use per space every 11 days.
          </li>
          <li>
            🌊 <strong>$1 – $7 paid tracks</strong> — remove room-entry
            restrictions across the sanctuary.
          </li>
          <li>
            👑 <strong>$9 Ultimate Tier</strong> — opens exclusive beta
            testing rooms first.
          </li>
        </ul>
      </>
    ),
    cta: { label: "See Pricing", path: "/pricing" },
  },
  {
    id: "community",
    title: "The Community Evolution Hub",
    subtitle: "Step 7 of 8",
    icon: Users,
    accent: "from-violet-400/30 to-fuchsia-400/20",
    highlightPath: "/community",
    body: (
      <>
        <p>
          The <strong>Community</strong> tab is where you find stories,
          support, and deep communal connection alongside others walking the
          exact same path. It's organized into <strong>4 distinct healing
          circles</strong>:
        </p>
        <ul className="grid gap-2 text-sm">
          <li>
            🌿 <strong>Physical</strong> — for bodies that ache and bodies
            that remember.
          </li>
          <li>
            💭 <strong>Mental & Emotional</strong> — for minds that
            won't quiet.
          </li>
          <li>
            🌅 <strong>Spiritual Awakening</strong> — for souls returning
            home.
          </li>
          <li>
            ✨ <strong>Energy & Spirit</strong> — for those journeying
            beyond the veil.
          </li>
        </ul>
        <p>
          The healing libraries grow continuously as we bring on more
          healers, and this is also the dedicated feedback zone — your voice
          shapes what gets built next.
        </p>
      </>
    ),
    cta: { label: "Visit Community", path: "/community" },
  },
  {
    id: "ecosystem",
    title: "The Creator Ecosystem Portfolio",
    subtitle: "Step 8 of 8",
    icon: Sparkles,
    accent: "from-fuchsia-400/30 to-purple-400/20",
    body: (
      <>
        <p>Explore the creator's wider digital network:</p>
        <div className="space-y-2">
          <a
            href="https://aurora.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
          >
            <span className="text-2xl">🌅</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm flex items-center gap-1">
                Aurora <ExternalLink className="h-3 w-3" />
              </p>
              <p className="text-xs text-muted-foreground">
                The ultimate smart creator selling & incubation platform.
              </p>
            </div>
          </a>
          <a
            href="https://sizemeup.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
          >
            <span className="text-2xl">📏</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm flex items-center gap-1">
                Size Me Up <ExternalLink className="h-3 w-3" />
              </p>
              <p className="text-xs text-muted-foreground">
                Universal cross-retailer fit filtering for every body.
              </p>
            </div>
          </a>
        </div>
      </>
    ),
  },
];

const TOUR_SEEN_KEY = "soul-echoes-tour-completed";
const AUTOPLAY_MS = 9500;

/** Broadcast which sidebar path (if any) should pulse-flash right now. */
export const TOUR_HIGHLIGHT_EVENT = "sanctuary-tour-highlight";

function emitHighlight(path: string | null) {
  window.dispatchEvent(
    new CustomEvent(TOUR_HIGHLIGHT_EVENT, { detail: { path } }),
  );
}

export function SanctuaryTour({ open, onOpenChange }: SanctuaryTourProps) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Reset on open / clear highlight on close.
  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setAutoplay(true);
    } else {
      emitHighlight(null);
    }
  }, [open]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const Icon = step.icon;

  // Broadcast current highlight target whenever the active step changes.
  useEffect(() => {
    if (!open) return;
    emitHighlight(step.highlightPath ?? null);
  }, [open, step.highlightPath]);

  // Auto-advance while playing.
  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!open || !autoplay || isLast) return;
    timerRef.current = window.setTimeout(() => {
      setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open, autoplay, stepIndex, isLast]);

  const goPrev = () => {
    setAutoplay(false);
    setStepIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    setAutoplay(false);
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const finish = () => {
    try { localStorage.setItem(TOUR_SEEN_KEY, "true"); } catch {}
    emitHighlight(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col p-0 bg-background/95 backdrop-blur-xl border-border/60">
        <div className={`bg-gradient-to-br ${step.accent} px-6 pt-6 pb-4`}>
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-background/60 backdrop-blur flex items-center justify-center ring-1 ring-border">
                <Icon className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {step.subtitle}
                </p>
                <DialogTitle className="text-lg leading-tight text-left">
                  {step.title}
                </DialogTitle>
              </div>
              <button
                onClick={() => setAutoplay((p) => !p)}
                aria-label={autoplay ? "Pause auto-play" : "Resume auto-play"}
                title={autoplay ? "Pause auto-play" : "Resume auto-play"}
                className="h-8 w-8 rounded-full bg-background/60 hover:bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-border transition-colors"
              >
                {autoplay ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <DialogDescription className="sr-only">
              Master Sanctuary Tour — {step.title}
            </DialogDescription>
          </DialogHeader>
          {/* progress */}
          <div className="mt-4 flex gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setAutoplay(false); setStepIndex(i); }}
                aria-label={`Jump to ${s.title}`}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < stepIndex
                    ? "bg-foreground/70"
                    : i === stepIndex
                      ? "bg-foreground/90"
                      : "bg-foreground/15 hover:bg-foreground/30"
                }`}
              >
                {i === stepIndex && autoplay && !isLast && (
                  <motion.span
                    key={`${s.id}-fill`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    className="block h-full bg-amber-300 rounded-full origin-left"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 text-sm leading-relaxed text-foreground/90"
            >
              {step.body}
              {step.cta && (step.cta.path || step.cta.url) && (
                <button
                  onClick={() => {
                    if (step.cta?.path) {
                      setAutoplay(false);
                      emitHighlight(null);
                      onOpenChange(false);
                      navigate(step.cta.path);
                    } else if (step.cta?.url) {
                      window.open(step.cta.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all text-sm font-medium"
                >
                  {step.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-2 bg-background/60">
          <button
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={finish}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          {isLast ? (
            <button
              onClick={finish}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Check className="h-4 w-4" /> Finish
            </button>
          ) : (
            <button
              onClick={goNext}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(TOUR_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}
