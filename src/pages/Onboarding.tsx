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

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // Step 1 state
  const [welcomeDone, setWelcomeDone] = useState(false);

  // Step 2 state
  const [primaryLang, setPrimaryLang] = useState("en");
  const [secondaryLang, setSecondaryLang] = useState<string | null>(null);
  const [wantSecondary, setWantSecondary] = useState<boolean | null>(null);
  const [signLanguage, setSignLanguage] = useState<boolean | null>(null);
  const [langSubStep, setLangSubStep] = useState(0);

  // Step 3 state
  const [commMethod, setCommMethod] = useState<string | null>(null);

  // Search
  const [searchPrimary, setSearchPrimary] = useState("");
  const [searchSecondary, setSearchSecondary] = useState("");

  const welcomeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Step 0: Welcome — speak and show
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

  // Step 1: Speak language question
  useEffect(() => {
    if (step === 1 && langSubStep === 0) {
      speak("What is your primary language?");
    }
    if (step === 1 && langSubStep === 1) {
      speak("Would you like to add a second language?");
    }
    if (step === 1 && langSubStep === 2) {
      speak("Would you like to enable Sign Language?");
    }
  }, [step, langSubStep]);

  // Step 2: Speak communication options
  useEffect(() => {
    if (step === 2) {
      speak("How do you prefer to communicate?");
      // Speak each option with delay
      const timer = setTimeout(() => {
        COMMUNICATION_METHODS.forEach((m, i) => {
          setTimeout(() => speak(m.label), i * 1800);
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Step 3: Confirm
  useEffect(() => {
    if (step === 3) {
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
  }, [step, primaryLang, secondaryLang, signLanguage, commMethod, onComplete]);

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
                  onClick={() => setStep(1)}
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
                        setPrimaryLang(lang.code);
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
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 rounded-2xl"
                    onClick={() => setWantSecondary(true)}
                    variant={wantSecondary === true ? "default" : "outline"}
                  >
                    Yes
                  </Button>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 rounded-2xl"
                    onClick={() => {
                      setWantSecondary(false);
                      setSecondaryLang(null);
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
                              setSecondaryLang(lang.code);
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
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-xl px-10 py-7 rounded-2xl min-w-[120px]"
                    onClick={() => {
                      setSignLanguage(true);
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
                      setSignLanguage(false);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Communication preference">
              {COMMUNICATION_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setCommMethod(method.id);
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
                  onClick={() => setStep(3)}
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
