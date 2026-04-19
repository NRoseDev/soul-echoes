import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  savePreferences,
  WORLD_LANGUAGES,
  COMMUNICATION_METHODS,
  type InputMethod,
} from "@/lib/preferences";
import { getVoiceSettings, saveVoiceSettings, CURATED_VOICES, type CuratedVoice, type VoiceSettings } from "@/lib/voiceSettings";
import ListeningIndicator from "@/components/ListeningIndicator";

const FLAG_LANGUAGES = [
  { code: "en", name: "English", cc: "us" },
  { code: "es", name: "Spanish", cc: "es" },
  { code: "fr", name: "French", cc: "fr" },
  { code: "pt", name: "Portuguese", cc: "br" },
  { code: "zh", name: "Mandarin", cc: "cn" },
  { code: "ar", name: "Arabic", cc: "sa" },
  { code: "hi", name: "Hindi", cc: "in" },
  { code: "ru", name: "Russian", cc: "ru" },
  { code: "de", name: "German", cc: "de" },
  { code: "ja", name: "Japanese", cc: "jp" },
  { code: "ko", name: "Korean", cc: "kr" },
  { code: "it", name: "Italian", cc: "it" },
  { code: "nl", name: "Dutch", cc: "nl" },
  { code: "tr", name: "Turkish", cc: "tr" },
  { code: "pl", name: "Polish", cc: "pl" },
  { code: "vi", name: "Vietnamese", cc: "vn" },
  { code: "th", name: "Thai", cc: "th" },
  { code: "el", name: "Greek", cc: "gr" },
  { code: "he", name: "Hebrew", cc: "il" },
  { code: "fil", name: "Filipino", cc: "ph" },
  { code: "uk", name: "Ukrainian", cc: "ua" },
  { code: "sw", name: "Swahili", cc: "za" },
];

const PREFERRED_VOICES = [
  "samantha", "karen", "moira", "fiona",
  "microsoft jenny", "microsoft aria", "microsoft zira", "microsoft natasha",
  "google uk english female", "google us english female",
];

function pickBrowserVoice(
  voices: SpeechSynthesisVoice[],
  preferredVoiceURI: string | null = null
): SpeechSynthesisVoice | null {
  if (preferredVoiceURI) {
    const selected = voices.find((v) => v.voiceURI === preferredVoiceURI);
    if (selected) return selected;
  }

  for (const pref of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }

  return (
    voices.find((v) => v.lang.startsWith("en") && /female|zira|samantha|karen|aria|jenny|natasha|moira|fiona/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0] ||
    null
  );
}

/**
 * Returns a Promise that resolves with the loaded voice list.
 * Handles the async nature of speechSynthesis.getVoices() across browsers.
 */
function getVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve([]); return; }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    const handler = () => {
      resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    }, 2000);
  });
}

async function speakAsync(text: string, preferredVoiceURI: string | null = null): Promise<void> {
  if (!("speechSynthesis" in window)) return;
  const voices = await getVoicesReady();
  window.speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickBrowserVoice(voices, preferredVoiceURI);
    if (voice) u.voice = voice;
    u.rate = 0.9;
    u.pitch = 1.1;
    u.volume = 1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
    setTimeout(resolve, text.length * 80 + 3000);
  });
}

async function speak(text: string, preferredVoiceURI: string | null = null): Promise<void> {
  if (!("speechSynthesis" in window)) return;
  const voices = await getVoicesReady();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickBrowserVoice(voices, preferredVoiceURI);
  if (voice) u.voice = voice;
  u.rate = 0.9;
  u.pitch = 1.1;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5 },
};

function matchLanguage(transcript: string) {
  const lower = transcript.toLowerCase().trim();
  return (
    WORLD_LANGUAGES.find((l) => l.name.toLowerCase() === lower) ||
    WORLD_LANGUAGES.find((l) => l.name.toLowerCase().startsWith(lower)) ||
    WORLD_LANGUAGES.find((l) => l.name.toLowerCase().includes(lower) || lower.includes(l.name.toLowerCase())) ||
    null
  );
}

function matchYesNo(transcript: string): boolean | null {
  const lower = transcript.toLowerCase().trim();
  if (["yes", "yeah", "yep", "sure", "okay", "ok", "si", "oui", "ja", "da"].some((w) => lower.includes(w))) return true;
  if (["no", "nah", "nope", "not", "non", "nein", "nyet", "skip", "pass", "no thanks"].some((w) => lower.includes(w))) return false;
  return null;
}

function matchCommMethod(transcript: string): string | null {
  const lower = transcript.toLowerCase().trim();
  const mapping: [string[], string][] = [
    [["speak", "talk", "voice", "verbal"], "speak"],
    [["type", "typing", "keyboard", "text"], "type"],
    [["sign", "asl", "signing"], "sign"],
    [["color", "colour", "symbol", "paint", "art"], "colors"],
    [["picture", "card", "point", "pointing", "image"], "point"],
    [["braille", "assistive"], "braille"],
    [["computer", "aac", "augmentative"], "aac"],
    [["eye", "tracking", "gaze"], "eyetrack"],
    [["connect", "device", "bluetooth"], "connect"],
  ];
  for (const [keywords, id] of mapping) {
    if (keywords.some((k) => lower.includes(k))) return id;
  }
  return null;
}

function ASLCameraPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 } } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {});
    } else {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
        <div className="absolute bottom-1 left-1 bg-background/80 text-[10px] px-2 py-0.5 rounded text-foreground">Sign your answer here</div>
        <button onClick={onClose} className="absolute top-1 right-1 bg-background/80 rounded-full h-6 w-6 flex items-center justify-center text-xs">✕</button>
      </div>
    </div>
  );
}

