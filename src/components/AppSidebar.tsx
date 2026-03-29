import {
  BookOpen,
  Wind,
  VolumeX,
  Eclipse,
  Sparkles,
  Compass,
  Users,
  Stethoscope,
  ShieldAlert,
  Brain,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const healingRooms = [
  { title: "Brain Dump", url: "/", icon: Brain, color: "text-primary" },
  { title: "Journal", url: "/journal", icon: BookOpen, color: "text-healing-journal" },
  { title: "Breathe", url: "/breathe", icon: Wind, color: "text-healing-breathe" },
  { title: "Unspoken Chamber", url: "/unspoken", icon: VolumeX, color: "text-healing-unspoken" },
  { title: "Shadow Work", url: "/shadow-work", icon: Eclipse, color: "text-healing-shadow" },
  { title: "Wisdom", url: "/wisdom", icon: Sparkles, color: "text-healing-wisdom" },
  { title: "Spiritual Tools", url: "/spiritual-tools", icon: Compass, color: "text-healing-tools" },
  { title: "Community", url: "/community", icon: Users, color: "text-healing-community" },
  { title: "Practitioner Connect", url: "/practitioner", icon: Stethoscope, color: "text-healing-practitioner" },
  { title: "Crisis Counselor", url: "/crisis", icon: ShieldAlert, color: "text-healing-crisis" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              Soul Echoes
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
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
                          aria-hidden="true"
                        />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center" role="contentinfo">
            You are seen. You are heard.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
