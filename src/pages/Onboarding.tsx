import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Volume2, Mic, Eye, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPreferences, savePreferences, COMMUNICATION_METHODS } from "@/lib/preferences";
import { getVoiceSettings, saveVoiceSettings, CURATED_VOICES } from "@/lib/voiceSettings";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { announceGuide } from "@/components/AIGuideAnnouncer";
import { playCue } from "@/lib/waitingCues";

type OnboardingStep = "welcome" | "input-method" | "voice-selection" | "ready";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const speech = useSpeechRecognition({
    onResult: (transcript) => {
      handleVoiceResponse(transcript);
    },
    continuous: false,
  });

  const handleVoiceResponse = useCallback(
    (transcript: string) => {
      const lower = transcript.toLowerCase().trim();
      setIsListening(false);

      if (step === "input-method") {
        // Match input method
        for (const method of COMMUNICATION_METHODS) {
          if (lower.includes(method.id) || lower.includes(method.label.toLowerCase())) {
            setSelectedInput(method.id);
            setTimeout(() => moveToVoiceSelection(), 800);
            return;
          }
        }
        // No match, ask again
        announceGuide("I didn't catch that. You can say: Speak, Type, Sign, Point, or Colors.");
        setTimeout(() => startListening(), 1500);
      } else if (step === "voice-selection") {
        // Match voice preference
        if (lower.includes("feminine") || lower.includes("female") || lower.includes("woman")) {
          setSelectedVoice(CURATED_VOICES[0].id);
          setTimeout(() => completeOnboarding(), 800);
        } else if (lower.includes("masculine") || lower.includes("male") || lower.includes("man")) {
          setSelectedVoice(CURATED_VOICES[1].id);
          setTimeout(() => completeOnboarding(), 800);
        } else {
          announceGuide("I didn't catch that. You can say: Feminine or Masculine.");
          setTimeout(() => startListening(), 1500);
        }
      }
    },
    [step]
  );

  const startListening = useCallback(() => {
    setWaitingForResponse(true);
    setIsListening(true);
    playCue("listening");
    speech.start("en-US");
  }, [speech]);

  const moveToInputMethod = useCallback(() => {
    setStep("input-method");
    announceGuide(
      "How will you communicate with me? You can say: Speak, Type, Sign, Point, or Colors."
    );
    setTimeout(() => startListening(), 1500);
  }, [startListening]);

  const moveToVoiceSelection = useCallback(() => {
    setStep("voice-selection");
    announceGuide("How should I sound to you? You can say: Feminine or Masculine.");
    setTimeout(() => startListening(), 1500);
  }, [startListening]);

  const completeOnboarding = useCallback(() => {
    if (!selectedInput || !selectedVoice) return;

    // Save preferences
    const prefs = getPreferences();
    savePreferences({ ...prefs, inputMethod: selectedInput });

    const voiceSettings = getVoiceSettings();
    saveVoiceSettings({ ...voiceSettings, elevenLabsVoiceId: selectedVoice });

    setStep("ready");
    announceGuide("Perfect! You're all set. Let's begin.");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [selectedInput, selectedVoice, navigate]);

  // Welcome step
  if (step === "welcome") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Welcome to Soul Echoes
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
            An AI-guided healing companion. I'm here to listen, guide you through your emotions, and help you find peace.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Let's set up how you'd like to communicate with me.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 w-full"
        >
          <Button
            onClick={moveToInputMethod}
            size="lg"
            className="rounded-2xl gap-2 h-14 text-base"
          >
            <Mic className="h-5 w-5" /> Start with Voice
          </Button>
          <Button
            onClick={() => {
              setSelectedInput("type");
              moveToVoiceSelection();
            }}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2 h-14 text-base"
          >
            <span className="text-xl">⌨️</span> I'll Type Instead
          </Button>
        </motion.div>
      </div>
    );
  }

  // Input method selection
  if (step === "input-method") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-foreground">How will you communicate?</h2>
          <p className="text-sm text-muted-foreground">
            {isListening ? "Listening…" : "Choose or say your preference"}
          </p>
        </motion.div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Waiting for your response…</span>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full">
          {COMMUNICATION_METHODS.slice(0, 4).map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setSelectedInput(method.id);
                setTimeout(() => moveToVoiceSelection(), 800);
              }}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                selectedInput === method.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="text-3xl">{method.emoji}</span>
              <span className="text-xs font-medium text-foreground text-center">{method.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Voice selection
  if (step === "voice-selection") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-foreground">How should I sound?</h2>
          <p className="text-sm text-muted-foreground">
            {isListening ? "Listening…" : "Choose or say your preference"}
          </p>
        </motion.div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Waiting for your response…</span>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => {
              setSelectedVoice(CURATED_VOICES[0].id);
              setTimeout(() => completeOnboarding(), 800);
            }}
            className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              selectedVoice === CURATED_VOICES[0].id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <span className="text-3xl">👩</span>
            <span className="text-xs font-medium text-foreground">Feminine</span>
          </button>
          <button
            onClick={() => {
              setSelectedVoice(CURATED_VOICES[1].id);
              setTimeout(() => completeOnboarding(), 800);
            }}
            className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              selectedVoice === CURATED_VOICES[1].id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <span className="text-3xl">👨</span>
            <span className="text-xs font-medium text-foreground">Masculine</span>
          </button>
        </div>
      </div>
    );
  }

  // Ready state
  if (step === "ready") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">You're all set!</h2>
          <p className="text-muted-foreground">Taking you to Brain Dump now…</p>
        </motion.div>
      </div>
    );
  }

  return null;
}
