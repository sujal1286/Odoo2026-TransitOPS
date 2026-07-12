import { useFuelLogsQuery } from "@/queries/expenses";
import { useVehiclesQuery } from "@/queries/vehicles";

export default function FuelLogsTable() {
  const { data: vehicles } = useVehiclesQuery();
  const { data: fuelLogs, isLoading: isFuelLoading } = useFuelLogsQuery();

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 space-y-4">
      <h2 className="text-sm font-bold text-zinc-400 tracking-wide uppercase">
        Fuel Logs
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              <th className="pb-3 pr-4">VEHICLE</th>
              <th className="pb-3 px-4">DATE</th>
              <th className="pb-3 px-4">LITERS</th>
              <th className="pb-3 pl-4">COST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {isFuelLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-600">
                  Loading fuel logs...
                </td>
              </tr>
            ) : !fuelLogs || fuelLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-600">
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
                  <tr key={log.id} className="text-zinc-300">
                    <td className="py-3.5 pr-4 font-semibold text-zinc-200">
                      {vehicleName}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-medium">
                      {log.liters} L
                    </td>
                    <td className="py-3.5 pl-4 font-semibold text-zinc-200">
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
