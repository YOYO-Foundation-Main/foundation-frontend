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

      // ✅ Save user + token in Zustand persist (auto saves to localStorage as "auth-storage")
      setUser: (user, token) => {
        console.log("🧠 setUser called:", user, token?.slice(0, 20));

        // Save cookie for middleware
        if (typeof document !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }

        set({ user, token });
      },

      // ✅ On logout — clear everything
      logout: () => {
        console.log("🚪 logout called");

        // Remove cookie
        if (typeof document !== "undefined") {
          document.cookie = "token=; path=/; max-age=0";
        }

        // Remove old standalone token key if it exists
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("token");
        }

        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // ← key in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
