import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  sessionExpired: boolean;
  setAuth: (isLoggedIn: boolean, username: string | null,token: string | null) => void;
  clearAuth: () => void;
  expireSession: () => void;
  authLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      username: null,
      token: null,
      sessionExpired: false,
      setAuth: (isLoggedIn, username, token) => set({ isLoggedIn, username, token, sessionExpired: false }),
      clearAuth: () => set({ isLoggedIn: false, username: null, token: null, sessionExpired: false }),
      expireSession: () => set({ isLoggedIn: false, token: null, sessionExpired: true }),
      authLoading: true,
      setAuthLoading: (authLoading) => set({ authLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, username: state.username, token: state.token }),
    }
  )
);