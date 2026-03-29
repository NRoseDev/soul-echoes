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

export function useTTS() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;

    const updateVoices = () => {
      const v = synthRef.current?.getVoices() || [];
      if (v.length > 0) setVoices(v);
    };

    updateVoices();
    synthRef.current?.addEventListener("voiceschanged", updateVoices);

    return () => {
      synthRef.current?.cancel();
      synthRef.current?.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const available = voices.length > 0 ? voices : (synthRef.current?.getVoices() || []);
    if (available.length === 0) return null;

    for (const pref of PREFERRED_VOICES) {
      const match = available.find((v) => v.name.toLowerCase().includes(pref));
      if (match) return match;
    }
    return available.find((v) => v.lang.startsWith("en")) || null;
  }, [voices]);

  const speak = useCallback(
    (text: string) => {
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
    },
    [getBestVoice]
  );

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}
