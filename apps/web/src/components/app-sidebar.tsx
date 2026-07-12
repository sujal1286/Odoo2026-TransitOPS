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
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md">
      <SidebarHeader className="border-b border-zinc-200/20 dark:border-zinc-800/20">
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
                  <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">TransitOps</span>
                  <span className="text-xs text-muted-foreground">Fleet Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = routerState.location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30">
                      <Link to={item.href}>
                        <item.icon className="text-zinc-500 dark:text-zinc-400" />
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

      <SidebarFooter className="border-t border-zinc-200/20 dark:border-zinc-800/20">
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
