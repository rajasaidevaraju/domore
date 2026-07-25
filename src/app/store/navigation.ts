import { create } from "zustand";

interface NavState {
  page: number;
  performerId: number | null;
  sortBy:string|undefined
  unassignedOnly: boolean;
  setNavContext: (page: number, performerId: number | null,sortBy:string|undefined,unassignedOnly:boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  page: 1,
  performerId: null,
  sortBy:undefined,
  unassignedOnly: false,
  setNavContext: (page, performerId,sortBy,unassignedOnly) => set({ page, performerId,sortBy,unassignedOnly }),
}));
