import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "ja-JP", label: "日本語", flag: "🇯🇵" },
  { code: "ko-KR", label: "한국어", flag: "🇰🇷" },
  { code: "ar-SA", label: "العربية", flag: "🇸🇦" },
  { code: "hi-IN", label: "हिन्दी", flag: "🇮🇳" },
];

const VOICE_GENDERS = [
  { id: "female", label: "Female Voice", icon: "👩" },
  { id: "male", label: "Male Voice", icon: "👨" },
];

const ACCENTS = [
  { id: "us", label: "US", region: "en-US" },
  { id: "uk", label: "UK", region: "en-GB" },
  { id: "australian", label: "Australian", region: "en-AU" },
  { id: "indian", label: "Indian", region: "en-IN" },
  { id: "irish", label: "Irish", region: "en-IE" },
  { id: "scottish", label: "Scottish", region: "en-GB" },
];

const COMMUNICATION_METHODS = [
  { id: "speak", label: "Speak It", icon: "🗣️", description: "Use your voice" },
  { id: "type", label: "Type It", icon: "⌨️", description: "Type your responses" },
  { id: "point", label: "Point It", icon: "👆", description: "Tap visual cards" },
  { id: "sign", label: "Sign It", icon: "🤟", description: "Use sign language" },
  { id: "device", label: "Connect Device", icon: "📱", description: "AAC device" },
];

