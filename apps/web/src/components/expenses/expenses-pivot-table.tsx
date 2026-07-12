import { useExpensesQuery, useFuelLogsQuery } from "@/queries/expenses";
import { useVehiclesQuery } from "@/queries/vehicles";

export default function ExpensesPivotTable() {
  const { data: vehicles } = useVehiclesQuery();
  const { data: fuelLogs } = useFuelLogsQuery();
  const { data: expenses, isLoading: isExpensesLoading } = useExpensesQuery();

  const otherExpenses = expenses?.filter((e) => e.category !== "Fuel") ?? [];

  const tripMap: Record<string, {
    tripId: string;
    vehicleName: string;
    toll: number;
    other: number;
    maint: number;
    total: number;
  }> = {};

  otherExpenses.forEach((exp) => {
    const key = exp.tripId || `no-trip-${exp.vehicleId}-${exp.id}`;
    if (!tripMap[key]) {
      tripMap[key] = {
        tripId: exp.tripId ? exp.tripId.substring(0, 8).toUpperCase() : "—",
        vehicleName: exp.vehicle?.name || vehicles?.find((v) => v.id === exp.vehicleId)?.name || "—",
        toll: 0,
        other: 0,
        maint: 0,
        total: 0,
      };
    }
    if (exp.category === "Tolls") {
      tripMap[key].toll += exp.amount;
    } else if (exp.category === "Maintenance") {
      tripMap[key].maint += exp.amount;
    } else {
      tripMap[key].other += exp.amount;
    }
    tripMap[key].total += exp.amount;
  });

  const aggregatedExpenses = Object.values(tripMap);

  const totalFuelCost = fuelLogs?.reduce((acc, f) => acc + f.cost, 0) || 0;
  const totalOtherExpenses = otherExpenses.reduce((acc, e) => acc + e.amount, 0) || 0;
  const totalOperationalCost = totalFuelCost + totalOtherExpenses;

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 space-y-4">
      <h2 className="text-sm font-bold text-zinc-400 tracking-wide uppercase">
        Other Expenses (Toll / Misc)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              <th className="pb-3 pr-4">TRIP</th>
              <th className="pb-3 px-4">VEHICLE</th>
              <th className="pb-3 px-4">TOLL</th>
              <th className="pb-3 px-4">OTHER</th>
              <th className="pb-3 px-4">MAINT. (LINKED)</th>
              <th className="pb-3 pl-4">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {isExpensesLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-600">
                  Loading expense reports...
                </td>
              </tr>
            ) : aggregatedExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-600">
                  No general operational expenses recorded.
                </td>
              </tr>
            ) : (
              aggregatedExpenses.map((row, idx) => (
                <tr key={idx} className="text-zinc-300">
                  <td className="py-3.5 pr-4 font-semibold text-zinc-200">
                    {row.tripId}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {row.vehicleName}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">
                    ₹{row.toll.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">
                    ₹{row.other.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">
                    ₹{row.maint.toLocaleString()}
                  </td>
                  <td className="py-3.5 pl-4 font-semibold text-zinc-200">
                    ₹{row.total.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-900 pt-5 mt-2">
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Total Operational Cost (Auto) = Fuel + Maint + Misc
        </span>
        <span className="text-xl font-bold text-amber-500">
          ₹{totalOperationalCost.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
