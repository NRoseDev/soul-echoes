import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlwaysOnListening } from "@/hooks/use-always-on-listening";
import { announceGuide } from "@/components/AIGuideAnnouncer";
import { SpirioEngine } from "./SpirioEchoesEngine"; // Pull in your new Spirio component

/**
 * AlwaysOnVoice — renders inside the router context.
 * Manages the global always-on speech recognition with:
 * - Navigation commands
 * - Distress phrase detection
 * - Screen-aware announcements
 * - Integrated Spirio Dynamic Text & Visual Milestone Flows
 */

// Custom event for distress trigger (DistressSignal component listens for this)
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
};

export default function AlwaysOnVoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastAnnouncedPath = useRef("");

  // Target context references (Using hardcoded placeholders for session alignment)
  const currentUserId = "global-user"; 
  const currentCharacterId = "active-soul-companion";

  const { isListening } = useAlwaysOnListening({
    onNavigate: (path) => {
      if (location.pathname !== path) {
        navigate(path);
        const label = SCREEN_ANNOUNCEMENTS[path];
        if (label) announceGuide(label);
      }
    },
    onDistress: () => {
      triggerDistressSignal();
    },
    onTranscript: async (transcript) => {
      if (!transcript || !transcript.trim()) return;

      // 1. Process voice transcript through the new integrated Spirio pipeline
      try {
        const spirioResult = await SpirioEngine.handleConversationFlow(
          currentUserId,
          currentCharacterId,
          transcript
        );

        // 2. Dispatch event downstream so visual screens can immediately use the resulting text/media
        window.dispatchEvent(new CustomEvent("soul-echoes-voice-input", { 
          detail: { 
            transcript,
            reply: spirioResult.reply,
            milestone: spirioResult.milestone
          } 
        }));
      } catch (error) {
        console.error("Spirio flow pipeline intercept failed:", error);
      }
    },
  });

  // Announce screen on navigation
  useEffect(() => {
    const path = location.pathname;
    // Only announce once per path change
    if (path !== lastAnnouncedPath.current) {
      lastAnnouncedPath.current = path;
      const message = SCREEN_ANNOUNCEMENTS[path];
      if (message) {
        // Small delay to let page render first
        const timer = setTimeout(() => announceGuide(message), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

  return (
    <>
      {/* Subtle always-on mic indicator at top of screen */}
      {isListening && (
        <div className="fixed top-[3.75rem] right-3 z-[80]">
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-2.5 py-1 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-body">Listening</span>
          </div>
        </div>
      )}
    </>
  );
}
