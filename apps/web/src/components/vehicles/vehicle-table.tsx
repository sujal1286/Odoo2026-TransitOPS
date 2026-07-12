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
    <div className="overflow-hidden rounded-md border border-border/70 bg-card/85 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50">
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
          <tbody className="divide-y divide-border/70 text-sm">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  No vehicles found in the registry.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="text-foreground transition-colors hover:bg-muted/40">
                  <td className="py-4 px-6 font-semibold text-foreground">{v.registrationNumber}</td>
                  <td className="py-4 px-6 font-medium text-foreground">{v.name}</td>
                  <td className="py-4 px-6 text-muted-foreground">{v.type}</td>
                  <td className="py-4 px-6 font-medium text-foreground">{formatCapacity(v.maxLoadCapacity)}</td>
                  <td className="py-4 px-6 text-muted-foreground">{v.odometer.toLocaleString()} km</td>
                  <td className="py-4 px-6 text-muted-foreground">₹{v.acquisitionCost.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        v.status === "Available"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                          : v.status === "On Trip"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40"
                          : v.status === "In Shop"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onEditClick(v)}
                      className="p-1 text-muted-foreground transition-colors hover:text-amber-600"
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
      <div className="border-t border-border/70 bg-muted/40 px-6 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
        </p>
      </div>
    </div>
  );
}
