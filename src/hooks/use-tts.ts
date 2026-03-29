import { useCallback, useEffect, useRef, useState } from "react";
import { getVoiceSettings } from "@/lib/voiceSettings";

const PREFERRED_VOICES = [
  "samantha", "karen", "moira",
  "google uk english female", "google us english female",
  "microsoft zira", "microsoft jenny",
];

function getBestFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  for (const pref of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }
  return (
    voices.find(
      (v) => v.lang.startsWith("en") && /female|zira|samantha|karen|jenny/i.test(v.name)
    ) || voices.find((v) => v.lang.startsWith("en")) || null
  );
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
    const settings = getVoiceSettings();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;
    if (settings.voiceURI) {
      selectedVoice = voices.find((v) => v.voiceURI === settings.voiceURI) || null;
    }
    if (!selectedVoice) selectedVoice = getBestFemaleVoice();
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = settings.speed ?? 0.85;
    utterance.volume = settings.volume ?? 1;
    utterance.pitch = 1.1;
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
