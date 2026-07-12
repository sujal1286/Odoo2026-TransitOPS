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
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 space-y-4">
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          Service Logs
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              <th className="pb-3 pr-4">VEHICLE</th>
              <th className="pb-3 px-4">SERVICE</th>
              <th className="pb-3 px-4">COST</th>
              <th className="pb-3 px-4">STATUS</th>
              {isFleetManager && <th className="pb-3 pl-4 text-right">ACTIONS</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {isLogsLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-600">
                  Loading service records...
                </td>
              </tr>
            ) : !logs || logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-600">
                  No service records logged.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const vehicleName = log.vehicle?.name || vehicles?.find((v) => v.id === log.vehicleId)?.name || "Unknown";
                const isLogActive = log.status === "In Shop" || log.status === "Active";

                return (
                  <tr key={log.id} className="text-zinc-300">
                    <td className="py-3.5 pr-4 font-semibold text-zinc-200">
                      {vehicleName}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      ₹{log.cost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isLogActive
                            ? "bg-amber-950/40 text-amber-400 border-amber-800/40"
                            : "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
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
                            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] px-2.5 py-1 h-auto flex items-center gap-1 border-emerald-900 ml-auto"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Close Log</span>
                          </Button>
                        ) : (
                          <span className="text-zinc-600 font-medium text-xs pr-2.5">—</span>
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
