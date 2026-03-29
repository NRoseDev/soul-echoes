import { useCallback, useEffect, useRef, useState } from "react";
import { getVoiceSettings } from "@/lib/voiceSettings";

export function useTTS() {
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const [speaking, setSpeaking] = useState(false);

  // Cancel on unmount
  useEffect(() => {
    return () => synthRef.current?.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth) return;

    synth.cancel();
    const settings = getVoiceSettings();
    const utterance = new SpeechSynthesisUtterance(text);

    // Find the saved voice
    const voices = synth.getVoices();
    if (settings.voiceURI) {
      const match = voices.find((v) => v.voiceURI === settings.voiceURI);
      if (match) utterance.voice = match;
    }

    utterance.rate = settings.speed;
    utterance.volume = settings.volume;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    synth.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}
