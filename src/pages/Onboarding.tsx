import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Volume2, Mic, Heart, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPreferences, savePreferences, COMMUNICATION_METHODS } from "@/lib/preferences";
import { getVoiceSettings, saveVoiceSettings, CURATED_VOICES } from "@/lib/voiceSettings";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { announceGuide } from "@/components/AIGuideAnnouncer";
import { playCue } from "@/lib/waitingCues";

type OnboardingStep = "welcome" | "input-method" | "voice-selection" | "mission" | "impact" | "pricing" | "healers" | "ready";

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
        for (const method of COMMUNICATION_METHODS) {
          if (lower.includes(method.id) || lower.includes(method.label.toLowerCase())) {
            setSelectedInput(method.id);
            setTimeout(() => moveToVoiceSelection(), 800);
            return;
          }
        }
        announceGuide("I didn't catch that. You can say: Speak, Type, Sign, Point, or Colors.");
        setTimeout(() => startListening(), 1500);
      } else if (step === "voice-selection") {
        if (lower.includes("feminine") || lower.includes("female") || lower.includes("woman")) {
          setSelectedVoice(CURATED_VOICES[0].id);
          setTimeout(() => moveToMission(), 800);
        } else if (lower.includes("masculine") || lower.includes("male") || lower.includes("man")) {
          setSelectedVoice(CURATED_VOICES[1].id);
          setTimeout(() => moveToMission(), 800);
        } else {
          announceGuide("I didn't catch that. You can say: Feminine or Masculine.");
          setTimeout(() => startListening(), 1500);
        }
      } else if (["mission", "impact", "pricing", "healers"].includes(step)) {
        // For info screens, just listen for "next" or "continue"
        if (lower.includes("next") || lower.includes("continue") || lower.includes("ok") || lower.includes("ready")) {
          moveToNextStep();
        } else {
          announceGuide("You can say: Next or Continue to move forward.");
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

  const moveToMission = useCallback(() => {
    setStep("mission");
    announceGuide(
      "Soul Echoes is a safe, judgment-free space where you can express yourself freely. I'm here to listen, help you understand your emotions, and guide you toward healing. Say Next when you're ready to learn more."
    );
    setTimeout(() => startListening(), 2000);
  }, [startListening]);

  const moveToImpact = useCallback(() => {
    setStep("impact");
    announceGuide(
      "Here's what makes Soul Echoes different: All proceeds from paid subscriptions go directly toward building non-profits that support mental health, spiritual healing, and accessibility. Your healing helps others heal. Say Next to learn about our pricing."
    );
    setTimeout(() => startListening(), 2500);
  }, [startListening]);

  const moveToPricing = useCallback(() => {
    setStep("pricing");
    announceGuide(
      "Brain Dump is always free and unlimited. Paid tiers unlock access to more healing rooms, priority features, and yearly savings. You can also connect with professional healers and practitioners anytime. Say Next to learn about our healer community."
    );
    setTimeout(() => startListening(), 2500);
  }, [startListening]);

  const moveToHealers = useCallback(() => {
    setStep("healers");
    announceGuide(
      "Soul Echoes connects you with certified spiritual practitioners, therapists, and healers. Whether you need deeper guidance, professional support, or spiritual direction, our healer network is here for you. Say Next when you're ready to begin."
    );
    setTimeout(() => startListening(), 2500);
  }, [startListening]);

  const moveToNextStep = useCallback(() => {
    if (step === "mission") moveToImpact();
    else if (step === "impact") moveToPricing();
    else if (step === "pricing") moveToHealers();
    else if (step === "healers") completeOnboarding();
  }, [step]);

  const completeOnboarding = useCallback(() => {
    if (!selectedInput || !selectedVoice) return;

    const prefs = getPreferences();
    savePreferences({ ...prefs, inputMethod: selectedInput });

    const voiceSettings = getVoiceSettings();
    saveVoiceSettings({ ...voiceSettings, elevenLabsVoiceId: selectedVoice });

    setStep("ready");
    announceGuide("Perfect! You're all set. Let's begin your healing journey.");
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
              setTimeout(() => moveToMission(), 800);
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
              setTimeout(() => moveToMission(), 800);
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

  // Mission step
  if (step === "mission") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Soul Echoes is a safe, judgment-free space where you can express yourself freely. I'm here to listen, help you understand your emotions, and guide you toward healing.
          </p>
          <p className="text-sm text-muted-foreground italic">
            {isListening ? "Listening…" : "Say Next to continue"}
          </p>
        </motion.div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Waiting for your response…</span>
          </motion.div>
        )}

        <Button
          onClick={() => moveToImpact()}
          variant="outline"
          size="lg"
          className="rounded-2xl gap-2"
        >
          <ArrowRight className="h-4 w-4" /> Next
        </Button>
      </div>
    );
  }

  // Impact step
  if (step === "impact") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Our Impact</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            All proceeds from paid subscriptions go directly toward building non-profits that support mental health, spiritual healing, and accessibility. Your healing helps others heal.
          </p>
          <p className="text-sm text-muted-foreground italic">
            {isListening ? "Listening…" : "Say Next to continue"}
          </p>
        </motion.div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Waiting for your response…</span>
          </motion.div>
        )}

        <Button
          onClick={() => moveToPricing()}
          variant="outline"
          size="lg"
          className="rounded-2xl gap-2"
        >
          <ArrowRight className="h-4 w-4" /> Next
        </Button>
      </div>
    );
  }

  // Pricing step
  if (step === "pricing") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
            <span className="text-2xl">💎</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Pricing & Access</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Brain Dump is always free and unlimited. Paid tiers unlock access to more healing rooms, priority features, and yearly savings. You can also connect with professional healers and practitioners anytime.
          </p>
          <p className="text-sm text-muted-foreground italic">
            {isListening ? "Listening…" : "Say Next to continue"}
          </p>
        </motion.div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Waiting for your response…</span>
          </motion.div>
        )}

        <Button
          onClick={() => moveToHealers()}
          variant="outline"
          size="lg"
          className="rounded-2xl gap-2"
        >
          <ArrowRight className="h-4 w-4" /> Next
        </Button>
      </div>
    );
  }

  // Healers step
  if (step === "healers") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="h-16 w-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto">
            <Users className="h-8 w-8 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Our Healer Community</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Soul Echoes connects you with certified spiritual practitioners, therapists, and healers. Whether you need deeper guidance, professional support, or spiritual direction, our healer network is here for you.
          </p>
          <p className="text-sm text-muted-foreground italic">
            {isListening ? "Listening…" : "Say Next to begin"}
          </p>
        </motion.div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Waiting for your response…</span>
          </motion.div>
        )}

        <Button
          onClick={() => completeOnboarding()}
          variant="outline"
          size="lg"
          className="rounded-2xl gap-2"
        >
          <ArrowRight className="h-4 w-4" /> Begin
        </Button>
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
