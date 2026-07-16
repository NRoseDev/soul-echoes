import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { useAuth } from "@/contexts/AuthContext";
import { logProgress } from "@/lib/roomPersistence";
import { Textarea } from "@/components/ui/textarea";
import reflectionIcon from "@/assets/reflection-icon.jpg.asset.json";

/* ---------- Chakra-tinted neon glow icons (inspired by uploaded sheet) ---------- */

type GlowIconProps = { className?: string };

const GlowWrap = ({
  color,
  children,
  className,
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    style={{ filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 14px ${color})` }}
    aria-hidden="true"
  >
    <g fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

// Star with sparkle dust — Solar Plexus (gold)
const StarSparkleIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#FFD500" className={className}>
    <polygon points="32,10 38,26 55,26 41,36 46,52 32,42 18,52 23,36 9,26 26,26" />
    <circle cx="12" cy="14" r="0.8" fill="#FFD500" />
    <circle cx="54" cy="16" r="1" fill="#FFD500" />
    <circle cx="50" cy="54" r="0.8" fill="#FFD500" />
    <circle cx="14" cy="52" r="1" fill="#FFD500" />
  </GlowWrap>
);

// Heart with planetary ring — Heart Chakra (emerald)
const HeartRingIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#00CC66" className={className}>
    <path d="M32 52 C 14 40, 10 26, 20 20 C 26 16, 30 20, 32 24 C 34 20, 38 16, 44 20 C 54 26, 50 40, 32 52 Z" />
    <ellipse cx="32" cy="38" rx="26" ry="6" transform="rotate(-18 32 38)" />
  </GlowWrap>
);

// Reflection — uploaded silhouette tinted emerald with matching glow
const ReflectionIcon = ({ className }: GlowIconProps) => (
  <img
    src={reflectionIcon.url}
    alt=""
    className={className}
    aria-hidden="true"
    style={{
      filter:
        "invert(1) brightness(0.85) sepia(1) saturate(5) hue-rotate(100deg) drop-shadow(0 0 6px #00CC66) drop-shadow(0 0 14px #00CC66)",
    }}
  />
);

// Crescent moon with star — Third Eye (indigo)
const MoonStarIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#4B7BFF" className={className}>
    <path d="M42 12 A 22 22 0 1 0 42 52 A 17 17 0 1 1 42 12 Z" />
    <polygon points="50,18 52,22 56,22 53,25 54,29 50,27 46,29 47,25 44,22 48,22" />
  </GlowWrap>
);

// Eclipse — Shadow Work (crimson ring, dark core)
const EclipseIcon = ({ className }: GlowIconProps) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    style={{ filter: "drop-shadow(0 0 8px #B30000) drop-shadow(0 0 18px #7a0000)" }}
    aria-hidden="true"
  >
    <circle cx="32" cy="32" r="20" fill="#0a0000" stroke="#FF2222" strokeWidth="2.4" />
    <circle cx="32" cy="32" r="24" fill="none" stroke="#FF2222" strokeWidth="1" opacity="0.7" />
  </svg>
);

// Lightning bolt — Sacral (orange)
const LightningIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#FF7A00" className={className}>
    <polygon points="36,6 16,36 30,36 26,58 48,26 34,26 40,6" />
  </GlowWrap>
);

// Blooming flower — Crown (violet/white)
const FlowerIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#B266FF" className={className}>
    <path d="M32 8 C 40 18, 40 26, 32 32 C 24 26, 24 18, 32 8 Z" />
    <path d="M56 32 C 46 40, 38 40, 32 32 C 38 24, 46 24, 56 32 Z" />
    <path d="M32 56 C 24 46, 24 38, 32 32 C 40 38, 40 46, 32 56 Z" />
    <path d="M8 32 C 18 24, 26 24, 32 32 C 26 40, 18 40, 8 32 Z" />
    <circle cx="32" cy="32" r="3.5" fill="#ffffff" />
  </GlowWrap>
);

// Envelope — Letters Never Sent (rose)
const EnvelopeIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#FF5CAA" className={className}>
    <rect x="8" y="20" width="48" height="30" rx="2" />
    <polyline points="8,20 32,36 56,20" />
    <line x1="8" y1="50" x2="24" y2="38" />
    <line x1="56" y1="50" x2="40" y2="38" />
  </GlowWrap>
);

// Pulse wave — Health Journal (turquoise)
const PulseIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#00E5CC" className={className}>
    <path d="M6 34 L16 34 L20 20 L30 48 L38 34 L46 34 L50 24 L58 44" />
  </GlowWrap>
);

// Meditating figure inside lotus petals — Healer Session Journal (teal)
const LotusIcon = ({ className }: GlowIconProps) => (
  <GlowWrap color="#20C4C4" className={className}>
    {/* center tall petal */}
    <path d="M32 6 C 28 16, 28 24, 32 30 C 36 24, 36 16, 32 6 Z" />
    {/* inner side petals */}
    <path d="M14 20 C 18 28, 24 32, 30 32 C 28 26, 22 22, 14 20 Z" />
    <path d="M50 20 C 46 28, 40 32, 34 32 C 36 26, 42 22, 50 20 Z" />
    {/* outer side petals */}
    <path d="M4 30 C 10 38, 20 40, 30 38 C 26 32, 16 28, 4 30 Z" />
    <path d="M60 30 C 54 38, 44 40, 34 38 C 38 32, 48 28, 60 30 Z" />
    {/* base bowl */}
    <path d="M10 44 C 18 54, 46 54, 54 44" />
    {/* meditating figure: head */}
    <circle cx="32" cy="30" r="3.4" />
    {/* torso */}
    <path d="M32 34 C 29 38, 29 42, 32 44 C 35 42, 35 38, 32 34 Z" />
    {/* arms resting on knees */}
    <path d="M25 44 C 22 42, 21 43, 22 46" />
    <path d="M39 44 C 42 42, 43 43, 42 46" />
    {/* crossed legs */}
    <path d="M20 48 C 26 46, 38 46, 44 48 C 40 50, 24 50, 20 48 Z" />
  </GlowWrap>

);

const JOURNAL_SECTIONS = [
  {
    id: "daily-check-in",
    title: "Daily Check-In",
    icon: StarSparkleIcon,
    description: "Mood and intention prompts auto-logged from your daily voice stream",
    prompt: "Your Brain Dump AI has gathered today's thoughts below. Review or add guidance cues.",
  },
  {
    id: "gratitude",
    title: "Reflection",
    icon: ReflectionIcon,
    description: "Guided gratitude prompts for a kinder view",
    prompt: "What are you grateful for today, no matter how small?",
  },
  {
    id: "dream-journal",
    title: "Dream Journal",
    icon: MoonStarIcon,
    description: "Capture dreams with date and detail",
    prompt: "What did you dream about? What feelings did it evoke?",
  },
  {
    id: "shadow-work",
    title: "Shadow Work Prompts",
    icon: EclipseIcon,
    description: "Deep reflection questions for honest growth",
    prompt: "What part of yourself are you avoiding? What can you learn from it?",
  },
  {
    id: "emotional-release",
    title: "Emotional Release Writing",
    icon: LightningIcon,
    description: "Free-write space to let emotions move",
    prompt: "Let it all out. No judgment. Just feel and write.",
  },
  {
    id: "manifestation",
    title: "Manifestation",
    icon: FlowerIcon,
    description: "Set intention and notice what you are calling in",
    prompt: "What are you calling into your life? Speak it into existence.",
  },
  {
    id: "letters-never-sent",
    title: "Letters Never Sent",
    icon: EnvelopeIcon,
    description: "Write what you need to say without sending it",
    prompt: "Who is this letter for? Say everything you wish you could say out loud.",
  },
  {
    id: "health-journal",
    title: "Health Journal",
    icon: PulseIcon,
    description: "Track body signals, symptoms, and wellness patterns",
    prompt: "How is your body feeling today? Note any symptoms, energy shifts, or wins.",
  },
  {
    id: "healer-session-journal",
    title: "Healer Session Journal",
    icon: LotusIcon,
    description: "Record insights and aftercare from healing sessions",
    prompt: "What came up during your session? What guidance are you carrying forward?",
  },
];

interface JournalEntry {
  id: string;
  sectionId: string;
  content: string;
  inputType: "text" | "voice" | "mixed";
  suggestedCues: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Journal() {
  const { user } = useAuth();
  const { goBack } = useRoom();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [currentContent, setCurrentContent] = useState("");
  const [aiRoomCues, setAiRoomCues] = useState<string[]>([]);
  const [isSavingEntry, setIsSavingEntry] = useState(false);

  useEffect(() => {
    const handleVoiceStreamIntercept = (event: CustomEvent) => {
      const { transcript, reply } = event.detail;
      if (!transcript) return;

      const textAnalysis = (transcript + " " + (reply || "")).toLowerCase();
      const updatedCues = [...aiRoomCues];

      if (textAnalysis.includes("fear") || textAnalysis.includes("dark") || textAnalysis.includes("hide")) {
        if (!updatedCues.includes("Shadow Work Room")) updatedCues.push("Shadow Work Room");
      }
      if (textAnalysis.includes("body") || textAnalysis.includes("hurt") || textAnalysis.includes("sleep")) {
        if (!updatedCues.includes("Health Journal")) updatedCues.push("Health Journal");
      }
      if (textAnalysis.includes("dream") || textAnalysis.includes("night")) {
        if (!updatedCues.includes("Dream Journal")) updatedCues.push("Dream Journal");
      }

      setAiRoomCues(updatedCues);

      setEntries((prev) => {
        const existingLog = prev["daily-check-in"]?.content || "";
        const compiledEntry: JournalEntry = {
          id: `daily-check-in-sync`,
          sectionId: "daily-check-in",
          content: existingLog
            ? `${existingLog}\n[User]: ${transcript}`
            : `[Auto-Logged Brain Dump Log]:\n${transcript}`,
          inputType: "voice",
          suggestedCues: updatedCues,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (selectedSection === "daily-check-in") {
          setCurrentContent(compiledEntry.content);
        }

        return { ...prev, "daily-check-in": compiledEntry };
      });
    };

    window.addEventListener("soul-echoes-voice-input" as any, handleVoiceStreamIntercept);
    return () => window.removeEventListener("soul-echoes-voice-input" as any, handleVoiceStreamIntercept);
  }, [aiRoomCues, selectedSection]);

  const currentSection = selectedSection
    ? JOURNAL_SECTIONS.find((s) => s.id === selectedSection)
    : null;

  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    const existing = entries[sectionId];
    setCurrentContent(existing ? existing.content : "");
  };

  const handleSaveEntry = async () => {
    if (!user || !selectedSection || !currentContent.trim()) return;

    setIsSavingEntry(true);
    try {
      const entry: JournalEntry = {
        id: `${selectedSection}-${Date.now()}`,
        sectionId: selectedSection,
        content: currentContent,
        inputType: selectedSection === "daily-check-in" ? "voice" : "text",
        suggestedCues: selectedSection === "daily-check-in" ? aiRoomCues : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setEntries((prev) => ({ ...prev, [selectedSection]: entry }));

      await logProgress(
        user.id,
        "journal",
        selectedSection,
        "completed",
        {
          sectionId: selectedSection,
          contentLength: currentContent.length,
          cuesApplied: entry.suggestedCues,
        },
        undefined,
        undefined,
        currentContent
      );
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setIsSavingEntry(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 min-h-screen">
      <AnimatePresence mode="wait">
        {!selectedSection ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 pb-32 space-y-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="space-y-2 border-b border-purple-500/20 pb-4">
                <h1 className="text-4xl font-bold tracking-wide text-amber-100 flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-amber-400" /> Journal Room
                </h1>
                <p className="text-purple-200/80 max-w-2xl font-light">
                  Your safe space for automated documentation. Brain Dump audio sessions are compiled silently below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {JOURNAL_SECTIONS.map((section) => {
                  const SectionIcon = section.icon;
                  const hasEntry = entries[section.id];

                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => handleSelectSection(section.id)}
                      aria-label={`Open ${section.title}`}
                      className={`p-6 rounded-xl border backdrop-blur-md text-left transition-all group flex flex-col justify-between h-48 relative overflow-hidden ${
                        section.id === "daily-check-in" && hasEntry
                          ? "bg-amber-500/10 border-amber-400/40"
                          : "bg-slate-900/40 border-purple-500/20 hover:border-amber-400/30"
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div>
                        <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <SectionIcon className="h-10 w-10" />
                        </div>
                        <h3 className="text-lg font-medium tracking-wide text-white group-hover:text-amber-200 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-xs text-purple-200/60 mt-1 line-clamp-2 font-light">
                          {section.description}
                        </p>
                      </div>

                      {hasEntry && (
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 mt-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {section.id === "daily-check-in" ? "Synced from Brain Dump" : "Entry Saved"}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 flex flex-col"
          >
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-5">
              <button
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-300 hover:text-white transition-colors self-start"
              >
                ← Back to Journal Matrix
              </button>

              <div className="flex items-center gap-3">
                {currentSection && <currentSection.icon className="h-10 w-10" />}
                <div>
                  <h2 className="text-2xl font-semibold text-amber-100">{currentSection?.title}</h2>
                  <p className="text-sm text-purple-200/70 font-light">{currentSection?.prompt}</p>
                </div>
              </div>

              {selectedSection === "daily-check-in" && aiRoomCues.length > 0 && (
                <div className="rounded-lg border border-amber-400/30 bg-amber-500/5 p-4 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    AI Suggested Healing Cues
                  </p>
                  <p className="text-sm text-purple-100/80 font-light">
                    Based on today's Brain Dump dialogue, your companion recommends spending time in these spaces:
                  </p>
                  <ul className="space-y-1">
                    {aiRoomCues.map((cue, idx) => (
                      <li key={idx} className="text-sm text-amber-200">→ Go check out {cue}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Textarea
                value={currentContent}
                onChange={(e) => setCurrentContent(e.target.value)}
                placeholder="Reviewing auto-sync channels... Your thoughts are fully secured."
                className="flex-1 min-h-[300px] bg-slate-950/60 border border-purple-500/20 text-white placeholder-purple-300/30 focus:border-amber-500/40 rounded-xl p-4 focus:ring-0 resize-none font-light leading-relaxed"
              />

              <button
                onClick={handleSaveEntry}
                disabled={isSavingEntry || !currentContent.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white text-xs uppercase tracking-widest px-6 py-3 rounded-lg font-medium shadow-md transition-all active:scale-95 disabled:opacity-40 self-start"
              >
                {isSavingEntry ? "Securing Entry..." : "Lock into Cloud"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
