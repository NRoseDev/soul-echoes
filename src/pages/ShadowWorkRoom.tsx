import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartHandshake, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LevelPath } from "@/components/levels/LevelPath";

type Side = "gold" | "purple" | "center";

type Module = {
  id: string;
  title: string;
  emoji: string;
  side: Side;
  description: string;
  exercisePrompt: string;
  exerciseHint: string;
};

const modules: Module[] = [
  {
    id: "meeting-your-shadow",
    title: "Meet Your Shadow",
    emoji: "🪞",
    side: "center",
    description:
      "Your shadow is not your enemy — it is every part of you that was pushed into the dark to be loved, safe, or accepted. Meeting it begins with a mirror, not a fight.",
    exercisePrompt:
      "Name one trait in someone else that irritates you. Now ask: where does that same trait quietly live in me?",
    exerciseHint: "Write freely for 3 minutes without editing.",
  },
  {
    id: "inner-child-healing",
    title: "Inner Child Work",
    emoji: "🧸",
    side: "gold",
    description:
      "There is a younger version of you still waiting for the reassurance, safety, and permission they never received. You can offer it now.",
    exercisePrompt:
      "Write a short letter to yourself at age 7. Tell them what they most needed to hear.",
    exerciseHint: "Sign it with the name they were called then.",
  },
  {
    id: "limiting-beliefs",
    title: "Limiting Belief Systems",
    emoji: "⛓️",
    side: "purple",
    description:
      "Old stories run quietly in the background: I am too much, not enough, unsafe to be seen. Naming them is the first crack in the chain.",
    exercisePrompt:
      "Finish this sentence three times: 'A belief I inherited about myself is ___.' Then rewrite each one as the truth you choose today.",
    exerciseHint: "Truths are gentle, not forced.",
  },
  {
    id: "generational-patterns",
    title: "Generational Patterns",
    emoji: "🧬",
    side: "purple",
    description:
      "Some wounds are older than you. They arrived through your lineage — the silences, the survival tactics, the ways of loving. You get to choose what continues.",
    exercisePrompt:
      "Name one pattern from your family line you are ready to release. Name one you want to keep and pass forward.",
    exerciseHint: "Both can exist. Nothing has to be all bad.",
  },
  {
    id: "emotional-triggers",
    title: "Emotional Triggers",
    emoji: "⚡",
    side: "purple",
    description:
      "A trigger is a doorway. Behind it is an unmet need, an old memory, or a part of you asking to be witnessed with softness rather than shame.",
    exercisePrompt:
      "Recall a recent moment you overreacted. Ask: what age did I feel in that moment? What did that younger me actually need?",
    exerciseHint: "You are allowed to answer slowly.",
  },
  {
    id: "self-forgiveness",
    title: "Self Forgiveness",
    emoji: "💜",
    side: "gold",
    description:
      "You have carried the weight of choices made in survival, in fear, in not-knowing. Mercy is not forgetting — it is finally letting yourself set the weight down.",
    exercisePrompt:
      "Write: 'I forgive myself for ___ because I understand now that ___.' Repeat as many times as it takes to breathe deeper.",
    exerciseHint: "The second half matters as much as the first.",
  },
  {
    id: "integration-and-wholeness",
    title: "Integration & Wholeness",
    emoji: "🔄",
    side: "center",
    description:
      "Healing is not becoming someone new — it is welcoming all of you home. Light and shadow, held in the same open hand, looping like an infinity you no longer resist.",
    exercisePrompt:
      "Close your eyes. Place a hand on your chest and say: 'All of me is welcome here.' Notice what softens.",
    exerciseHint: "Return to this whenever a part of you feels exiled.",
  },
];

const sideAlign: Record<Side, string> = {
  gold: "md:mr-auto md:ml-0 md:pr-8",
  purple: "md:ml-auto md:mr-0 md:pl-8",
  center: "mx-auto",
};

const sideAccent: Record<Side, string> = {
  gold: "border-amber-300/40 bg-gradient-to-br from-amber-100/95 via-yellow-50/90 to-amber-200/80 text-amber-950 shadow-[0_0_40px_-10px_rgba(251,191,36,0.55)]",
  purple:
    "border-violet-400/40 bg-gradient-to-br from-violet-950/80 via-indigo-950/85 to-purple-950/90 text-violet-50 shadow-[0_0_40px_-10px_rgba(139,92,246,0.55)]",
  center:
    "border-white/30 bg-gradient-to-r from-amber-100/90 via-white/90 to-violet-900/85 text-foreground shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)]",
};

