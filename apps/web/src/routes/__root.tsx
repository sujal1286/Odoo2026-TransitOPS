import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, createRootRouteWithContext, useRouterState, Link } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  MapPin, 
  Wrench, 
  Receipt, 
  BarChart3,
  LogOut
} from "lucide-react";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";

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

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Vehicles", href: "/vehicles", icon: Car },
    { label: "Drivers", href: "/drivers", icon: Users },
    { label: "Trips", href: "/trips", icon: MapPin },
    { label: "Maintenance", href: "/maintenance", icon: Wrench },
    { label: "Expenses", href: "/expenses", icon: Receipt },
    { label: "Reports", href: "/reports", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-svh bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 md:flex">
        <div className="flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600/20 border-2 border-amber-600/40 rounded flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-amber-600/80 rounded-[1px]" />
                ))}
              </div>
            </div>
            <span className="font-semibold tracking-tight text-lg dark:text-zinc-50">TransitOps</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors [&.active]:bg-zinc-100 dark:[&.active]:bg-zinc-900 [&.active]:text-zinc-900 dark:[&.active]:text-zinc-50"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6">
          <div className="font-medium text-sm text-zinc-500 dark:text-zinc-400 capitalize">
            {routerState.location.pathname.slice(1) || 'Home'}
          </div>
          <Header />
        </header>
        <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-[#09090b]">
          {children}
        </div>
      </main>
    </div>
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
        <AppShell>
          <Outlet />
        </AppShell>
        <Toaster richColors />
      </ThemeProvider>

      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
