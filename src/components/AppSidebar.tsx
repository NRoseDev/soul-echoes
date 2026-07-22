import { useEffect, useState } from "react";
import { Volume2, Settings, Lock, CreditCard, Sparkles } from "lucide-react";
import {
  BrainDumpIcon, JournalIcon, FlowIcon, UnspokenIcon,
  ShadowIcon, WisdomIcon, ToolsIcon, PortalIcon, CommunityIcon,
} from "@/components/icons/RoomIcons";
import { TOUR_HIGHLIGHT_EVENT, TOUR_OPEN_EVENT } from "@/components/SanctuaryTour";
import { TreeOfLifeTourIcon } from "@/components/icons/TreeOfLifeTourIcon";

import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const healingRooms = [
  { title: "Brain Dump", url: "/", icon: BrainDumpIcon, color: "text-violet-500", free: true },
  { title: "Journal", url: "/journal", icon: JournalIcon, color: "text-orange-500", free: false },
  { title: "Flow", url: "/flow", icon: FlowIcon, color: "text-emerald-500", free: false },
  { title: "Unspoken Chamber", url: "/unspoken", icon: UnspokenIcon, color: "text-sky-500", free: false },
  { title: "Shadow Work", url: "/shadow-work", icon: ShadowIcon, color: "text-red-600", free: false },
  { title: "Wisdom", url: "/wisdom", icon: WisdomIcon, color: "text-indigo-500", free: false },
  { title: "Tools", url: "/tools", icon: ToolsIcon, color: "text-yellow-400", free: false },
  { title: "Community", url: "/community", icon: CommunityIcon, color: "text-violet-400", free: false },
  { title: "Portal", url: "/shop", icon: PortalIcon, color: "text-teal-400", free: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [highlightPath, setHighlightPath] = useState<string | null>(null);

  useEffect(() => {
    const onHighlight = (e: Event) => {
      const detail = (e as CustomEvent<{ path: string | null }>).detail;
      setHighlightPath(detail?.path ?? null);
    };
    window.addEventListener(TOUR_HIGHLIGHT_EVENT, onHighlight);
    return () => window.removeEventListener(TOUR_HIGHLIGHT_EVENT, onHighlight);
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary"  aria-hidden="true" />
            </div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">Soul Echoes</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary"  aria-hidden="true" />
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
                const isTourHighlighted = highlightPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent ${isTourHighlighted ? "tour-pulse" : ""}`}
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
                          <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0"  aria-hidden="true" />
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
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent(TOUR_OPEN_EVENT))}
                aria-label="AI Tour and System Guide"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-sidebar-accent border border-primary/30 bg-gradient-to-r from-amber-400/10 via-fuchsia-500/10 to-violet-500/15 hover:from-amber-400/20 hover:via-fuchsia-500/20 hover:to-violet-500/25 shadow-[0_0_18px_hsl(280_70%_60%/0.18)]"
              >
                <TreeOfLifeTourIcon className="h-6 w-6 shrink-0"  aria-hidden="true" />
                {!collapsed && (
                  <span className="text-sm font-semibold bg-gradient-to-r from-amber-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
                    AI Tour
                  </span>
                )}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/voice-settings" aria-label="Voice Settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <Volume2 className={`h-5 w-5 shrink-0 ${location.pathname === "/voice-settings" ? "text-sidebar-primary" : "text-muted-foreground"}`}  aria-hidden="true" />
                {!collapsed && <span className="text-sm">Voice Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/pricing" aria-label="Pricing" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent ${highlightPath === "/pricing" ? "tour-pulse" : ""}`} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <CreditCard className={`h-5 w-5 shrink-0 ${location.pathname === "/pricing" ? "text-sidebar-primary" : "text-muted-foreground"}`}  aria-hidden="true" />
                {!collapsed && <span className="text-sm">Pricing</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" aria-label="Settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <Settings className={`h-5 w-5 shrink-0 ${location.pathname === "/settings" ? "text-sidebar-primary" : "text-muted-foreground"}`}  aria-hidden="true" />
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
