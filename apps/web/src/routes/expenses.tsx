import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Receipt, Fuel, AlertTriangle, X, Plus } from "lucide-react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useTripsQuery } from "@/queries/trips";
import {
  useFuelLogsQuery,
  useCreateFuelLogMutation,
  useExpensesQuery,
  useCreateExpenseMutation,
} from "@/queries/expenses";
import { fuelLogSchema, expenseSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FuelLogInputs = z.infer<typeof fuelLogSchema>;
type ExpenseInputs = z.infer<typeof expenseSchema>;

export const Route = createFileRoute("/expenses")({
  component: ExpensesPage,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
});

function ExpensesPage() {
  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role;

  const isFuelAllowed = ["FLEET_MANAGER", "DISPATCHER", "DRIVER"].includes(userRole || "");
  const isExpenseAllowed = ["FLEET_MANAGER", "DISPATCHER", "DRIVER", "FINANCIAL_ANALYST"].includes(userRole || "");

  const { data: vehicles } = useVehiclesQuery();
  const { data: trips } = useTripsQuery();
  const { data: fuelLogs, isLoading: isFuelLoading } = useFuelLogsQuery();
  const { data: expenses, isLoading: isExpensesLoading } = useExpensesQuery();

  const createFuelMutation = useCreateFuelLogMutation();
  const createExpenseMutation = useCreateExpenseMutation();

  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fuelForm = useForm<FuelLogInputs>({
    resolver: zodResolver(fuelLogSchema),
    defaultValues: {
      vehicleId: "",
      tripId: "",
      liters: 0,
      cost: 0,
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  const expenseForm = useForm<ExpenseInputs>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      vehicleId: "",
      tripId: "",
      amount: 0,
      category: "Tolls",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  const onFuelSubmit = async (values: FuelLogInputs) => {
    try {
      await createFuelMutation.mutateAsync({
        ...values,
        tripId: values.tripId || undefined,
        date: new Date(values.date).toISOString(),
      });
      toast.success("Fuel replenishment logged successfully");
      setIsFuelModalOpen(false);
      fuelForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to log fuel");
    }
  };

  const onExpenseSubmit = async (values: ExpenseInputs) => {
    try {
      await createExpenseMutation.mutateAsync({
        ...values,
        tripId: values.tripId || undefined,
        description: values.description || undefined,
        date: new Date(values.date).toISOString(),
      });
      toast.success("Expense registered successfully");
      setIsExpenseModalOpen(false);
      expenseForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to add expense");
    }
  };

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
    <div className="p-6 space-y-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-zinc-100">Fuel & Expense Management</h1>
          <p className="text-xs text-zinc-500">Log purchases and track operational expenditure across fleet assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsFuelModalOpen(true)}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 flex items-center gap-1.5"
          >
            <Fuel className="h-4 w-4" />
            <span>+ Log Fuel</span>
          </Button>
          <Button
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 flex items-center gap-1.5"
          >
            <Receipt className="h-4 w-4" />
            <span>+ Add Expense</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 tracking-wide uppercase">
            Fuel Logs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] font-bold text-zinc-500 tracking-wider">
                  <th className="pb-3 pr-4">VEHICLE</th>
                  <th className="pb-3 px-4">DATE</th>
                  <th className="pb-3 px-4">LITERS</th>
                  <th className="pb-3 pl-4">COST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
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

        <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 tracking-wide uppercase">
            Other Expenses (Toll / Misc)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] font-bold text-zinc-500 tracking-wider">
                  <th className="pb-3 pr-4">TRIP</th>
                  <th className="pb-3 px-4">VEHICLE</th>
                  <th className="pb-3 px-4">TOLL</th>
                  <th className="pb-3 px-4">OTHER</th>
                  <th className="pb-3 px-4">MAINT. (LINKED)</th>
                  <th className="pb-3 pl-4">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
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
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Total Operational Cost (Auto) = Fuel + Maint + Misc
            </span>
            <span className="text-xl font-bold text-amber-500">
              ₹{totalOperationalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111113] border border-zinc-800 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Log Fuel Replenishment
              </h3>
              <button onClick={() => setIsFuelModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!isFuelAllowed && (
              <div className="mx-6 mt-4 border border-amber-800/40 bg-amber-950/20 text-amber-400 p-4 rounded-md text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Access Restricted</p>
                  <p className="text-zinc-400 mt-1">Requires Fleet Manager, Dispatcher, or Driver role to log fuel.</p>
                </div>
              </div>
            )}

            <form onSubmit={fuelForm.handleSubmit(onFuelSubmit)} className="p-6 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fuel-vehicle" className="text-xs text-zinc-400">Vehicle</Label>
                <select
                  id="fuel-vehicle"
                  disabled={!isFuelAllowed}
                  {...fuelForm.register("vehicleId")}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
                {fuelForm.formState.errors.vehicleId && (
                  <p className="text-red-500 text-xs">
                    {fuelForm.formState.errors.vehicleId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fuel-trip" className="text-xs text-zinc-400">Trip (Optional)</Label>
                <select
                  id="fuel-trip"
                  disabled={!isFuelAllowed}
                  {...fuelForm.register("tripId")}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
                >
                  <option value="">None / Select Trip...</option>
                  {trips?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id.substring(0, 8).toUpperCase()} ({t.source} &rarr; {t.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="fuel-liters" className="text-xs text-zinc-400">Liters</Label>
                  <Input
                    id="fuel-liters"
                    type="number"
                    disabled={!isFuelAllowed}
                    {...fuelForm.register("liters", { valueAsNumber: true })}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
                  />
                  {fuelForm.formState.errors.liters && (
                    <p className="text-red-500 text-xs">
                      {fuelForm.formState.errors.liters.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="fuel-cost" className="text-xs text-zinc-400">Cost (₹)</Label>
                  <Input
                    id="fuel-cost"
                    type="number"
                    disabled={!isFuelAllowed}
                    {...fuelForm.register("cost", { valueAsNumber: true })}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
                  />
                  {fuelForm.formState.errors.cost && (
                    <p className="text-red-500 text-xs">
                      {fuelForm.formState.errors.cost.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="fuel-date" className="text-xs text-zinc-400">Date</Label>
                <Input
                  id="fuel-date"
                  type="date"
                  disabled={!isFuelAllowed}
                  {...fuelForm.register("date")}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
                />
                {fuelForm.formState.errors.date && (
                  <p className="text-red-500 text-xs">
                    {fuelForm.formState.errors.date.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={!isFuelAllowed || !fuelForm.formState.isValid || fuelForm.formState.isSubmitting}
                  className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 text-sm font-semibold px-4 py-2"
                >
                  {fuelForm.formState.isSubmitting ? "Logging..." : "Log Fuel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111113] border border-zinc-800 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Log Operating Expense
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!isExpenseAllowed && (
              <div className="mx-6 mt-4 border border-amber-800/40 bg-amber-950/20 text-amber-400 p-4 rounded-md text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Access Restricted</p>
                  <p className="text-zinc-400 mt-1">Requires Fleet Manager, Dispatcher, Driver, or Financial Analyst role.</p>
                </div>
              </div>
            )}

            <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="p-6 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="exp-vehicle" className="text-xs text-zinc-400">Vehicle</Label>
                <select
                  id="exp-vehicle"
                  disabled={!isExpenseAllowed}
                  {...expenseForm.register("vehicleId")}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
                {expenseForm.formState.errors.vehicleId && (
                  <p className="text-red-500 text-xs">
                    {expenseForm.formState.errors.vehicleId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-trip" className="text-xs text-zinc-400">Trip (Optional)</Label>
                <select
                  id="exp-trip"
                  disabled={!isExpenseAllowed}
                  {...expenseForm.register("tripId")}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
                >
                  <option value="">None / Select Trip...</option>
                  {trips?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id.substring(0, 8).toUpperCase()} ({t.source} &rarr; {t.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="exp-amount" className="text-xs text-zinc-400">Amount (₹)</Label>
                  <Input
                    id="exp-amount"
                    type="number"
                    disabled={!isExpenseAllowed}
                    {...expenseForm.register("amount", { valueAsNumber: true })}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
                  />
                  {expenseForm.formState.errors.amount && (
                    <p className="text-red-500 text-xs">
                      {expenseForm.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="exp-category" className="text-xs text-zinc-400">Category</Label>
                  <select
                    id="exp-category"
                    disabled={!isExpenseAllowed}
                    {...expenseForm.register("category")}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
                  >
                    <option value="Tolls">Tolls</option>
                    <option value="Food">Food</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Other">Other</option>
                  </select>
                  {expenseForm.formState.errors.category && (
                    <p className="text-red-500 text-xs">
                      {expenseForm.formState.errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-desc" className="text-xs text-zinc-400">Description (Optional)</Label>
                <Input
                  id="exp-desc"
                  placeholder="e.g. Highway tolls, lunch allowance"
                  disabled={!isExpenseAllowed}
                  {...expenseForm.register("description")}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
                />
                {expenseForm.formState.errors.description && (
                  <p className="text-red-500 text-xs">
                    {expenseForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-date" className="text-xs text-zinc-400">Date</Label>
                <Input
                  id="exp-date"
                  type="date"
                  disabled={!isExpenseAllowed}
                  {...expenseForm.register("date")}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
                />
                {expenseForm.formState.errors.date && (
                  <p className="text-red-500 text-xs">
                    {expenseForm.formState.errors.date.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={!isExpenseAllowed || !expenseForm.formState.isValid || expenseForm.formState.isSubmitting}
                  className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 text-sm font-semibold px-4 py-2"
                >
                  {expenseForm.formState.isSubmitting ? "Saving..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
