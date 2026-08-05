import { create } from "zustand";
import { FileFilters, DEFAULT_FILTERS } from "@/app/files/filterParams";

interface NavState {
  filters: FileFilters;
  setFilters: (filters: FileFilters) => void;
}

export const useNavStore = create<NavState>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (filters) => set({ filters }),
}));
