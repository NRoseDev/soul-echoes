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
import { getVoiceSettings, saveVoiceSettings, ELEVENLABS_VOICES, type VoiceSettings } from "@/lib/voiceSettings";
import ListeningIndicator from "@/components/ListeningIndicator";
import { useAlwaysOnListening } from "@/hooks/use-always-on-listening";

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

const PREFERRED_VOICES = ["samantha", "karen", "moira", "google uk english female", "google us english female", "microsoft zira"];

function getSoftFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  for (const pref of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en") && /female|zira|samantha|karen/i.test(v.name)) || null;
}

function speakAsync(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = getSoftFemaleVoice();
    if (voice) u.voice = voice;
    u.rate = 0.9;
    u.pitch = 1.1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
    setTimeout(resolve, text.length * 80 + 2000);
  });
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = getSoftFemaleVoice();
  if (voice) u.voice = voice;
  u.rate = 0.9;
  u.pitch = 1.1;
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
        .then((stream) => { streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; })
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
  { code: "en", label: "English", emoji: "🇺🇸" },
  { code: "es", label: "Español", emoji: "🇪🇸" },
  { code: "fr", label: "Français", emoji: "🇫🇷" },
  { code: "pt", label: "Português", emoji: "🇧🇷" },
  { code: "zh", label: "中文", emoji: "🇨🇳" },
  { code: "ar", label: "العربية", emoji: "🇸🇦" },
  { code: "hi", label: "हिन्दी", emoji: "🇮🇳" },
  { code: "ru", label: "Русский", emoji: "🇷🇺" },
  { code: "de", label: "Deutsch", emoji: "🇩🇪" },
  { code: "ja", label: "日本語", emoji: "🇯🇵" },
  { code: "ko", label: "한국어", emoji: "🇰🇷" },
  { code: "it", label: "Italiano", emoji: "🇮🇹" },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [primaryLang, setPrimaryLang] = useState("en");
  const [secondaryLang, setSecondaryLang] = useState<string | null>(null);
  const [wantSecondary, setWantSecondary] = useState<boolean | null>(null);
  const [signLanguage, setSignLanguage] = useState<boolean | null>(null);
  const [langSubStep, setLangSubStep] = useState(0);
  const [typedLang, setTypedLang] = useState("");
  const [commMethods, setCommMethods] = useState<string[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(getVoiceSettings);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);
  const hasSpokenRef = useRef<string>("");
  const contRecRef = useRef<any>(null);
  const contRecActiveRef = useRef(false);
  const handleVoiceRef = useRef<(t: string) => void>(() => {});

  const isSpeakMode = inputMethod === "speak";

  // Always-on listening active during entire onboarding
  useAlwaysOnListening({
    onTranscript: (t) => handleVoiceRef.current(t),
    onDistress: () => {
      // Save what we have and advance to safety step
      savePreferences({
        onboardingComplete: false,
        primaryLanguage: primaryLang,
        inputMethod: inputMethod || "type",
        communicationMethods: commMethods.length > 0 ? commMethods : [inputMethod || "type"],
      });
      window.dispatchEvent(new CustomEvent("soul-echoes-distress-trigger"));
    },
    enabled: true,
  });

  const startContinuousRec = useCallback(() => {
    if (!isSpeakMode) return;
    if (contRecActiveRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    contRecRef.current?.abort();
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.maxAlternatives = 3;
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1];
      if (last.isFinal) handleVoiceRef.current(last[0].transcript);
    };
    rec.onend = () => {
      contRecActiveRef.current = false;
      if (contRecRef.current === rec) setTimeout(() => startContinuousRec(), 300);
      else setIsListening(false);
    };
    rec.onerror = (e: any) => {
      contRecActiveRef.current = false;
      if (e.error === "not-allowed" || e.error === "network") { contRecRef.current = null; return; }
    };
    contRecRef.current = rec;
    contRecActiveRef.current = true;
    setIsListening(true);
    rec.start();
  }, [isSpeakMode]);

  const stopContinuousRec = useCallback(() => {
    contRecRef.current?.abort();
    contRecRef.current = null;
    contRecActiveRef.current = false;
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (inputMethod !== "speak") return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => { stream.getTracks().forEach((t) => t.stop()); startContinuousRec(); })
      .catch(() => {});
    return () => stopContinuousRec();
  }, [inputMethod, startContinuousRec, stopContinuousRec]);

  useEffect(() => {
    if (step !== 1) return;
    if (isSpeakMode) speak("Soul Echoes — Your daily healing advocate. A sacred space to release, heal, and find closure.");
    const timer = setTimeout(() => setWelcomeDone(true), 4000);
    const autoAdvance = setTimeout(() => setStep(2), 8000);
    return () => { clearTimeout(timer); clearTimeout(autoAdvance); };
  }, [step, isSpeakMode]);

  useEffect(() => {
    if (step !== 2 || !isSpeakMode) return;
    if (langSubStep === 0 && hasSpokenRef.current !== "lang-primary") {
      hasSpokenRef.current = "lang-primary";
      speakAsync("What is your primary language?").then(() => startContinuousRec());
    }
    if (langSubStep === 1 && wantSecondary === null && hasSpokenRef.current !== "lang-secondary-q") {
      hasSpokenRef.current = "lang-secondary-q";
      speakAsync("Would you like to add a second language?").then(() => startContinuousRec());
    }
    if (langSubStep === 1 && wantSecondary === true && hasSpokenRef.current !== "lang-secondary-pick") {
      hasSpokenRef.current = "lang-secondary-pick";
      speakAsync("Which second language?").then(() => startContinuousRec());
    }
    if (langSubStep === 2 && hasSpokenRef.current !== "lang-sign") {
      hasSpokenRef.current = "lang-sign";
      speakAsync("Would you like to enable Sign Language?").then(() => startContinuousRec());
    }
  }, [step, langSubStep, wantSecondary, isSpeakMode, startContinuousRec]);

  useEffect(() => {
    if (step !== 3 || !isSpeakMode) return;
    if (hasSpokenRef.current !== "voice-setup") {
      hasSpokenRef.current = "voice-setup";
      speakAsync("Choose your AI voice. Say a voice name, or say continue to skip.").then(() => startContinuousRec());
    }
  }, [step, isSpeakMode, startContinuousRec]);

  useEffect(() => {
    if (step !== 4 || !isSpeakMode) return;
    if (hasSpokenRef.current !== "comm-method") {
      hasSpokenRef.current = "comm-method";
      speakAsync("How do you like to communicate? You can choose all that apply. Say select all for everything.").then(() => startContinuousRec());
    }
  }, [step, isSpeakMode, startContinuousRec]);

  useEffect(() => {
    if (step !== 6) return;
    stopContinuousRec();
    if (isSpeakMode) speak("You are all set. Welcome to Soul Echoes.");
    const timer = setTimeout(() => {
      savePreferences({
        onboardingComplete: true,
        primaryLanguage: primaryLang,
        secondaryLanguage: secondaryLang,
        signLanguageEnabled: signLanguage === true,
        communicationMethods: commMethods.length > 0 ? commMethods : [inputMethod || "type"],
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
    if (step === 2) {
      if (langSubStep === 0) {
        const match = matchLanguage(t);
        if (match) {
          stopContinuousRec();
          setPrimaryLang(match.code);
          setRetryMessage(null);
          hasSpokenRef.current = "";
          savePreferences({ primaryLanguage: match.code });
          speakAsync(`Got it — ${match.name} selected.`).then(() => setLangSubStep(1));
        } else { setRetryMessage(`I heard "${t}" — try again.`); }
      } else if (langSubStep === 1) {
        if (wantSecondary === true) {
          const match = matchLanguage(t);
          if (match) {
            stopContinuousRec();
            setSecondaryLang(match.code);
            setRetryMessage(null);
            hasSpokenRef.current = "";
            savePreferences({ secondaryLanguage: match.code });
            speakAsync(`Selected ${match.name}`).then(() => setLangSubStep(2));
          } else { setRetryMessage(`I heard "${t}" — say a language name.`); }
        } else {
          const yn = matchYesNo(t);
          if (yn === true) { setWantSecondary(true); setRetryMessage(null); hasSpokenRef.current = ""; }
          else if (yn === false) { stopContinuousRec(); setWantSecondary(false); setRetryMessage(null); hasSpokenRef.current = ""; setLangSubStep(2); }
          else {
            const match = matchLanguage(t);
            if (match) {
              stopContinuousRec(); setWantSecondary(true); setSecondaryLang(match.code);
              setRetryMessage(null); hasSpokenRef.current = "";
              savePreferences({ secondaryLanguage: match.code });
              speakAsync(`Selected ${match.name}`).then(() => setLangSubStep(2));
            } else { setRetryMessage(`I heard "${t}". Say yes, no, or a language.`); }
          }
        }
      } else if (langSubStep === 2) {
        const yn = matchYesNo(t);
        if (yn === true) { stopContinuousRec(); setSignLanguage(true); setStep(3); }
        else if (yn === false) { stopContinuousRec(); setSignLanguage(false); setStep(3); }
        else { setRetryMessage(`I heard "${t}". Say yes or no.`); }
      }
    } else if (step === 3) {
      if (["continue", "next", "skip"].some((w) => lower.includes(w))) { stopContinuousRec(); setStep(4); return; }
      const matchingVoice = ELEVENLABS_VOICES.find((v) => lower.includes(v.name.toLowerCase()) || v.name.toLowerCase().includes(lower));
      if (matchingVoice) {
        setVoiceSettings((s) => ({ ...s, elevenLabsVoiceId: matchingVoice.id, elevenLabsVoiceName: matchingVoice.name }));
        setRetryMessage(null);
      } else { setRetryMessage(`I heard "${t}" — say a voice name or "continue".`); }
    } else if (step === 4) {
      if (["all", "select all", "everything", "all of them"].some((w) => lower.includes(w))) {
        setCommMethods(COMMUNICATION_METHODS.map((m) => m.id));
        speak("All communication methods selected.");
        return;
      }
      const method = matchCommMethod(t);
      if (method && !commMethods.includes(method)) {
        const updated = [...commMethods, method];
        setCommMethods(updated);
        const label = COMMUNICATION_METHODS.find((m) => m.id === method)?.label || method;
        speak(`Added: ${label}.`);
      }
    }
  }, [step, langSubStep, wantSecondary, commMethods, stopContinuousRec, voiceSettings]);

  handleVoiceRef.current = handleVoiceInput;

  const toggleComm = (id: string) => {
    setRetryMessage(null);
    setCommMethods((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const getLangName = (code: string) => WORLD_LANGUAGES.find((l) => l.code === code)?.name || code;

  const handleSelectLang = (code: string, name: string, next: () => void) => {
    stopContinuousRec();
    setPrimaryLang(code);
    setRetryMessage(null);
    hasSpokenRef.current = "";
    savePreferences({ primaryLanguage: code });
    if (isSpeakMode) speakAsync(`Got it — ${name} selected.`).then(next);
    else next();
  };

  const handleSelectSecondaryLang = (code: string, name: string) => {
    stopContinuousRec();
    setSecondaryLang(code);
    setRetryMessage(null);
    hasSpokenRef.current = "";
    savePreferences({ secondaryLanguage: code });
    if (isSpeakMode) speakAsync(`Selected ${name}`).then(() => setLangSubStep(2));
    else setLangSubStep(2);
  };

  const testVoice = async (voiceId: string) => {
    setTestingVoice(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: "Hello, I am here with you.", voiceId }),
        }
      );
      if (!response.ok) throw new Error("TTS failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); setTestingVoice(false); };
      audio.onerror = () => { URL.revokeObjectURL(url); setTestingVoice(false); };
      await audio.play();
    } catch {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Hello, I am here with you.");
      u.rate = voiceSettings.speed;
      u.volume = voiceSettings.volume;
      u.onend = () => setTestingVoice(false);
      window.speechSynthesis.speak(u);
    }
  };

  const INPUT_METHOD_CARDS: { id: InputMethod; label: string; emoji: string; desc: string }[] = [
    { id: "speak", label: "Speak It", emoji: "🗣️", desc: "Use your voice" },
    { id: "sign", label: "Sign It", emoji: "🤟", desc: "Use sign language" },
    { id: "point", label: "Point It", emoji: "👆", desc: "Tap cards & pictures" },
    { id: "type", label: "Type It", emoji: "⌨️", desc: "Use your keyboard" },
    { id: "connect", label: "Connect Device", emoji: "🔌", desc: "AAC, eye gaze, Bluetooth" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4 overflow-y-auto" role="main" aria-label="Soul Echoes Onboarding">
      <AnimatePresence mode="wait">

        {step === 0 && (
          <motion.div key="input-method" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-6 text-center">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">How would you like to interact?</h1>
            <p className="text-muted-foreground text-sm">Choose your preferred way to communicate. This will be used throughout the app.</p>
            <div className="grid gap-3">
              {INPUT_METHOD_CARDS.map((m) => (
                <button key={m.id}
                  onClick={() => { setInputMethod(m.id); savePreferences({ inputMethod: m.id }); if (m.id === "sign") setCameraOpen(true); setStep(1); }}
                  className="flex items-center gap-4 px-5 py-5 rounded-2xl border-2 border-border bg-card text-left transition-all hover:border-primary/50 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring">
                  <span className="text-4xl">{m.emoji}</span>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{m.label}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="welcome" {...fadeSlide} className="text-center max-w-2xl mx-auto space-y-8 cursor-pointer"
            onClick={() => setStep(2)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setStep(2)}>
            <div className="inline-block px-5 py-1.5 rounded-full border border-purple-400/30 bg-purple-500/10">
              <span className="text-sm font-medium text-purple-300">Your sanctuary for healing</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-teal-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">Soul Echoes</h1>
            <p className="text-lg sm:text-xl text-foreground">Your daily healing advocate.</p>
            <p className="text-base text-muted-foreground leading-relaxed">A sacred space to release, heal, and find closure.</p>
            {welcomeDone && <p className="text-sm text-muted-foreground animate-pulse">Tap anywhere to continue</p>}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="language" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-4 bg-gradient-to-b from-[hsl(220,60%,12%)] to-[hsl(230,50%,18%)] rounded-3xl p-4 sm:p-6">
            {isSpeakMode && <ListeningIndicator visible={isListening} />}
            {retryMessage && <p className="text-sm text-center text-destructive" role="alert">{retryMessage}</p>}
            {inputMethod === "sign" && <ASLCameraPanel open={true} onClose={() => {}} />}
            {inputMethod === "connect" && (
              <div className="bg-card border border-border rounded-2xl p-4 text-center space-y-2 mb-4">
                <p className="text-2xl">🔌</p>
                <p className="text-sm text-muted-foreground">Connect your AAC device, eye gaze tracker, or external communication equipment via Bluetooth or USB.</p>
              </div>
            )}
            {langSubStep === 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">What is your primary language?</h2>
                {inputMethod === "type" && (
                  <Input placeholder="Type your language..." value={typedLang} onChange={(e) => setTypedLang(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && typedLang.trim()) { const match = matchLanguage(typedLang); if (match) handleSelectLang(match.code, match.name, () => setLangSubStep(1)); else setRetryMessage(`"${typedLang}" not found.`); }}}
                    className="text-lg py-6 rounded-2xl" autoFocus />
                )}
                {inputMethod === "point" && (
                  <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                    {LANGUAGE_POINT_CARDS.map((lang) => (
                      <button key={lang.code} onClick={() => handleSelectLang(lang.code, lang.label, () => setLangSubStep(1))}
                        className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${primaryLang === lang.code ? "border-primary bg-primary/10 scale-105" : "border-border bg-card hover:border-primary/40"}`}>
                        <span className="text-3xl">{lang.emoji}</span>
                        <span className="text-sm font-medium text-foreground">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                {(inputMethod === "speak" || inputMethod === "sign" || inputMethod === "connect") && (
                  <div className="max-h-[420px] overflow-y-auto rounded-xl p-1">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {FLAG_LANGUAGES.map((lang) => (
                        <button key={lang.code} onClick={() => handleSelectLang(lang.code, lang.name, () => setLangSubStep(1))}
                          className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${primaryLang === lang.code ? "border-primary bg-white scale-105 shadow-lg" : "border-white/20 bg-white/90 hover:bg-white shadow-sm"}`}>
                          <img src={`https://flagcdn.com/48x36/${lang.cc}.png`} alt={lang.name} className="w-12 h-9 object-cover rounded-sm" />
                          <span className="text-xs font-medium text-gray-800">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {langSubStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">Would you like to add a second language?</h2>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl min-w-[120px] gap-2" onClick={() => { setWantSecondary(true); setRetryMessage(null); hasSpokenRef.current = ""; }} variant={wantSecondary === true ? "default" : "outline"}>
                    <span className="text-2xl">✅</span> Yes
                  </Button>
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl min-w-[120px] gap-2" onClick={() => { setWantSecondary(false); setSecondaryLang(null); setRetryMessage(null); hasSpokenRef.current = ""; setLangSubStep(2); }} variant={wantSecondary === false ? "default" : "outline"}>
                    <span className="text-2xl">❌</span> No
                  </Button>
                </div>
                {wantSecondary && (
                  <>
                    {inputMethod === "type" && (
                      <Input placeholder="Type second language..." value={typedLang} onChange={(e) => setTypedLang(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && typedLang.trim()) { const match = matchLanguage(typedLang); if (match) handleSelectSecondaryLang(match.code, match.name); else setRetryMessage(`"${typedLang}" not found.`); }}}
                        className="text-lg py-6 rounded-2xl" autoFocus />
                    )}
                    {inputMethod === "point" && (
                      <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                        {LANGUAGE_POINT_CARDS.filter((l) => l.code !== primaryLang).map((lang) => (
                          <button key={lang.code} onClick={() => handleSelectSecondaryLang(lang.code, lang.label)}
                            className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${secondaryLang === lang.code ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}>
                            <span className="text-3xl">{lang.emoji}</span>
                            <span className="text-sm font-medium text-foreground">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {(inputMethod === "speak" || inputMethod === "sign" || inputMethod === "connect") && (
                      <div className="max-h-[300px] overflow-y-auto rounded-xl p-1">
                        <div className="grid grid-cols-3 gap-2">
                          {FLAG_LANGUAGES.filter((l) => l.code !== primaryLang).map((lang) => (
                            <button key={lang.code} onClick={() => handleSelectSecondaryLang(lang.code, lang.name)}
                              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${secondaryLang === lang.code ? "border-primary bg-white scale-105 shadow-lg" : "border-white/20 bg-white/90 shadow-sm"}`}>
                              <img src={`https://flagcdn.com/48x36/${lang.cc}.png`} alt={lang.name} className="w-12 h-9 object-cover rounded-sm" />
                              <span className="text-xs font-medium text-gray-800">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {langSubStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">Would you like to enable Sign Language?</h2>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="text-xl px-10 py-7 rounded-2xl min-w-[140px] gap-3" onClick={() => { setSignLanguage(true); setRetryMessage(null); setStep(3); }} variant={signLanguage === true ? "default" : "outline"}>
                    <span className="text-3xl">🤟</span> Yes
                  </Button>
                  <Button size="lg" className="text-xl px-10 py-7 rounded-2xl min-w-[140px] gap-3" onClick={() => { setSignLanguage(false); setRetryMessage(null); setStep(3); }} variant={signLanguage === false ? "default" : "outline"}>
                    <span className="text-3xl">❌</span> No
                  </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm">Selected: {getLangName(primaryLang)}{secondaryLang && ` + ${getLangName(secondaryLang)}`}</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="voice" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-4 max-h-[80vh] overflow-y-auto">
            {isSpeakMode && <ListeningIndicator visible={isListening} />}
            {retryMessage && <p className="text-sm text-center text-destructive">{retryMessage}</p>}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">Choose Your AI Voice</h2>
            <p className="text-center text-muted-foreground text-sm">Pick the voice Soul Echoes will use to speak to you.</p>
            <div className="flex gap-3">
              {(["feminine", "masculine", "neutral"] as const).map((g) => {
                const gIcons = { feminine: "♀️", masculine: "♂️", neutral: "⚧️" };
                return (
                  <button key={g} onClick={() => setVoiceSettings((s) => ({ ...s, genderPref: g }))}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${voiceSettings.genderPref === g ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
                    <span className="text-lg">{gIcons[g]}</span>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Speed — {voiceSettings.speed <= 0.75 ? "Slow 🐢" : voiceSettings.speed >= 1.25 ? "Fast 🐇" : "Normal"}</p>
              <Slider value={[voiceSettings.speed]} onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, speed: v }))} min={0.5} max={1.5} step={0.1} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Volume — {voiceSettings.volume <= 0.35 ? "Soft 🔈" : voiceSettings.volume >= 0.75 ? "Loud 🔊" : "Medium 🔉"}</p>
              <Slider value={[voiceSettings.volume]} onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, volume: v }))} min={0.1} max={1} step={0.05} />
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-card p-2">
              {ELEVENLABS_VOICES.filter((v) => {
                if (voiceSettings.genderPref === "neutral") return true;
                return v.gender === voiceSettings.genderPref || v.gender === "neutral";
              }).map((elVoice) => {
                const isSelected = voiceSettings.elevenLabsVoiceId === elVoice.id;
                return (
                  <div key={elVoice.id} onClick={() => setVoiceSettings((s) => ({ ...s, elevenLabsVoiceId: elVoice.id, elevenLabsVoiceName: elVoice.name }))}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-primary/15 border border-primary/30" : "hover:bg-muted"}`}>
                    <button onClick={(e) => { e.stopPropagation(); testVoice(elVoice.id); }} disabled={testingVoice}
                      className="shrink-0 h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 disabled:opacity-50">
                      <Play className="h-3 w-3 text-foreground" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{elVoice.name}</p>
                      <p className="text-xs text-muted-foreground">{elVoice.accent} · {elVoice.description}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                );
              })}
            </div>
            <Button onClick={() => { stopContinuousRec(); setStep(4); }} className="w-full rounded-2xl">
              Continue <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* STEP 4: Communication Methods */}
        {step === 4 && (
          <motion.div key="comm" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-4">
            {isSpeakMode && <ListeningIndicator visible={isListening} />}
            {retryMessage && <p className="text-sm text-center text-destructive">{retryMessage}</p>}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">How do you communicate?</h2>
            <p className="text-center text-muted-foreground text-sm">Select all that apply. These help us tailor your experience.</p>
            <div className="space-y-2">
              {COMMUNICATION_METHODS.map((method) => {
                const selected = commMethods.includes(method.id);
                return (
                  <button key={method.id}
                    onClick={() => setCommMethods((prev) => selected ? prev.filter((m) => m !== method.id) : [...prev, method.id])}
                    className={`w-full flex items-center gap-4 px-5 py-5 rounded-2xl border-2 text-left text-base font-medium transition-all ${selected ? "border-primary bg-primary/10 text-foreground shadow-md" : "border-border bg-card text-foreground hover:border-primary/50"}`}
                    style={{ borderLeftWidth: 5, borderLeftColor: method.color }}>
                    <span className="text-3xl">{method.picture}</span>
                    <span className="flex-1">{method.label}</span>
                    {selected && <Check className="h-5 w-5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
            {commMethods.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-2">
                <Button size="lg" className="text-lg px-8 py-6 rounded-2xl" onClick={() => { stopContinuousRec(); setStep(5); }}>
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 5: Safety Info */}
        {step === 5 && (
          <motion.div key="safety-info" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-8 text-center">
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              This app includes a private safety feature. You can access it anytime from the main menu. Only you will know what it does.
            </p>
            <Button size="lg" className="text-lg px-10 py-6 rounded-2xl" onClick={() => setStep(6)}>Got it</Button>
          </motion.div>
        )}

        {/* STEP 6: Confirmation */}
        {step === 6 && (
          <motion.div key="confirm" {...fadeSlide} className="text-center max-w-xl mx-auto space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-secondary" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">You are all set.</h2>
            <p className="text-lg text-foreground">Welcome to Soul Echoes. I am here for you every day.</p>
            <p className="text-xl font-display font-bold text-primary">Let's begin.</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
