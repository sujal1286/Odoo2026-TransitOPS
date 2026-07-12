import { createFileRoute } from "@tanstack/react-router";

import DispatcherConsole from "@/components/trips/dispatcher-console";
import LiveBoard from "@/components/trips/live-board";

export const Route = createFileRoute("/dashboard/trips")({
  component: TripsComponent,
});

function TripsComponent() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Trip Dispatcher</h1>
        <p className="text-xs text-muted-foreground">Manage trip lifecycles, schedule dispatches, and record operational data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <DispatcherConsole />
        <LiveBoard />
      </div>
    </div>
  );
}
