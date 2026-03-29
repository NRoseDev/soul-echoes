import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import BrainDump from "./pages/BrainDump";
import HealingRoom from "./pages/HealingRoom";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import VoiceSettings from "./pages/VoiceSettings";
import Settings from "./pages/Settings";
import PractitionerSignup from "./pages/PractitionerSignup";
import DistressSignal from "./components/DistressSignal";
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
          <AppLayout>
            <Routes>
              <Route path="/" element={<BrainDump />} />
              <Route path="/journal" element={<HealingRoom />} />
              <Route path="/breathe" element={<HealingRoom />} />
              <Route path="/unspoken" element={<HealingRoom />} />
              <Route path="/shadow-work" element={<HealingRoom />} />
              <Route path="/wisdom" element={<HealingRoom />} />
              <Route path="/spiritual-tools" element={<HealingRoom />} />
              <Route path="/community" element={<HealingRoom />} />
              <Route path="/practitioner" element={<HealingRoom />} />
              <Route path="/crisis" element={<HealingRoom />} />
              <Route path="/voice-settings" element={<VoiceSettings />} />
              <Route path="/settings" element={<Settings />} />
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