const LANGUAGE_POINT_CARDS = [
  { code: "en", label: "English",   cc: "us" },
  { code: "es", label: "Español",   cc: "es" },
  { code: "fr", label: "Français",  cc: "fr" },
  { code: "pt", label: "Português", cc: "br" },
  { code: "zh", label: "中文",      cc: "cn" },
  { code: "ar", label: "العربية",  cc: "sa" },
  { code: "hi", label: "हिन्दी",   cc: "in" },
  { code: "ru", label: "Русский",   cc: "ru" },
  { code: "de", label: "Deutsch",   cc: "de" },
  { code: "ja", label: "日本語",    cc: "jp" },
  { code: "ko", label: "한국어",    cc: "kr" },
  { code: "it", label: "Italiano",  cc: "it" },
];

const FEMININE_VOICE_KEYWORDS = ["female", "woman", "zira", "samantha", "karen", "victoria", "moira", "fiona", "jenny", "aria", "natasha", "hazel", "kate", "allison", "ava", "emily", "emma", "lisa", "nicky", "susan"];
const MASCULINE_VOICE_KEYWORDS = ["male", "man", "daniel", "david", "mark", "james", "fred", "ralph", "tom", "bruce", "george", "liam", "charlie", "brian", "eric", "will", "chris", "callum", "bill", "roger"];

function pickSynthVoice(voice: CuratedVoice, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const enVoices = voices.filter((v) => v.lang.startsWith("en"));
  const pool = enVoices.length > 0 ? enVoices : voices;
  let picked = pool.find((v) => v.name.toLowerCase().includes(voice.speakName.toLowerCase()));
  if (!picked) {
    if (voice.gender === "feminine") picked = pool.find((v) => FEMININE_VOICE_KEYWORDS.some((k) => v.name.toLowerCase().includes(k)));
    else if (voice.gender === "masculine") picked = pool.find((v) => MASCULINE_VOICE_KEYWORDS.some((k) => v.name.toLowerCase().includes(k)));
  }
  return picked ?? pool[0] ?? null;
}

