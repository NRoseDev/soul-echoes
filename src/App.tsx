import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RoomProvider } from "./contexts/RoomContext";
import Index from "./pages/Index";
import BrainDump from "./pages/BrainDump";
import Journal from "./pages/Journal";
import VoiceSettings from "./pages/VoiceSettings";
import Auth from "./pages/Auth";

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
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/brain-dump" element={<BrainDump />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/voice-settings" element={<VoiceSettings />} />
              {/* Fallback to Index for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RoomProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
