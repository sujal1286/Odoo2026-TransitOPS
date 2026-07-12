import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Car,
  Users,
  MapPin,
  Wrench,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const allNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST", "DRIVER"] },
  { label: "Vehicles", href: "/dashboard/vehicles", icon: Car, roles: ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { label: "Drivers", href: "/dashboard/drivers", icon: Users, roles: ["FLEET_MANAGER", "SAFETY_OFFICER"] },
  { label: "Trips", href: "/dashboard/trips", icon: MapPin, roles: ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "DRIVER"] },
  { label: "Maintenance", href: "/dashboard/maintenance", icon: Wrench, roles: ["FLEET_MANAGER"] },
  { label: "Expenses", href: "/dashboard/expenses", icon: Receipt, roles: ["FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST", "DRIVER"] },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST", "DRIVER"] },
];

export default function AppSidebar() {
  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role as string | undefined;
  const routerState = useRouterState();

  const navItems = allNavItems.filter((item) => !userRole || item.roles.includes(userRole));

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-border bg-card/70 backdrop-blur-md">
      <SidebarHeader className="border-b border-border/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-600/20 border-2 border-amber-600/40">
                  <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-amber-600/80 rounded-[1px]" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold tracking-tight text-foreground">TransitOps</span>
                  <span className="text-xs text-muted-foreground">Fleet Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = routerState.location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} className="text-foreground/80 hover:text-foreground hover:bg-muted/60">
                      <Link to={item.href}>
                        <item.icon className="text-muted-foreground" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sign Out"
              className="text-red-500 hover:text-red-400 hover:bg-red-950/30 font-semibold"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
