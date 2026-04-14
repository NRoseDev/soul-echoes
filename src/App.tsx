import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import BrainDump from "./pages/BrainDump";
import HealingRoom from "./pages/HealingRoom";
import HealingResources from "./pages/HealingResources";
import BreathePage from "./pages/BreathePage";
import BreatheDetail from "./pages/BreatheDetail";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import VoiceSettings from "./pages/VoiceSettings";
import Settings from "./pages/Settings";
import PractitionerSignup from "./pages/PractitionerSignup";
import Pricing from "./pages/Pricing";
import JournalRoom from "./pages/JournalRoom";
import JournalSection from "./pages/JournalSection";
import UnspokenRoom from "./pages/UnspokenRoom";
import UnspokenDetail from "./pages/UnspokenDetail";
import ShadowWorkRoom from "./pages/ShadowWorkRoom";
import ShadowWorkDetail from "./pages/ShadowWorkDetail";
import WisdomRoom from "./pages/WisdomRoom";
import WisdomDetail from "./pages/WisdomDetail";
import ShopRoom from "./pages/ShopRoom";
import SpiritualToolsRoom from "./pages/SpiritualToolsRoom";
import SpiritualToolsDetail from "./pages/SpiritualToolsDetail";
import DistressSignal from "./components/DistressSignal";
import AIGuideAnnouncer from "./components/AIGuideAnnouncer";
import AlwaysOnVoice from "./components/AlwaysOnVoice";
import { getPreferences } from "./lib/preferences";

const queryClient = new QueryClient();

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !getPreferences().onboardingComplete
  );

  if (showOnboarding) {
    return (
      <TooltipProvider>
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </TooltipProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AIGuideAnnouncer />
          <AlwaysOnVoice />
          <AppLayout>
            <Routes>
              <Route path="/" element={<BrainDump />} />
              <Route path="/journal" element={<JournalRoom />} />
              <Route path="/journal/:section" element={<JournalSection />} />
              <Route path="/breathe" element={<BreathePage />} />
              <Route path="/breathe/:section" element={<BreatheDetail />} />
              <Route path="/unspoken" element={<UnspokenRoom />} />
              <Route path="/unspoken/:section" element={<UnspokenDetail />} />
              <Route path="/shadow-work" element={<ShadowWorkRoom />} />
              <Route path="/shadow-work/:module" element={<ShadowWorkDetail />} />
              <Route path="/wisdom" element={<WisdomRoom />} />
              <Route path="/wisdom/:section" element={<WisdomDetail />} />
              <Route path="/shop" element={<ShopRoom />} />
              <Route path="/spiritual-tools" element={<SpiritualToolsRoom />} />
              <Route path="/spiritual-tools/:section" element={<SpiritualToolsDetail />} />
              <Route path="/community" element={<HealingRoom />} />
              <Route path="/practitioner" element={<HealingRoom />} />
              <Route path="/practitioner/signup" element={<PractitionerSignup />} />
              <Route path="/resources" element={<HealingResources />} />
              <Route path="/crisis" element={<HealingRoom />} />
              <Route path="/voice-settings" element={<VoiceSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
          <DistressSignal />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
