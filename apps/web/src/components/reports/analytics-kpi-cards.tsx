import { useAnalyticsQuery } from "@/queries/analytics";
import { useMemo } from "react";
import { Gauge, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

export default function AnalyticsKpiCards() {
  const { data: analytics, isLoading } = useAnalyticsQuery();

  const kpis = useMemo(() => {
    if (!analytics || analytics.length === 0) {
      return { avgFuelEfficiency: 0, fleetUtilization: 0, totalOperationalCost: 0, avgRoi: 0 };
    }

    const vehiclesWithDistance = analytics.filter((v) => v.totalDistance > 0);
    const avgFuelEfficiency =
      vehiclesWithDistance.length > 0
        ? vehiclesWithDistance.reduce((acc, v) => acc + v.fuelEfficiency, 0) / vehiclesWithDistance.length
        : 0;

    const totalRevenue = analytics.reduce((acc, v) => acc + v.totalRevenue, 0);
    const totalOpCost = analytics.reduce((acc, v) => acc + v.totalOperationalCost, 0);
    const fleetUtilization = totalRevenue > 0 ? ((totalRevenue - totalOpCost) / totalRevenue) * 100 : 0;

    const vehiclesWithRoi = analytics.filter((v) => v.acquisitionCost > 0);
    const avgRoi =
      vehiclesWithRoi.length > 0
        ? vehiclesWithRoi.reduce((acc, v) => acc + v.vehicleRoi, 0) / vehiclesWithRoi.length
        : 0;

    return { avgFuelEfficiency, fleetUtilization, totalOperationalCost: totalOpCost, avgRoi };
  }, [analytics]);

  const cards = [
    {
      label: "FUEL EFFICIENCY",
      value: `${kpis.avgFuelEfficiency.toFixed(1)} km/l`,
      icon: Gauge,
      accent: "border-blue-600/40",
    },
    {
      label: "FLEET UTILIZATION",
      value: `${kpis.fleetUtilization.toFixed(0)}%`,
      icon: TrendingUp,
      accent: "border-emerald-600/40",
    },
    {
      label: "OPERATIONAL COST",
      value: `₹${kpis.totalOperationalCost.toLocaleString()}`,
      icon: DollarSign,
      accent: "border-amber-600/40",
    },
    {
      label: "VEHICLE ROI",
      value: `${kpis.avgRoi.toFixed(1)}%`,
      icon: BarChart3,
      accent: "border-rose-600/40",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111113] border border-zinc-800 rounded-md p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-[#111113] border-l-4 ${card.accent} border border-zinc-800 rounded-md p-5 flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              {card.label}
            </span>
            <card.icon className="h-4 w-4 text-zinc-600" />
          </div>
          <span className="text-2xl font-bold text-zinc-100 tracking-tight">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}
