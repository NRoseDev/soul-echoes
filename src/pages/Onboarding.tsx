import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  savePreferences,
  WORLD_LANGUAGES,
  COMMUNICATION_METHODS,
} from "@/lib/preferences";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import ListeningIndicator from "@/components/ListeningIndicator";

/** Speak text and return a promise that resolves when done */
function speakAsync(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
    // Safety timeout in case onend never fires
    setTimeout(resolve, text.length * 80 + 2000);
  });
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5 },
};

/** Fuzzy match a spoken transcript to the closest language name */
function matchLanguage(transcript: string): { code: string; name: string } | null {
  const lower = transcript.toLowerCase().trim();
  // Exact match first
  const exact = WORLD_LANGUAGES.find(
    (l) => l.name.toLowerCase() === lower
  );
  if (exact) return exact;

  // Starts with
  const startsWith = WORLD_LANGUAGES.find(
    (l) => l.name.toLowerCase().startsWith(lower)
  );
  if (startsWith) return startsWith;

  // Contains
  const contains = WORLD_LANGUAGES.find(
    (l) => l.name.toLowerCase().includes(lower) || lower.includes(l.name.toLowerCase())
  );
  if (contains) return contains;

  return null;
}

/** Match spoken answer to yes/no */
function matchYesNo(transcript: string): boolean | null {
  const lower = transcript.toLowerCase().trim();
  const yesWords = ["yes", "yeah", "yep", "sure", "okay", "ok", "si", "oui", "ja", "da", "affirmative"];
  const noWords = ["no", "nah", "nope", "not", "non", "nein", "nyet", "negative"];
  if (yesWords.some((w) => lower.includes(w))) return true;
  if (noWords.some((w) => lower.includes(w))) return false;
  return null;
}

