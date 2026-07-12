import { create } from "zustand";

interface VehicleFilters {
  type: string;
  status: string;
  search: string;
  setType: (type: string) => void;
  setStatus: (status: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

export const useVehicleStore = create<VehicleFilters>((set) => ({
  type: "All",
  status: "All",
  search: "",
  setType: (type) => set({ type }),
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ type: "All", status: "All", search: "" }),
}));
