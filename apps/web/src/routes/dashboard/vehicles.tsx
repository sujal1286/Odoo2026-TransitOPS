import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useVehiclesQuery } from "@/queries/vehicles";
import type { Vehicle } from "@/queries/vehicles";
import { useVehicleStore } from "@/store/useVehicleStore";
import VehicleFilters from "@/components/vehicles/vehicle-filters";
import VehicleTable from "@/components/vehicles/vehicle-table";
import VehicleDialog from "@/components/vehicles/vehicle-dialog";

export const Route = createFileRoute("/dashboard/vehicles")({
  component: VehiclesRegistryComponent,
});

function VehiclesRegistryComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filters = useVehicleStore();
  const { data: allVehicles } = useVehiclesQuery();
  const { data: filteredVehicles, isLoading } = useVehiclesQuery({
    type: filters.type === "All" ? undefined : filters.type,
    status: filters.status === "All" ? undefined : filters.status,
    search: filters.search || undefined,
  });

  const uniqueTypes = allVehicles
    ? Array.from(new Set(allVehicles.map((v) => v.type)))
    : [];

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Vehicle Registry</h1>
        <p className="text-xs text-muted-foreground">Manage your transport assets and operational statuses</p>
      </div>

      <VehicleFilters
        onAddClick={handleAdd}
        uniqueTypes={uniqueTypes}
      />

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          Loading vehicles registry...
        </div>
      ) : (
        <VehicleTable
          vehicles={filteredVehicles ?? []}
          onEditClick={handleEdit}
        />
      )}

      {isOpen && (
        <VehicleDialog
          isOpen={isOpen}
          onClose={handleClose}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
}
