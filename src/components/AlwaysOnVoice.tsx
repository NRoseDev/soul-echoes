import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlwaysOnListening } from "@/hooks/use-always-on-listening";
import { announceGuide } from "@/components/AIGuideAnnouncer";

function triggerDistressSignal() {
  window.dispatchEvent(new CustomEvent("soul-echoes-distress-trigger"));
}

const SCREEN_ANNOUNCEMENTS: Record<string, string> = {
  "/": "You're in Brain Dump. Speak freely or type your thoughts.",
  "/journal": "Journal room. Write or speak what's on your heart.",
  "/flow": "Flow and Movement room. Say a practice name or tap to explore.",
  "/unspoken": "Unspoken Chamber. Express what words cannot.",
  "/shadow-work": "Shadow Work room. Explore your deeper self safely.",
  "/wisdom": "Wisdom room. Receive guidance and insight.",
  "/tools": "Tools. Access rituals, prayers, and healing aids.",
  "/community": "Community space. You are not alone.",
  "/practitioner": "Practitioner Connect. Find a healer or teacher.",
  "/crisis": "Crisis Counselor. Immediate support is available.",
  "/voice-settings": "Voice Settings. Choose how the app speaks to you.",
  "/settings": "Settings. Customize your experience.",
  "/pricing": "Pricing. Choose the plan that fits your journey.",
  "/shop": "The Portal. Browse marketplace bundles, practitioner connections, crisis support, sessions, or use your wait and save vault."
};

export default function AlwaysOnVoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastAnnouncedPath = useRef("");
  const [tourActive, setTourActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const tourSteps = ["/", "/journal", "/flow", "/unspoken", "/shadow-work", "/wisdom", "/tools", "/voice-settings", "/settings", "/pricing", "/shop"];
  const currentStepRef = useRef(0);

  // Cleans emojis and selects a natural, premium human voice inflection
  const speakAccessibilityText = (text: string, callback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      announceGuide(text);
      if (callback) callback();
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean emojis entirely out of the text string
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Pick premium natural sound variations (Google US English, Samantha, or Natural English)
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => 
      v.name.includes("Google") || 
      v.name.includes("Natural") || 
      v.name.includes("Samantha") || 
      v.name.includes("Premium")
    );
    
    if (premiumVoice) utterance.voice = premiumVoice;
    
    // Set standard warm human delivery rates
    utterance.rate = 0.95; 
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (callback) callback();
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (callback) callback();
    };

    announceGuide(cleanText);
    window.speechSynthesis.speak(utterance);
  };

  const executeTourStep = (index: number) => {
    if (index >= tourSteps.length) {
      setTourActive(false);
      speakAccessibilityText("Tour complete! You have explored each space and setting. You are fully ready to use Soul Echoes.");
      return;
    }

    currentStepRef.current = index;
    const destinationPath = tourSteps[index];
    navigate(destinationPath);

    const rawLabel = SCREEN_ANNOUNCEMENTS[destinationPath] || "Next Room Space";
    
    // Automatically pacing: read complete text block, then automatically move to next step
    speakAccessibilityText(`Stepping into next room. ${rawLabel}`, () => {
      if (tourActive) {
        // Safe 1.5 second pause on screen before auto-progressing to the next room
        setTimeout(() => {
          executeTourStep(index + 1);
        }, 1500);
      }
    });
  };

  const handleStartTour = () => {
    setTourActive(true);
    executeTourStep(0);
  };

  const { isListening } = useAlwaysOnListening({
    onNavigate: (path) => {
      if (location.pathname !== path) {
        navigate(path);
        const label = SCREEN_ANNOUNCEMENTS[path];
        if (label) speakAccessibilityText(label);
      }
    },
    onDistress: () => {
      triggerDistressSignal();
    },
    onTranscript: (transcript) => {
      const voiceCommand = transcript.trim().toLowerCase();

      // Clear immediate start without manual button clicking layers
      if (voiceCommand.includes("start tour") || voiceCommand.includes("system guide") || voiceCommand.includes("begin tour")) {
        handleStartTour();
        return;
      }
      
      if (tourActive && (voiceCommand === "stop" || voiceCommand.includes("exit tour") || voiceCommand.includes("quit"))) {
        setTourActive(false);
        window.speechSynthesis.cancel();
        speakAccessibilityText("Tour stopped. Returning to home layout.");
        return;
      }

      window.dispatchEvent(new CustomEvent("soul-echoes-voice-input", { detail: { transcript } }));
    },
  });

  // Start Tour immediately the moment this component loads up or focuses
  useEffect(() => {
    const autoStartTimeout = setTimeout(() => {
      if (!tourActive && location.pathname === "/") {
        handleStartTour();
      }
    }, 1000);

    return () => clearTimeout(autoStartTimeout);
  }, []);

  // Sync general page loading changes when tour is inactive
  useEffect(() => {
    const path = location.pathname;
    if (path !== lastAnnouncedPath.current && !tourActive) {
      lastAnnouncedPath.current = path;
      const message = SCREEN_ANNOUNCEMENTS[path];
      if (message) {
        const timer = setTimeout(() => speakAccessibilityText(message), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, tourActive]);

  return (
    <>
      {isListening && (
        <div className="fixed top-[3.75rem] right-3 z-[80]">
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-2.5 py-1 shadow-sm">
            <div className={`h-2 w-2 rounded-full ${isSpeaking ? 'bg-amber-400' : 'bg-primary'} animate-pulse`} />
            <span className="text-[10px] text-muted-foreground font-body">
              {isSpeaking ? "Tour speaking..." : "Listening"}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
