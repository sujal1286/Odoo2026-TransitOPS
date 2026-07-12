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
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 space-y-6">
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          Log Service Record
        </h2>
      </div>

      {!isFleetManager && (
        <div className="border border-amber-800/40 bg-amber-950/20 text-amber-400 p-4 rounded-md text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Access Denied</p>
            <p className="text-zinc-400 mt-1">Enforcement: requires FLEET_MANAGER role to record new servicing entries.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="vehicleId" className="text-[11px] text-zinc-400">Vehicle</Label>
          <select
            id="vehicleId"
            disabled={!isFleetManager}
            {...register("vehicleId")}
            className="w-full appearance-none bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Label htmlFor="description" className="text-[11px] text-zinc-400">Service Type / Description</Label>
          <Input
            id="description"
            placeholder="e.g. Oil Change, Engine Repair"
            disabled={!isFleetManager}
            {...register("description")}
            className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="cost" className="text-[11px] text-zinc-400">Servicing Cost (₹)</Label>
          <Input
            id="cost"
            type="number"
            disabled={!isFleetManager}
            {...register("cost", { valueAsNumber: true })}
            className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
          />
          {errors.cost && (
            <p className="text-red-500 text-xs">
              {errors.cost.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-[11px] text-zinc-400">Servicing Date</Label>
          <Input
            id="startDate"
            type="date"
            disabled={!isFleetManager}
            {...register("startDate")}
            className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50 disabled:opacity-50"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] text-zinc-400">Servicing Status</Label>
          <div className="bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50/60 text-zinc-400 text-sm px-3 py-2 rounded-md font-semibold select-none">
            Active (In Shop)
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isFleetManager || !isValid || isSubmitting}
          className="w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs py-2 border-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>

      <div className="border-t border-zinc-900 pt-4 space-y-2 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500">Available</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-zinc-400 font-bold">Initiating record</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-amber-500">In Shop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500">In Shop</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-zinc-400 font-bold">Closing record</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-emerald-500">Available</span>
        </div>
        <p className="text-zinc-600 italic mt-1 font-normal">Note: In Shop vehicles are removed from the dispatch pool.</p>
      </div>
    </div>
  );
}
