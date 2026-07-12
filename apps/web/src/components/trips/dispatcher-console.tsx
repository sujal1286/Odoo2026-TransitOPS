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
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <span className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Trip Details: {selectedTrip.id.substring(0, 8)}...
            </span>
          </div>
          <Button
            onClick={clearSelection}
            variant="outline"
            className="border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs px-2.5 py-1 h-auto font-semibold flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New
          </Button>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block">
            Trip Lifecycle
          </span>
          <div className="flex items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800/40 rounded-md">
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDraft || isDispatched || isCompleted
                    ? "bg-emerald-500 text-zinc-950"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                1
              </div>
              <span className="text-[10px] font-semibold text-zinc-400 mt-1.5">Draft</span>
            </div>
            <div className="h-0.5 bg-zinc-800 flex-1 -mt-4" />
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDispatched || isCompleted
                    ? "bg-blue-500 text-zinc-950"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                2
              </div>
              <span className="text-[10px] font-semibold text-zinc-400 mt-1.5">Dispatched</span>
            </div>
            <div className="h-0.5 bg-zinc-800 flex-1 -mt-4" />
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? "bg-emerald-500 text-zinc-950"
                    : isCancelled
                    ? "bg-rose-500 text-zinc-950"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                3
              </div>
              <span className="text-[10px] font-semibold text-zinc-400 mt-1.5">
                {isCancelled ? "Cancelled" : "Completed"}
              </span>
            </div>
          </div>
        </div>

        {isCompleting ? (
          <form onSubmit={handleCompleteSubmit(onCompleteSubmit)} className="space-y-4 border border-amber-800/20 bg-amber-950/5 p-4 rounded-md">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wide">
              Complete Operational Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="endOdometer" className="text-[11px] text-zinc-400">End Odometer (km)</Label>
                <Input
                  id="endOdometer"
                  type="number"
                  {...completeRegister("endOdometer", { valueAsNumber: true })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                />
                {completeErrors.endOdometer && (
                  <p className="text-red-500 text-xs">
                    {completeErrors.endOdometer.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fuelLiters" className="text-[11px] text-zinc-400">Fuel Liters</Label>
                <Input
                  id="fuelLiters"
                  type="number"
                  {...completeRegister("fuelLiters", { valueAsNumber: true })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
                />
                {completeErrors.fuelLiters && (
                  <p className="text-red-500 text-xs">
                    {completeErrors.fuelLiters.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="fuelCost" className="text-[11px] text-zinc-400">Fuel Cost (₹)</Label>
              <Input
                id="fuelCost"
                type="number"
                {...completeRegister("fuelCost", { valueAsNumber: true })}
                className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
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
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 px-3 py-2 transition-colors"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={!isCompleteValid || isCompletingSubmit}
                className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 ml-auto"
              >
                Confirm Completion
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Source</span>
                <span className="text-zinc-200 font-semibold">{selectedTrip.source}</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Destination</span>
                <span className="text-zinc-200 font-semibold">{selectedTrip.destination}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Vehicle Assigned</span>
                <span className="text-zinc-200 font-semibold">{selectedTripVehicle ? `${selectedTripVehicle.name} (${selectedTripVehicle.registrationNumber})` : "Unassigned"}</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Driver Assigned</span>
                <span className="text-zinc-200 font-semibold">{selectedTripDriver ? selectedTripDriver.name : "Unassigned"}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Cargo Weight</span>
                <span className="text-zinc-200 font-semibold">{selectedTrip.cargoWeight} kg</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Distance</span>
                <span className="text-zinc-200 font-semibold">{selectedTrip.plannedDistance} km</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-md">
                <span className="text-zinc-500 block font-medium">Revenue</span>
                <span className="text-zinc-200 font-semibold">₹{selectedTrip.revenue.toLocaleString()}</span>
              </div>
            </div>

            {isDraft && tripCapacityExceeded && (
              <div className="border border-red-800/40 bg-red-950/20 text-red-400 p-4 rounded-md text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5" />
                  <span>Vehicle Capacity: {selectedTripVehicle?.maxLoadCapacity} kg</span>
                </p>
                <p>Cargo Weight: {selectedTrip.cargoWeight} kg</p>
                <p className="font-bold border-t border-red-900/40 pt-1 mt-1 text-red-500">
                  X Capacity exceeded by {tripExceedAmount} kg — dispatch blocked
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
              {isDraft && (
                <>
                  <Button
                    onClick={handleDispatch}
                    disabled={tripCapacityExceeded || dispatchMutation.isPending}
                    className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 flex items-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Dispatch</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    variant="outline"
                    className="border-zinc-800 text-rose-500 hover:text-rose-400 text-xs px-4 py-2 font-semibold flex items-center gap-1.5"
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
                    className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Complete</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    variant="outline"
                    className="border-zinc-800 text-rose-500 hover:text-rose-400 text-xs px-4 py-2 font-semibold flex items-center gap-1.5"
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
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 space-y-6">
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
          Create Trip (Draft)
        </h2>
      </div>

      <form onSubmit={handleCreateSubmit(onCreateSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="source" className="text-[11px] text-zinc-400">Source</Label>
            <Input
              id="source"
              {...createRegister("source")}
              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
            />
            {createErrors.source && (
              <p className="text-red-500 text-xs">
                {createErrors.source.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="destination" className="text-[11px] text-zinc-400">Destination</Label>
            <Input
              id="destination"
              {...createRegister("destination")}
              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
            />
            {createErrors.destination && (
              <p className="text-red-500 text-xs">
                {createErrors.destination.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="vehicleId" className="text-[11px] text-zinc-400">Vehicle (Available Only)</Label>
            <div className="relative">
              <select
                id="vehicleId"
                {...createRegister("vehicleId")}
                className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
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
            <Label htmlFor="driverId" className="text-[11px] text-zinc-400">Driver (Available Only)</Label>
            <div className="relative">
              <select
                id="driverId"
                {...createRegister("driverId")}
                className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
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

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="cargoWeight" className="text-[11px] text-zinc-400">Cargo Weight (kg)</Label>
            <Input
              id="cargoWeight"
              type="number"
              {...createRegister("cargoWeight", { valueAsNumber: true })}
              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
            />
            {createErrors.cargoWeight && (
              <p className="text-red-500 text-xs">
                {createErrors.cargoWeight.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="plannedDistance" className="text-[11px] text-zinc-400">Distance (km)</Label>
            <Input
              id="plannedDistance"
              type="number"
              {...createRegister("plannedDistance", { valueAsNumber: true })}
              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
            />
            {createErrors.plannedDistance && (
              <p className="text-red-500 text-xs">
                {createErrors.plannedDistance.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="revenue" className="text-[11px] text-zinc-400">Revenue (₹)</Label>
            <Input
              id="revenue"
              type="number"
              {...createRegister("revenue", { valueAsNumber: true })}
              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
            />
            {createErrors.revenue && (
              <p className="text-red-500 text-xs">
                {createErrors.revenue.message}
              </p>
            )}
          </div>
        </div>

        {capacityExceeded && (
          <div className="border border-red-800/40 bg-red-950/20 text-red-400 p-4 rounded-md text-xs space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="h-4.5 w-4.5" />
              <span>Vehicle Capacity: {selectedVehicle?.maxLoadCapacity} kg</span>
            </p>
            <p>Cargo Weight: {watchCargoWeight} kg</p>
            <p className="font-bold border-t border-red-900/40 pt-1 mt-1 text-red-500">
              X Capacity exceeded by {exceedAmount} kg — dispatch blocked
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
          <Button
            type="submit"
            disabled={!isCreateValid || capacityExceeded || createMutation.isPending}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800"
          >
            Create Draft Trip
          </Button>
        </div>
      </form>
    </div>
  );
}
