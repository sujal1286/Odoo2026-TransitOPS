import { createFileRoute } from "@tanstack/react-router";

import DashboardFilters from "@/components/dashboard/filters";
import DashboardKpis from "@/components/dashboard/kpi-cards";
import RecentTrips from "@/components/dashboard/recent-trips";
import VehicleStatusChart from "@/components/dashboard/vehicle-status";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <DashboardFilters />
      <DashboardKpis />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <RecentTrips />
        </div>
        <div className="flex flex-col">
          <VehicleStatusChart />
        </div>
      </div>
    </div>
  );
}
