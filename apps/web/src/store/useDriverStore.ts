import { create } from "zustand";

interface DriverStore {
  selectedDriverId: string | null;
  search: string;
  status: string;
  available: boolean;
  setSelectedDriverId: (id: string | null) => void;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setAvailable: (available: boolean) => void;
  resetStore: () => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  selectedDriverId: null,
  search: "",
  status: "All",
  available: false,
  setSelectedDriverId: (selectedDriverId) => set({ selectedDriverId }),
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setAvailable: (available) => set({ available }),
  resetStore: () => set({ selectedDriverId: null, search: "", status: "All", available: false }),
}));
