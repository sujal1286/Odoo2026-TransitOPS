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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-border/70 bg-card/95 shadow-2xl backdrop-blur-md sm:max-h-[88dvh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Expense Entry
            </p>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Log Fuel Replenishment
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isFuelAllowed && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 rounded-md border border-amber-700/30 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400 sm:mx-6">
            <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Access Restricted</p>
              <p className="mt-1 text-amber-700/80 dark:text-zinc-300">Requires Fleet Manager, Dispatcher, or Driver role to log fuel.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-1">
            <Label htmlFor="fuel-vehicle" className="text-xs font-medium text-foreground/80">Vehicle</Label>
            <select
              id="fuel-vehicle"
              disabled={!isFuelAllowed}
              {...register("vehicleId")}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer disabled:opacity-50"
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
            <Label htmlFor="fuel-trip" className="text-xs font-medium text-foreground/80">Trip (Optional)</Label>
            <select
              id="fuel-trip"
              disabled={!isFuelAllowed}
              {...register("tripId")}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer disabled:opacity-50"
            >
              <option value="">None / Select Trip...</option>
              {trips?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id.substring(0, 8).toUpperCase()} ({t.source} &rarr; {t.destination})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="fuel-liters" className="text-xs font-medium text-foreground/80">Liters</Label>
              <Input
                id="fuel-liters"
                type="number"
                disabled={!isFuelAllowed}
                {...register("liters", { valueAsNumber: true })}
                className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40 disabled:opacity-50"
              />
              {errors.liters && (
                <p className="text-red-500 text-xs">
                  {errors.liters.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fuel-cost" className="text-xs font-medium text-foreground/80">Cost (₹)</Label>
              <Input
                id="fuel-cost"
                type="number"
                disabled={!isFuelAllowed}
                {...register("cost", { valueAsNumber: true })}
                className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40 disabled:opacity-50"
              />
              {errors.cost && (
                <p className="text-red-500 text-xs">
                  {errors.cost.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="fuel-date" className="text-xs font-medium text-foreground/80">Date</Label>
            <Input
              id="fuel-date"
              type="date"
              disabled={!isFuelAllowed}
              {...register("date")}
              className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40 disabled:opacity-50"
            />
            {errors.date && (
              <p className="text-red-500 text-xs">
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={!isFuelAllowed || !isValid || isSubmitting}
              className="w-full border-amber-800 bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 sm:w-auto"
            >
              {isSubmitting ? "Logging..." : "Log Fuel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
