import { createFileRoute } from "@tanstack/react-router";

import AnalyticsKpiCards from "@/components/reports/analytics-kpi-cards";
import RevenueBarChart from "@/components/reports/revenue-bar-chart";
import CostliestVehiclesChart from "@/components/reports/costliest-vehicles-chart";
import AnalyticsTable from "@/components/reports/analytics-table";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Reports & Analytics</h1>
        <p className="text-xs text-muted-foreground">Fleet performance reports, cost aggregation, and vehicle ROI analytics</p>
      </div>

      <AnalyticsKpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBarChart />
        <CostliestVehiclesChart />
      </div>

      <AnalyticsTable />
    </div>
  );
}
