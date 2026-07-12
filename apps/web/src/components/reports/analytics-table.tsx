import { useAnalyticsQuery } from "@/queries/analytics";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsTable() {
  const { data: analytics, isLoading } = useAnalyticsQuery();

  const handleExportCsv = () => {
    if (!analytics || analytics.length === 0) return;

    const headers = [
      "Vehicle",
      "Registration",
      "Type",
      "Acquisition Cost",
      "Total Distance (km)",
      "Total Revenue (₹)",
      "Fuel Cost (₹)",
      "Maintenance Cost (₹)",
      "Tolls Cost (₹)",
      "Total Op. Cost (₹)",
      "Fuel Efficiency (km/l)",
      "Vehicle ROI (%)",
    ];

    const rows = analytics.map((v) => [
      v.name,
      v.registrationNumber,
      v.type,
      v.acquisitionCost,
      v.totalDistance,
      v.totalRevenue,
      v.fuelCost,
      v.maintenanceCost,
      v.tollsCost,
      v.totalOperationalCost,
      v.fuelEfficiency.toFixed(2),
      v.vehicleRoi.toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transitops-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-400 tracking-wide uppercase">
          Vehicle Performance Details
        </h3>
        <Button
          onClick={handleExportCsv}
          disabled={!analytics || analytics.length === 0}
          size="sm"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs px-3 py-1.5 h-auto flex items-center gap-1.5 border border-zinc-700"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-[11px] font-bold text-zinc-500 tracking-wider">
              <th className="pb-3 pr-4">VEHICLE</th>
              <th className="pb-3 px-4">TYPE</th>
              <th className="pb-3 px-4 text-right">DISTANCE</th>
              <th className="pb-3 px-4 text-right">REVENUE</th>
              <th className="pb-3 px-4 text-right">FUEL</th>
              <th className="pb-3 px-4 text-right">MAINT.</th>
              <th className="pb-3 px-4 text-right">TOLLS</th>
              <th className="pb-3 px-4 text-right">OP. COST</th>
              <th className="pb-3 px-4 text-right">EFF. (km/l)</th>
              <th className="pb-3 pl-4 text-right">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-zinc-600">
                  Loading analytics...
                </td>
              </tr>
            ) : !analytics || analytics.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-zinc-600">
                  No analytics data available. Complete some trips to generate reports.
                </td>
              </tr>
            ) : (
              analytics.map((v) => {
                const roiColor =
                  v.vehicleRoi > 10
                    ? "text-emerald-400"
                    : v.vehicleRoi > 0
                      ? "text-amber-400"
                      : "text-rose-400";

                return (
                  <tr key={v.vehicleId} className="text-zinc-300">
                    <td className="py-3 pr-4">
                      <div>
                        <span className="font-semibold text-zinc-200">{v.name}</span>
                        <span className="block text-[10px] text-zinc-500 font-medium">{v.registrationNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-medium">{v.type}</td>
                    <td className="py-3 px-4 text-right text-zinc-400 font-medium">{v.totalDistance.toLocaleString()} km</td>
                    <td className="py-3 px-4 text-right font-semibold text-zinc-200">₹{v.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-400">₹{v.fuelCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-400">₹{v.maintenanceCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-400">₹{v.tollsCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-zinc-200">₹{v.totalOperationalCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-400 font-medium">{v.fuelEfficiency.toFixed(1)}</td>
                    <td className={`py-3 pl-4 text-right font-bold ${roiColor}`}>{v.vehicleRoi.toFixed(1)}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-900 pt-4 text-[10px] text-zinc-600 font-medium italic">
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost × 100
      </div>
    </div>
  );
}
