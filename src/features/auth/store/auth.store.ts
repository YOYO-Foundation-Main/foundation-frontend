import { create } from "zustand";

type AuthState = {
  user: any;
  token: string | null;
  setUser: (user: any, token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,          // ✅ NO localStorage here
  token: null,

  // ✅ SET USER
  setUser: (user, token) => {
    try {
      console.log("🧠 SET USER:", user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({ user, token });
    } catch (err) {
      console.error("❌ setUser error:", err);
    }
  },

  // ✅ LOGOUT
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // ✅ SAFE HYDRATE
  hydrate: () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user && token) {
        set({
          user: JSON.parse(user),
          token,
        });
      }
    } catch (err) {
      console.error("❌ Invalid localStorage, clearing...");

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      set({ user: null, token: null });
    }
  },
}));