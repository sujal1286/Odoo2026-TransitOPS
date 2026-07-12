import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Kpis {
  activeVehicles: number;
  availableVehicles: number;
  maintenanceVehicles: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
  region: string;
}

export function useDashboardKpisQuery() {
  return useQuery<Kpis>({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      const res = await api.get("/dashboard/kpis");
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useVehiclesQuery() {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await api.get("/vehicles");
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}
