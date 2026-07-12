import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useMaintenanceLogsQuery, useCloseMaintenanceMutation } from "@/queries/maintenance";
import { Button } from "@/components/ui/button";

export default function ServiceLogs() {
  const { data: session } = authClient.useSession();
  const isFleetManager = session?.user?.role === "FLEET_MANAGER";

  const { data: vehicles } = useVehiclesQuery();
  const { data: logs, isLoading: isLogsLoading } = useMaintenanceLogsQuery();
  const closeMutation = useCloseMaintenanceMutation();

  const handleCloseLog = async (id: string) => {
    try {
      await closeMutation.mutateAsync({
        id,
        data: {
          endDate: new Date().toISOString(),
        },
      });
      toast.success("Maintenance closed successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.error || "Failed to close maintenance");
    }
  };

  return (
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-4">
      <div className="border-b border-border pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Service Logs
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-4">VEHICLE</th>
              <th className="pb-3 px-4">SERVICE</th>
              <th className="pb-3 px-4">COST</th>
              <th className="pb-3 px-4">STATUS</th>
              {isFleetManager && <th className="pb-3 pl-4 text-right">ACTIONS</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {isLogsLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  Loading service records...
                </td>
              </tr>
            ) : !logs || logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No service records logged.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const vehicleName = log.vehicle?.name || vehicles?.find((v) => v.id === log.vehicleId)?.name || "Unknown";
                const isLogActive = log.status === "In Shop" || log.status === "Active";

                return (
                  <tr key={log.id} className="text-foreground">
                    <td className="py-3.5 pr-4 font-semibold text-foreground">
                      {vehicleName}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      ₹{log.cost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isLogActive
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                        }`}
                      >
                        {isLogActive ? "In Shop" : "Completed"}
                      </span>
                    </td>
                    {isFleetManager && (
                      <td className="py-3.5 pl-4 text-right">
                        {isLogActive ? (
                          <Button
                            onClick={() => handleCloseLog(log.id)}
                            disabled={closeMutation.isPending}
                            size="sm"
                            className="ml-auto flex h-auto items-center gap-1 border-emerald-800 bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-600"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Close Log</span>
                          </Button>
                        ) : (
                          <span className="pr-2.5 text-xs font-medium text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
