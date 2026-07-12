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
    <div className="bg-card/85 backdrop-blur-md border border-border/70 rounded-md p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
        Role-Based Access (RBAC)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-4">ROLE</th>
              <th className="pb-3 px-4 text-center">FLEET</th>
              <th className="pb-3 px-4 text-center">DRIVERS</th>
              <th className="pb-3 px-4 text-center">TRIPS</th>
              <th className="pb-3 px-4 text-center">FUEL/EXP</th>
              <th className="pb-3 pl-4 text-center">ANALYTICS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {roles.map((row) => (
              <tr key={row.role} className="text-foreground">
                <td className="py-3 pr-4 font-semibold text-foreground">{row.role}</td>
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
    return <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{value}</span>;
  }
  if (value === "—") {
    return <span className="text-muted-foreground font-medium">{value}</span>;
  }
  return (
    <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold lowercase">{value}</span>
  );
}
