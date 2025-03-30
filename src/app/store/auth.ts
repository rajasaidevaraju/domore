import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  setAuth: (isLoggedIn: boolean, username: string | null,token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      username: null,
      token: null,
      setAuth: (isLoggedIn, username, token) => set({ isLoggedIn, username, token }),
      clearAuth: () => set({ isLoggedIn: false, username: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);