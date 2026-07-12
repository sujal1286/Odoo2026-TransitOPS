import { useDashboardStore } from "@/store/useDashboardStore";

const mockTrips = [
  { id: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", eta: "45 min", type: "Van", region: "North" },
  { id: "TR002", vehicle: "TRX-12", driver: "John", status: "Completed", eta: "—", type: "Semi Truck", region: "South" },
  { id: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", eta: "10 min", type: "Box Truck", region: "West" },
  { id: "TR004", vehicle: "—", driver: "—", status: "Draft", eta: "Awaiting vehicle", type: "Flatbed", region: "East" },
];

export default function RecentTrips() {
  const filters = useDashboardStore();

  const filteredTrips = mockTrips.filter((trip) => {
    if (filters.vehicleType !== "All" && trip.type !== filters.vehicleType) return false;
    if (filters.status !== "All" && trip.status !== filters.status) return false;
    if (filters.region !== "All" && trip.region !== filters.region) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const matchVehicle = trip.vehicle.toLowerCase().includes(s);
      const matchDriver = trip.driver.toLowerCase().includes(s);
      const matchId = trip.id.toLowerCase().includes(s);
      if (!matchVehicle && !matchDriver && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 tracking-wide uppercase mb-4">
          Recent Trips
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-bold text-zinc-500 tracking-wider">
                <th className="pb-3 pr-4">TRIP</th>
                <th className="pb-3 px-4">VEHICLE</th>
                <th className="pb-3 px-4">DRIVER</th>
                <th className="pb-3 px-4">STATUS</th>
                <th className="pb-3 pl-4">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-sm">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-600">
                    No recent trips match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((t) => (
                  <tr key={t.id} className="text-zinc-300">
                    <td className="py-3.5 pr-4 font-semibold text-zinc-200">{t.id}</td>
                    <td className="py-3.5 px-4 font-medium">{t.vehicle}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{t.driver}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          t.status === "On Trip"
                            ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                            : t.status === "Completed"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                            : t.status === "Dispatched"
                            ? "bg-cyan-950/40 text-cyan-400 border-cyan-800/40"
                            : "bg-zinc-900/60 text-zinc-400 border-zinc-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-zinc-400 font-medium">{t.eta}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
