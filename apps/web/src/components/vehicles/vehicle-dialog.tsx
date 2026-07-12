import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import z from "zod";
import { useCreateVehicleMutation, useUpdateVehicleMutation } from "@/queries/vehicles";
import type { Vehicle } from "@/queries/vehicles";
import { vehicleSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

type VehicleInputs = z.infer<typeof vehicleSchema>;

export default function VehicleDialog({ isOpen, onClose, vehicle }: VehicleDialogProps) {
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<VehicleInputs>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: vehicle?.registrationNumber ?? "",
      name: vehicle?.name ?? "",
      type: vehicle?.type ?? "",
      maxLoadCapacity: vehicle?.maxLoadCapacity ?? 0,
      odometer: vehicle?.odometer ?? 0,
      acquisitionCost: vehicle?.acquisitionCost ?? 0,
      region: vehicle?.region ?? "",
      status: (vehicle?.status as any) ?? "Available",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: VehicleInputs) => {
    try {
      if (vehicle) {
        await updateMutation.mutateAsync({
          id: vehicle.id,
          data: values,
        });
        toast.success("Vehicle updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Vehicle added successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "An error occurred");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h2 className="text-lg font-bold text-zinc-100">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="registrationNumber" className="text-xs text-zinc-400">Reg. Number</Label>
              <Input
                id="registrationNumber"
                {...register("registrationNumber")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-xs">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs text-zinc-400">Name/Model</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="type" className="text-xs text-zinc-400">Vehicle Type</Label>
              <Input
                id="type"
                placeholder="e.g. Van, Semi Truck"
                {...register("type")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.type && (
                <p className="text-red-500 text-xs">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="maxLoadCapacity" className="text-xs text-zinc-400">Load Capacity (kg)</Label>
              <Input
                id="maxLoadCapacity"
                type="number"
                {...register("maxLoadCapacity", { valueAsNumber: true })}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.maxLoadCapacity && (
                <p className="text-red-500 text-xs">
                  {errors.maxLoadCapacity.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="odometer" className="text-xs text-zinc-400">Odometer (km)</Label>
              <Input
                id="odometer"
                type="number"
                {...register("odometer", { valueAsNumber: true })}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.odometer && (
                <p className="text-red-500 text-xs">
                  {errors.odometer.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="acquisitionCost" className="text-xs text-zinc-400">Acq. Cost</Label>
              <Input
                id="acquisitionCost"
                type="number"
                {...register("acquisitionCost", { valueAsNumber: true })}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.acquisitionCost && (
                <p className="text-red-500 text-xs">
                  {errors.acquisitionCost.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="region" className="text-xs text-zinc-400">Region</Label>
              <Input
                id="region"
                {...register("region")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.region && (
                <p className="text-red-500 text-xs">
                  {errors.region.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs text-zinc-400">Status</Label>
              <div className="relative">
                <select
                  id="status"
                  {...register("status")}
                  className="w-full appearance-none bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              {errors.status && (
                <p className="text-red-500 text-xs">
                  {errors.status.message}
                </p>
              )}
            </div>
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
              disabled={!isValid || isSubmitting}
              className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 transition-colors text-sm font-semibold px-4 py-2"
            >
              {isSubmitting ? "Saving..." : "Save Vehicle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
