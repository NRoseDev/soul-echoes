import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onNoMatch?: () => void;
  lang?: string;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(
    (lang?: string) => {
      if (!isSupported) return;
      // Stop any existing session
      recognitionRef.current?.abort();

      const SpeechRecognitionAPI =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang || optionsRef.current.lang || "en-US";
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setListening(false);
        optionsRef.current.onResult?.(result);
      };

      recognition.onnomatch = () => {
        setListening(false);
        optionsRef.current.onNoMatch?.();
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // "no-speech" and "aborted" are not real errors
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.warn("Speech recognition error:", event.error);
        }
        setListening(false);
        if (event.error === "no-speech") {
          optionsRef.current.onNoMatch?.();
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.abort();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { start, stop, listening, transcript, isSupported };
}
