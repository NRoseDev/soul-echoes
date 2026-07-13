import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Save, Sparkles, BookOpen, Moon, Compass, CompassIcon, Heart, Mail, Activity, Eye, ShieldAlert } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { useAuth } from "@/contexts/AuthContext";
import { logProgress } from "@/lib/roomPersistence";
import { Textarea } from "@/components/ui/textarea";

const JOURNAL_SECTIONS = [
  {
    id: "daily-check-in",
    title: "Daily Check-In",
    icon: Sparkles,
    description: "Mood and intention prompts auto-logged from your daily voice stream",
    prompt: "Your Brain Dump AI has gathered today's thoughts below. Review or add guidance cues.",
  },
  {
    id: "gratitude",
    title: "Gratitude",
    icon: Heart,
    description: "Guided gratitude prompts for a kinder view",
    prompt: "What are you grateful for today, no matter how small?",
  },
];
  {
    id: "dream-journal",
    title: "Dream Journal",
    icon: Moon,
    description: "Capture dreams with date and detail",
    prompt: "What did you dream about? What feelings did it evoke?",
  },
  {
    id: "shadow-work",
    title: "Shadow Work Prompts",
    icon: Compass,
    description: "Deep reflection questions for honest growth",
    prompt: "What part of yourself are you avoiding? What can you learn from it?",
  },
  {
    id: "emotional-release",
    title: "Emotional Release Writing",
    icon: Eye,
    description: "Free-write space to let emotions move",
    prompt: "Let it all out. No judgment. Just feel and write.",
  },
  {
    id: "manifestation",
    title: "Manifestation",
    icon: CompassIcon,
    description: "Set intention and notice what you are calling in",
    prompt: "What are you calling into your life? Speak it into existence.",
  },
  {
    id: "letters-never-sent",
    title: "Letters Never Sent",
    icon: Mail,
    description: "Write to anyone living or passed",
    prompt: "Who do you need to write to? What do you need to say?",
  },
  {
    id: "health-journal",
    title: "Health Journal",
    icon: Activity,
    description: "Track food, herbs, sleep, symptoms, pain, and progress",
    prompt: "How is your body feeling today? What are you noticing?",
  },
  {
    id: "healer-session",
    title: "Healer Session Journal",
    icon: BookOpen,
    description: "Log session notes, homework, progress, and shared insights",
    prompt: "What did you learn from your session? What homework did you receive?",
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
          content: existingLog ? `${existingLog}\n[User]: ${transcript}` : `[Auto-Logged Brain Dump Log]:\n${transcript}`,
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
    if (existing) {
      setCurrentContent(existing.content);
    } else {
      setCurrentContent("");
    }
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

      setEntries((prev) => ({
        ...prev,
        [selectedSection]: entry,
      }));

      await logProgress(
        user.id,
        "journal",
        selectedSection,
        "completed",
        {
          sectionId: selectedSection,
          contentLength: currentContent.length,
          cuesApplied: entry.suggestedCues
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
                      className={`p-6 rounded-xl border backdrop-blur-md text-left transition-all group flex flex-col justify-between h-48 relative overflow-hidden ${
                        section.id === 'daily-check-in' && hasEntry
                          ? 'bg-amber-500/10 border-amber-400/40' 
                          : 'bg-slate-900/40 border-purple-500/20 hover:border-amber-400/30'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div>
                        <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-500/20 w-fit mb-3 text-amber-300 group-hover:text-amber-100 transition-colors">
                          <SectionIcon className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium tracking-wide text-white group-hover:text-amber-200 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-xs text-purple-200/60 mt-1 line-clamp-2 font-light">{section.description}</p>
                      </div>

                      {hasEntry && (
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 mt-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {section.id === 'daily-check-in' ? 'Synced from Brain Dump' : 'Entry Saved'}
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
<buttononClick={() => setSelectedSection(null)}className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-300 hover:text-white transition-colors">Back to Journal Matrix{currentSection && (<currentSection.icon className="h-5 w-5" />)}{selectedSection === "daily-check-in" && aiRoomCues.length > 0 && (AI Suggested Healing CuesBased on today's Brain Dump dialogue, your companion recommends spending time in these spaces:{aiRoomCues.map((cue, idx) => (→ Go check out {cue}))})}{currentSection?.title}{currentSection?.prompt}<Textareavalue={currentContent}onChange={(e) => setCurrentContent(e.target.value)}placeholder="Reviewing auto-sync channels... Your thoughts are fully secured."className="flex-1 min-h-[300px] bg-slate-950/60 border border-purple-500/20 text-white placeholder-purple-300/30 focus:border-amber-500/40 rounded-xl p-4 focus:ring-0 resize-none font-light leading-relaxed"/><buttononClick={handleSaveEntry}disabled={isSavingEntry || !currentContent.trim()}className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white text-xs uppercase tracking-widest px-6 py-3 rounded-lg font-medium shadow-md transition-all active:scale-95 disabled:opacity-40">{isSavingEntry ? "Securing Entry..." : "Lock into Cloud"}</motion.div>)});}
