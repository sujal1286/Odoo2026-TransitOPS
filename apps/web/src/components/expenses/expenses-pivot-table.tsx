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
    <div className="rounded-2xl border border-border/70 bg-card/80 p-5 space-y-4 shadow-sm backdrop-blur-md sm:p-6">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
          Other Expenses
        </h2>
        <p className="text-sm text-muted-foreground">
          Tolls, maintenance links, and non-fuel operating costs rolled up by trip.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-4">TRIP</th>
              <th className="pb-3 px-4">VEHICLE</th>
              <th className="pb-3 px-4">TOLL</th>
              <th className="pb-3 px-4">OTHER</th>
              <th className="pb-3 px-4">MAINT. (LINKED)</th>
              <th className="pb-3 pl-4">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {isExpensesLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  Loading expense reports...
                </td>
              </tr>
            ) : aggregatedExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No general operational expenses recorded.
                </td>
              </tr>
            ) : (
              aggregatedExpenses.map((row, idx) => (
                <tr key={idx} className="text-foreground">
                  <td className="py-3.5 pr-4 font-medium text-foreground">
                    {row.tripId}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {row.vehicleName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-muted-foreground">
                    ₹{row.toll.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-muted-foreground">
                    ₹{row.other.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-muted-foreground">
                    ₹{row.maint.toLocaleString()}
                  </td>
                  <td className="py-3.5 pl-4 font-semibold text-foreground">
                    ₹{row.total.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-5 mt-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Total Operational Cost (Auto) = Fuel + Maint + Misc
        </span>
        <span className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
          ₹{totalOperationalCost.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
