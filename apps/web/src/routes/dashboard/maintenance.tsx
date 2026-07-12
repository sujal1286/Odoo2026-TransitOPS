import { createFileRoute } from "@tanstack/react-router";

import ServiceRecordForm from "@/components/maintenance/service-record-form";
import ServiceLogs from "@/components/maintenance/service-logs";

export const Route = createFileRoute("/dashboard/maintenance")({
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Maintenance Console</h1>
        <p className="text-xs text-muted-foreground">Track and schedule servicing records for the vehicle registry</p>
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
