import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { useDriversQuery } from "@/queries/drivers";
import { useDriverStore } from "@/store/useDriverStore";
import DriverFilters from "@/components/drivers/driver-filters";
import DriverTable from "@/components/drivers/driver-table";
import StatusToggler from "@/components/drivers/status-toggler";
import DriverDialog from "@/components/drivers/driver-dialog";

export const Route = createFileRoute("/drivers")({
  component: DriverManagementComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
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
    <div className="p-6 space-y-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-100">Drivers & Safety Profiles</h1>
        <p className="text-xs text-zinc-500">Manage credentials, safety scores, and toggle active assignments</p>
      </div>

      <DriverFilters onAddClick={() => setIsOpen(true)} />

      {isLoading ? (
        <div className="py-20 text-center text-zinc-500 text-sm">
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
