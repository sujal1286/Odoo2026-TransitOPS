import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import ServiceRecordForm from "@/components/maintenance/service-record-form";
import ServiceLogs from "@/components/maintenance/service-logs";

export const Route = createFileRoute("/maintenance")({
  component: MaintenancePage,
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

function MaintenancePage() {
  return (
    <div className="p-6 space-y-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-100">Maintenance Console</h1>
        <p className="text-xs text-zinc-500">Track and schedule servicing records for the vehicle registry</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <ServiceRecordForm />
        </div>
        <div className="lg:col-span-2">
          <ServiceLogs />
        </div>
      </div>
    </div>
  );
}
