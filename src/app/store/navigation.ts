import { create } from "zustand";

interface NavState {
  page: number;
  performerId: number | null;
  sortBy:string|undefined
  setNavContext: (page: number, performerId: number | null,sortBy:string|undefined) => void;
}

export const useNavStore = create<NavState>((set) => ({
  page: 1,
  performerId: null,
  sortBy:undefined,
  setNavContext: (page, performerId,sortBy) => set({ page, performerId,sortBy }),
}));
