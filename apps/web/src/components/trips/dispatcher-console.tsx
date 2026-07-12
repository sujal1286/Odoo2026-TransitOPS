import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info, Play, CheckCircle, Ban, ArrowLeft, Plus } from "lucide-react";
import z from "zod";
import { useTripStore } from "@/store/useTripStore";
import {
  useTripsQuery,
  useCreateTripMutation,
  useDispatchTripMutation,
  useCompleteTripMutation,
  useCancelTripMutation,
} from "@/queries/trips";
import type { Trip } from "@/queries/trips";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useDriversQuery } from "@/queries/drivers";
import { createTripSchema, completeTripSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateTripInputs = z.infer<typeof createTripSchema>;
type CompleteTripInputs = z.infer<typeof completeTripSchema>;

export default function DispatcherConsole() {
  const selectedTripId = useTripStore((state) => state.selectedTripId);
  const clearSelection = useTripStore((state) => state.clearSelection);

  const { data: trips } = useTripsQuery();
  const { data: vehicles } = useVehiclesQuery();
  const { data: drivers } = useDriversQuery();

  const createMutation = useCreateTripMutation();
  const dispatchMutation = useDispatchTripMutation();
  const completeMutation = useCompleteTripMutation();
  const cancelMutation = useCancelTripMutation();

  const [isCompleting, setIsCompleting] = useState(false);

  const selectedTrip = trips?.find((t) => t.id === selectedTripId);
  const selectedTripVehicle = vehicles?.find((v) => v.id === selectedTrip?.vehicleId);
  const selectedTripDriver = drivers?.find((d) => d.id === selectedTrip?.driverId);

  const availableVehicles = vehicles?.filter((v) => v.status === "Available") ?? [];
  const availableDrivers = drivers?.filter((d) => d.status === "Available") ?? [];

  const {
    register: createRegister,
    handleSubmit: handleCreateSubmit,
    watch: createWatch,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isCreating, isValid: isCreateValid },
  } = useForm<CreateTripInputs>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      source: "",
      destination: "",
      vehicleId: "",
      driverId: "",
      cargoWeight: 0,
      plannedDistance: 0,
      revenue: 0,
    },
    mode: "onChange",
  });

  const {
    register: completeRegister,
    handleSubmit: handleCompleteSubmit,
    reset: resetComplete,
    formState: { errors: completeErrors, isSubmitting: isCompletingSubmit, isValid: isCompleteValid },
  } = useForm<CompleteTripInputs>({
    resolver: zodResolver(completeTripSchema),
    defaultValues: {
      endOdometer: selectedTripVehicle ? selectedTripVehicle.odometer : 0,
      fuelLiters: 0,
      fuelCost: 0,
    },
    mode: "onChange",
  });

  const watchVehicleId = createWatch("vehicleId");
  const watchCargoWeight = createWatch("cargoWeight");

  const selectedVehicle = vehicles?.find((v) => v.id === watchVehicleId);
  const capacityExceeded = selectedVehicle && watchCargoWeight > selectedVehicle.maxLoadCapacity;
  const exceedAmount = selectedVehicle ? watchCargoWeight - selectedVehicle.maxLoadCapacity : 0;

  useEffect(() => {
    if (selectedTripVehicle) {
      resetComplete({
        endOdometer: selectedTripVehicle.odometer,
        fuelLiters: 0,
        fuelCost: 0,
      });
    }
  }, [selectedTripVehicle, resetComplete]);

  const onCreateSubmit = async (values: CreateTripInputs) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Draft trip created successfully");
      resetCreate();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to create trip");
    }
  };

  const onCompleteSubmit = async (values: CompleteTripInputs) => {
    if (!selectedTrip) return;
    try {
      await completeMutation.mutateAsync({
        id: selectedTrip.id,
        data: values,
      });
      toast.success("Trip completed successfully");
      setIsCompleting(false);
      clearSelection();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to complete trip");
    }
  };

  const handleDispatch = async () => {
    if (!selectedTrip) return;
    try {
      await dispatchMutation.mutateAsync(selectedTrip.id);
      toast.success("Trip dispatched successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to dispatch trip");
    }
  };

  const handleCancel = async () => {
    if (!selectedTrip) return;
    try {
      await cancelMutation.mutateAsync(selectedTrip.id);
      toast.success("Trip cancelled successfully");
      clearSelection();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to cancel trip");
    }
  };

  if (selectedTrip) {
    const isDraft = selectedTrip.status === "Draft";
    const isDispatched = selectedTrip.status === "Dispatched";
    const isCompleted = selectedTrip.status === "Completed";
    const isCancelled = selectedTrip.status === "Cancelled";

    const tripCapacityExceeded = selectedTripVehicle && selectedTrip.cargoWeight > selectedTripVehicle.maxLoadCapacity;
    const tripExceedAmount = selectedTripVehicle ? selectedTrip.cargoWeight - selectedTripVehicle.maxLoadCapacity : 0;

    return (
      <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Trip Details: {selectedTrip.id.substring(0, 8)}...
            </span>
          </div>
          <Button
            onClick={clearSelection}
            variant="outline"
            className="flex h-auto items-center gap-1 border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New
          </Button>
        </div>

        <div className="space-y-3">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Trip Lifecycle
          </span>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 p-4">
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDraft || isDispatched || isCompleted
                    ? "bg-emerald-500 text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-muted-foreground">Draft</span>
            </div>
            <div className="h-0.5 flex-1 -mt-4 bg-border" />
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDispatched || isCompleted
                    ? "bg-blue-500 text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-muted-foreground">Dispatched</span>
            </div>
            <div className="h-0.5 flex-1 -mt-4 bg-border" />
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? "bg-emerald-500 text-foreground"
                    : isCancelled
                    ? "bg-rose-500 text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-muted-foreground">
                {isCancelled ? "Cancelled" : "Completed"}
              </span>
            </div>
          </div>
        </div>

        {isCompleting ? (
          <form onSubmit={handleCompleteSubmit(onCompleteSubmit)} className="space-y-4 rounded-md border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-800/20 dark:bg-amber-950/5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Complete Operational Details
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="endOdometer" className="text-[11px] font-medium text-muted-foreground">End Odometer (km)</Label>
                <Input
                  id="endOdometer"
                  type="number"
                  {...completeRegister("endOdometer", { valueAsNumber: true })}
                  className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
                />
                {completeErrors.endOdometer && (
                  <p className="text-red-500 text-xs">
                    {completeErrors.endOdometer.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fuelLiters" className="text-[11px] font-medium text-muted-foreground">Fuel Liters</Label>
                <Input
                  id="fuelLiters"
                  type="number"
                  {...completeRegister("fuelLiters", { valueAsNumber: true })}
                  className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
                />
                {completeErrors.fuelLiters && (
                  <p className="text-red-500 text-xs">
                    {completeErrors.fuelLiters.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="fuelCost" className="text-[11px] font-medium text-muted-foreground">Fuel Cost (₹)</Label>
              <Input
                id="fuelCost"
                type="number"
                {...completeRegister("fuelCost", { valueAsNumber: true })}
                className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
              />
              {completeErrors.fuelCost && (
                <p className="text-red-500 text-xs">
                  {completeErrors.fuelCost.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCompleting(false)}
                className="px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={!isCompleteValid || isCompletingSubmit}
                className="ml-auto border-amber-800 bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
              >
                Confirm Completion
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Source</span>
                <span className="font-semibold text-foreground">{selectedTrip.source}</span>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Destination</span>
                <span className="font-semibold text-foreground">{selectedTrip.destination}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Vehicle Assigned</span>
                <span className="font-semibold text-foreground">{selectedTripVehicle ? `${selectedTripVehicle.name} (${selectedTripVehicle.registrationNumber})` : "Unassigned"}</span>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Driver Assigned</span>
                <span className="font-semibold text-foreground">{selectedTripDriver ? selectedTripDriver.name : "Unassigned"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Cargo Weight</span>
                <span className="font-semibold text-foreground">{selectedTrip.cargoWeight} kg</span>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Distance</span>
                <span className="font-semibold text-foreground">{selectedTrip.plannedDistance} km</span>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <span className="block font-medium text-muted-foreground">Revenue</span>
                <span className="font-semibold text-foreground">₹{selectedTrip.revenue.toLocaleString()}</span>
              </div>
            </div>

            {isDraft && tripCapacityExceeded && (
              <div className="space-y-1 rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-400">
                <p className="font-semibold flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5" />
                  <span>Vehicle Capacity: {selectedTripVehicle?.maxLoadCapacity} kg</span>
                </p>
                <p>Cargo Weight: {selectedTrip.cargoWeight} kg</p>
                <p className="mt-1 border-t border-red-200 pt-1 font-bold text-red-600 dark:border-red-900/40 dark:text-red-500">
                  X Capacity exceeded by {tripExceedAmount} kg — dispatch blocked
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
              {isDraft && (
                <>
                  <Button
                    onClick={handleDispatch}
                    disabled={tripCapacityExceeded || dispatchMutation.isPending}
                    className="flex items-center gap-1.5 border-amber-800 bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Dispatch</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    variant="outline"
                    className="flex items-center gap-1.5 border-border px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-500"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </Button>
                </>
              )}

              {isDispatched && (
                <>
                  <Button
                    onClick={() => setIsCompleting(true)}
                    className="flex items-center gap-1.5 border-amber-800 bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Complete</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    variant="outline"
                    className="flex items-center gap-1.5 border-border px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-500"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Create Trip (Draft)
        </h2>
      </div>

      <form onSubmit={handleCreateSubmit(onCreateSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="source" className="text-[11px] font-medium text-muted-foreground">Source</Label>
            <Input
              id="source"
              {...createRegister("source")}
              className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
            />
            {createErrors.source && (
              <p className="text-red-500 text-xs">
                {createErrors.source.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="destination" className="text-[11px] font-medium text-muted-foreground">Destination</Label>
            <Input
              id="destination"
              {...createRegister("destination")}
              className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
            />
            {createErrors.destination && (
              <p className="text-red-500 text-xs">
                {createErrors.destination.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="vehicleId" className="text-[11px] font-medium text-muted-foreground">Vehicle (Available Only)</Label>
            <div className="relative">
              <select
                id="vehicleId"
                {...createRegister("vehicleId")}
                className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="">Select vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber}) - {v.maxLoadCapacity}kg cap
                  </option>
                ))}
              </select>
            </div>
            {createErrors.vehicleId && (
              <p className="text-red-500 text-xs">
                {createErrors.vehicleId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="driverId" className="text-[11px] font-medium text-muted-foreground">Driver (Available Only)</Label>
            <div className="relative">
              <select
                id="driverId"
                {...createRegister("driverId")}
                className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="">Select driver...</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.licenseCategory})
                  </option>
                ))}
              </select>
            </div>
            {createErrors.driverId && (
              <p className="text-red-500 text-xs">
                {createErrors.driverId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="cargoWeight" className="text-[11px] font-medium text-muted-foreground">Cargo Weight (kg)</Label>
            <Input
              id="cargoWeight"
              type="number"
              {...createRegister("cargoWeight", { valueAsNumber: true })}
              className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
            />
            {createErrors.cargoWeight && (
              <p className="text-red-500 text-xs">
                {createErrors.cargoWeight.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="plannedDistance" className="text-[11px] font-medium text-muted-foreground">Distance (km)</Label>
            <Input
              id="plannedDistance"
              type="number"
              {...createRegister("plannedDistance", { valueAsNumber: true })}
              className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
            />
            {createErrors.plannedDistance && (
              <p className="text-red-500 text-xs">
                {createErrors.plannedDistance.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="revenue" className="text-[11px] font-medium text-muted-foreground">Revenue (₹)</Label>
            <Input
              id="revenue"
              type="number"
              {...createRegister("revenue", { valueAsNumber: true })}
              className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
            />
            {createErrors.revenue && (
              <p className="text-red-500 text-xs">
                {createErrors.revenue.message}
              </p>
            )}
          </div>
        </div>

        {capacityExceeded && (
          <div className="space-y-1 rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-400">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="h-4.5 w-4.5" />
              <span>Vehicle Capacity: {selectedVehicle?.maxLoadCapacity} kg</span>
            </p>
            <p>Cargo Weight: {watchCargoWeight} kg</p>
            <p className="mt-1 border-t border-red-200 pt-1 font-bold text-red-600 dark:border-red-900/40 dark:text-red-500">
              X Capacity exceeded by {exceedAmount} kg — dispatch blocked
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            type="submit"
            disabled={!isCreateValid || capacityExceeded || createMutation.isPending}
            className="border-amber-800 bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
          >
            Create Draft Trip
          </Button>
        </div>
      </form>
    </div>
  );
}
