import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Wind, MessageCircleOff, Moon, Sparkles, Flame } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/breathe", label: "Breathe", icon: Wind },
  { path: "/unspoken", label: "Unspoken", icon: MessageCircleOff },
  { path: "/shadow-work", label: "Shadow", icon: Moon },
  { path: "/wisdom", label: "Wisdom", icon: Sparkles },
  { path: "/spiritual-tools", label: "Tools", icon: Flame },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1 min-h-0">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b border-border px-4 shrink-0">
              <SidebarTrigger className="text-muted-foreground" aria-label="Toggle navigation menu" />
              <span className="ml-3 font-display text-lg font-bold bg-gradient-to-r from-teal-400 via-pink-400 to-purple-500 bg-clip-text text-transparent sr-only sm:not-sr-only">
                Soul Echoes
              </span>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
              {children}
            </main>
          </div>
        </div>
        {/* Bottom Navigation Bar */}
        <nav
          className="shrink-0 flex items-center justify-around px-2 py-2 border-t border-white/10"
          style={{ background: "hsl(260, 40%, 5%)" }}
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? "text-purple-400" : "text-white/50 hover:text-white/80"}`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
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
