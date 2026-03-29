import {
  BookOpen, Wind, VolumeX, Eclipse, Sparkles, Compass, Users, Stethoscope,
  ShieldAlert, Brain, Volume2, Settings, Lock,
} from "lucide-react";
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
  { title: "Community", url: "/community", icon: Users, color: "text-healing-community", free: false },
  { title: "Practitioner Connect", url: "/practitioner", icon: Stethoscope, color: "text-healing-practitioner", free: false },
  { title: "Crisis Counselor", url: "/crisis", icon: ShieldAlert, color: "text-healing-crisis", free: true },
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
              <NavLink to="/voice-settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                <Volume2 className={`h-5 w-5 shrink-0 ${location.pathname === "/voice-settings" ? "text-sidebar-primary" : "text-muted-foreground"}`} />
                {!collapsed && <span className="text-sm">Voice Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
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
