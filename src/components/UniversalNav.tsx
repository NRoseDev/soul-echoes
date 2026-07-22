import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Home, BookOpen, ArrowLeft, X, Compass } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { Button } from "@/components/ui/button";

const NAVIGATION_OPTIONS = [
  { id: "brain-dump", label: "Brain Dump", icon: "🧠", description: "Guidance center" },
  { id: "journal", label: "Journal", icon: "📓", description: "Logging center" },
  { id: "breathe", label: "Flow", icon: "🌬️", description: "Breathing exercises" },
  { id: "unspoken", label: "Unspoken Chamber", icon: "🤐", description: "Silent space" },
  { id: "shadow-work", label: "Shadow Work", icon: "🌑", description: "Deep reflection" },
  { id: "wisdom", label: "Wisdom", icon: "✨", description: "Guidance & insights" },
];

interface UniversalNavProps {
  currentRoomId: string;
  onNavigate: (roomId: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  isSaving?: boolean;
}

export default function UniversalNav({
  currentRoomId,
  onNavigate,
  onGoBack,
  canGoBack,
  isSaving = false,
}: UniversalNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (roomId: string) => {
    if (roomId !== currentRoomId) {
      onNavigate(roomId);
      setIsOpen(false);
    }
  };

  const handleGoBack = () => {
    if (canGoBack) {
      onGoBack();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Navigation Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={isSaving}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
            >
              <X className="h-6 w-6"  aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
            >
              <Compass className="h-6 w-6"  aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/50"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-24 right-6 z-40 w-80 rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary"  aria-hidden="true" />
                Where would you like to go?
              </h2>

              {/* Navigation Options */}
              <div className="grid grid-cols-2 gap-3">
                {NAVIGATION_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleNavigate(option.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      currentRoomId === option.id
                        ? "bg-primary text-primary-foreground ring-2 ring-primary"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSaving}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </motion.button>
                ))}
              </div>

              {/* Back & Close Options */}
              <div className="border-t border-border pt-4 space-y-2">
                {canGoBack && (
                  <Button
                    onClick={handleGoBack}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    disabled={isSaving}
                  >
                    <ArrowLeft className="h-4 w-4"  aria-hidden="true" />
                    Go Back
                  </Button>
                )}

                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <X className="h-4 w-4"  aria-hidden="true" />
                  Stay Here
                </Button>
              </div>

              {isSaving && (
                <div className="text-xs text-muted-foreground text-center">
                  Saving your progress...
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
