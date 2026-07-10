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
        if (event.error === "not-allowed") {
          activeRef.current = false;
          if (mountedRef.current) setListening(false);
          return;
        }
        
        // Don't log common non-fatal errors
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.warn("Speech recognition error:", event.error);
        }

        // Auto-restart on "no-speech" if we're in continuous mode
        if (event.error === "no-speech" && isContinuous && activeRef.current && mountedRef.current) {
          return; // onend will handle the restart
        }

        if (event.error === "no-speech") {
          optionsRef.current.onNoMatch?.();
        }

        if (!isContinuous || event.error === "aborted") {
          activeRef.current = false;
          if (mountedRef.current) setListening(false);
        }
      };

      recognition.onend = () => {
        // If we are still "active" but the engine stopped, it means it finished a segment
        if (activeRef.current && isContinuous && mountedRef.current) {
          setTimeout(() => {
            if (activeRef.current) recognition.start();
          }, 100);
        } else {
          activeRef.current = false;
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