export default function Onboarding() {
  const { toast } = useToast();
  
  // Current step (1 = Welcome, 2 = Language, 3 = Voice, 4 = Communication, 5 = Safety, 6 = Done)
  const [currentStep, setCurrentStep] = useState(1);
  
  // User preferences
  const [language, setLanguage] = useState("en-US");
  const [voiceGender, setVoiceGender] = useState("female");
  const [accent, setAccent] = useState("us");
  const [communicationMethods, setCommunicationMethods] = useState<string[]>(["speak"]); // Multiple methods allowed
  const [userName, setUserName] = useState("");
  
  // Voice settings
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(0.9);
  const [voicePitch, setVoicePitch] = useState(1.1);
  
  // Speech recognition
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          handleVoiceCommand(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          // Auto-restart listening after AI speaks (continuous conversation)
          setTimeout(() => {
            if (!isSpeaking && currentStep < 6) {
              startListening();
            }
          }, 500);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  // AI speaks on every step change
  useEffect(() => {
    const messages = {
      1: "Welcome to Soul Echoes, a place to find your voice and heal your heart. Let's get started.",
      2: "What language would you like the app in? Say or tap your choice.",
      3: `Great! Now, would you like a male or female voice to guide you?`,
      4: "You can communicate with me in many ways. All methods are always available. Which do you prefer right now? You can change anytime.",
      5: "Almost done! Let's set up your account for safety. What should I call you?",
      6: "Perfect! You're all set. Let's begin your healing journey.",
    };

    const message = messages[currentStep as keyof typeof messages];
    if (message) {
      speak(message);
    }
  }, [currentStep]);

  // Speak function - AI always speaks regardless of user's input method
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    utterance.volume = 1.0;

    // Select voice based on user preferences
    const voices = synthRef.current.getVoices();
    const selectedVoice = voices.find(
      (voice) =>
        voice.lang.startsWith(ACCENTS.find(a => a.id === accent)?.region || language) &&
        voice.name.toLowerCase().includes(voiceGender)
    ) || voices.find(voice => voice.lang.startsWith(language));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Stop listening while AI is speaking
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      // Auto-start listening after AI finishes speaking
      setTimeout(() => {
        if (currentStep < 6) {
          startListening();
        }
      }, 500);
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [language, voiceSpeed, voicePitch, voiceGender, accent, currentStep, isListening]);

  // Start listening for voice commands
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening || isSpeaking) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start recognition:", error);
    }
  }, [isListening, isSpeaking]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Handle voice commands based on current step
  const handleVoiceCommand = useCallback((command: string) => {
    console.log("Voice command received:", command);

    // Step 2: Language selection
    if (currentStep === 2) {
      const matchedLang = LANGUAGES.find(
        (lang) => command.includes(lang.label.toLowerCase()) || command.includes(lang.code.toLowerCase())
      );
      if (matchedLang) {
        setLanguage(matchedLang.code);
        speak(`${matchedLang.label} selected.`);
        setTimeout(() => setCurrentStep(3), 1500);
        return;
      }
    }

    // Step 3: Voice gender selection
    if (currentStep === 3) {
      if (command.includes("male") && !command.includes("female")) {
        setVoiceGender("male");
        speak("Male voice selected.");
        setTimeout(() => setCurrentStep(4), 1500);
        return;
      }
      if (command.includes("female")) {
        setVoiceGender("female");
        speak("Female voice selected.");
        setTimeout(() => setCurrentStep(4), 1500);
        return;
      }
    }

    // Step 4: Communication methods
    if (currentStep === 4) {
      const methods: string[] = [];
      if (command.includes("speak")) methods.push("speak");
      if (command.includes("type")) methods.push("type");
      if (command.includes("point")) methods.push("point");
      if (command.includes("sign")) methods.push("sign");
      if (command.includes("device")) methods.push("device");
      
      if (methods.length > 0) {
        setCommunicationMethods(methods);
        speak("Communication methods set.");
        setTimeout(() => setCurrentStep(5), 1500);
        return;
      }
    }

    // Step 5: Name entry
    if (currentStep === 5) {
      if (command.length > 0) {
        setUserName(command);
        speak(`Nice to meet you, ${command}.`);
        setTimeout(() => setCurrentStep(6), 1500);
        return;
      }
    }

    // Navigation commands (work on any step)
    if (command.includes("next") || command.includes("continue")) {
      handleNext();
      return;
    }
    if (command.includes("back") || command.includes("previous")) {
      handleBack();
      return;
    }

    // If command not recognized, ask again
    speak("I didn't catch that. Could you repeat?");
  }, [currentStep, speak]);

  // Handle Next button
  const handleNext = () => {
    if (currentStep === 2 && !language) {
      toast({ title: "Please select a language", variant: "destructive" });
      return;
    }
    if (currentStep === 3 && !voiceGender) {
      toast({ title: "Please select a voice", variant: "destructive" });
      return;
    }
    if (currentStep === 4 && communicationMethods.length === 0) {
      toast({ title: "Please select at least one communication method", variant: "destructive" });
      return;
    }
    if (currentStep === 5 && !userName.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and complete onboarding
      localStorage.setItem("onboardingComplete", "true");
      localStorage.setItem("userPreferences", JSON.stringify({
        language,
        voiceGender,
        accent,
        communicationMethods,
        userName,
        voiceSpeed,
        voicePitch,
      }));
      window.location.href = "/brain-dump"; // Navigate to app
    }
  };

  // Handle Back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Toggle communication method (multiple can be selected)
  const toggleCommunicationMethod = (methodId: string) => {
    setCommunicationMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl"
      >
        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                step < currentStep
                  ? "bg-green-500"
                  : step === currentStep
                  ? "bg-purple-500 ring-4 ring-purple-300"
                  : "bg-white/20"
              }`}
            >
              {step < currentStep ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white font-semibold">{step}</span>
              )}
            </div>
          ))}
        </div>

        {/* Listening indicator */}
        {isListening && (
          <div className="mb-4 p-3 bg-green-500/20 rounded-lg flex items-center gap-3">
            <Mic className="w-5 h-5 text-green-400 animate-pulse" />
            <span className="text-green-200">Listening... Speak now</span>
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="mb-4 p-3 bg-blue-500/20 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-blue-200">Speaking...</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold text-white text-center">
                Welcome to Soul Echoes
              </h1>
              <p className="text-xl text-purple-200 text-center">
                A place to find your voice and heal your heart
              </p>
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Language Selection */}
          {currentStep === 2 && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white text-center">
                Choose Your Language
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      speak(`${lang.label} selected.`);
                    }}
                    className={`p-4 rounded-xl transition-all ${
                      language === lang.code
                        ? "bg-purple-500 ring-4 ring-purple-300"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-4xl mb-2">{lang.flag}</div>
                    <div className="text-white font-medium">{lang.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Voice Gender & Accent */}
          {currentStep === 3 && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white text-center">
                Choose Your Guide's Voice
              </h2>
              
              {/* Voice Gender */}
              <div className="space-y-3">
                <label className="text-white font-medium">Voice Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  {VOICE_GENDERS.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => {
                        setVoiceGender(voice.id);
                        speak(`${voice.label} selected.`);
                      }}
                      className={`p-4 rounded-xl transition-all ${
                        voiceGender === voice.id
                          ? "bg-purple-500 ring-4 ring-purple-300"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <div className="text-4xl mb-2">{voice.icon}</div>
                      <div className="text-white font-medium">{voice.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Selection */}
              <div className="space-y-3">
                <label className="text-white font-medium">Accent</label>
                <div className="grid grid-cols-3 gap-3">
                  {ACCENTS.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccent(acc.id);
                        speak(`${acc.label} accent selected.`);
                      }}
                      className={`p-3 rounded-lg transition-all ${
                        accent === acc.id
                          ? "bg-purple-500 ring-2 ring-purple-300"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <div className="text-white font-medium">{acc.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Speed */}
              <div className="space-y-3">
                <label className="text-white font-medium">
                  Speaking Speed: {voiceSpeed.toFixed(1)}x
                </label>
                <Slider
                  value={[voiceSpeed]}
                  onValueChange={([value]) => setVoiceSpeed(value)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Test Voice Button */}
              <Button
                onClick={() => speak("This is how I sound with your current settings.")}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Test Voice
              </Button>
            </motion.div>
          )}

          {/* Step 4: Communication Methods */}
          {currentStep === 4 && (
            <motion.div
              key="communication"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white text-center">
                How Do You Want to Communicate?
              </h2>
              <p className="text-purple-200 text-center">
                All methods are always available. Choose your preferences:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMUNICATION_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => toggleCommunicationMethod(method.id)}
                    className={`p-6 rounded-xl transition-all text-left ${
                      communicationMethods.includes(method.id)
                        ? "bg-purple-500 ring-4 ring-purple-300"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{method.icon}</div>
                      <div>
                        <div className="text-white font-bold text-lg">{method.label}</div>
                        <div className="text-purple-200 text-sm">{method.description}</div>
                      </div>
                    </div>
                    {communicationMethods.includes(method.id) && (
                      <div className="mt-2 flex justify-end">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Safety & Account Setup */}
          {currentStep === 5 && (
            <motion.div
              key="safety"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white text-center">
                Let's Set Up Your Account
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium block mb-2">
                    What should I call you?
                  </label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg">
                  <p className="text-purple-200 text-sm">
                    🔒 Your privacy and safety are our top priority. Your information is encrypted and never shared.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Complete */}
          {currentStep === 6 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="text-8xl">🎉</div>
              <h2 className="text-3xl font-bold text-white">
                You're All Set, {userName}!
              </h2>
              <p className="text-xl text-purple-200">
                Let's begin your healing journey
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center gap-4">
          {/* Back Button */}
          {currentStep > 1 && currentStep < 6 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back
            </Button>
          )}

          {/* Voice Control Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full transition-all ${
              isListening
                ? "bg-red-500 animate-pulse"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
            title={isListening ? "Stop Listening" : "Start Listening"}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Next Button */}
          {currentStep < 6 && (
            <Button
              onClick={handleNext}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {currentStep === 5 ? "Complete" : "Next"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}

          {/* Begin Button */}
          {currentStep === 6 && (
            <Button
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white w-full text-lg py-6"
            >
              Begin Your Journey
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
