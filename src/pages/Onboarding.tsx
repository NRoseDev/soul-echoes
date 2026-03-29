import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, ChevronRight, Volume2, Play, Hand, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  savePreferences,
  WORLD_LANGUAGES,
  COMMUNICATION_METHODS,
} from "@/lib/preferences";
import { getVoiceSettings, saveVoiceSettings, type VoiceSettings } from "@/lib/voiceSettings";
import {
  saveSafetySettings,
  ACCESS_SYMBOLS,
  ACCESS_COLORS,
  type AngelType,
  type AccessMethod,
} from "@/lib/safetySettings";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import ListeningIndicator from "@/components/ListeningIndicator";
import angelMichaelImg from "@/assets/angel-michael.png";
import angelFaithImg from "@/assets/angel-faith.png";

/* ─── TTS helpers ─── */
function speakAsync(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
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
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

/* ─── Animations ─── */
const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5 },
};

/* ─── Matchers ─── */
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
  if (["no", "nah", "nope", "not", "non", "nein", "nyet"].some((w) => lower.includes(w))) return false;
  return null;
}

function matchCommMethod(transcript: string): string | null {
  const lower = transcript.toLowerCase().trim();
  const mapping: [string[], string][] = [
    [["speak", "talk", "voice", "verbal"], "speak"],
    [["type", "typing", "keyboard", "text"], "type"],
    [["sign", "asl", "signing"], "sign"],
    [["color", "colour", "symbol", "paint", "art"], "colors"],
    [["picture", "card", "point", "pointing", "image"], "pictures"],
    [["braille", "assistive", "device"], "braille"],
    [["computer", "aac", "device speaks", "augmentative"], "aac"],
    [["eye", "tracking", "switch", "gaze"], "eyetrack"],
  ];
  for (const [keywords, id] of mapping) {
    if (keywords.some((k) => lower.includes(k))) return id;
  }
  return null;
}

function guessGender(name: string): VoiceSettings["genderPref"] {
  const lower = name.toLowerCase();
  const fem = ["samantha", "karen", "moira", "tessa", "fiona", "victoria", "alice", "anna", "sara", "female"];
  const masc = ["daniel", "alex", "fred", "jorge", "thomas", "male", "david", "mark"];
  if (fem.some((n) => lower.includes(n))) return "feminine";
  if (masc.some((n) => lower.includes(n))) return "masculine";
  return "neutral";
}

