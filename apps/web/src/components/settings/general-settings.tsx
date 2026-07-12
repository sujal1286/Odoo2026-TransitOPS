import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GeneralSettings() {
  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 space-y-6">
      <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
        General
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="depot-name" className="text-[11px] text-zinc-400">DEPOT NAME</Label>
          <Input
            id="depot-name"
            readOnly
            defaultValue="TransitOps Central Depot"
            className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="currency" className="text-[11px] text-zinc-400">CURRENCY</Label>
          <Input
            id="currency"
            readOnly
            defaultValue="INR (₹)"
            className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="distance-unit" className="text-[11px] text-zinc-400">DISTANCE UNIT</Label>
          <Input
            id="distance-unit"
            readOnly
            defaultValue="Kilometers"
            className="bg-zinc-900 border-zinc-800 text-zinc-200 text-sm focus-visible:ring-amber-700/50"
          />
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-4 text-[10px] text-zinc-600 font-medium italic">
        Settings are read-only in the hackathon demo. Contact the system administrator for changes.
      </div>
    </div>
  );
}
