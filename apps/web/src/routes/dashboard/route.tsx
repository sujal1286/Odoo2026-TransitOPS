import { createFileRoute, redirect, Outlet, useRouterState } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const routerState = useRouterState();
  const breadcrumb = routerState.location.pathname.split("/").filter(Boolean).slice(1).join(" / ") || "Overview";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background/60 backdrop-blur-md">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/70 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-muted-foreground" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
            <span className="font-medium text-sm capitalize text-muted-foreground">
              {breadcrumb}
            </span>
          </div>
          <div className="ml-auto">
            <Header />
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
