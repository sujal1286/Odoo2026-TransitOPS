import { toast } from "sonner";
import { useDriverStore } from "@/store/useDriverStore";
import { useDriversQuery, useUpdateDriverMutation } from "@/queries/drivers";

export default function StatusToggler() {
  const selectedDriverId = useDriverStore((state) => state.selectedDriverId);
  const { data: drivers } = useDriversQuery();
  const updateMutation = useUpdateDriverMutation();

  const driver = drivers?.find((d) => d.id === selectedDriverId);

  const handleToggle = async (status: string) => {
    if (!driver) return;
    try {
      await updateMutation.mutateAsync({
        id: driver.id,
        data: { status },
      });
      toast.success(`Driver status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update status");
    }
  };

  if (!driver) {
    return (
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-5 text-center text-zinc-500 text-sm">
        Select a driver from the table above to toggle operational status.
      </div>
    );
  }

  const statuses = [
    { label: "Available", color: "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/30 text-white", inactive: "bg-transparent text-emerald-400 border-emerald-800/30 hover:bg-emerald-950/20" },
    { label: "On Trip", color: "bg-blue-600 hover:bg-blue-500 border-blue-500/30 text-white", inactive: "bg-transparent text-blue-400 border-blue-800/30 hover:bg-blue-950/20" },
    { label: "Off Duty", color: "bg-zinc-700 hover:bg-zinc-600 border-zinc-600/30 text-white", inactive: "bg-transparent text-zinc-400 border-zinc-800 hover:bg-zinc-900/40" },
    { label: "Suspended", color: "bg-amber-600 hover:bg-amber-500 border-amber-500/30 text-white", inactive: "bg-transparent text-amber-400 border-amber-800/30 hover:bg-amber-950/20" },
  ];

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-5 space-y-4">
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
          Toggle Status for {driver.name}
        </h4>
      </div>

      <div className="flex flex-wrap gap-3">
        {statuses.map((s) => {
          const isActive = driver.status === s.label;
          return (
            <button
              key={s.label}
              disabled={updateMutation.isPending}
              onClick={() => handleToggle(s.label)}
              className={`px-4 py-2 rounded text-xs font-semibold border transition-all ${
                isActive ? s.color : s.inactive
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-amber-600 font-semibold pt-2 border-t border-zinc-900">
        Rule: Expired license or Suspended status ➜ blocked from trip assignment
      </p>
    </div>
  );
}
