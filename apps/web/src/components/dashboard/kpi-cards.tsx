import { useDashboardKpisQuery } from "@/queries/dashboard";

export default function DashboardKpis() {
  const { data: kpiData } = useDashboardKpisQuery();

  const activeVehiclesVal = kpiData ? kpiData.activeVehicles : 53;
  const availableVehiclesVal = kpiData ? kpiData.availableVehicles : 42;
  const maintenanceVehiclesVal = kpiData ? kpiData.maintenanceVehicles : 5;
  const activeTripsVal = kpiData ? kpiData.activeTrips : 18;
  const pendingTripsVal = kpiData ? kpiData.pendingTrips : 9;
  const driversOnDutyVal = kpiData ? kpiData.driversOnDuty : 26;
  const fleetUtilizationVal = kpiData ? kpiData.fleetUtilization : 81;

  const cards = [
    { label: "ACTIVE VEHICLES", value: activeVehiclesVal, border: "border-cyan-500/80" },
    { label: "AVAILABLE VEHICLES", value: availableVehiclesVal, border: "border-emerald-500/80" },
    { label: "VEHICLES IN MAINTENANCE", value: String(maintenanceVehiclesVal).padStart(2, "0"), border: "border-amber-500/80" },
    { label: "ACTIVE TRIPS", value: activeTripsVal, border: "border-sky-500/80" },
    { label: "PENDING TRIPS", value: String(pendingTripsVal).padStart(2, "0"), border: "border-blue-500/80" },
    { label: "DRIVERS ON DUTY", value: driversOnDutyVal, border: "border-indigo-500/80" },
    { label: "FLEET UTILIZATION", value: `${fleetUtilizationVal}%`, border: "border-emerald-500/80" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-4 flex flex-col justify-between min-h-[90px] border-l-4 ${c.border} shadow-sm`}
        >
          <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            {c.label}
          </span>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
            {c.value}
          </span>
        </div>
      ))}
    </div>
  );
}
