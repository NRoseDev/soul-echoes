import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onNoMatch?: () => void;
  lang?: string;
  continuous?: boolean;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const optionsRef = useRef(options);
  const activeRef = useRef(false);
  const mountedRef = useRef(true);
  optionsRef.current = options;

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(
    (lang?: string) => {
      if (!isSupported) return;
      recognitionRef.current?.abort();

      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();

      const isContinuous = optionsRef.current.continuous !== false;
      recognition.continuous = isContinuous;
      recognition.interimResults = false;
      recognition.lang = lang || optionsRef.current.lang || "en-US";
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        if (!mountedRef.current) return;
        activeRef.current = true;
        setListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        const last = event.results[event.results.length - 1];
        if (last.isFinal) {
          const result = last[0].transcript;
          if (mountedRef.current) setTranscript(result);
          optionsRef.current.onResult?.(result);
        }
      };

      recognition.onnomatch = () => {
        optionsRef.current.onNoMatch?.();
      };

      recognition.onerror = (event: any) => {
        activeRef.current = false;
        if (event.error === "not-allowed") {
          if (mountedRef.current) setListening(false);
          return;
        }
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.warn("Speech recognition error:", event.error);
        }
        if (event.error === "no-speech") {
          optionsRef.current.onNoMatch?.();
        }
        // Auto-restart on non-fatal errors if continuous
        if (isContinuous && mountedRef.current && activeRef.current) {
          setTimeout(() => start(lang), 300);
        } else {
          if (mountedRef.current) setListening(false);
        }
      };

      recognition.onend = () => {
        activeRef.current = false;
        // Auto-restart if continuous mode
        if (isContinuous && mountedRef.current) {
          setTimeout(() => start(lang), 300);
        } else {
          if (mountedRef.current) setListening(false);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        activeRef.current = false;
        if (isContinuous && mountedRef.current) {
          setTimeout(() => start(lang), 1000);
        }
      }
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    activeRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    if (mountedRef.current) setListening(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  return { start, stop, listening, transcript, isSupported };
}
