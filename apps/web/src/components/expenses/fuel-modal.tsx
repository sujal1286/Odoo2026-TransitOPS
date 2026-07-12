import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, X } from "lucide-react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useTripsQuery } from "@/queries/trips";
import { useCreateFuelLogMutation } from "@/queries/expenses";
import { fuelLogSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FuelLogInputs = z.infer<typeof fuelLogSchema>;

interface FuelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FuelModal({ isOpen, onClose }: FuelModalProps) {
  const { data: session } = authClient.useSession();
  const isFuelAllowed = ["FLEET_MANAGER", "DISPATCHER", "DRIVER"].includes(session?.user?.role || "");

  const { data: vehicles } = useVehiclesQuery();
  const { data: trips } = useTripsQuery();
  const createFuelMutation = useCreateFuelLogMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FuelLogInputs>({
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

  const onSubmit = async (values: FuelLogInputs) => {
    try {
      await createFuelMutation.mutateAsync({
        ...values,
        tripId: values.tripId || undefined,
        date: new Date(values.date).toISOString(),
      });
      toast.success("Fuel replenishment logged successfully");
      onClose();
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to log fuel");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            Log Fuel Replenishment
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="fuel-vehicle" className="text-xs text-zinc-400">Vehicle</Label>
            <select
              id="fuel-vehicle"
              disabled={!isFuelAllowed}
              {...register("vehicleId")}
              className="w-full appearance-none bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
            >
              <option value="">Select vehicle...</option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.registrationNumber})
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-red-500 text-xs">
                {errors.vehicleId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="fuel-trip" className="text-xs text-zinc-400">Trip (Optional)</Label>
            <select
              id="fuel-trip"
              disabled={!isFuelAllowed}
              {...register("tripId")}
              className="w-full appearance-none bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50"
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
                {...register("liters", { valueAsNumber: true })}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
              />
              {errors.liters && (
                <p className="text-red-500 text-xs">
                  {errors.liters.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fuel-cost" className="text-xs text-zinc-400">Cost (₹)</Label>
              <Input
                id="fuel-cost"
                type="number"
                disabled={!isFuelAllowed}
                {...register("cost", { valueAsNumber: true })}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
              />
              {errors.cost && (
                <p className="text-red-500 text-xs">
                  {errors.cost.message}
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
              {...register("date")}
              className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
            />
            {errors.date && (
              <p className="text-red-500 text-xs">
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={!isFuelAllowed || !isValid || isSubmitting}
              className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 text-sm font-semibold px-4 py-2"
            >
              {isSubmitting ? "Logging..." : "Log Fuel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
