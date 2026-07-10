import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { announceGuide } from "@/components/AIGuideAnnouncer";

export interface SetupStep {
  id: string;
  question: string;
  options: { keyword: string; value: string; label: string }[];
  onAnswer: (value: string) => void;
}

interface UseGuidedSetupOptions {
  steps: SetupStep[];
  onComplete?: () => void;
  enabled?: boolean;
}

/**
 * Guided Setup Hook
 * Walks users through setup step-by-step with voice guidance and auto-listening.
 * Perfect for blind users and anyone who needs hands-free setup.
 */
export function useGuidedSetup(options: UseGuidedSetupOptions) {
  const { steps, onComplete, enabled = true } = options;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListeningForAnswer, setIsListeningForAnswer] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const listenTimeoutRef = useRef<number | null>(null);

  const speech = useSpeechRecognition({
    onResult: (transcript) => {
      handleUserAnswer(transcript);
    },
    continuous: false,
  });

  const currentStep = steps[currentStepIndex];

  const handleUserAnswer = useCallback(
    (transcript: string) => {
      if (!currentStep) return;

      const lower = transcript.toLowerCase().trim();
      setIsListeningForAnswer(false);

      // Find matching option
      for (const option of currentStep.options) {
        if (lower.includes(option.keyword.toLowerCase())) {
          // Call the step's handler
          currentStep.onAnswer(option.value);

          // Move to next step
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            // Announce next step after a brief delay
            setTimeout(() => announceAndListen(), 500);
          } else {
            // Setup complete
            setSetupComplete(true);
            announceGuide("Setup complete. You're all set!");
            onComplete?.();
          }
          return;
        }
      }

      // No match found — ask again
      const optionLabels = currentStep.options.map((o) => o.label).join(", ");
      announceGuide(`I didn't catch that. You can say: ${optionLabels}`);
      setTimeout(() => announceAndListen(), 1500);
    },
    [currentStep, currentStepIndex, steps, onComplete]
  );

  const announceAndListen = useCallback(() => {
    if (!currentStep || !enabled) return;

    // Announce the question
    announceGuide(currentStep.question);

    // Auto-start listening after announcement
    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
    listenTimeoutRef.current = window.setTimeout(() => {
      setIsListeningForAnswer(true);
      speech.start("en-US");
    }, 1500); // Wait for announcement to finish
  }, [currentStep, speech, enabled]);

  // Start setup when enabled
  useEffect(() => {
    if (enabled && !setupComplete && currentStep) {
      announceAndListen();
    }

    return () => {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
    };
  }, [enabled, setupComplete, currentStep, announceAndListen]);

  const skipStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTimeout(() => announceAndListen(), 500);
    }
  }, [currentStepIndex, steps.length, announceAndListen]);

  const restartSetup = useCallback(() => {
    setCurrentStepIndex(0);
    setSetupComplete(false);
    setIsListeningForAnswer(false);
    setTimeout(() => announceAndListen(), 500);
  }, [announceAndListen]);

  return {
    currentStep,
    currentStepIndex,
    isListeningForAnswer,
    setupComplete,
    skipStep,
    restartSetup,
    progress: currentStepIndex + 1,
    totalSteps: steps.length,
  };
}
