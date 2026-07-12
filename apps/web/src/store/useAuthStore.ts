import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role =
  | "Fleet Manager"
  | "Dispatcher"
  | "Safety Officer"
  | "Financial Analyst"
  | "Driver";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start in loading state until session is checked
      
      setUser: (user) => 
        set({ user, isAuthenticated: !!user, isLoading: false }),
        
      setLoading: (isLoading) => set({ isLoading }),
      
      logout: () => 
        set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