/* ─── ACCESS METHOD options ─── */
const ACCESS_METHOD_OPTIONS: { id: AccessMethod; label: string; icon: string; desc: string }[] = [
  { id: "pin", label: "4-Digit PIN", icon: "🔢", desc: "Type a 4-digit code" },
  { id: "codeword", label: "Code Word", icon: "🗣️", desc: "Speak or type a secret word" },
  { id: "symbol", label: "Personal Symbol", icon: "✨", desc: "Select your sacred symbol" },
  { id: "colorseq", label: "Color Sequence", icon: "🎨", desc: "Choose 3 colors in order" },
  { id: "sign", label: "Sign Gesture", icon: "🤟", desc: "Show your sign on camera" },
  { id: "pattern", label: "Drawn Pattern", icon: "✏️", desc: "Draw your pattern" },
];

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  // Steps: 0=Welcome, 1=Language, 2=Communication, 3=Safety, 4=Voice, 5=Confirmation
  const [step, setStep] = useState(0);
  const [welcomeDone, setWelcomeDone] = useState(false);

  // Language
  const [primaryLang, setPrimaryLang] = useState("en");
  const [secondaryLang, setSecondaryLang] = useState<string | null>(null);
  const [wantSecondary, setWantSecondary] = useState<boolean | null>(null);
  const [signLanguage, setSignLanguage] = useState<boolean | null>(null);
  const [langSubStep, setLangSubStep] = useState(0);
  const [searchPrimary, setSearchPrimary] = useState("");
  const [searchSecondary, setSearchSecondary] = useState("");

  // Communication
  const [commMethods, setCommMethods] = useState<string[]>([]);

  // Safety
  const [safetyAngel, setSafetyAngel] = useState<AngelType | null>(null);
  const [accessMethod, setAccessMethod] = useState<AccessMethod | null>(null);
  const [accessValue, setAccessValue] = useState("");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Voice
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(getVoiceSettings);

  // Shared
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const welcomeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const hasSpokenRef = useRef<string>("");
  const speech = useSpeechRecognition();

  // Load voices
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis?.getVoices() || [];
      if (v.length > 0) setVoices(v);
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const speakThenListen = useCallback(
    async (text: string, key: string) => {
      if (hasSpokenRef.current === key) return;
      hasSpokenRef.current = key;
      setRetryMessage(null);
      await speakAsync(text);
      setTimeout(() => speech.start(), 400);
    },
    [speech]
  );

  /* ─── Step effects ─── */

  // STEP 0: Welcome — auto-advance after 5s or tap
  useEffect(() => {
    if (step === 0) {
      const text = "Soul Echoes — Your daily healing advocate. A sacred space to release, heal, and find closure. Let the tools of the universe guide you home to your heart, where your journey began.";
      speak(text);
      welcomeTimerRef.current = setTimeout(() => setWelcomeDone(true), 4000);
      const autoAdvance = setTimeout(() => { setStep(1); }, 8000);
      return () => {
        if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
        clearTimeout(autoAdvance);
      };
    }
  }, [step]);

  // STEP 1: Language
  useEffect(() => {
    if (step === 1 && langSubStep === 0) speakThenListen("What is your primary language?", "lang-primary");
    if (step === 1 && langSubStep === 1) speakThenListen("Would you like to add a second language?", "lang-secondary");
    if (step === 1 && langSubStep === 2) speakThenListen("Would you like to enable Sign Language?", "lang-sign");
  }, [step, langSubStep, speakThenListen]);

  // STEP 2: Communication
  useEffect(() => {
    if (step === 2) {
      speakThenListen("How do you like to communicate? You can choose up to 3 options. Say or tap your choices.", "comm-method");
    }
  }, [step, speakThenListen]);

  // STEP 3: Safety
  useEffect(() => {
    if (step === 3 && !safetyAngel) {
      speakThenListen("Let's set up your safety angel. This is just between us. Choose Michael for protection, or Faith for inner strength.", "safety-angel");
    }
  }, [step, safetyAngel, speakThenListen]);

  // STEP 5: Confirmation
  useEffect(() => {
    if (step === 5) {
      speech.stop();
      speak("You are all set. Welcome to Soul Echoes. I am here for you every day. Let's begin.");
      const timer = setTimeout(() => {
        savePreferences({
          onboardingComplete: true,
          primaryLanguage: primaryLang,
          secondaryLanguage: secondaryLang,
          signLanguageEnabled: signLanguage === true,
          communicationMethods: commMethods.length > 0 ? commMethods : ["type"],
          autoReadEnabled: true,
        });
        saveVoiceSettings(voiceSettings);
        saveSafetySettings({
          angel: safetyAngel,
          accessMethod: accessMethod,
          accessValue: accessMethod === "colorseq" ? colorSequence.join(",") : accessMethod === "symbol" ? (selectedSymbol || "") : accessValue,
          setupComplete: true,
        });
        onComplete();
      }, 4500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* ─── Speech results handler ─── */
  useEffect(() => {
    if (!speech.transcript) return;
    const t = speech.transcript;

    if (step === 1 && langSubStep === 0) {
      const match = matchLanguage(t);
      if (match) {
        setPrimaryLang(match.code);
        speakAsync(`Got it — ${match.name} selected.`).then(() => setLangSubStep(1));
      } else {
        setRetryMessage(`I heard "${t}" but couldn't match a language.`);
        speak(`I didn't catch that — please try again or tap below.`);
        hasSpokenRef.current = "";
        setTimeout(() => speech.start(), 3500);
      }
    } else if (step === 1 && langSubStep === 1) {
      const yn = matchYesNo(t);
      if (yn === true) {
        setWantSecondary(true);
        speak("Which language?");
        setTimeout(() => speech.start(), 2000);
      } else if (yn === false) {
        setWantSecondary(false);
        setSecondaryLang(null);
        setLangSubStep(2);
      } else {
        const match = matchLanguage(t);
        if (match) {
          setWantSecondary(true);
          setSecondaryLang(match.code);
          speakAsync(`Selected ${match.name}`).then(() => setLangSubStep(2));
        } else {
          setRetryMessage(`I heard "${t}". Say yes, no, or a language name.`);
          hasSpokenRef.current = "";
          setTimeout(() => speech.start(), 3500);
        }
      }
    } else if (step === 1 && langSubStep === 2) {
      const yn = matchYesNo(t);
      if (yn === true) { setSignLanguage(true); setStep(2); }
      else if (yn === false) { setSignLanguage(false); setStep(2); }
      else {
        setRetryMessage(`I heard "${t}". Please say yes or no.`);
        hasSpokenRef.current = "";
        setTimeout(() => speech.start(), 3000);
      }
    } else if (step === 2) {
      const method = matchCommMethod(t);
      if (method && !commMethods.includes(method)) {
        const updated = [...commMethods, method].slice(0, 3);
        setCommMethods(updated);
        const label = COMMUNICATION_METHODS.find((m) => m.id === method)?.label || method;
        speak(`Added: ${label}.`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript]);

  /* ─── Helpers ─── */
  const toggleComm = (id: string) => {
    speech.stop();
    setRetryMessage(null);
    setCommMethods((prev) => {
      if (prev.includes(id)) return prev.filter((m) => m !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filteredLangs = (search: string) =>
    WORLD_LANGUAGES.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  const getLangName = (code: string) =>
    WORLD_LANGUAGES.find((l) => l.code === code)?.name || code;

  const filteredVoices = voices.filter((v) => {
    if (voiceSettings.genderPref === "neutral") return true;
    return guessGender(v.name) === voiceSettings.genderPref || guessGender(v.name) === "neutral";
  });

  const testVoice = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Soul Echoes — Your daily healing advocate. A sacred space to release, heal, and find closure.");
    if (voiceSettings.voiceURI) {
      const match = voices.find((v) => v.voiceURI === voiceSettings.voiceURI);
      if (match) u.voice = match;
    }
    u.rate = voiceSettings.speed;
    u.volume = voiceSettings.volume;
    window.speechSynthesis.speak(u);
  };

  const canFinishSafety = safetyAngel && accessMethod && (
    (accessMethod === "pin" && accessValue.length === 4) ||
    (accessMethod === "codeword" && accessValue.length >= 2) ||
    (accessMethod === "symbol" && selectedSymbol) ||
    (accessMethod === "colorseq" && colorSequence.length === 3) ||
    (accessMethod === "sign") ||
    (accessMethod === "pattern" && accessValue.length >= 1)
  );

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div
      className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4 overflow-y-auto"
      role="main"
      aria-label="Soul Echoes Onboarding"
    >
      <AnimatePresence mode="wait">
        {/* ─── STEP 0: Welcome ─── */}
        {step === 0 && (
          <motion.div
            key="welcome"
            {...fadeSlide}
            className="text-center max-w-2xl mx-auto space-y-8 cursor-pointer"
            onClick={() => setStep(1)}
            role="button"
            aria-label="Tap to continue"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setStep(1)}
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight"
            >
              Soul Echoes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-foreground leading-relaxed"
            >
              Your daily healing advocate.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              A sacred space to release, heal, and find closure. Let the tools of the universe guide you home to your heart, where your journey began.
            </motion.p>
            {welcomeDone && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground animate-pulse">
                Tap anywhere to continue
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ─── STEP 1: Language ─── */}
        {step === 1 && (
          <motion.div key="language" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-6">
            {/* ASL camera placeholder visible on all sub-steps */}
            <div className="flex justify-end">
              <button
                onClick={() => setCameraOpen(!cameraOpen)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full border border-border"
                aria-label="Open camera for sign language"
              >
                <Camera className="h-4 w-4" /> ASL Camera
              </button>
            </div>
            {cameraOpen && (
              <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                ASL video recognition coming soon. Please tap your answer below.
              </div>
            )}

            {langSubStep === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center" aria-live="polite">
                  What is your primary language?
                </h2>
                <ListeningIndicator visible={speech.listening} />
                {retryMessage && <p className="text-sm text-center text-destructive" role="alert">{retryMessage}</p>}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <Input value={searchPrimary} onChange={(e) => setSearchPrimary(e.target.value)} placeholder="Search languages..." className="pl-10 text-lg h-12" aria-label="Search languages" />
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-card space-y-1 p-2" role="listbox" aria-label="Language list">
                  {filteredLangs(searchPrimary).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { speech.stop(); setPrimaryLang(lang.code); setRetryMessage(null); hasSpokenRef.current = ""; speakAsync(`Got it — ${lang.name} selected.`).then(() => setLangSubStep(1)); }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors ${primaryLang === lang.code ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                      role="option"
                      aria-selected={primaryLang === lang.code}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {langSubStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center" aria-live="polite">
                  Would you like to add a second language?
                </h2>
                <ListeningIndicator visible={speech.listening} />
                {retryMessage && <p className="text-sm text-center text-destructive" role="alert">{retryMessage}</p>}
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl min-w-[100px]" onClick={() => { speech.stop(); setWantSecondary(true); setRetryMessage(null); }} variant={wantSecondary === true ? "default" : "outline"} aria-label="Yes, add second language">
                    ✅ Yes
                  </Button>
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl min-w-[100px]" onClick={() => { speech.stop(); setWantSecondary(false); setSecondaryLang(null); setRetryMessage(null); setLangSubStep(2); }} variant={wantSecondary === false ? "default" : "outline"} aria-label="No second language">
                    ❌ No
                  </Button>
                </div>
                {wantSecondary && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <Input value={searchSecondary} onChange={(e) => setSearchSecondary(e.target.value)} placeholder="Search languages..." className="pl-10 text-lg h-12" aria-label="Search second language" />
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-card space-y-1 p-2" role="listbox">
                      {filteredLangs(searchSecondary).filter((l) => l.code !== primaryLang).map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { speech.stop(); setSecondaryLang(lang.code); setRetryMessage(null); hasSpokenRef.current = ""; setLangSubStep(2); }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors ${secondaryLang === lang.code ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                          role="option"
                          aria-selected={secondaryLang === lang.code}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {langSubStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center" aria-live="polite">
                  Would you like to enable Sign Language?
                </h2>
                <ListeningIndicator visible={speech.listening} />
                {retryMessage && <p className="text-sm text-center text-destructive" role="alert">{retryMessage}</p>}
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="text-xl px-10 py-7 rounded-2xl min-w-[120px]" onClick={() => { speech.stop(); setSignLanguage(true); setRetryMessage(null); setStep(2); }} variant={signLanguage === true ? "default" : "outline"} aria-label="Yes, enable sign language">
                    🤟 Yes
                  </Button>
                  <Button size="lg" className="text-xl px-10 py-7 rounded-2xl min-w-[120px]" onClick={() => { speech.stop(); setSignLanguage(false); setRetryMessage(null); setStep(2); }} variant={signLanguage === false ? "default" : "outline"} aria-label="No sign language">
                    ❌ No
                  </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  Selected: {getLangName(primaryLang)}{secondaryLang && ` + ${getLangName(secondaryLang)}`}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── STEP 2: Communication ─── */}
        {step === 2 && (
          <motion.div key="communication" {...fadeSlide} className="w-full max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center" aria-live="polite">
              How do you like to communicate?
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              Choose up to 3 methods. {commMethods.length}/3 selected.
            </p>
            <ListeningIndicator visible={speech.listening} />
            {retryMessage && <p className="text-sm text-center text-destructive" role="alert">{retryMessage}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Communication methods">
              {COMMUNICATION_METHODS.map((method) => {
                const selected = commMethods.includes(method.id);
                const disabled = !selected && commMethods.length >= 3;
                return (
                  <button
                    key={method.id}
                    onClick={() => toggleComm(method.id)}
                    disabled={disabled}
                    className={`flex items-center gap-4 px-5 py-5 rounded-2xl border-2 text-left text-base sm:text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground shadow-md"
                        : disabled
                        ? "border-border bg-card text-muted-foreground/50 cursor-not-allowed"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                    }`}
                    aria-pressed={selected}
                    aria-label={method.label}
                  >
                    <span className="text-2xl sm:text-3xl" aria-hidden="true">{method.icon}</span>
                    <span>{method.label}</span>
                    {selected && <Check className="ml-auto h-5 w-5 text-primary shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            {commMethods.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-2">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-2xl"
                  onClick={() => {
                    speech.stop();
                    const labels = commMethods.map((m) => COMMUNICATION_METHODS.find((cm) => cm.id === m)?.label || m).join(", ");
                    speakAsync(`Perfect — I have set up ${labels} for you. You can change this anytime in settings.`).then(() => setStep(3));
                  }}
                  aria-label="Continue to safety setup"
                >
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── STEP 3: Safety Angel Setup ─── */}
        {step === 3 && (
          <motion.div key="safety" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-6 max-h-[85vh] overflow-y-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center" aria-live="polite">
              🦄 Your Safety Angel
            </h2>
            <p className="text-center text-muted-foreground text-sm">This is just between us.</p>

            {/* Angel selection */}
            {!safetyAngel && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setSafetyAngel("michael"); speak("Michael selected. Now choose your private access method."); }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
                  aria-label="Michael — masculine protective energy"
                >
                  <img src={angelMichaelImg} alt="Michael — protective guardian" className="w-28 h-28 object-contain" />
                  <span className="font-display font-bold text-foreground text-lg">Michael ⚔️</span>
                </button>
                <button
                  onClick={() => { setSafetyAngel("faith"); speak("Faith selected. Now choose your private access method."); }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-card hover:border-secondary/50 hover:bg-secondary/5 transition-all"
                  aria-label="Faith — feminine nurturing energy"
                >
                  <img src={angelFaithImg} alt="Faith — nurturing guardian" className="w-28 h-28 object-contain" />
                  <span className="font-display font-bold text-foreground text-lg">Faith 🕊️</span>
                </button>
              </div>
            )}

            {/* Access method selection */}
            {safetyAngel && !accessMethod && (
              <div className="space-y-3">
                <p className="font-display text-lg font-bold text-foreground text-center">Choose your private access method</p>
                <div className="grid grid-cols-2 gap-3">
                  {ACCESS_METHOD_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAccessMethod(opt.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-muted transition-all"
                      aria-label={`${opt.label} — ${opt.desc}`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="font-medium text-sm text-foreground">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Access value input */}
            {safetyAngel && accessMethod && (
              <div className="space-y-4">
                <p className="font-display text-lg font-bold text-foreground text-center">
                  Set your {ACCESS_METHOD_OPTIONS.find((o) => o.id === accessMethod)?.label}
                </p>

                {accessMethod === "pin" && (
                  <Input
                    type="password"
                    maxLength={4}
                    value={accessValue}
                    onChange={(e) => setAccessValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="● ● ● ●"
                    className="text-center text-2xl h-16 tracking-[0.5em]"
                    aria-label="Enter 4-digit PIN"
                    autoFocus
                  />
                )}

                {accessMethod === "codeword" && (
                  <Input
                    type="text"
                    value={accessValue}
                    onChange={(e) => setAccessValue(e.target.value)}
                    placeholder="Your secret word…"
                    className="text-center text-xl h-14"
                    aria-label="Enter code word"
                    autoFocus
                  />
                )}

                {accessMethod === "symbol" && (
                  <div className="grid grid-cols-4 gap-3">
                    {ACCESS_SYMBOLS.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setSelectedSymbol(sym)}
                        className={`text-3xl p-3 rounded-xl border-2 transition-all ${
                          selectedSymbol === sym ? "border-primary bg-primary/10 scale-110" : "border-border bg-card hover:border-primary/40"
                        }`}
                        aria-label={`Select symbol ${sym}`}
                        aria-pressed={selectedSymbol === sym}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                )}

                {accessMethod === "colorseq" && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">Tap 3 colors in your secret order ({colorSequence.length}/3)</p>
                    <div className="grid grid-cols-4 gap-3">
                      {ACCESS_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            if (colorSequence.length < 3) setColorSequence([...colorSequence, c.id]);
                          }}
                          className="h-14 rounded-xl border-2 border-border transition-all hover:scale-105"
                          style={{ backgroundColor: `hsl(${c.hsl})` }}
                          aria-label={`Select ${c.label}`}
                        />
                      ))}
                    </div>
                    {colorSequence.length > 0 && (
                      <div className="flex gap-2 justify-center">
                        {colorSequence.map((cId, i) => {
                          const c = ACCESS_COLORS.find((x) => x.id === cId);
                          return (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-foreground/20" style={{ backgroundColor: c ? `hsl(${c.hsl})` : undefined }} />
                          );
                        })}
                        <button onClick={() => setColorSequence([])} className="text-xs text-muted-foreground underline ml-2">Reset</button>
                      </div>
                    )}
                  </div>
                )}

                {accessMethod === "sign" && (
                  <div className="text-center space-y-3">
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Sign gesture recognition coming soon.</p>
                    <p className="text-xs text-muted-foreground">Your gesture will be saved locally on your device.</p>
                  </div>
                )}

                {accessMethod === "pattern" && (
                  <Input
                    type="text"
                    value={accessValue}
                    onChange={(e) => setAccessValue(e.target.value)}
                    placeholder="Draw or type your pattern…"
                    className="text-center text-xl h-14"
                    aria-label="Enter pattern"
                    autoFocus
                  />
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setAccessMethod(null); setAccessValue(""); setColorSequence([]); setSelectedSymbol(null); }} className="flex-1 rounded-2xl">
                    Back
                  </Button>
                  <Button
                    disabled={!canFinishSafety}
                    onClick={() => {
                      speak("Your angel is set. You are protected.");
                      setTimeout(() => setStep(4), 2500);
                    }}
                    className="flex-1 rounded-2xl"
                  >
                    Confirm <Check className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── STEP 4: Voice Setup ─── */}
        {step === 4 && (
          <motion.div key="voice" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-6 max-h-[80vh] overflow-y-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
              Choose Your AI Voice
            </h2>
            <p className="text-center text-muted-foreground text-sm">Pick the voice Soul Echoes will use to speak to you.</p>

            {/* Gender */}
            <div className="flex gap-3" role="radiogroup" aria-label="Voice gender preference">
              {(["feminine", "masculine", "neutral"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setVoiceSettings((s) => ({ ...s, genderPref: g }))}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    voiceSettings.genderPref === g ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                  role="radio"
                  aria-checked={voiceSettings.genderPref === g}
                  aria-label={g}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Speed — {voiceSettings.speed <= 0.75 ? "Slow" : voiceSettings.speed >= 1.25 ? "Fast" : "Normal"}</p>
              <Slider value={[voiceSettings.speed]} onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, speed: v }))} min={0.5} max={1.5} step={0.1} aria-label="Voice speed" />
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Volume — {voiceSettings.volume <= 0.35 ? "Soft" : voiceSettings.volume >= 0.75 ? "Loud" : "Medium"}</p>
              <Slider value={[voiceSettings.volume]} onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, volume: v }))} min={0.1} max={1} step={0.05} aria-label="Voice volume" />
            </div>

            {/* Voice list */}
            <div className="space-y-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-card p-2" role="listbox" aria-label="Available voices">
              {filteredVoices.length === 0 && <p className="text-sm text-muted-foreground p-3">Loading voices…</p>}
              {filteredVoices.map((voice) => {
                const isSelected = voiceSettings.voiceURI === voice.voiceURI;
                return (
                  <div
                    key={voice.voiceURI}
                    onClick={() => setVoiceSettings((s) => ({ ...s, voiceURI: voice.voiceURI }))}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                      isSelected ? "bg-primary/15 border border-primary/30" : "hover:bg-muted"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.speechSynthesis.cancel();
                        const u = new SpeechSynthesisUtterance("Hello, I am " + voice.name + ". Welcome to Soul Echoes.");
                        u.voice = voice;
                        u.rate = voiceSettings.speed;
                        u.volume = voiceSettings.volume;
                        window.speechSynthesis.speak(u);
                      }}
                      className="shrink-0 h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20"
                      aria-label={`Preview ${voice.name}`}
                    >
                      <Play className="h-3 w-3 text-foreground" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{voice.name}</p>
                      <p className="text-xs text-muted-foreground">{voice.lang}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Test & Continue */}
            <div className="flex gap-3">
              <Button onClick={testVoice} variant="outline" className="flex-1 rounded-2xl" aria-label="Test selected voice">
                <Volume2 className="h-4 w-4 mr-2" /> Test Voice
              </Button>
              <Button onClick={() => setStep(5)} className="flex-1 rounded-2xl" aria-label="Continue to confirmation">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 5: Confirmation ─── */}
        {step === 5 && (
          <motion.div key="confirm" {...fadeSlide} className="text-center max-w-xl mx-auto space-y-6" aria-live="polite">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto"
            >
              <Check className="h-10 w-10 text-secondary" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              You are all set.
            </h2>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              Welcome to Soul Echoes. I am here for you every day.
            </p>
            <p className="text-xl sm:text-2xl font-display font-bold text-primary">
              Let's begin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
