import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

import { useAnalyticsQuery } from "@/queries/analytics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "oklch(0.65 0.15 250)",
  },
} satisfies ChartConfig;

export default function RevenueBarChart() {
  const { data: analytics, isLoading } = useAnalyticsQuery();

  const chartData = useMemo(() => {
    if (!analytics) return [];

    return analytics
      .filter((v) => v.totalRevenue > 0)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((v) => ({
        name: v.registrationNumber || v.name,
        revenue: v.totalRevenue,
      }));
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-6 h-80 animate-pulse" />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-[#111113] border border-zinc-800 rounded-md p-6">
        <h3 className="text-sm font-bold text-zinc-400 tracking-wide uppercase mb-4">
          Revenue by Vehicle
        </h3>
        <div className="flex items-center justify-center h-56 text-zinc-600 text-sm">
          No revenue data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-md p-6">
      <h3 className="text-sm font-bold text-zinc-400 tracking-wide uppercase mb-4">
        Revenue by Vehicle
      </h3>
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
              />
            }
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
