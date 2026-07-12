import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { useAnalyticsQuery } from "@/queries/analytics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  cost: {
    label: "Operational Cost",
    color: "oklch(0.65 0.2 25)",
  },
} satisfies ChartConfig;

export default function CostliestVehiclesChart() {
  const { data: analytics, isLoading } = useAnalyticsQuery();

  const chartData = useMemo(() => {
    if (!analytics) return [];

    return analytics
      .filter((v) => v.totalOperationalCost > 0)
      .sort((a, b) => b.totalOperationalCost - a.totalOperationalCost)
      .slice(0, 5)
      .map((v, idx) => {
        const colors = [
          "oklch(0.65 0.2 25)",
          "oklch(0.7 0.18 60)",
          "oklch(0.6 0.15 250)",
          "oklch(0.65 0.16 150)",
          "oklch(0.55 0.12 300)",
        ];
        return {
          name: v.registrationNumber || v.name,
          cost: v.totalOperationalCost,
          fill: colors[idx % colors.length],
        };
      });
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6 h-80 animate-pulse" />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6">
        <h3 className="text-sm font-bold text-zinc-400 tracking-wide uppercase mb-4">
          Top Costliest Vehicles
        </h3>
        <div className="flex items-center justify-center h-56 text-zinc-600 text-sm">
          No cost data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-md p-6">
      <h3 className="text-sm font-bold text-zinc-400 tracking-wide uppercase mb-4">
        Top Costliest Vehicles
      </h3>
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart data={chartData} layout="vertical" accessibilityLayer>
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={80}
            tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 600 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
              />
            }
          />
          <Bar
            dataKey="cost"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
