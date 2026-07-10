import { useCallback, useRef, useEffect, useState } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { MultiModalInput, InputMethod } from "@/lib/multiModalInput";
import { playCue } from "@/lib/waitingCues";

interface UseMultiModalInputOptions {
  onInput: (input: MultiModalInput) => void;
  enabled?: boolean;
}

/**
 * Hook that enables multi-modal input (voice, text, click, equipment)
 * All methods work simultaneously without requiring the user to switch modes
 */
export function useMultiModalInput(options: UseMultiModalInputOptions) {
  const { onInput, enabled = true } = options;
  const [isListening, setIsListening] = useState(false);
  const inputTimeoutRef = useRef<number | null>(null);

  const speech = useSpeechRecognition({
    onResult: (transcript) => {
      if (enabled) {
        playCue("processing");
        onInput({
          method: "voice",
          value: transcript,
          timestamp: Date.now(),
          confidence: 0.9,
        });
      }
      setIsListening(false);
    },
    continuous: false,
  });

  // Start listening for voice input
  const startListening = useCallback(() => {
    if (!enabled) return;
    setIsListening(true);
    playCue("listening");
    speech.start("en-US");
  }, [enabled, speech]);

  // Stop listening
  const stopListening = useCallback(() => {
    setIsListening(false);
    speech.stop();
  }, [speech]);

  // Handle text input (from keyboard or AAC devices)
  const handleTextInput = useCallback(
    (text: string) => {
      if (!enabled || !text.trim()) return;
      playCue("processing");
      onInput({
        method: "text",
        value: text.trim(),
        timestamp: Date.now(),
      });
    },
    [enabled, onInput]
  );

  // Handle click input (from buttons or touch)
  const handleClickInput = useCallback(
    (value: string) => {
      if (!enabled || !value) return;
      playCue("processing");
      onInput({
        method: "click",
        value,
        timestamp: Date.now(),
      });
    },
    [enabled, onInput]
  );

  // Handle equipment input (from eye trackers, braille devices, etc.)
  const handleEquipmentInput = useCallback(
    (value: string) => {
      if (!enabled || !value) return;
      playCue("processing");
      onInput({
        method: "equipment",
        value,
        timestamp: Date.now(),
      });
    },
    [enabled, onInput]
  );

  // Listen for keyboard input (for typing)
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only capture if user is typing in a text input or if Enter is pressed
      if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
        const input = e.target as HTMLInputElement;
        handleTextInput(input.value);
        input.value = "";
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [enabled, handleTextInput]);

  // Listen for equipment events (custom events from AAC devices, eye trackers, etc.)
  useEffect(() => {
    if (!enabled) return;

    const handleEquipmentEvent = (event: CustomEvent) => {
      handleEquipmentInput(event.detail.value);
    };

    window.addEventListener("soul-echoes-equipment-input" as any, handleEquipmentEvent);
    return () => window.removeEventListener("soul-echoes-equipment-input" as any, handleEquipmentEvent);
  }, [enabled, handleEquipmentInput]);

  return {
    isListening,
    startListening,
    stopListening,
    handleTextInput,
    handleClickInput,
    handleEquipmentInput,
  };
}
