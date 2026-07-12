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
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background/80 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-1.5 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-semibold capitalize text-muted-foreground">
              {session?.user.role?.toLowerCase() || "User"}
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {session?.user.name}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <select
              value={filters.vehicleType}
              onChange={(e) => filters.setVehicleType(e.target.value)}
              className="appearance-none rounded-md border border-border bg-background/80 pl-3 pr-8 py-2 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option value="All">Vehicle Type: All</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => filters.setStatus(e.target.value)}
              className="appearance-none rounded-md border border-border bg-background/80 pl-3 pr-8 py-2 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => filters.setRegion(e.target.value)}
              className="appearance-none rounded-md border border-border bg-background/80 pl-3 pr-8 py-2 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option value="All">Region: All</option>
              {uniqueRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