/** Match spoken communication method */
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

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [primaryLang, setPrimaryLang] = useState("en");
  const [secondaryLang, setSecondaryLang] = useState<string | null>(null);
  const [wantSecondary, setWantSecondary] = useState<boolean | null>(null);
  const [signLanguage, setSignLanguage] = useState<boolean | null>(null);
  const [langSubStep, setLangSubStep] = useState(0);
  const [commMethod, setCommMethod] = useState<string | null>(null);
  const [searchPrimary, setSearchPrimary] = useState("");
  const [searchSecondary, setSearchSecondary] = useState("");
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const welcomeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const hasSpokenRef = useRef<string>("");

  // Speech recognition
  const speech = useSpeechRecognition();

  // Helper: speak then listen
  const speakThenListen = useCallback(
    async (text: string, key: string) => {
      if (hasSpokenRef.current === key) return;
      hasSpokenRef.current = key;
      setRetryMessage(null);
      await speakAsync(text);
      // Small delay before activating mic
      setTimeout(() => speech.start(), 400);
    },
    [speech]
  );

  // ---- STEP 0: Welcome ----
  useEffect(() => {
    if (step === 0) {
      const text =
        "Soul Echoes — Your daily healing advocate. A sacred space to release, heal, and find closure. Let the tools of the universe guide you home to your heart, where your journey began.";
      speak(text);
      welcomeTimerRef.current = setTimeout(() => setWelcomeDone(true), 4000);
      return () => {
        if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      };
    }
  }, [step]);

  // ---- STEP 1: Language sub-steps — speak then listen ----
  useEffect(() => {
    if (step === 1 && langSubStep === 0) {
      speakThenListen("What is your primary language?", "lang-primary");
    }
    if (step === 1 && langSubStep === 1) {
      speakThenListen("Would you like to add a second language?", "lang-secondary");
    }
    if (step === 1 && langSubStep === 2) {
      speakThenListen("Would you like to enable Sign Language?", "lang-sign");
    }
  }, [step, langSubStep, speakThenListen]);

  // ---- STEP 2: Communication ----
  useEffect(() => {
    if (step === 2) {
      speakThenListen("How do you prefer to communicate? You can say: I speak, I type, I sign, colors and symbols, pictures, braille, computer speaks for me, or eye tracking.", "comm-method");
    }
  }, [step, speakThenListen]);

  // ---- STEP 3: Confirm ----
  useEffect(() => {
    if (step === 3) {
      speech.stop();
      const text =
        "Perfect. Soul Echoes is set up for you. You can change these settings anytime. Let's begin.";
      speak(text);
      const timer = setTimeout(() => {
        savePreferences({
          onboardingComplete: true,
          primaryLanguage: primaryLang,
          secondaryLanguage: secondaryLang,
          signLanguageEnabled: signLanguage === true,
          communicationMethod: commMethod || "type",
        });
        onComplete();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [step, primaryLang, secondaryLang, signLanguage, commMethod, onComplete, speech]);

  // ---- Handle speech results based on current step ----
  useEffect(() => {
    if (!speech.transcript) return;
    const t = speech.transcript;

    if (step === 1 && langSubStep === 0) {
      const match = matchLanguage(t);
      if (match) {
        setPrimaryLang(match.code);
        speakAsync(`Selected ${match.name}`).then(() => setLangSubStep(1));
      } else {
        setRetryMessage(`I heard "${t}" but couldn't match a language. Please try again or select manually.`);
        speak(`I heard "${t}" but couldn't match a language. Please try again or tap to select.`);
        setTimeout(() => speech.start(), 3500);
      }
    } else if (step === 1 && langSubStep === 1) {
      const yn = matchYesNo(t);
      if (yn === true) {
        setWantSecondary(true);
        speak("Which language? Say the name.");
        // We'll handle the follow-up in a secondary listen
        setTimeout(() => speech.start(), 2000);
      } else if (yn === false) {
        setWantSecondary(false);
        setSecondaryLang(null);
        setLangSubStep(2);
      } else {
        // Maybe they said a language name directly
        const match = matchLanguage(t);
        if (match) {
          setWantSecondary(true);
          setSecondaryLang(match.code);
          speakAsync(`Selected ${match.name} as your second language`).then(() => setLangSubStep(2));
        } else {
          setRetryMessage(`I heard "${t}". Please say yes or no, or say a language name.`);
          speak(`I heard "${t}". Please say yes or no, or say a language name.`);
          setTimeout(() => speech.start(), 3500);
        }
      }
    } else if (step === 1 && langSubStep === 2) {
      const yn = matchYesNo(t);
      if (yn === true) {
        setSignLanguage(true);
        setStep(2);
      } else if (yn === false) {
        setSignLanguage(false);
        setStep(2);
      } else {
        setRetryMessage(`I heard "${t}". Please say yes or no.`);
        speak(`I heard "${t}". Please say yes or no.`);
        setTimeout(() => speech.start(), 3000);
      }
    } else if (step === 2) {
      const method = matchCommMethod(t);
      if (method) {
        setCommMethod(method);
        const label = COMMUNICATION_METHODS.find((m) => m.id === method)?.label || method;
        speakAsync(`Selected: ${label}. Continuing.`).then(() => setStep(3));
      } else {
        setRetryMessage(`I heard "${t}" but couldn't match a communication method. Try again or tap to select.`);
        speak(`I heard "${t}" but couldn't match a method. Please try again or tap to select.`);
        setTimeout(() => speech.start(), 3500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript]);

  const filteredLangs = (search: string) =>
    WORLD_LANGUAGES.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase())
    );

  const getLangName = (code: string) =>
    WORLD_LANGUAGES.find((l) => l.code === code)?.name || code;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* STEP 0: Welcome */}
        {step === 0 && (
          <motion.div key="welcome" {...fadeSlide} className="text-center max-w-2xl mx-auto space-y-8">
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
              className="text-lg sm:text-xl md:text-2xl text-foreground leading-relaxed font-body"
            >
              Your daily healing advocate.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-body"
            >
              A sacred space to release, heal, and find closure. Let the tools of the universe guide you home to your heart, where your journey began.
            </motion.p>

            {welcomeDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Button
                  onClick={() => { speech.stop(); setStep(1); }}
                  size="lg"
                  className="text-lg px-8 py-6 rounded-2xl"
                  aria-label="Continue to setup"
                >
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 1: Language Setup */}
        {step === 1 && (
          <motion.div key="language" {...fadeSlide} className="w-full max-w-lg mx-auto space-y-6">
            {langSubStep === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
                  What is your primary language?
                </h2>
                <ListeningIndicator visible={speech.listening} />
                {retryMessage && (
                  <p className="text-sm text-center text-destructive font-body">{retryMessage}</p>
                )}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={searchPrimary}
                    onChange={(e) => setSearchPrimary(e.target.value)}
                    placeholder="Search languages..."
                    className="pl-10 text-lg h-12"
                    aria-label="Search languages"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-card space-y-1 p-2" role="listbox" aria-label="Languages">
                  {filteredLangs(searchPrimary).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        speech.stop();
                        setPrimaryLang(lang.code);
                        setRetryMessage(null);
                        setLangSubStep(1);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                        primaryLang === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
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
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
                  Would you like to add a second language?
                </h2>
                <ListeningIndicator visible={speech.listening} />
                {retryMessage && (
                  <p className="text-sm text-center text-destructive font-body">{retryMessage}</p>
                )}
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 rounded-2xl"
                    onClick={() => { speech.stop(); setWantSecondary(true); setRetryMessage(null); }}
                    variant={wantSecondary === true ? "default" : "outline"}
                  >
                    Yes
                  </Button>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 rounded-2xl"
                    onClick={() => {
                      speech.stop();
                      setWantSecondary(false);
                      setSecondaryLang(null);
                      setRetryMessage(null);
                      setLangSubStep(2);
                    }}
                    variant={wantSecondary === false ? "default" : "outline"}
                  >
                    No
                  </Button>
                </div>
                {wantSecondary && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        value={searchSecondary}
                        onChange={(e) => setSearchSecondary(e.target.value)}
                        placeholder="Search languages..."
                        className="pl-10 text-lg h-12"
                        aria-label="Search second language"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-card space-y-1 p-2" role="listbox">
                      {filteredLangs(searchSecondary)
                        .filter((l) => l.code !== primaryLang)
                        .map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              speech.stop();
                              setSecondaryLang(lang.code);
                              setRetryMessage(null);
                              setLangSubStep(2);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                              secondaryLang === lang.code
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-foreground"
                            }`}
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
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
                  Would you like to enable Sign Language?
                </h2>
                <ListeningIndicator visible={speech.listening} />
                {retryMessage && (
                  <p className="text-sm text-center text-destructive font-body">{retryMessage}</p>
                )}
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-xl px-10 py-7 rounded-2xl min-w-[120px]"
                    onClick={() => {
                      speech.stop();
                      setSignLanguage(true);
                      setRetryMessage(null);
                      setStep(2);
                    }}
                    variant={signLanguage === true ? "default" : "outline"}
                    aria-label="Yes, enable sign language"
                  >
                    Yes
                  </Button>
                  <Button
                    size="lg"
                    className="text-xl px-10 py-7 rounded-2xl min-w-[120px]"
                    onClick={() => {
                      speech.stop();
                      setSignLanguage(false);
                      setRetryMessage(null);
                      setStep(2);
                    }}
                    variant={signLanguage === false ? "default" : "outline"}
                    aria-label="No, do not enable sign language"
                  >
                    No
                  </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  Selected: {getLangName(primaryLang)}
                  {secondaryLang && ` + ${getLangName(secondaryLang)}`}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: Communication Preference */}
        {step === 2 && (
          <motion.div key="communication" {...fadeSlide} className="w-full max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
              How do you prefer to communicate?
            </h2>
            <ListeningIndicator visible={speech.listening} />
            {retryMessage && (
              <p className="text-sm text-center text-destructive font-body">{retryMessage}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Communication preference">
              {COMMUNICATION_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    speech.stop();
                    setCommMethod(method.id);
                    setRetryMessage(null);
                  }}
                  className={`flex items-center gap-4 px-5 py-5 rounded-2xl border-2 text-left text-base sm:text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                    commMethod === method.id
                      ? "border-primary bg-primary/10 text-foreground shadow-md"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                  }`}
                  role="radio"
                  aria-checked={commMethod === method.id}
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden="true">{method.icon}</span>
                  <span>{method.label}</span>
                  {commMethod === method.id && (
                    <Check className="ml-auto h-5 w-5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
            {commMethod && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-2">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-2xl"
                  onClick={() => { speech.stop(); setStep(3); }}
                >
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 3: Confirmation */}
        {step === 3 && (
          <motion.div key="confirm" {...fadeSlide} className="text-center max-w-xl mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto"
            >
              <Check className="h-10 w-10 text-secondary" />
            </motion.div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Perfect.
            </h2>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed font-body">
              Soul Echoes is set up for you. You can change these settings anytime.
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
