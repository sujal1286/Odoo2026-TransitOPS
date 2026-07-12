import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

export interface CreateVehicleInput {
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  region: string;
  status?: string;
}

export function useVehiclesQuery(filters?: {
  status?: string;
  type?: string;
  region?: string;
  search?: string;
}) {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles", filters],
    queryFn: async () => {
      const res = await api.get("/vehicles", { params: filters });
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVehicleInput) => {
      const res = await api.post("/vehicles", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
    },
  });
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateVehicleInput> }) => {
      const res = await api.patch(`/vehicles/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
    },
  });
}
