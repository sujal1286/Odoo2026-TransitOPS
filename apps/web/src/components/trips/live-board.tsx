import { useTripStore } from "@/store/useTripStore";
import { useTripsQuery } from "@/queries/trips";
import { useVehiclesQuery } from "@/queries/vehicles";
import { useDriversQuery } from "@/queries/drivers";

export default function LiveBoard() {
  const selectedTripId = useTripStore((state) => state.selectedTripId);
  const setSelectedTripId = useTripStore((state) => state.setSelectedTripId);

  const { data: trips, isLoading } = useTripsQuery();
  const { data: vehicles } = useVehiclesQuery();
  const { data: drivers } = useDriversQuery();

  const getVehicleDriverText = (vehicleId: string, driverId: string) => {
    const v = vehicles?.find((x) => x.id === vehicleId);
    const d = drivers?.find((x) => x.id === driverId);
    
    if (v && d) {
      return `${v.name} / ${d.name}`.toUpperCase();
    }
    if (v) {
      return `${v.name} / UNASSIGNED`.toUpperCase();
    }
    return "UNASSIGNED";
  };

  const getSubtext = (status: string) => {
    switch (status) {
      case "Draft":
        return "Awaiting dispatch";
      case "Dispatched":
        return "In transit";
      case "Cancelled":
        return "Cancelled";
      case "Completed":
        return "Completed";
      default:
        return "Ready";
    }
  };

  return (
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Live Board
        </h2>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          Loading live trips...
        </div>
      ) : (
        <div className="space-y-4">
          {trips?.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No trips registered. Use the panel on the left to create one.
            </div>
          ) : (
            trips?.map((t) => {
              const isSelected = selectedTripId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTripId(isSelected ? null : t.id)}
                  className={`p-4 border rounded-md cursor-pointer transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                    isSelected
                      ? "bg-muted/60 border-amber-600/80 shadow-md"
                      : "bg-muted/20 border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                        {t.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {getVehicleDriverText(t.vehicleId, t.driverId)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {t.source} &rarr; {t.destination}
                    </p>
                  </div>

                  <div className="flex items-center md:flex-col md:items-end justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        t.status === "Dispatched"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40"
                          : t.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                          : t.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {getSubtext(t.status)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <p className="border-t border-border pt-4 text-center text-xs font-medium text-muted-foreground">
        On Complete: odometer &rarr; fuel log &rarr; expenses &rarr; Vehicle & Driver Available
      </p>
    </div>
  );
}
