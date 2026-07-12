import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import z from "zod";
import { useCreateDriverMutation } from "@/queries/drivers";
import { driverSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type DriverInputs = z.infer<typeof driverSchema>;

export default function DriverDialog({ isOpen, onClose }: DriverDialogProps) {
  const createMutation = useCreateDriverMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DriverInputs>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      licenseCategory: "",
      licenseExpiryDate: "",
      contactNumber: "",
      safetyScore: 100,
      status: "Available",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: DriverInputs) => {
    try {
      const payload = {
        ...values,
        licenseExpiryDate: new Date(values.licenseExpiryDate).toISOString(),
      };
      await createMutation.mutateAsync(payload);
      toast.success("Driver registered successfully");
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
          <h2 className="text-lg font-bold text-zinc-100">Register New Driver</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs text-zinc-400">Driver Name</Label>
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

            <div className="space-y-1">
              <Label htmlFor="licenseNumber" className="text-xs text-zinc-400">License Number</Label>
              <Input
                id="licenseNumber"
                {...register("licenseNumber")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-xs">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="licenseCategory" className="text-xs text-zinc-400">License Category</Label>
              <Input
                id="licenseCategory"
                placeholder="e.g. LMV, HMV"
                {...register("licenseCategory")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.licenseCategory && (
                <p className="text-red-500 text-xs">
                  {errors.licenseCategory.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="licenseExpiryDate" className="text-xs text-zinc-400">License Expiry Date</Label>
              <Input
                id="licenseExpiryDate"
                type="date"
                {...register("licenseExpiryDate")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.licenseExpiryDate && (
                <p className="text-red-500 text-xs">
                  {errors.licenseExpiryDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="contactNumber" className="text-xs text-zinc-400">Contact Number</Label>
              <Input
                id="contactNumber"
                {...register("contactNumber")}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="safetyScore" className="text-xs text-zinc-400">Safety Score</Label>
              <Input
                id="safetyScore"
                type="number"
                {...register("safetyScore", { valueAsNumber: true })}
                className="bg-white/50 dark:bg-zinc-900/50 border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus-visible:ring-amber-700/50"
              />
              {errors.safetyScore && (
                <p className="text-red-500 text-xs">
                  {errors.safetyScore.message}
                </p>
              )}
            </div>
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
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            {errors.status && (
              <p className="text-red-500 text-xs">
                {errors.status.message}
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
              disabled={!isValid || isSubmitting}
              className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 transition-colors text-sm font-semibold px-4 py-2"
            >
              {isSubmitting ? "Registering..." : "Register Driver"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
