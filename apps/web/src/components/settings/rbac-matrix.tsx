export default function RbacMatrix() {
  const roles = [
    {
      role: "Fleet Manager",
      fleet: "✓",
      drivers: "✓",
      trips: "—",
      fuelExp: "—",
      analytics: "✓",
    },
    {
      role: "Dispatcher",
      fleet: "View",
      drivers: "—",
      trips: "✓",
      fuelExp: "—",
      analytics: "—",
    },
    {
      role: "Safety Officer",
      fleet: "—",
      drivers: "✓",
      trips: "View",
      fuelExp: "—",
      analytics: "—",
    },
    {
      role: "Financial Analyst",
      fleet: "View",
      drivers: "—",
      trips: "—",
      fuelExp: "✓",
      analytics: "✓",
    },
    {
      role: "Driver",
      fleet: "—",
      drivers: "—",
      trips: "View",
      fuelExp: "Log",
      analytics: "—",
    },
  ];

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 space-y-4">
      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
        Role-Based Access (RBAC)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              <th className="pb-3 pr-4">ROLE</th>
              <th className="pb-3 px-4 text-center">FLEET</th>
              <th className="pb-3 px-4 text-center">DRIVERS</th>
              <th className="pb-3 px-4 text-center">TRIPS</th>
              <th className="pb-3 px-4 text-center">FUEL/EXP</th>
              <th className="pb-3 pl-4 text-center">ANALYTICS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {roles.map((row) => (
              <tr key={row.role} className="text-zinc-300">
                <td className="py-3 pr-4 font-semibold text-zinc-200">{row.role}</td>
                <td className="py-3 px-4 text-center">
                  <AccessBadge value={row.fleet} />
                </td>
                <td className="py-3 px-4 text-center">
                  <AccessBadge value={row.drivers} />
                </td>
                <td className="py-3 px-4 text-center">
                  <AccessBadge value={row.trips} />
                </td>
                <td className="py-3 px-4 text-center">
                  <AccessBadge value={row.fuelExp} />
                </td>
                <td className="py-3 pl-4 text-center">
                  <AccessBadge value={row.analytics} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccessBadge({ value }: { value: string }) {
  if (value === "✓") {
    return <span className="text-emerald-400 font-bold text-sm">{value}</span>;
  }
  if (value === "—") {
    return <span className="text-zinc-600 font-medium">{value}</span>;
  }
  return (
    <span className="text-amber-400 text-xs font-semibold lowercase">{value}</span>
  );
}
