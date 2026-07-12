import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GeneralSettings() {
  return (
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
        General
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="depot-name" className="text-[11px] font-medium text-muted-foreground">DEPOT NAME</Label>
          <Input
            id="depot-name"
            readOnly
            defaultValue="TransitOps Central Depot"
            className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="currency" className="text-[11px] font-medium text-muted-foreground">CURRENCY</Label>
          <Input
            id="currency"
            readOnly
            defaultValue="INR (₹)"
            className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="distance-unit" className="text-[11px] font-medium text-muted-foreground">DISTANCE UNIT</Label>
          <Input
            id="distance-unit"
            readOnly
            defaultValue="Kilometers"
            className="border-input bg-background text-foreground text-sm focus-visible:ring-ring/40"
          />
        </div>
      </div>

      <div className="border-t border-border pt-4 text-[10px] font-medium italic text-muted-foreground">
        Settings are read-only in the hackathon demo. Contact the system administrator for changes.
      </div>
    </div>
  );
}
