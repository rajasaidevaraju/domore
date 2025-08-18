import { create } from "zustand";

interface NavState {
  page: number;
  performerId: number | null;
  setNavContext: (page: number, performerId: number | null) => void;
}

export const useNavStore = create<NavState>((set) => ({
  page: 1,
  performerId: null,
  setNavContext: (page, performerId) => set({ page, performerId }),
}));
