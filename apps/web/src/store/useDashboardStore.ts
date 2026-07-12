import { create } from "zustand";

interface DashboardFilters {
  vehicleType: string;
  status: string;
  region: string;
  search: string;
  setVehicleType: (type: string) => void;
  setStatus: (status: string) => void;
  setRegion: (region: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardFilters>((set) => ({
  vehicleType: "All",
  status: "All",
  region: "All",
  search: "",
  setVehicleType: (vehicleType) => set({ vehicleType }),
  setStatus: (status) => set({ status }),
  setRegion: (region) => set({ region }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ vehicleType: "All", status: "All", region: "All", search: "" }),
}));
