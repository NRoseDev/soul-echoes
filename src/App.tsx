import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoomProvider } from "@/contexts/RoomContext";
import Index from "./pages/Index";
import BrainDump from "./pages/BrainDump";
import Journal from "./pages/Journal";
import VoiceSettings from "./pages/VoiceSettings";
import Auth from "./pages/Auth";
import WisdomRoom from "./pages/WisdomRoom";
import ToolsRoom from "./pages/ToolsRoom";
import FlowRoom from "./pages/FlowRoom";
import FlowDetail from "./pages/BreatheDetail";
import WisdomDetail from "./pages/WisdomDetail";
import SpiritualToolsDetail from "./pages/SpiritualToolsDetail";
import UnspokenDetail from "./pages/UnspokenDetail";
import ShadowWorkDetail from "./pages/ShadowWorkDetail";
import LevelPage from "./pages/LevelPage";
import PortalRoom from "./pages/PortalRoom";
import CommunityRoom from "./pages/CommunityRoom";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import { AppLayout } from "@/components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RoomProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AppLayout><BrainDump /></AppLayout>} />
              <Route path="/brain-dump" element={<Navigate to="/" replace />} />
              <Route path="/journal" element={<AppLayout><Journal /></AppLayout>} />
              <Route path="/voice-settings" element={<AppLayout><VoiceSettings /></AppLayout>} />
              <Route path="/wisdom" element={<AppLayout><WisdomRoom /></AppLayout>} />
              <Route path="/wisdom/:section" element={<AppLayout><WisdomDetail /></AppLayout>} />
              <Route path="/tools" element={<AppLayout><ToolsRoom /></AppLayout>} />
              <Route path="/tools/:section" element={<AppLayout><SpiritualToolsDetail /></AppLayout>} />
              <Route path="/flow" element={<AppLayout><FlowRoom /></AppLayout>} />
              <Route path="/flow/:section" element={<AppLayout><FlowDetail /></AppLayout>} />
              <Route path="/unspoken" element={<AppLayout><UnspokenDetail /></AppLayout>} />
              <Route path="/shadow-work" element={<AppLayout><ShadowWorkDetail /></AppLayout>} />
              <Route path="/shop" element={<AppLayout><PortalRoom initialSection="products" /></AppLayout>} />
              <Route path="/practitioner-connect" element={<AppLayout><PortalRoom initialSection="practitioners" /></AppLayout>} />
              <Route path="/crisis-counselor" element={<AppLayout><PortalRoom initialSection="crisis" /></AppLayout>} />
              <Route path="/portal" element={<Navigate to="/shop" replace />} />
              <Route path="/community" element={<AppLayout><CommunityRoom /></AppLayout>} />
              <Route path="/:roomId/level/:levelNum" element={<LevelPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RoomProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
