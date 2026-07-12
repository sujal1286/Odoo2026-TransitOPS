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
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase bg-[#141416]/50">
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
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 text-sm">
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-500">
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
                        ? "bg-zinc-800/40 border-l-4 border-amber-600/80"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/25"
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold text-zinc-200">{d.name}</td>
                    <td className="py-4 px-6 font-medium text-zinc-400">{d.licenseNumber}</td>
                    <td className="py-4 px-6 text-zinc-400">{d.licenseCategory}</td>
                    <td className={`py-4 px-6 font-medium ${isExpired ? "text-red-500" : "text-zinc-400"}`}>
                      {expiryText}
                    </td>
                    <td className="py-4 px-6 text-zinc-400">{d.contactNumber}</td>
                    <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300 font-semibold">96%</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/20 text-emerald-400 border border-emerald-800/20">
                        {d.safetyScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          d.status === "Available"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                            : d.status === "On Trip"
                            ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                            : d.status === "Off Duty"
                            ? "bg-zinc-900/60 text-zinc-400 border-zinc-800"
                            : "bg-amber-950/40 text-amber-400 border-amber-800/40"
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