export default function Onboarding({ onComplete }: { onComplete: () => void }) { /* v2 */
  const [step, setStep] = useState(0);
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [primaryLang, setPrimaryLang] = useState("en");
  const [secondaryLang, setSecondaryLang] = useState<string | null>(null);
  const [wantSecondary, setWantSecondary] = useState<boolean | null>(null);
  const [signLanguage, setSignLanguage] = useState<boolean | null>(null);
  const [langSubStep, setLangSubStep] = useState(0);
  const [typedLang, setTypedLang] = useState("");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(getVoiceSettings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [playingVoiceURI, setPlayingVoiceURI] = useState<string | null>(null);
  const [autoPlayIdx, setAutoPlayIdx] = useState(0);
  const [autoPhase, setAutoPhase] = useState<"idle" | "playing" | "listening">("idle");
  const autoRecRef = useRef<any>(null);
  const voiceListRef = useRef<HTMLDivElement>(null);
  const spokenPromptsRef = useRef<Set<string>>(new Set());
  const handleVoiceRef = useRef<(t: string) => void>(() => {});

  const hasSpoken = useCallback((key: string) => spokenPromptsRef.current.has(key), []);
  const markSpoken = useCallback((key: string) => { spokenPromptsRef.current.add(key); }, []);
  const clearSpoken = useCallback(() => { spokenPromptsRef.current.clear(); }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
  }, []);

  const ttsSpeakAsync = useCallback((text: string) => speakAsync(text, voiceSettings.voiceURI), [voiceSettings.voiceURI]);
  const ttsSpeak = useCallback((text: string) => speak(text, voiceSettings.voiceURI), [voiceSettings.voiceURI]);

  const isSpeakMode = inputMethod === "speak";

  const [isListening, setIsListening] = useState(false);
  const inputLevel = 0;
  const recognitionRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch {}
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const startRecognition = useCallback(() => {
    if (recognitionRef.current) return;
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      if (!mountedRef.current) return;
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      if (!last || !last.isFinal) return;
      const transcript = last[0]?.transcript?.trim();
      if (!transcript) return;
      if (mountedRef.current) {
        setRetryMessage(null);
      }
      handleVoiceRef.current(transcript);
    };

    rec.onerror = (event: any) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsListening(false);
      }
    };

    rec.onend = () => {
      recognitionRef.current = null;
      if (!mountedRef.current) return;
      setIsListening(false);
      if (inputMethod === "speak") {
        window.setTimeout(() => startRecognition(), 250);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      window.setTimeout(() => startRecognition(), 500);
    }
  }, [inputMethod]);

  useEffect(() => {
    mountedRef.current = true;

    const introText =
      "If you use a communication device, AAC board, eye gaze tracker, or any assistive technology — you can connect it via Bluetooth or your phone's port and use it here. " +
      "Soul Echoes works on iPhone, Android, and all computers worldwide. " +
      "All options are always available. How would you like to communicate today?";

    const initialize = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        // microphone permission request was attempted
      }

      await speakAsync(introText, null);
      if (mountedRef.current) {
        startRecognition();
      }
    };

    initialize();

    return () => {
      mountedRef.current = false;
      stopListening();
    };
  }, [startRecognition, stopListening]);

  useEffect(() => {
    if (step !== 1) return;
    if (hasSpoken("welcome")) return;
    markSpoken("welcome");
    markSpoken("lang-primary");
    ttsSpeakAsync("Soul Echoes. Your daily healing advocate. A sacred space to release, heal, and find closure. What is your primary language?")
      .then(() => {
        setWelcomeDone(true);
        setStep(2);
      });
  }, [step, ttsSpeakAsync, hasSpoken, markSpoken]);

  useEffect(() => {
    if (step !== 2) return;
    if (langSubStep === 0 && !hasSpoken("lang-primary")) {
      markSpoken("lang-primary");
      ttsSpeakAsync("What is your primary language?");
    }
    if (langSubStep === 1 && wantSecondary === null && !hasSpoken("lang-secondary-q")) {
      markSpoken("lang-secondary-q");
      ttsSpeakAsync("Would you like to add a second language?");
    }
    if (langSubStep === 1 && wantSecondary === true && !hasSpoken("lang-secondary-pick")) {
      markSpoken("lang-secondary-pick");
      ttsSpeakAsync("Which second language?");
    }
    if (langSubStep === 2 && !hasSpoken("lang-sign")) {
      markSpoken("lang-sign");
      ttsSpeakAsync("Would you like to enable sign language?");
    }
  }, [step, langSubStep, wantSecondary, hasSpoken, markSpoken, ttsSpeakAsync]);

  // Step 3: on enter, kick off auto-play from voice 0
  useEffect(() => {
    if (step !== 3) return;
    setAutoPlayIdx(0);
    setAutoPhase("playing");
    return () => {
      window.speechSynthesis?.cancel();
      try { autoRecRef.current?.abort(); } catch {}
      autoRecRef.current = null;
    };
  }, [step]);

  // Step 3: play the current voice sample
  useEffect(() => {
    if (step !== 3 || autoPhase !== "playing") return;
    const voice = CURATED_VOICES[autoPlayIdx];
    if (!voice) return;

    // Highlight this voice as current selection
    setVoiceSettings((s) => ({ ...s, elevenLabsVoiceId: voice.id, elevenLabsVoiceName: voice.name, voiceURI: null }));

    // Scroll voice into view
    const el = voiceListRef.current?.querySelector(`[data-voice-id="${voice.id}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });

    const synth = window.speechSynthesis;
    synth.cancel();

    let cleanupCalled = false;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    const advance = () => {
      if (cleanupCalled) return;
      if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
      setAutoPhase("listening");
    };

    const doSpeak = (tries: number) => {
      const voices = synth.getVoices();
      const u = new SpeechSynthesisUtterance(`Hello. My name is ${voice.name}. I am here with you.`);
      const picked = pickSynthVoice(voice, voices);
      if (picked) u.voice = picked;
      u.rate = 1;
      u.pitch = 1;
      u.volume = 1;
      u.onend = advance;
      u.onerror = () => {
        if (cleanupCalled) return;
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
        if (tries < 3) {
          setTimeout(() => { if (!cleanupCalled) { synth.cancel(); synth.resume(); doSpeak(tries + 1); } }, 200);
        } else {
          advance();
        }
      };
      synth.resume();
      synth.speak(u);
      safetyTimer = setTimeout(advance, 10000);
    };

    if (synth.getVoices().length > 0) {
      doSpeak(1);
    } else {
      synth.onvoiceschanged = () => { synth.onvoiceschanged = null; doSpeak(1); };
    }

    return () => {
      cleanupCalled = true;
      if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
      synth.cancel();
    };
  }, [step, autoPhase, autoPlayIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 3: listen for "next", "stop", "pick this one", "I choose this voice"
  useEffect(() => {
    if (step !== 3 || autoPhase !== "listening") return;
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    autoRecRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      if (!last?.isFinal) return;
      const t = last[0]?.transcript?.trim().toLowerCase() ?? "";

      if (["pick this one", "i choose this", "i choose this voice", "select this", "this one", "choose this"].some((w) => t.includes(w))) {
        try { rec.abort(); } catch {}
        autoRecRef.current = null;
        clearSpoken();
        setStep(4);
        return;
      }
      if (["next", "skip"].some((w) => t.includes(w))) {
        try { rec.abort(); } catch {}
        autoRecRef.current = null;
        const nextIdx = (autoPlayIdx + 1) % CURATED_VOICES.length;
        setAutoPlayIdx(nextIdx);
        setAutoPhase("playing");
        return;
      }
      if (["stop", "pause", "enough", "quit"].some((w) => t.includes(w))) {
        try { rec.abort(); } catch {}
        autoRecRef.current = null;
        setAutoPhase("idle");
        return;
      }
      // Unrecognised — restart listening
      try { rec.start(); } catch {}
    };

    rec.onend = () => {
      // If still in listening phase (no command matched), restart
      if (autoRecRef.current === rec) {
        try { rec.start(); } catch {}
      }
    };

    try { rec.start(); } catch {}

    return () => {
      try { rec.abort(); } catch {}
      if (autoRecRef.current === rec) autoRecRef.current = null;
    };
  }, [step, autoPhase, autoPlayIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== 4) return;
    if (!hasSpoken("comm-method")) {
      markSpoken("comm-method");
      ttsSpeakAsync("Every communication method is always available to you. Switch anytime, from any room.");
    }
  }, [step, ttsSpeakAsync, hasSpoken, markSpoken]);

  useEffect(() => {
    if (step !== 5) return;
    ttsSpeakAsync("This app includes a private safety feature. Only you will know what it does. You can access it anytime from the main menu.");
  }, [step, ttsSpeakAsync]);

  useEffect(() => {
    if (step !== 6) return;
    ttsSpeak("You are all set. Welcome to Soul Echoes.");
    const timer = setTimeout(() => {
      savePreferences({
        onboardingComplete: true,
        primaryLanguage: primaryLang,
        secondaryLanguage: secondaryLang,
        signLanguageEnabled: signLanguage === true,
        communicationMethods: COMMUNICATION_METHODS.map((m) => m.id),
        autoReadEnabled: true,
        inputMethod: inputMethod || "type",
      });
      saveVoiceSettings(voiceSettings);
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [step]);

  const handleVoiceInput = useCallback((t: string) => {
    const lower = t.toLowerCase().trim();
    if (step === 0) {
      const matched = matchCommMethod(t) as InputMethod | null;
      if (matched && ["speak", "type", "sign", "point", "connect"].includes(matched)) {
        setInputMethod(matched);
        setRetryMessage(null);
        clearSpoken();
        if (matched === "sign") setCameraOpen(true);
        setStep(1);
        return;
      }
      setRetryMessage(`I heard "${t}" — say speak, type, sign, point, or connect.`);
      return;
    }
    if (step === 2) {
      if (langSubStep === 0) {
        const match = matchLanguage(t);
        if (match) {
          setPrimaryLang(match.code);
          setRetryMessage(null);
          clearSpoken();
          savePreferences({ primaryLanguage: match.code });
          ttsSpeakAsync(`Got it — ${match.name} selected.`).then(() => setLangSubStep(1));
        } else {
          setRetryMessage(`I heard "${t}" — try again.`);
        }
      } else if (langSubStep === 1) {
        if (wantSecondary === true) {
          const match = matchLanguage(t);
          if (match) {
            setSecondaryLang(match.code);
            setRetryMessage(null);
            clearSpoken();
            savePreferences({ secondaryLanguage: match.code });
            ttsSpeakAsync(`Selected ${match.name}`).then(() => setLangSubStep(2));
          } else {
            setRetryMessage(`I heard "${t}" — say a language name.`);
          }
        } else {
          const yn = matchYesNo(t);
          if (yn === true) { setWantSecondary(true); setRetryMessage(null); clearSpoken(); }
          else if (yn === false) { setWantSecondary(false); setRetryMessage(null); clearSpoken(); setLangSubStep(2); }
          else {
            const match = matchLanguage(t);
            if (match) {
              setWantSecondary(true);
              setSecondaryLang(match.code);
              setRetryMessage(null);
              clearSpoken();
              savePreferences({ secondaryLanguage: match.code });
              ttsSpeakAsync(`Selected ${match.name}`).then(() => setLangSubStep(2));
            } else {
              setRetryMessage(`I heard "${t}". Say yes, no, or a language.`);
            }
          }
        }
      } else if (langSubStep === 2) {
        const yn = matchYesNo(t);
        if (yn === true) { setSignLanguage(true); setStep(3); }
        else if (yn === false) { setSignLanguage(false); setStep(3); }
        else setRetryMessage(`I heard "${t}". Say yes or no.`);
      }
    } else if (step === 3) {
      if (["continue", "next", "skip"].some((w) => lower.includes(w))) {
        clearSpoken();
        setRetryMessage(null);
        setStep(4);
        return;
      }
      const matchingVoice = availableVoices.find((v) => lower.includes(v.name.toLowerCase()) || v.name.toLowerCase().includes(lower));
      if (matchingVoice) {
        setVoiceSettings((s) => ({ ...s, voiceURI: matchingVoice.voiceURI, elevenLabsVoiceId: null, elevenLabsVoiceName: null }));
        setRetryMessage(null);
        clearSpoken();
        ttsSpeakAsync(`Great choice. Moving on to the next step.`).then(() => setStep(4));
      } else {
        setRetryMessage(`I heard "${t}" — say a voice name or "continue".`);
      }
    } else if (step === 4) {
      if (["continue", "next", "okay", "ok", "got it", "yes"].some((w) => lower.includes(w))) {
        clearSpoken();
        setRetryMessage(null);
        setStep(5);
      }
    } else if (step === 5) {
      const yn = matchYesNo(t);
      if (yn === true || ["got it", "continue", "ok", "okay", "yes"].some((w) => lower.includes(w))) {
        clearSpoken();
        setRetryMessage(null);
        setStep(6);
      } else {
        setRetryMessage(`I heard "${t}" — say yes or got it to continue.`);
      }
    }
  }, [step, langSubStep, wantSecondary, voiceSettings]);

  handleVoiceRef.current = handleVoiceInput;

  const getLangName = (code: string) => WORLD_LANGUAGES.find((l) => l.code === code)?.name || code;

  const handleSelectLang = (code: string, name: string, next: () => void) => {
    setPrimaryLang(code);
    setRetryMessage(null);
    clearSpoken();
    savePreferences({ primaryLanguage: code });
    if (isSpeakMode) ttsSpeakAsync(`Got it — ${name} selected.`).then(next);
    else next();
  };

  const handleSelectSecondaryLang = (code: string, name: string) => {
    setSecondaryLang(code);
    setRetryMessage(null);
    clearSpoken();
    savePreferences({ secondaryLanguage: code });
    if (isSpeakMode) ttsSpeakAsync(`Selected ${name}`).then(() => setLangSubStep(2));
    else setLangSubStep(2);
  };

  const testVoice = useCallback((voice: CuratedVoice) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    let safetyTimer: ReturnType<typeof setTimeout> | null = null;
    const clear = () => {
      if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
      setPlayingVoiceURI(null);
    };

    const attempt = (tries: number) => {
      const allVoices = synth.getVoices();
      const u = new SpeechSynthesisUtterance("Hello, I am here with you.");
      u.rate = voiceSettings.speed;
      u.volume = voiceSettings.volume;
      u.pitch = 1;
      const picked = pickSynthVoice(voice, allVoices);
      if (picked) u.voice = picked;
      u.onend = clear;
      u.onerror = () => {
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
        if (tries < 3) {
          setTimeout(() => { synth.cancel(); synth.resume(); attempt(tries + 1); }, 200);
        } else {
          setPlayingVoiceURI(null);
        }
      };
      synth.resume();
      synth.speak(u);
      safetyTimer = setTimeout(clear, 8000);
    };

    setPlayingVoiceURI(voice.id);
    const voices = synth.getVoices();
    if (voices.length > 0) { attempt(1); }
    else { synth.onvoiceschanged = () => { synth.onvoiceschanged = null; attempt(1); }; }
  }, [voiceSettings.speed, voiceSettings.volume]);

  const INPUT_METHOD_CARDS: {
    id: InputMethod; label: string; emoji: string; desc: string; detail?: string;
    grad: string; border: string; glow: string; iconGrad: string;
  }[] = [
    {
      id: "speak", label: "Speak It", emoji: "🗣️", desc: "Use your voice",
      grad: "from-violet-500/20 to-purple-700/10", border: "border-violet-400/30",
      glow: "hover:shadow-[0_0_28px_rgba(167,139,250,0.35)]", iconGrad: "from-violet-500 to-purple-600",
    },
    {
      id: "sign", label: "Sign It", emoji: "🤟", desc: "Use sign language with camera",
      grad: "from-teal-400/20 to-emerald-600/10", border: "border-teal-400/30",
      glow: "hover:shadow-[0_0_28px_rgba(52,211,153,0.35)]", iconGrad: "from-teal-400 to-emerald-500",
    },
    {
      id: "point", label: "Point It", emoji: "👆", desc: "Tap cards & pictures",
      grad: "from-rose-400/20 to-pink-600/10", border: "border-rose-400/30",
      glow: "hover:shadow-[0_0_28px_rgba(251,113,133,0.35)]", iconGrad: "from-rose-400 to-pink-500",
    },
    {
      id: "type", label: "Type It", emoji: "⌨️", desc: "Use your keyboard or on-screen text",
      grad: "from-amber-400/20 to-orange-500/10", border: "border-amber-400/30",
      glow: "hover:shadow-[0_0_28px_rgba(251,191,36,0.35)]", iconGrad: "from-amber-400 to-orange-500",
    },
    {
      id: "connect", label: "Connect My Device", emoji: "🔌",
      desc: "Braille display, AAC device, eye gaze, or switch access",
      detail: "Connect via USB, Bluetooth, or 3.5mm audio port",
      grad: "from-sky-400/20 to-blue-600/10", border: "border-sky-400/30",
      glow: "hover:shadow-[0_0_28px_rgba(56,189,248,0.35)]", iconGrad: "from-sky-400 to-blue-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[radial-gradient(ellipse_at_top,hsl(270,50%,8%)_0%,hsl(260,40%,4%)_100%)] flex items-center justify-center p-4 overflow-y-auto" role="main" aria-label="Soul Echoes Onboarding">
      <AnimatePresence mode="wait">

        {/* STEP 0: Input Method */}
        {step === 0 && (
          <motion.div key="input-method" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/20">
                <span className="text-xs font-medium text-violet-300 tracking-wide uppercase">Welcome</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                How shall we guide you?
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Just for this setup — not a permanent choice.<br />
                <span className="text-foreground/60">All options stay available everywhere, always.</span>
              </p>
            </div>
            {/* Availability ribbon */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/50 px-2">
              {["🗣️ Talk","⌨️ Type","🤟 Sign","👆 Point","⠿ Braille","💻 AAC","👁️ Eye gaze","🔘 Switch"].map((t) => (
                <span key={t}>{t}</span>
              ))}
              <span className="w-full text-center text-foreground/30 mt-0.5">switch any of these anytime, anywhere in the app</span>
            </div>
            {/* Cards */}
            <div className="grid gap-3">
              {INPUT_METHOD_CARDS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setInputMethod(m.id); savePreferences({ inputMethod: m.id }); if (m.id === "sign") setCameraOpen(true); setStep(1); }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-3xl border bg-gradient-to-br ${m.grad} ${m.border} ${m.glow} text-left transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500/40`}
                >
                  <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${m.iconGrad} flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl leading-none" role="img" aria-hidden="true">{m.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground">{m.label}</p>
                    <p className="text-sm text-muted-foreground/80 leading-snug">{m.desc}</p>
                    {m.detail && <p className="text-xs text-sky-300/70 mt-0.5">{m.detail}</p>}
                  </div>
                  <ChevronRight className="shrink-0 h-4 w-4 text-muted-foreground/40" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <motion.div key="welcome" {...fadeSlide} className="text-center max-w-2xl mx-auto space-y-8 cursor-pointer px-4"
            onClick={() => { window.speechSynthesis?.cancel(); setStep(2); }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") { window.speechSynthesis?.cancel(); setStep(2); } }}>
            {/* glow orb */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
              <div className="w-96 h-96 rounded-full bg-gradient-radial from-violet-600/20 via-purple-600/5 to-transparent blur-3xl" />
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
              className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-teal-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(167,139,250,0.5)]"
            >
              <span className="text-4xl" aria-hidden="true">✦</span>
            </motion.div>
            <div className="inline-block px-5 py-1.5 rounded-full border border-violet-400/30 bg-violet-500/10">
              <span className="text-sm font-medium text-violet-300 tracking-wide">Your sanctuary for healing</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-teal-300 via-pink-300 to-violet-400 bg-clip-text text-transparent">
              Soul Echoes
            </h1>
            <p className="text-lg sm:text-xl text-foreground/90 font-light">Your daily healing advocate.</p>
            <p className="text-base text-muted-foreground/70 leading-relaxed max-w-md mx-auto">
              A sacred space to release, heal, and find closure.
            </p>
            {welcomeDone && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-sm text-violet-300/60 animate-pulse"
              >
                Tap anywhere to continue
              </motion.p>
            )}
          </motion.div>
        )}

        {/* STEP 2: Language */}
        {step === 2 && (
          <motion.div key="language" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-5 bg-gradient-to-b from-[hsl(260,45%,10%)] to-[hsl(260,35%,7%)] border border-white/[0.07] rounded-3xl p-5 sm:p-7 shadow-2xl">
            {isSpeakMode && <ListeningIndicator visible={isListening} level={inputLevel} />}
            {retryMessage && <p className="text-sm text-center text-rose-400" role="alert">{retryMessage}</p>}
            {inputMethod === "sign" && <ASLCameraPanel open={true} onClose={() => {}} />}
            {inputMethod === "connect" && (
              <div className="flex items-center gap-3 bg-sky-500/10 border border-sky-400/20 rounded-2xl p-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-lg" aria-hidden="true">🔌</span>
                </div>
                <p className="text-sm text-muted-foreground/80">Connect your AAC device, eye gaze tracker, or external equipment via Bluetooth or USB.</p>
              </div>
            )}

            {langSubStep === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center">
                  What is your primary language?
                </h2>
                {inputMethod === "type" && (
                  <Input placeholder="Type your language..." value={typedLang} onChange={(e) => setTypedLang(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && typedLang.trim()) { const match = matchLanguage(typedLang); if (match) handleSelectLang(match.code, match.name, () => setLangSubStep(1)); else setRetryMessage(`"${typedLang}" not found.`); }}}
                    className="text-lg py-6 rounded-2xl bg-white/5 border-white/10 focus:border-violet-400/50" autoFocus />
                )}
                {(inputMethod === "point" || inputMethod === "speak" || inputMethod === "sign" || inputMethod === "connect") && (() => {
                  const cards = inputMethod === "point" ? LANGUAGE_POINT_CARDS.map(l => ({ code: l.code, name: l.label, cc: l.cc })) : FLAG_LANGUAGES;
                  const sel = primaryLang;
                  return (
                    <div className="max-h-[380px] overflow-y-auto rounded-xl p-1">
                      <div className="grid grid-cols-3 gap-2">
                        {cards.map((lang) => (
                          <button key={lang.code} onClick={() => handleSelectLang(lang.code, lang.name, () => setLangSubStep(1))}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${
                              sel === lang.code
                                ? "border-violet-400/70 bg-violet-500/20 scale-105 shadow-[0_0_16px_rgba(167,139,250,0.4)]"
                                : "border-white/10 bg-white/[0.04] hover:border-violet-400/40 hover:bg-white/[0.08] hover:shadow-[0_0_10px_rgba(167,139,250,0.15)] hover:scale-[1.03]"
                            }`}>
                            <img src={`https://flagcdn.com/48x36/${lang.cc}.png`}
                              srcSet={`https://flagcdn.com/96x72/${lang.cc}.png 2x`}
                              alt={lang.name} className="w-12 h-9 rounded-md object-cover shadow-md" />
                            <span className="text-[11px] font-medium text-foreground/85 text-center leading-tight">{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {langSubStep === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center">
                  Add a second language?
                </h2>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setWantSecondary(true); setRetryMessage(null); clearSpoken(); }}
                    className={`flex items-center gap-2 px-7 py-4 rounded-2xl border text-base font-semibold transition-all duration-200 ${
                      wantSecondary === true
                        ? "border-teal-400/70 bg-teal-500/20 text-teal-300 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                        : "border-white/10 bg-white/5 text-foreground/80 hover:border-teal-400/40 hover:shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">✨</span> Yes
                  </button>
                  <button
                    onClick={() => { setWantSecondary(false); setSecondaryLang(null); setRetryMessage(null); clearSpoken(); setLangSubStep(2); }}
                    className={`flex items-center gap-2 px-7 py-4 rounded-2xl border text-base font-semibold transition-all duration-200 ${
                      wantSecondary === false
                        ? "border-rose-400/70 bg-rose-500/20 text-rose-300 shadow-[0_0_18px_rgba(251,113,133,0.35)]"
                        : "border-white/10 bg-white/5 text-foreground/80 hover:border-rose-400/40 hover:shadow-[0_0_12px_rgba(251,113,133,0.2)]"
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">🌿</span> No
                  </button>
                </div>
                {wantSecondary && (
                  <div className="max-h-[280px] overflow-y-auto rounded-xl p-1">
                    <div className="grid grid-cols-3 gap-2">
                      {FLAG_LANGUAGES.filter((l) => l.code !== primaryLang).map((lang) => (
                        <button key={lang.code} onClick={() => handleSelectSecondaryLang(lang.code, lang.name)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${
                            secondaryLang === lang.code
                              ? "border-violet-400/70 bg-violet-500/20 scale-105 shadow-[0_0_16px_rgba(167,139,250,0.4)]"
                              : "border-white/10 bg-white/[0.04] hover:border-violet-400/40 hover:bg-white/[0.08] hover:shadow-[0_0_10px_rgba(167,139,250,0.15)] hover:scale-[1.03]"
                          }`}>
                          <img src={`https://flagcdn.com/48x36/${lang.cc}.png`}
                            srcSet={`https://flagcdn.com/96x72/${lang.cc}.png 2x`}
                            alt={lang.name} className="w-12 h-9 rounded-md object-cover shadow-md" />
                          <span className="text-[11px] font-medium text-foreground/85 text-center leading-tight">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {langSubStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.4)] mb-4">
                    <span className="text-3xl" aria-hidden="true">🤟</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Enable Sign Language?</h2>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setSignLanguage(true); setRetryMessage(null); setStep(3); }}
                    className={`flex items-center gap-2 px-7 py-4 rounded-2xl border text-base font-semibold transition-all duration-200 ${
                      signLanguage === true
                        ? "border-teal-400/70 bg-teal-500/20 text-teal-300 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                        : "border-white/10 bg-white/5 text-foreground/80 hover:border-teal-400/40 hover:shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">🤟</span> Yes
                  </button>
                  <button
                    onClick={() => { setSignLanguage(false); setRetryMessage(null); setStep(3); }}
                    className={`flex items-center gap-2 px-7 py-4 rounded-2xl border text-base font-semibold transition-all duration-200 ${
                      signLanguage === false
                        ? "border-rose-400/70 bg-rose-500/20 text-rose-300 shadow-[0_0_18px_rgba(251,113,133,0.35)]"
                        : "border-white/10 bg-white/5 text-foreground/80 hover:border-rose-400/40 hover:shadow-[0_0_12px_rgba(251,113,133,0.2)]"
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">🌿</span> No
                  </button>
                </div>
                <p className="text-center text-muted-foreground/60 text-xs">
                  {getLangName(primaryLang)}{secondaryLang && ` · ${getLangName(secondaryLang)}`}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 3: Voice Setup — auto-play */}
        {step === 3 && (() => {
          const currentVoice = CURATED_VOICES[autoPlayIdx];
          const chooseVoice = () => {
            window.speechSynthesis?.cancel();
            try { autoRecRef.current?.abort(); } catch {}
            autoRecRef.current = null;
            clearSpoken();
            setStep(4);
          };
          const goTo = (idx: number) => {
            window.speechSynthesis?.cancel();
            try { autoRecRef.current?.abort(); } catch {}
            autoRecRef.current = null;
            setAutoPlayIdx(idx);
            setAutoPhase("playing");
          };
          return (
            <motion.div key="voice" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-5 bg-gradient-to-b from-[hsl(260,45%,10%)] to-[hsl(260,35%,7%)] border border-white/[0.07] rounded-3xl p-5 sm:p-7 shadow-2xl">
              {/* Header */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.5)] mb-3">
                  <span className="text-2xl" aria-hidden="true">🎙️</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                  Choose Your AI Voice
                </h2>
                <p className="text-muted-foreground/70 text-sm">
                  {autoPhase === "idle"
                    ? "Tap a voice to preview it, then tap Choose."
                    : autoPhase === "playing"
                    ? `Playing ${currentVoice?.name ?? ""}…`
                    : 'Say "next", "pick this one", or "stop"'}
                </p>
              </div>

              {/* Progress + animation */}
              {autoPhase !== "idle" && (
                <div className="flex flex-col items-center gap-2 py-1">
                  <p className="text-xs text-muted-foreground/50">{autoPlayIdx + 1} of {CURATED_VOICES.length}</p>
                  {autoPhase === "playing" ? (
                    <div className="flex gap-1.5 items-end h-9 px-2 py-1 rounded-xl bg-violet-500/10 border border-violet-400/20" aria-label="Playing audio" role="img">
                      {[7, 14, 20, 16, 9, 18, 12].map((h, i) => (
                        <div key={i} className="w-1.5 bg-gradient-to-t from-violet-500 to-pink-400 rounded-full animate-pulse"
                          style={{ height: h, animationDelay: `${i * 0.11}s`, animationDuration: "0.75s" }} />
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-400/20">
                      <ListeningIndicator visible={true} level={0} />
                    </div>
                  )}
                </div>
              )}

              {/* Speed + Volume */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Speed — {voiceSettings.speed <= 0.75 ? "Slow" : voiceSettings.speed >= 1.25 ? "Fast" : "Normal"}</p>
                  <Slider value={[voiceSettings.speed]} onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, speed: v }))} min={0.5} max={1.5} step={0.1} aria-label="Speech speed" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">Volume — {voiceSettings.volume <= 0.35 ? "Soft" : voiceSettings.volume >= 0.75 ? "Loud" : "Medium"}</p>
                  <Slider value={[voiceSettings.volume]} onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, volume: v }))} min={0.1} max={1} step={0.05} aria-label="Speech volume" />
                </div>
              </div>

              {/* Manual controls */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: "← Prev", action: () => goTo((autoPlayIdx - 1 + CURATED_VOICES.length) % CURATED_VOICES.length), aria: "Previous voice", style: "border-white/10 bg-white/5 hover:border-violet-400/40 text-foreground/70" },
                  { label: "↺ Replay", action: () => { window.speechSynthesis?.cancel(); try { autoRecRef.current?.abort(); } catch {} autoRecRef.current = null; setAutoPhase("playing"); }, aria: "Replay current voice", style: "border-white/10 bg-white/5 hover:border-violet-400/40 text-foreground/70" },
                  { label: "Next →", action: () => goTo((autoPlayIdx + 1) % CURATED_VOICES.length), aria: "Next voice", style: "border-white/10 bg-white/5 hover:border-violet-400/40 text-foreground/70" },
                ].map(({ label, action, aria, style }) => (
                  <button key={label} onClick={action} aria-label={aria}
                    className={`px-3 py-1.5 rounded-xl border text-sm transition-all duration-200 ${style}`}>
                    {label}
                  </button>
                ))}
                <button onClick={chooseVoice} aria-label="Choose this voice and continue"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_14px_rgba(167,139,250,0.4)] hover:shadow-[0_0_20px_rgba(167,139,250,0.6)] transition-all duration-200">
                  ✓ Choose This Voice
                </button>
                {autoPhase !== "idle" && (
                  <button onClick={() => { window.speechSynthesis?.cancel(); try { autoRecRef.current?.abort(); } catch {} autoRecRef.current = null; setAutoPhase("idle"); }}
                    aria-label="Stop auto-play"
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-sm text-muted-foreground/60 hover:border-rose-400/30 transition-all duration-200">
                    Stop
                  </button>
                )}
              </div>

              {/* Voice list */}
              <div ref={voiceListRef} className="space-y-0.5 max-h-[240px] overflow-y-auto rounded-2xl border border-white/[0.07] bg-black/20 p-2" role="listbox" aria-label="Voice options">
                {CURATED_VOICES.map((voice, idx) => {
                  const isCurrent = idx === autoPlayIdx;
                  const isPlaying = isCurrent && autoPhase === "playing";
                  const isManualPlaying = playingVoiceURI === voice.id;
                  return (
                    <div
                      key={voice.id}
                      data-voice-id={voice.id}
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => { setVoiceSettings((s) => ({ ...s, elevenLabsVoiceId: voice.id, elevenLabsVoiceName: voice.name, voiceURI: null })); goTo(idx); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? "bg-violet-500/20 border border-violet-400/40 shadow-[0_0_10px_rgba(167,139,250,0.25)]"
                          : "hover:bg-white/[0.05] border border-transparent"
                      }`}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); testVoice(voice); }}
                        disabled={playingVoiceURI !== null && !isManualPlaying}
                        aria-label={isPlaying || isManualPlaying ? `Playing ${voice.name}` : `Preview ${voice.name}`}
                        className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                          isPlaying || isManualPlaying
                            ? "bg-violet-500/30 border border-violet-400/50"
                            : "bg-white/5 border border-white/10 hover:bg-violet-500/20 hover:border-violet-400/40 disabled:opacity-40"
                        }`}
                      >
                        {isPlaying || isManualPlaying
                          ? <span className="h-3 w-3 rounded-full border-2 border-violet-400 border-t-transparent animate-spin block" />
                          : <Play className="h-3 w-3 text-foreground/60" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground/90 truncate">{voice.name}</p>
                        <p className="text-xs text-muted-foreground/50">{voice.accent}</p>
                      </div>
                      {isCurrent && <Check className="h-4 w-4 text-violet-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <button onClick={() => { clearSpoken(); setStep(4); }}
                className="w-full py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-muted-foreground/60 hover:border-white/20 hover:text-muted-foreground transition-all duration-200 flex items-center justify-center gap-2">
                Skip <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })()}

        {/* STEP 4: Communication */}
        {step === 4 && (
          <motion.div key="communication" {...fadeSlide} className="w-full max-w-2xl mx-auto space-y-5">
            {isSpeakMode && <ListeningIndicator visible={isListening} level={inputLevel} />}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-400 to-violet-600 flex items-center justify-center shadow-[0_0_24px_rgba(167,139,250,0.45)] mb-3">
                <span className="text-2xl" aria-hidden="true">🌈</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                Every way to communicate
              </h2>
              <p className="text-muted-foreground/70 text-sm max-w-md mx-auto leading-relaxed">
                All methods are always available. Switch anytime, from any room, without leaving where you are.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMUNICATION_METHODS.map((method) => (
                <div key={method.id}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
                  style={{ boxShadow: `0 0 14px ${method.color}22` }}>
                  <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-md"
                    style={{ background: `linear-gradient(135deg, ${method.color}55, ${method.color}22)`, border: `1px solid ${method.color}44` }}>
                    {method.picture}
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground/90">{method.label}</span>
                  <Check className="h-4 w-4 shrink-0" style={{ color: method.color }} />
                </div>
              ))}
            </div>
            {/* External devices */}
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/[0.06] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow">
                  <span className="text-sm" aria-hidden="true">🔌</span>
                </div>
                <p className="text-sm font-semibold text-foreground/90">Connect an external device</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground/70">
                <div className="flex items-start gap-2"><span className="text-sky-400">⠿</span><span><strong className="text-foreground/80">Braille display</strong> — USB or Bluetooth</span></div>
                <div className="flex items-start gap-2"><span className="text-sky-400">💻</span><span><strong className="text-foreground/80">AAC / speech device</strong> — USB, Bluetooth, audio</span></div>
                <div className="flex items-start gap-2"><span className="text-sky-400">👁️</span><span><strong className="text-foreground/80">Eye gaze tracker</strong> — USB</span></div>
                <div className="flex items-start gap-2"><span className="text-sky-400">🔘</span><span><strong className="text-foreground/80">Switch access</strong> — 3.5mm or Bluetooth</span></div>
              </div>
              <p className="text-[11px] text-muted-foreground/50">Pair your device first, then use the 🔌 switcher in the app header anytime.</p>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-1">
              <button onClick={() => { setStep(5); }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-base shadow-[0_0_24px_rgba(167,139,250,0.45)] hover:shadow-[0_0_32px_rgba(167,139,250,0.6)] transition-all duration-300 hover:scale-[1.02]">
                Continue <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 5: Safety Info */}
        {step === 5 && (
          <motion.div key="safety-info" {...fadeSlide} className="w-full max-w-md mx-auto space-y-8 text-center px-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 14 }}
              className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center shadow-[0_0_36px_rgba(74,222,128,0.6),0_0_70px_rgba(74,222,128,0.2)]"
            >
              <span className="text-4xl" aria-hidden="true">👼</span>
            </motion.div>
            <div className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                Your private safety feature
              </h2>
              <p className="text-base text-foreground/80 leading-relaxed max-w-sm mx-auto">
                The green angel icon is your private silent distress beacon. Tap it anytime to send a code to a dispatcher on call.
              </p>
              <p className="text-sm text-muted-foreground/60">Only you will know what it does.</p>
            </div>
            <button onClick={() => setStep(6)}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-base shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:shadow-[0_0_30px_rgba(74,222,128,0.6)] transition-all duration-300 hover:scale-[1.03]">
              Got it
            </button>
          </motion.div>
        )}

        {/* STEP 6: Confirmation */}
        {step === 6 && (
          <motion.div key="confirm" {...fadeSlide} className="text-center max-w-xl mx-auto space-y-7 px-4">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 13 }}
              className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-teal-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-[0_0_48px_rgba(167,139,250,0.6)]"
            >
              <Check className="h-14 w-14 text-white" strokeWidth={2.5} />
            </motion.div>
            <div className="space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                You are all set.
              </h2>
              <p className="text-lg text-foreground/80 font-light">Welcome to Soul Echoes.</p>
              <p className="text-base text-muted-foreground/60">I am here for you every day.</p>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-xl font-display font-bold bg-gradient-to-r from-teal-300 to-violet-300 bg-clip-text text-transparent"
            >
              Let's begin. ✦
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
