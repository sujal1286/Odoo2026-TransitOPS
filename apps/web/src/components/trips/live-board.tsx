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
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 space-y-6">
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          Live Board
        </h2>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          Loading live trips...
        </div>
      ) : (
        <div className="space-y-4">
          {trips?.length === 0 ? (
            <div className="py-12 text-center text-zinc-600 text-sm">
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
                      ? "bg-zinc-800/40 border-amber-600/80 shadow-md"
                      : "bg-[#141416]/50 border-zinc-800/60 hover:bg-zinc-900/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                        {t.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-zinc-500">•</span>
                      <span className="text-xs font-semibold text-zinc-400">
                        {getVehicleDriverText(t.vehicleId, t.driverId)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                      {t.source} &rarr; {t.destination}
                    </p>
                  </div>

                  <div className="flex items-center md:flex-col md:items-end justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        t.status === "Dispatched"
                          ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                          : t.status === "Completed"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                          : t.status === "Cancelled"
                          ? "bg-rose-950/40 text-rose-400 border-rose-800/40"
                          : "bg-zinc-900/60 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium capitalize">
                      {getSubtext(t.status)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium border-t border-zinc-900 pt-4 text-center">
        On Complete: odometer &rarr; fuel log &rarr; expenses &rarr; Vehicle & Driver Available
      </p>
    </div>
  );
}
