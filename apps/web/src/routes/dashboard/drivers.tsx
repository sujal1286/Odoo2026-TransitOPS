import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useDriversQuery } from "@/queries/drivers";
import { useDriverStore } from "@/store/useDriverStore";
import DriverFilters from "@/components/drivers/driver-filters";
import DriverTable from "@/components/drivers/driver-table";
import StatusToggler from "@/components/drivers/status-toggler";
import DriverDialog from "@/components/drivers/driver-dialog";

export const Route = createFileRoute("/dashboard/drivers")({
  component: DriverManagementComponent,
});

function DriverManagementComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const filters = useDriverStore();

  const { data: drivers, isLoading } = useDriversQuery({
    status: filters.status === "All" ? undefined : filters.status,
    search: filters.search || undefined,
    available: filters.available ? "true" : undefined,
  });

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Drivers & Safety Profiles</h1>
        <p className="text-xs text-muted-foreground">Manage credentials, safety scores, and toggle active assignments</p>
      </div>

      <DriverFilters onAddClick={() => setIsOpen(true)} />

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          Loading driver profiles...
        </div>
      ) : (
        <div className="space-y-6">
          <DriverTable drivers={drivers ?? []} />
          <StatusToggler />
        </div>
      )}

      {isOpen && (
        <DriverDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
