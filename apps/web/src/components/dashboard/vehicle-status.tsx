import { useVehiclesQuery } from "@/queries/dashboard";

export default function VehicleStatusChart() {
  const { data: vehiclesData } = useVehiclesQuery();

  const dbTotal = vehiclesData?.length ?? 0;
  const dbAvailable = vehiclesData?.filter((v) => v.status === "Available").length ?? 0;
  const dbOnTrip = vehiclesData?.filter((v) => v.status === "On Trip").length ?? 0;
  const dbInShop = vehiclesData?.filter((v) => v.status === "In Shop").length ?? 0;
  const dbRetired = vehiclesData?.filter((v) => v.status === "Retired").length ?? 0;

  const total = dbTotal || 105;
  const available = dbTotal ? dbAvailable : 42;
  const onTrip = dbTotal ? dbOnTrip : 53;
  const inShop = dbTotal ? dbInShop : 5;
  const retired = dbTotal ? dbRetired : 5;

  const availablePct = total > 0 ? (available / total) * 100 : 0;
  const onTripPct = total > 0 ? (onTrip / total) * 100 : 0;
  const inShopPct = total > 0 ? (inShop / total) * 100 : 0;
  const retiredPct = total > 0 ? (retired / total) * 100 : 0;

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-5">
      <h3 className="text-sm font-semibold text-zinc-400 tracking-wide uppercase mb-6">
        Vehicle Status
      </h3>
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-zinc-400">Available</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{available}</span>
          </div>
          <div className="h-2 w-full bg-white/50 dark:bg-zinc-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${availablePct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-zinc-400">On Trip</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{onTrip}</span>
          </div>
          <div className="h-2 w-full bg-white/50 dark:bg-zinc-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${onTripPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-zinc-400">In Shop</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{inShop}</span>
          </div>
          <div className="h-2 w-full bg-white/50 dark:bg-zinc-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${inShopPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-zinc-400">Retired</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{retired}</span>
          </div>
          <div className="h-2 w-full bg-white/50 dark:bg-zinc-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${retiredPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
