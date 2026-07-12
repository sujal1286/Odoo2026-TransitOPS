import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useCreateDriverMutation } from "@/queries/drivers";
import { driverSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriverDialog({ isOpen, onClose }: DriverDialogProps) {
  const createMutation = useCreateDriverMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      licenseNumber: "",
      licenseCategory: "",
      licenseExpiryDate: "",
      contactNumber: "",
      safetyScore: 100,
      status: "Available",
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          ...value,
          licenseExpiryDate: new Date(value.licenseExpiryDate).toISOString(),
        };
        await createMutation.mutateAsync(payload);
        toast.success("Driver registered successfully");
        onClose();
      } catch (err: any) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    },
    validators: {
      onSubmit: driverSchema,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111113] border border-zinc-800 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-100">Register New Driver</h2>
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
            <form.Field name="name">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Driver Name</Label>
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

            <form.Field name="licenseNumber">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">License Number</Label>
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
            <form.Field name="licenseCategory">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">License Category</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. LMV, HMV"
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

            <form.Field name="licenseExpiryDate">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">License Expiry Date</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
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
            <form.Field name="contactNumber">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Contact Number</Label>
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

            <form.Field name="safetyScore">
              {(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="text-xs text-zinc-400">Safety Score</Label>
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
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
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
                  {state.isSubmitting ? "Registering..." : "Register Driver"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
