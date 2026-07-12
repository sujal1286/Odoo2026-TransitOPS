import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import DispatcherConsole from "@/components/trips/dispatcher-console";
import LiveBoard from "@/components/trips/live-board";

export const Route = createFileRoute("/trips")({
  component: TripsComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
});

function TripsComponent() {
  return (
    <div className="p-6 space-y-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-100">Trip Dispatcher</h1>
        <p className="text-xs text-zinc-500">Manage trip lifecycles, schedule dispatches, and record operational data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <DispatcherConsole />
        <LiveBoard />
      </div>
    </div>
  );
}
