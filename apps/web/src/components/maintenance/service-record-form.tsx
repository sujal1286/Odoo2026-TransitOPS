import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, ArrowRight } from "lucide-react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useInitiateMaintenanceMutation } from "@/queries/maintenance";
import { maintenanceSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MaintenanceInputs = z.infer<typeof maintenanceSchema>;

export default function ServiceRecordForm() {
  const { data: session } = authClient.useSession();
  const isFleetManager = session?.user?.role === "FLEET_MANAGER";

  const { data: vehicles } = useVehiclesQuery();
  const initiateMutation = useInitiateMaintenanceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<MaintenanceInputs>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicleId: "",
      description: "",
      cost: 0,
      startDate: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  const onSubmit = async (values: MaintenanceInputs) => {
    try {
      await initiateMutation.mutateAsync({
        ...values,
        startDate: new Date(values.startDate).toISOString(),
      });
      toast.success("Maintenance initiated successfully");
      reset({
        vehicleId: "",
        description: "",
        cost: 0,
        startDate: new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to initiate maintenance");
    }
  };

  return (
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Log Service Record
        </h2>
      </div>

      {!isFleetManager && (
        <div className="flex items-start gap-2.5 rounded-md border border-amber-700/30 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Access Denied</p>
            <p className="mt-1 text-amber-700/80 dark:text-zinc-300">Enforcement: requires FLEET_MANAGER role to record new servicing entries.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="vehicleId" className="text-[11px] font-medium text-muted-foreground">Vehicle</Label>
          <select
            id="vehicleId"
            disabled={!isFleetManager}
            {...register("vehicleId")}
            className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="">Select vehicle...</option>
            {vehicles?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.registrationNumber}) - {v.status}
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
          <Label htmlFor="description" className="text-[11px] font-medium text-muted-foreground">Service Type / Description</Label>
          <Input
            id="description"
            placeholder="e.g. Oil Change, Engine Repair"
            disabled={!isFleetManager}
            {...register("description")}
            className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40 disabled:opacity-50"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="cost" className="text-[11px] font-medium text-muted-foreground">Servicing Cost (₹)</Label>
          <Input
            id="cost"
            type="number"
            disabled={!isFleetManager}
            {...register("cost", { valueAsNumber: true })}
            className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40 disabled:opacity-50"
          />
          {errors.cost && (
            <p className="text-red-500 text-xs">
              {errors.cost.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-[11px] font-medium text-muted-foreground">Servicing Date</Label>
          <Input
            id="startDate"
            type="date"
            disabled={!isFleetManager}
            {...register("startDate")}
            className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40 disabled:opacity-50"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-muted-foreground">Servicing Status</Label>
          <div className="rounded-md border border-border bg-muted/60 px-3 py-2 text-sm font-semibold text-muted-foreground select-none">
            Active (In Shop)
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isFleetManager || !isValid || isSubmitting}
          className="w-full border-amber-800 bg-amber-700 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>

      <div className="border-t border-border pt-4 space-y-2 text-[10px] font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-600 dark:text-emerald-400">Available</span>
          <ArrowRight className="h-3 w-3" />
          <span className="font-bold text-muted-foreground">Initiating record</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-amber-600 dark:text-amber-400">In Shop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-amber-600 dark:text-amber-400">In Shop</span>
          <ArrowRight className="h-3 w-3" />
          <span className="font-bold text-muted-foreground">Closing record</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-emerald-600 dark:text-emerald-400">Available</span>
        </div>
        <p className="mt-1 font-normal italic text-muted-foreground">Note: In Shop vehicles are removed from the dispatch pool.</p>
      </div>
    </div>
  );
}
