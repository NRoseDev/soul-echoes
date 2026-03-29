import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import BrainDump from "./pages/BrainDump";
import HealingRoom from "./pages/HealingRoom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
