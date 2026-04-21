import {
  BookOpen, Wind, VolumeX, Eclipse, Sparkles, Compass,
  Brain, Volume2, Settings, Lock, CreditCard,
} from "lucide-react";

function PortalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      {/* teal outer glow ring */}
      <circle cx="12" cy="12" r="10.5" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* gold ring */}
      <circle cx="12" cy="12" r="9" stroke="url(#ringGrad)" strokeWidth="2.5" />
      {/* dark interior */}
      <circle cx="12" cy="12" r="7.5" fill="#0c1a2e" />
      {/* 4-point star burst arms — long cardinal */}
      <line x1="12" y1="4.5" x2="12" y2="19.5" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      {/* diagonal arms — shorter */}
      <line x1="7.2" y1="7.2" x2="16.8" y2="16.8" stroke="#fbbf24" strokeWidth="0.6" strokeLinecap="round" strokeOpacity="0.45" />
      <line x1="16.8" y1="7.2" x2="7.2" y2="16.8" stroke="#fbbf24" strokeWidth="0.6" strokeLinecap="round" strokeOpacity="0.45" />
      {/* glowing center */}
      <circle cx="12" cy="12" r="3" fill="url(#portalGlow)" />
      <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
    </svg>
  );
}

import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const healingRooms = [
  { title: "Brain Dump", url: "/", icon: Brain, color: "text-primary", free: true },
  { title: "Journal", url: "/journal", icon: BookOpen, color: "text-healing-journal", free: false },
  { title: "Breathe", url: "/breathe", icon: Wind, color: "text-healing-breathe", free: false },
  { title: "Unspoken Chamber", url: "/unspoken", icon: VolumeX, color: "text-healing-unspoken", free: false },
  { title: "Shadow Work", url: "/shadow-work", icon: Eclipse, color: "text-healing-shadow", free: false },
  { title: "Wisdom", url: "/wisdom", icon: Sparkles, color: "text-healing-wisdom", free: false },
  { title: "Spiritual Tools", url: "/spiritual-tools", icon: Compass, color: "text-healing-tools", free: false },
  { title: "Portal", url: "/shop", icon: PortalIcon, color: "text-teal-400", free: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">Soul Echoes</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider">
            {!collapsed && "Healing Rooms"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {healingRooms.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                        aria-label={item.title}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${isActive ? "text-sidebar-primary" : item.color}`}
                        />
                        {!collapsed && (
                          <span className="text-sm flex-1">{item.title}</span>
                        )}
                        {!collapsed && !item.free && (
                          <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/voice-settings" aria-label="Voice Settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <Volume2 className={`h-5 w-5 shrink-0 ${location.pathname === "/voice-settings" ? "text-sidebar-primary" : "text-muted-foreground"}`} />
                {!collapsed && <span className="text-sm">Voice Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/pricing" aria-label="Pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <CreditCard className={`h-5 w-5 shrink-0 ${location.pathname === "/pricing" ? "text-sidebar-primary" : "text-muted-foreground"}`} />
                {!collapsed && <span className="text-sm">Pricing</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" aria-label="Settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <Settings className={`h-5 w-5 shrink-0 ${location.pathname === "/settings" ? "text-sidebar-primary" : "text-muted-foreground"}`} />
                {!collapsed && <span className="text-sm">Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center">You are seen. You are heard.</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
