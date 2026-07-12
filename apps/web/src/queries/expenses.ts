import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Vehicle } from "./vehicles";
import type { Trip } from "./trips";

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  tripId?: string;
  trip?: Trip;
  liters: number;
  cost: number;
  date: string;
}

export interface CreateFuelLogInput {
  vehicleId: string;
  tripId?: string;
  liters: number;
  cost: number;
  date?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  tripId?: string;
  trip?: Trip;
  amount: number;
  category: "Tolls" | "Food" | "Maintenance" | "Fuel" | "Other";
  description?: string;
  date: string;
}

export interface CreateExpenseInput {
  vehicleId: string;
  tripId?: string;
  amount: number;
  category: "Tolls" | "Food" | "Maintenance" | "Fuel" | "Other";
  description?: string;
  date?: string;
}

export function useFuelLogsQuery() {
  return useQuery<FuelLog[]>({
    queryKey: ["fuel-logs"],
    queryFn: async () => {
      const res = await api.get("/fuel-logs");
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useCreateFuelLogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateFuelLogInput) => {
      const res = await api.post("/fuel-logs", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-logs"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useExpensesQuery() {
  return useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await api.get("/expenses");
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateExpenseInput) => {
      const res = await api.post("/expenses", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "kpis"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
