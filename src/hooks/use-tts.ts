import { useCallback, useEffect, useRef, useState } from "react";

const PREFERRED_VOICES = [
  "microsoft jenny",
  "microsoft aria",
  "microsoft natasha",
  "samantha",
  "karen",
  "google uk english female",
  "google us english female",
];

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  for (const pref of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en")) || null;
}

export function useTTS() {
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => synthRef.current?.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth) return;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoice = getBestVoice();
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1;
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
