import { useDriverStore } from "@/store/useDriverStore";
import type { Driver } from "@/queries/drivers";

interface DriverTableProps {
  drivers: Driver[];
}

export default function DriverTable({ drivers }: DriverTableProps) {
  const selectedDriverId = useDriverStore((state) => state.selectedDriverId);
  const setSelectedDriverId = useDriverStore((state) => state.setSelectedDriverId);

  const checkLicenseExpiry = (expiryDateStr: string) => {
    try {
      const expiry = new Date(expiryDateStr);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const dateFormatted = `${String(expiry.getMonth() + 1).padStart(2, "0")}/${expiry.getFullYear()}`;

      if (diffDays <= 0) {
        return { text: `${dateFormatted} EXPIRED`, isExpired: true };
      }
      if (diffDays < 30) {
        return { text: `${dateFormatted} EXPIRING`, isExpired: true };
      }
      return { text: dateFormatted, isExpired: false };
    } catch {
      return { text: expiryDateStr, isExpired: false };
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-border/70 bg-card/85 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-4 px-6">Driver</th>
              <th className="py-4 px-6">License No.</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Expiry</th>
              <th className="py-4 px-6">Contact</th>
              <th className="py-4 px-6">Trip Compl.</th>
              <th className="py-4 px-6">Safety</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 text-sm">
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  No drivers found.
                </td>
              </tr>
            ) : (
              drivers.map((d) => {
                const { text: expiryText, isExpired } = checkLicenseExpiry(d.licenseExpiryDate);
                const isSelected = selectedDriverId === d.id;
                
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDriverId(isSelected ? null : d.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                          ? "bg-muted/60 border-l-4 border-amber-600/80"
                          : "text-foreground hover:bg-muted/40"
                    }`}
                  >
                      <td className="py-4 px-6 font-semibold text-foreground">{d.name}</td>
                      <td className="py-4 px-6 font-medium text-muted-foreground">{d.licenseNumber}</td>
                      <td className="py-4 px-6 text-muted-foreground">{d.licenseCategory}</td>
                      <td className={`py-4 px-6 font-medium ${isExpired ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                      {expiryText}
                    </td>
                      <td className="py-4 px-6 text-muted-foreground">{d.contactNumber}</td>
                      <td className="py-4 px-6 font-semibold text-foreground">96%</td>
                    <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/20">
                        {d.safetyScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          d.status === "Available"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                            : d.status === "On Trip"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40"
                            : d.status === "Off Duty"
                              ? "bg-muted text-muted-foreground border-border"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
