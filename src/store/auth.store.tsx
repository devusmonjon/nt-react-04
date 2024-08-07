import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  refreshToken: string;
  setRefreshToken: (refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  accessToken: "",
  setAccessToken: (accessToken) => set({ accessToken }),
  refreshToken: "",
  setRefreshToken: (refreshToken) => set({ refreshToken }),
}));

export default useAuthStore;
