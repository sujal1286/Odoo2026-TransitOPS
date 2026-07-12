import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface VehicleAnalytics {
  vehicleId: string;
  registrationNumber: string;
  name: string;
  type: string;
  acquisitionCost: number;
  totalDistance: number;
  totalRevenue: number;
  totalLiters: number;
  fuelCost: number;
  maintenanceCost: number;
  tollsCost: number;
  fuelEfficiency: number;
  totalOperationalCost: number;
  vehicleRoi: number;
}

export function useAnalyticsQuery() {
  return useQuery<VehicleAnalytics[]>({
    queryKey: ["reports", "analytics"],
    queryFn: async () => {
      const res = await api.get("/reports/analytics");
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });
}
