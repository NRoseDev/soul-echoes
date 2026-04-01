import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Always-on speech recognition hook.
 * Runs continuously across the entire app lifecycle.
 * Detects voice commands for navigation, distress phrases, and general speech input.
 */

/* ─── Distress phrases that trigger safety signal immediately ─── */
const DISTRESS_PHRASES = [
  "angel", "help me", "i'm in danger", "i am in danger",
  "send signal", "call for help", "i need help",
  "i'm not safe", "i am not safe", "someone help",
  "save me", "emergency", "i want to die",
  "hurt me", "hurting me", "being held",
  "i'm scared", "i am scared",
];

/* ─── Navigation command map ─── */
const NAV_COMMANDS: [string[], string][] = [
  [["brain dump", "home", "go home", "main page", "start page"], "/"],
  [["journal", "go to journal", "open journal"], "/journal"],
  [["breathe", "breathing", "go to breathe", "breathe room", "movement"], "/breathe"],
  [["unspoken", "unspoken chamber", "go to unspoken"], "/unspoken"],
  [["shadow", "shadow work", "go to shadow"], "/shadow-work"],
  [["wisdom", "go to wisdom", "wisdom room"], "/wisdom"],
  [["spiritual", "spiritual tools", "tools", "go to tools"], "/spiritual-tools"],
  [["community", "go to community"], "/community"],
  [["practitioner", "healer", "go to practitioner", "find a healer"], "/practitioner"],
  [["crisis", "crisis counselor", "go to crisis"], "/crisis"],
  [["voice", "voice settings", "change voice", "voice setup"], "/voice-settings"],
  [["settings", "go to settings", "preferences"], "/settings"],
  [["pricing", "plans", "subscription", "go to pricing"], "/pricing"],
];

export interface AlwaysOnListeningState {
  isListening: boolean;
  lastTranscript: string;
  /** true when mic permission was denied */
  permissionDenied: boolean;
}

interface UseAlwaysOnListeningOptions {
  /** Called when a navigation command is detected */
  onNavigate?: (path: string) => void;
  /** Called when a distress phrase is detected */
  onDistress?: () => void;
  /** Called with every final transcript for screen-specific handling */
  onTranscript?: (transcript: string) => void;
  /** Whether the hook should be active (default true) */
  enabled?: boolean;
}

export function useAlwaysOnListening(options: UseAlwaysOnListeningOptions = {}) {
  const [state, setState] = useState<AlwaysOnListeningState>({
    isListening: false,
    lastTranscript: "",
    permissionDenied: false,
  });

  const recRef = useRef<any>(null);
  const activeRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const mountedRef = useRef(true);

  const enabled = options.enabled !== false;

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const processTranscript = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    if (!lower) return;

    // 1. Check distress phrases first (highest priority)
    for (const phrase of DISTRESS_PHRASES) {
      if (lower.includes(phrase)) {
        optionsRef.current.onDistress?.();
        return; // Don't process further
      }
    }

    // 2. Check navigation commands
    for (const [keywords, path] of NAV_COMMANDS) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          optionsRef.current.onNavigate?.(path);
          return;
        }
      }
    }

    // 3. Pass through to screen-specific handler
    optionsRef.current.onTranscript?.(transcript);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !enabled) return;
    if (activeRef.current) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    // Abort any existing instance
    try { recRef.current?.abort(); } catch {}

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      if (!mountedRef.current) return;
      activeRef.current = true;
      setState(s => ({ ...s, isListening: true, permissionDenied: false }));
    };

    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1];
      if (last.isFinal) {
        const transcript = last[0].transcript;
        if (mountedRef.current) {
          setState(s => ({ ...s, lastTranscript: transcript }));
        }
        processTranscript(transcript);
      }
    };

    rec.onerror = (e: any) => {
      activeRef.current = false;
      if (e.error === "not-allowed") {
        if (mountedRef.current) {
          setState(s => ({ ...s, isListening: false, permissionDenied: true }));
        }
        return; // Don't retry if permission denied
      }
      // For other errors, retry
      if (mountedRef.current && enabled) {
        setTimeout(() => startListening(), 2000);
      }
    };

    rec.onend = () => {
      activeRef.current = false;
      // Auto-restart — keep listening always
      if (mountedRef.current && enabled) {
        // Keep isListening true during restart gap
        setTimeout(() => startListening(), 300);
      } else {
        if (mountedRef.current) {
          setState(s => ({ ...s, isListening: false }));
        }
      }
    };

    recRef.current = rec;
    try {
      rec.start();
    } catch {
      activeRef.current = false;
      if (mountedRef.current && enabled) {
        setTimeout(() => startListening(), 2000);
      }
    }
  }, [isSupported, enabled, processTranscript]);

  const stopListening = useCallback(() => {
    try { recRef.current?.abort(); } catch {}
    recRef.current = null;
    activeRef.current = false;
    if (mountedRef.current) {
      setState(s => ({ ...s, isListening: false }));
    }
  }, []);

  // Start on mount, restart if enabled changes
  useEffect(() => {
    mountedRef.current = true;
    if (enabled && isSupported) {
      // Request mic permission first, then start
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(t => t.stop());
          startListening();
        })
        .catch(() => {
          setState(s => ({ ...s, permissionDenied: true }));
        });
    } else {
      stopListening();
    }
    return () => {
      mountedRef.current = false;
      try { recRef.current?.abort(); } catch {}
      recRef.current = null;
      activeRef.current = false;
    };
  }, [enabled, isSupported, startListening, stopListening]);

  return {
    ...state,
    isSupported,
    startListening,
    stopListening,
  };
}
