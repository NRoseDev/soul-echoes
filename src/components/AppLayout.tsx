import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Wind, MessageCircleOff, Moon, Sparkles, Flame, Check, Globe2 } from "lucide-react";
import FloatingHub from "@/components/FloatingHub";
import { getPreferences, savePreferences, type InputMethod } from "@/lib/preferences";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Clean, streamlined navigation structure for a clear user flow
const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/breathe", label: "Breathe", icon: Wind },
  { path: "/shop", label: "Portal", icon: Globe2 },
];

const COMM_MODES: { id: InputMethod; label: string; emoji: string; desc: string; detail?: string }[] = [
  { id: "speak", label: "Speak", emoji: "🗣️", desc: "Voice input & audio output" },
  { id: "sign", label: "Sign", emoji: "🤟", desc: "Sign language with camera" },
  { id: "point", label: "Point", emoji: "👆", desc: "Tap pictures & cards" },
  { id: "type", label: "Type", emoji: "⌨️", desc: "Keyboard & text" },
  { id: "connect", label: "Connect Device", emoji: "🔌", desc: "Braille display, AAC, eye gaze, switch", detail: "Connect via USB, Bluetooth, or 3.5mm audio port" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputMethod, setInputMethod] = useState<InputMethod>(
    () => getPreferences().inputMethod ?? "type"
  );

  const switchMode = (id: InputMethod) => {
    setInputMethod(id);
    savePreferences({ inputMethod: id });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1 min-h-0">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b border-border px-4 shrink-0 gap-2">
              <SidebarTrigger className="text-muted-foreground" aria-label="Toggle navigation menu" />
              <span className="ml-3 font-display text-lg font-bold bg-gradient-to-r from-teal-400 via-pink-400 to-purple-500 bg-clip-text text-transparent sr-only sm:not-sr-only">
                Soul Echoes
              </span>
              <div className="ml-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <button aria-label="Switch communication method" title="Switch how you communicate" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" >
                      <span className="text-base">{COMM_MODES.find((m) => m.id === inputMethod)?.emoji ?? "🔌"}</span>
                      <span className="hidden sm:inline text-xs font-medium">{COMM_MODES.find((m) => m.id === inputMethod)?.label ?? "Communicate"}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                    <SheetHeader className="pb-2">
                      <SheetTitle className="text-xl">How are you communicating right now?</SheetTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Switch anytime — all options are always available. You are never locked into one way.
                      </p>
                    </SheetHeader>
                    <div className="grid gap-2 mt-4" role="radiogroup" aria-label="Communication method">
                      {COMM_MODES.map((mode) => {
                        const active = inputMethod === mode.id;
                        return (
                          <button key={mode.id} onClick={() => switchMode(mode.id)} role="radio" aria-checked={active} aria-label={`${mode.label} — ${mode.desc}${active ? " (currently selected)" : ""}`} className={`flex items-center gap-4 px-4 py-4 rounded-2xl border-2 text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`} >
                            <span className="text-3xl">{mode.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-foreground">{mode.label}</p>
                              <p className="text-sm text-muted-foreground">{mode.desc}</p>
                              {mode.detail && <p className="text-xs text-primary/80 mt-0.5">{mode.detail}</p>}
                            </div>
                            {active && <Check className="h-5 w-5 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">External device connections</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2"><span>⠿</span><span><strong className="text-foreground">Braille display</strong> — USB or Bluetooth</span></div>
                        <div className="flex items-start gap-2"><span>💻</span><span><strong className="text-foreground">AAC / speech device</strong> — USB, Bluetooth, or audio port</span></div>
                        <div className="flex items-start gap-2"><span>👁️</span><span><strong className="text-foreground">Eye gaze tracker</strong> — USB</span></div>
                        <div className="flex items-start gap-2"><span>🔘</span><span><strong className="text-foreground">Switch access</strong> — 3.5mm audio port or Bluetooth</span></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Pair or plug in your device first, then select "Connect Device" above.</p>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-4 pb-2">
                      You can switch again anytime — tap this button from any room in the app.
                    </p>
                  </SheetContent>
                </Sheet>
              </div>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
              {children}
            </main>
          </div>
        </div>
        <FloatingHub inputMethod={inputMethod} />
        
        {/* Streamlined, high-utility Bottom Navigation Bar */}
        <nav className="shrink-0 flex items-center justify-around px-2 py-2 border-t border-white/10" style={{ background: "hsl(260, 40%, 5%)" }} aria-label="Main navigation" >
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? "text-purple-400" : "text-white/50 hover:text-white/80"}`} aria-label={item.label} aria-current={active ? "page" : undefined} >
                <item.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </SidebarProvider>
  );
}
