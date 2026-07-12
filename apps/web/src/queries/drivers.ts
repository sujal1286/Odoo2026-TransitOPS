import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverInput {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore?: number;
  status?: string;
}

export function useDriversQuery(filters?: {
  status?: string;
  search?: string;
  available?: string;
}) {
  return useQuery<Driver[]>({
    queryKey: ["drivers", filters],
    queryFn: async () => {
      const res = await api.get("/drivers", { params: filters });
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useCreateDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDriverInput) => {
      const res = await api.post("/drivers", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
    },
  });
}

export function useUpdateDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateDriverInput> }) => {
      const res = await api.patch(`/drivers/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
    },
  });
}