const sideBadge: Record<Side, string> = {
  gold: "bg-amber-500/20 text-amber-900 border-amber-400/50",
  purple: "bg-violet-500/25 text-violet-100 border-violet-300/40",
  center: "bg-white/40 text-foreground border-white/50",
};

function ModuleCard({ mod, index }: { mod: Module; index: number }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
      className={`w-full md:w-[62%] ${sideAlign[mod.side]}`}
    >
      <div
        className={`rounded-3xl border backdrop-blur-md p-5 sm:p-6 space-y-4 ${sideAccent[mod.side]}`}
      >
        <header className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`h-11 w-11 shrink-0 rounded-full border flex items-center justify-center text-2xl ${sideBadge[mod.side]}`}
          >
            {mod.emoji}
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold leading-tight">
              {mod.title}
            </h2>
            <p className="text-sm mt-1 opacity-90 leading-relaxed">
              {mod.description}
            </p>
          </div>
        </header>

        <section
          aria-label={`${mod.title} — Actionable Exercise`}
          className={`rounded-2xl border p-4 space-y-3 ${
            mod.side === "purple"
              ? "border-violet-300/30 bg-black/30"
              : mod.side === "gold"
                ? "border-amber-500/30 bg-white/60"
                : "border-white/40 bg-white/50"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">
              Actionable Exercise
            </h3>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`${mod.id}-exercise`}
              className="inline-flex items-center gap-1 text-xs font-semibold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
            >
              {open ? "Hide" : "Begin"}
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="text-sm leading-relaxed">{mod.exercisePrompt}</p>
          {open && (
            <div id={`${mod.id}-exercise`} className="space-y-2">
              <label
                htmlFor={`${mod.id}-answer`}
                className="text-xs opacity-75 italic block"
              >
                {mod.exerciseHint}
              </label>
              <textarea
                id={`${mod.id}-answer`}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="Write here at your own pace…"
                className={`w-full rounded-xl border p-3 text-sm resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                  mod.side === "purple"
                    ? "bg-black/40 border-violet-300/30 text-violet-50 placeholder:text-violet-200/50"
                    : "bg-white/80 border-amber-500/30 text-amber-950 placeholder:text-amber-900/50"
                }`}
              />
              <p className="text-[11px] opacity-60">
                Private to you on this device. Nothing is sent.
              </p>
            </div>
          )}
        </section>
      </div>
    </motion.article>
  );
}

export default function ShadowWorkRoom() {
  const navigate = useNavigate();

  return (
    <div
      className="flex-1 overflow-y-auto pb-32"
      style={{
        background:
          "linear-gradient(90deg, hsl(45,90%,10%) 0%, hsl(42,85%,18%) 30%, hsl(0,0%,6%) 50%, hsl(265,60%,14%) 70%, hsl(270,70%,8%) 100%)",
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 pt-6 pb-4 text-center"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Shadow Work Room
        </h1>
        <p className="text-white/85 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
          Gold on one side, deep purple on the other. You are the seam between
          them — whole, welcome, held.
        </p>
      </motion.header>

      {/* Level path */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <LevelPath roomId="shadow-work" />
      </div>

      {/* Support banner */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md p-4 space-y-3">
          <p className="text-sm text-white/90 leading-relaxed">
            Shadow work can surface deep emotions. If it becomes too much, pause
            and reach out — you do not have to hold it alone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              className="w-full bg-white/15 text-white border border-white/30 hover:bg-white/25"
              onClick={() => navigate("/community")}
            >
              <HeartHandshake className="h-4 w-4 mr-2" aria-hidden="true" />
              Talk to an Intercessor
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-amber-400 to-violet-500 text-white hover:opacity-95"
              onClick={() => navigate("/practitioner")}
            >
              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
              Connect to a Healer
            </Button>
          </div>
        </div>
      </div>

      {/* Split-center scrolling column */}
      <main
        className="relative max-w-5xl mx-auto px-4"
        aria-label="Shadow Work modules"
      >
        {/* centerline */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-amber-300/50 via-white/40 to-violet-400/60"
        />
        <div className="space-y-6 relative">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
