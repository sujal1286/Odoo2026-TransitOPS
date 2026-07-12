import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/header";
import AppSidebar from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import "../index.css";

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "TransitOps Platform",
      },
      {
        name: "description",
        content: "Smart Transport Operations Platform",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function AppShell({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const isAuthRoute = routerState.location.pathname.startsWith('/login');

  if (isAuthRoute) {
    return <div className="h-svh w-full">{children}</div>;
  }

  const breadcrumb = routerState.location.pathname.slice(1) || 'Home';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 data-[orientation=vertical]:h-4" />
            <span className="font-medium text-sm text-zinc-500 dark:text-zinc-400 capitalize">
              {breadcrumb}
            </span>
          </div>
          <div className="ml-auto">
            <Header />
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-[#09090b]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function RootComponent() {
  return (
    <>
      <HeadContent />

      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <TooltipProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </TooltipProvider>
        <Toaster richColors />
      </ThemeProvider>

      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
