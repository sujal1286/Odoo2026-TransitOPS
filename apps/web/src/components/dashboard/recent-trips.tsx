import { useDashboardStore } from "@/store/useDashboardStore";
import { useTripsQuery } from "@/queries/trips";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useDriversQuery } from "@/queries/drivers";

export default function RecentTrips() {
  const filters = useDashboardStore();

  const { data: trips, isLoading } = useTripsQuery();
  const { data: vehicles } = useVehiclesQuery();
  const { data: drivers } = useDriversQuery();

  const getEta = (status: string) => {
    switch (status) {
      case "Draft":
        return "Awaiting vehicle";
      case "Dispatched":
        return "45 min";
      case "Completed":
        return "—";
      case "Cancelled":
        return "Cancelled";
      default:
        return "—";
    }
  };

  const filteredTrips = (trips ?? []).filter((trip) => {
    const vehicle = vehicles?.find((v) => v.id === trip.vehicleId);
    const driver = drivers?.find((d) => d.id === trip.driverId);

    if (filters.vehicleType !== "All" && vehicle?.type !== filters.vehicleType) return false;
    if (filters.status !== "All" && trip.status !== filters.status) return false;
    if (filters.region !== "All" && vehicle?.region !== filters.region) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const matchVehicle = vehicle ? vehicle.name.toLowerCase().includes(s) : false;
      const matchDriver = driver ? driver.name.toLowerCase().includes(s) : false;
      const matchId = trip.id.toLowerCase().includes(s);
      if (!matchVehicle && !matchDriver && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-4">
          Recent Trips
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">TRIP</th>
                <th className="pb-3 px-4">VEHICLE</th>
                <th className="pb-3 px-4">DRIVER</th>
                <th className="pb-3 px-4">STATUS</th>
                <th className="pb-3 pl-4">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading recent trips...
                  </td>
                </tr>
              ) : filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No recent trips match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((t) => {
                  const vehicle = vehicles?.find((v) => v.id === t.vehicleId);
                  const driver = drivers?.find((d) => d.id === t.driverId);
                  
                  return (
                    <tr key={t.id} className="text-foreground">
                      <td className="py-3.5 pr-4 font-semibold text-foreground">
                        {t.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {vehicle ? vehicle.name : "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {driver ? driver.name : "Unassigned"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            t.status === "On Trip" || t.status === "Dispatched"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40"
                              : t.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                              : t.status === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                              : "bg-muted/70 text-muted-foreground border-border"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-muted-foreground font-medium">
                        {getEta(t.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
