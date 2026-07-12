import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Vehicle } from "./vehicles";

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  description: string;
  cost: number;
  startDate: string;
  endDate?: string;
  status: string;
}

export interface CreateMaintenanceInput {
  vehicleId: string;
  description: string;
  cost: number;
  startDate?: string;
}

export interface CloseMaintenanceInput {
  endDate?: string;
}

export function useMaintenanceLogsQuery() {
  return useQuery<MaintenanceLog[]>({
    queryKey: ["maintenance"],
    queryFn: async () => {
      const res = await api.get("/maintenance");
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useInitiateMaintenanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMaintenanceInput) => {
      const res = await api.post("/maintenance", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
    },
  });
}

export function useCloseMaintenanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data?: CloseMaintenanceInput }) => {
      const res = await api.patch(`/maintenance/${id}/close`, data || {});
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
    },
  });
}
