import { useFuelLogsQuery } from "@/queries/expenses";
import { useVehiclesQuery } from "@/queries/vehicles";

export default function FuelLogsTable() {
  const { data: vehicles } = useVehiclesQuery();
  const { data: fuelLogs, isLoading: isFuelLoading } = useFuelLogsQuery();

  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-5 space-y-4 shadow-sm backdrop-blur-md sm:p-6">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
          Fuel Logs
        </h2>
        <p className="text-sm text-muted-foreground">
          Latest replenishment activity recorded against the fleet.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-4">VEHICLE</th>
              <th className="pb-3 px-4">DATE</th>
              <th className="pb-3 px-4">LITERS</th>
              <th className="pb-3 pl-4">COST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {isFuelLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  Loading fuel logs...
                </td>
              </tr>
            ) : !fuelLogs || fuelLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  No fuel replenishment history.
                </td>
              </tr>
            ) : (
              fuelLogs.map((log) => {
                const vehicleName = log.vehicle?.name || vehicles?.find((v) => v.id === log.vehicleId)?.name || "Unknown";
                const formattedDate = new Date(log.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <tr key={log.id} className="text-foreground">
                    <td className="py-3.5 pr-4 font-medium text-foreground">
                      {vehicleName}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-muted-foreground">
                      {log.liters} L
                    </td>
                    <td className="py-3.5 pl-4 font-semibold text-foreground">
                      ₹{log.cost.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
