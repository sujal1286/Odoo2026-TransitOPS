import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { X } from "lucide-react";
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

export default function VehicleDialog({ isOpen, onClose, vehicle }: VehicleDialogProps) {
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation();

  const form = useForm({
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
    onSubmit: async ({ value }) => {
      try {
        if (vehicle) {
          await updateMutation.mutateAsync({
            id: vehicle.id,
            data: value,
          });
          toast.success("Vehicle updated successfully");
        } else {
          await createMutation.mutateAsync(value);
          toast.success("Vehicle added successfully");
        }
        onClose();
      } catch (err: any) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    },
    validators: {
      onSubmit: vehicleSchema,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111113] border border-zinc-800 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-100">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="registrationNumber">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Reg. Number</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="name">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Name/Model</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="type">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Vehicle Type</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Van, Semi Truck"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="maxLoadCapacity">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Load Capacity (kg)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="odometer">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Odometer (km)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="acquisitionCost">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Acq. Cost</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="region">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Region</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Status</Label>
                  <div className="relative">
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value as any)}
                      className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs">
                      {String((error as any)?.message ?? error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  disabled={!state.canSubmit || state.isSubmitting}
                  className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 transition-colors text-sm font-semibold px-4 py-2"
                >
                  {state.isSubmitting ? "Saving..." : "Save Vehicle"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
