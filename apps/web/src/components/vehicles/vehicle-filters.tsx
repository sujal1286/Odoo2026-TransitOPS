import { Search, ChevronDown, SlidersHorizontal, Plus } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { Button } from "@/components/ui/button";

interface VehicleFiltersProps {
  onAddClick: () => void;
  uniqueTypes: string[];
}

export default function VehicleFilters({ onAddClick, uniqueTypes }: VehicleFiltersProps) {
  const filters = useVehicleStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search reg. no..."
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
              className="w-full bg-[#111113] border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => filters.setType(e.target.value)}
              className="appearance-none bg-[#111113] border border-zinc-800 text-xs text-zinc-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-700 font-medium cursor-pointer"
            >
              <option value="All">Type: All</option>
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
              className="appearance-none bg-[#111113] border border-zinc-800 text-xs text-zinc-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-700 font-medium cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <Button
          onClick={onAddClick}
          className="bg-amber-700 hover:bg-amber-600 text-white border-amber-800 shadow-sm transition-colors text-xs font-semibold px-4 py-2 flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </Button>
      </div>
    </div>
  );
}
