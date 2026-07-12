import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVehiclesQuery } from "@/queries/dashboard";

export default function DashboardFilters() {
  const { data: session } = authClient.useSession();
  const filters = useDashboardStore();
  const { data: vehiclesData } = useVehiclesQuery();

  const uniqueTypes = vehiclesData
    ? Array.from(new Set(vehiclesData.map((v) => v.type)))
    : ["Semi Truck", "Van", "Box Truck", "Flatbed"];

  const uniqueRegions = vehiclesData
    ? Array.from(new Set(vehiclesData.map((v) => v.region)))
    : ["North", "South", "East", "West"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            className="w-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-md pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-md">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold capitalize">
              {session?.user.role?.toLowerCase() || "User"}
            </span>
          </div>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {session?.user.name}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <select
              value={filters.vehicleType}
              onChange={(e) => filters.setVehicleType(e.target.value)}
              className="appearance-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 text-xs text-zinc-700 dark:text-zinc-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-medium cursor-pointer"
            >
              <option value="All">Vehicle Type: All</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => filters.setStatus(e.target.value)}
              className="appearance-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 text-xs text-zinc-700 dark:text-zinc-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-medium cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => filters.setRegion(e.target.value)}
              className="appearance-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 text-xs text-zinc-700 dark:text-zinc-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-medium cursor-pointer"
            >
              <option value="All">Region: All</option>
              {uniqueRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
