import { Edit2 } from "lucide-react";
import type { Vehicle } from "@/queries/vehicles";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEditClick: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ vehicles, onEditClick }: VehicleTableProps) {
  const formatCapacity = (cap: number) => {
    if (cap >= 1000) {
      return `${cap / 1000} Ton`;
    }
    return `${cap} kg`;
  };

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase bg-[#141416]/50">
              <th className="py-4 px-6">Reg. No. (Unique)</th>
              <th className="py-4 px-6">Name/Model</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6">Capacity</th>
              <th className="py-4 px-6">Odometer</th>
              <th className="py-4 px-6">Acq. Cost</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 text-sm">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-500">
                  No vehicles found in the registry.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/25 transition-colors">
                  <td className="py-4 px-6 font-semibold text-zinc-200">{v.registrationNumber}</td>
                  <td className="py-4 px-6 font-medium">{v.name}</td>
                  <td className="py-4 px-6 text-zinc-400">{v.type}</td>
                  <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300 font-medium">{formatCapacity(v.maxLoadCapacity)}</td>
                  <td className="py-4 px-6 text-zinc-400">{v.odometer.toLocaleString()} km</td>
                  <td className="py-4 px-6 text-zinc-400">₹{v.acquisitionCost.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        v.status === "Available"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                          : v.status === "On Trip"
                          ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                          : v.status === "In Shop"
                          ? "bg-amber-950/40 text-amber-400 border-amber-800/40"
                          : "bg-rose-950/40 text-rose-400 border-rose-800/40"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onEditClick(v)}
                      className="text-zinc-500 hover:text-amber-500 transition-colors p-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-[#141416]/20">
        <p className="text-xs text-amber-600 font-medium">
          Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
        </p>
      </div>
    </div>
  );
}
