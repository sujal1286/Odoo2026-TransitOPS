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
      <SidebarInset className="bg-zinc-50/50 dark:bg-[#09090b]/50 backdrop-blur-md">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-zinc-600 dark:text-zinc-400" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-200/50 dark:bg-zinc-800/50" />
            <span className="font-medium text-sm text-zinc-500 dark:text-zinc-400 capitalize">
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
