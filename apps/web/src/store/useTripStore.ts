import { create } from "zustand";

interface TripStore {
  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  selectedTripId: null,
  setSelectedTripId: (selectedTripId) => set({ selectedTripId }),
  clearSelection: () => set({ selectedTripId: null }),
}));
