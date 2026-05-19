import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Users, TrendingUp, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreferences, savePreferences, COMMUNICATION_METHODS } from "@/lib/preferences";
import { getVoiceSettings, saveVoiceSettings, CURATED_VOICES } from "@/lib/voiceSettings";
import { useMultiModalInput } from "@/hooks/use-multi-modal-input";
import { announceGuide } from "@/components/AIGuideAnnouncer";
import { playCue } from "@/lib/waitingCues";
import { MultiModalInput } from "@/lib/multiModalInput";

type OnboardingStep = "welcome" | "input-method" | "voice-selection" | "mission" | "impact" | "pricing" | "healers" | "ready";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [lastInputMethod, setLastInputMethod] = useState<string | null>(null);

  const handleMultiModalInput = useCallback(
    (input: MultiModalInput) => {
      setLastInputMethod(input.method);
      const value = input.value.toLowerCase().trim();

      if (step === "input-method") {
        for (const method of COMMUNICATION_METHODS) {
          if (value.includes(method.id) || value.includes(method.label.toLowerCase())) {
            setSelectedInput(method.id);
            setTimeout(() => moveToVoiceSelection(), 800);
            return;
          }
        }
        announceGuide("I didn't catch that. You can say, type, or click: Speak, Type, Sign, Point, or Colors.");
        setTimeout(() => multiModal.startListening(), 1500);
      } else if (step === "voice-selection") {
        if (value.includes("feminine") || value.includes("female") || value.includes("woman")) {
          setSelectedVoice(CURATED_VOICES[0].id);
          setTimeout(() => moveToMission(), 800);
        } else if (value.includes("masculine") || value.includes("male") || value.includes("man")) {
          setSelectedVoice(CURATED_VOICES[1].id);
          setTimeout(() => moveToMission(), 800);
        } else {
          announceGuide("You can say, type, or click: Feminine or Masculine.");
          setTimeout(() => multiModal.startListening(), 1500);
        }
      } else if (["mission", "impact", "pricing", "healers"].includes(step)) {
        if (value.includes("next") || value.includes("continue") || value.includes("ok") || value.includes("ready")) {
          moveToNextStep();
        } else {
          announceGuide("You can say, type, or click: Next to continue.");
          setTimeout(() => multiModal.startListening(), 1500);
        }
      }
    },
    [step]
  );

  const multiModal = useMultiModalInput({
    onInput: handleMultiModalInput,
    enabled: true,
  });

  const moveToInputMethod = useCallback(() => {
    setStep("input-method");
    announceGuide(
      "How will you communicate with me? You can speak, type, or click: Speak, Type, Sign, Point, or Colors."
    );
    setTimeout(() => multiModal.startListening(), 1500);
  }, [multiModal]);

  const moveToVoiceSelection = useCallback(() => {
    setStep("voice-selection");
    announceGuide("How should I sound to you? You can speak, type, or click: Feminine or Masculine.");
    setTimeout(() => multiModal.startListening(), 1500);
  }, [multiModal]);

  const moveToMission = useCallback(() => {
    setStep("mission");
    announceGuide(
      "Soul Echoes is a safe, judgment-free space where you can express yourself freely. I'm here to listen, help you understand your emotions, and guide you toward healing. Say, type, or click Next when you're ready to learn more."
    );
    setTimeout(() => multiModal.startListening(), 2000);
  }, [multiModal]);

  const moveToImpact = useCallback(() => {
    setStep("impact");
    announceGuide(
      "Here's what makes Soul Echoes different: All proceeds from paid subscriptions go directly toward building non-profits that support mental health, spiritual healing, and accessibility. Your healing helps others heal. Say, type, or click Next to learn about our pricing."
    );
    setTimeout(() => multiModal.startListening(), 2500);
  }, [multiModal]);

  const moveToPricing = useCallback(() => {
    setStep("pricing");
    announceGuide(
      "Brain Dump is always free and unlimited. Paid tiers unlock access to more healing rooms, priority features, and yearly savings. You can also connect with professional healers and practitioners anytime. Say, type, or click Next to learn about our healer community."
    );
    setTimeout(() => multiModal.startListening(), 2500);
  }, [multiModal]);

  const moveToHealers = useCallback(() => {
    setStep("healers");
    announceGuide(
      "Soul Echoes connects you with certified spiritual practitioners, therapists, and healers. Whether you need deeper guidance, professional support, or spiritual direction, our healer network is here for you. Say, type, or click Next when you're ready to begin."
    );
    setTimeout(() => multiModal.startListening(), 2500);
  }, [multiModal]);

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
            <Mic className="h-5 w-5" /> Get Started
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
            Speak, type, or click your preference
          </p>
        </motion.div>

        {multiModal.isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full">
          {COMMUNICATION_METHODS.slice(0, 4).map((method) => (
            <button
              key={method.id}
              onClick={() => multiModal.handleClickInput(method.id)}
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

        <div className="w-full max-w-sm">
          <Input
            type="text"
            placeholder="Or type your choice…"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                multiModal.handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="rounded-xl"
          />
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
            Speak, type, or click your preference
          </p>
        </motion.div>

        {multiModal.isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => multiModal.handleClickInput("feminine")}
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
            onClick={() => multiModal.handleClickInput("masculine")}
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

        <div className="w-full max-w-sm">
          <Input
            type="text"
            placeholder="Or type your choice…"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                multiModal.handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="rounded-xl"
          />
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
        </motion.div>

        {multiModal.isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => multiModal.handleClickInput("next")}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2"
          >
            <ArrowRight className="h-4 w-4" /> Next
          </Button>
          <Input
            type="text"
            placeholder="Or type: Next…"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                multiModal.handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="rounded-xl"
          />
        </div>
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
        </motion.div>

        {multiModal.isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => multiModal.handleClickInput("next")}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2"
          >
            <ArrowRight className="h-4 w-4" /> Next
          </Button>
          <Input
            type="text"
            placeholder="Or type: Next…"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                multiModal.handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="rounded-xl"
          />
        </div>
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
        </motion.div>

        {multiModal.isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => multiModal.handleClickInput("next")}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2"
          >
            <ArrowRight className="h-4 w-4" /> Next
          </Button>
          <Input
            type="text"
            placeholder="Or type: Next…"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                multiModal.handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="rounded-xl"
          />
        </div>
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
        </motion.div>

        {multiModal.isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => multiModal.handleClickInput("next")}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2"
          >
            <ArrowRight className="h-4 w-4" /> Begin
          </Button>
          <Input
            type="text"
            placeholder="Or type: Begin…"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                multiModal.handleTextInput((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="rounded-xl"
          />
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
