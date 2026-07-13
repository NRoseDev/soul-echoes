import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Save, Mic, Keyboard } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { useAuth } from "@/contexts/AuthContext";
import { logProgress } from "@/lib/roomPersistence";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UniversalNav from "@/components/UniversalNav";

const JOURNAL_SECTIONS = [
  {
    id: "daily-check-in",
    title: "Daily Check-In",
    icon: "☀️",
    description: "Mood and intention prompts to center your day",
    prompt: "How are you feeling today? What's your intention for this moment?",
  },
  {
    id: "gratitude",
    title: "Gratitude",
    icon: "🌸",
    description: "Guided gratitude prompts for a kinder view",
    prompt: "What are you grateful for today, no matter how small?",
  },
  {
    id: "dream-journal",
    title: "Dream Journal",
    icon: "🌙",
    description: "Capture dreams with date and detail",
    prompt: "What did you dream about? What feelings did it evoke?",
  },
  {
    id: "shadow-work",
    title: "Shadow Work Prompts",
    icon: "🌑",
    description: "Deep reflection questions for honest growth",
    prompt: "What part of yourself are you avoiding? What can you learn from it?",
  },
  {
    id: "emotional-release",
    title: "Emotional Release Writing",
    icon: "🖋️",
    description: "Free-write space to let emotions move",
    prompt: "Let it all out. No judgment. Just feel and write.",
  },
  {
    id: "manifestation",
    title: "Manifestation",
    icon: "✨",
    description: "Set intention and notice what you are calling in",
    prompt: "What are you calling into your life? Speak it into existence.",
  },
  {
    id: "letters-never-sent",
    title: "Letters Never Sent",
    icon: "💌",
    description: "Write to anyone living or passed",
    prompt: "Who do you need to write to? What do you need to say?",
  },
  {
    id: "health-journal",
    title: "Health Journal",
    icon: "🩺",
    description: "Track food, herbs, sleep, symptoms, pain, and progress",
    prompt: "How is your body feeling today? What are you noticing?",
  },
  {
    id: "healer-session",
    title: "Healer Session Journal",
    icon: "🧘",
    description: "Log session notes, homework, progress, and shared insights",
    prompt: "What did you learn from your session? What homework did you receive?",
  },
];

interface JournalEntry {
  id: string;
  sectionId: string;
  content: string;
  inputType: "text" | "voice" | "mixed";
  emotionalState?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Journal() {
  const { user } = useAuth();
  const { navigateToRoom, goBack, canGoBack, isSaving } = useRoom();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [currentContent, setCurrentContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSavingEntry, setIsSavingEntry] = useState(false);

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
        inputType: "text",
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

  const handleStartRecording = () => {
    setIsRecording(true);
    // Voice recording logic would go here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Process voice and add to content
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatePresence mode="wait">
        {!selectedSection ? (
          // Journal Menu
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 pb-32 space-y-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">📓 Journal Room</h1>
                <p className="text-gray-300">
                  Choose a section to open a full-screen journal page. Your writing saves to the cloud and resumes where you left off.
                </p>
              </div>

              {/* Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {JOURNAL_SECTIONS.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => handleSelectSection(section.id)}
                    className="p-6 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-left transition-all group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-4xl mb-3">{section.icon}</div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-300 mt-2">{section.description}</p>
                    {entries[section.id] && (
                      <div className="mt-3 text-xs text-green-400">✓ Saved</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Full-Screen Journal Entry
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 flex flex-col"
          >
            <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedSection(null)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back to Sections
                </button>
                <div className="text-3xl">{currentSection?.icon}</div>
              </div>

              {/* Title & Prompt */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">{currentSection?.title}</h2>
                <p className="text-gray-300 text-lg italic">{currentSection?.prompt}</p>
              </div>

              {/* Text Area */}
              <div className="flex-1 flex flex-col space-y-4">
                <Textarea
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  placeholder="Start writing... Your thoughts are safe here."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none text-lg p-6 rounded-xl"
                />

                {/* Input Method Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleStartRecording}
                    disabled={isRecording || isSavingEntry}
                    variant="outline"
                    className="gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    {isRecording ? "Recording..." : "Speak It"}
                  </Button>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!currentContent.trim() || isSavingEntry}
                    className="gap-2 flex-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSavingEntry ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Navigation */}
      <UniversalNav
        currentRoomId="journal"
        onNavigate={navigateToRoom}
        onGoBack={goBack}
        canGoBack={canGoBack}
        isSaving={isSaving || isSavingEntry}
      />
    </div>
  );
}
