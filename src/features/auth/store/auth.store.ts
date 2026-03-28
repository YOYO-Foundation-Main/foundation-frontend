import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number | null;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user, token) => {
        set({ user, token });
      },

      logout: () => {
        // ✅ Clear cookie too so middleware knows user is logged out
        if (typeof document !== "undefined") {
          document.cookie = "token=; path=/; max-age=0";
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);