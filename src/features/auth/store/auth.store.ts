import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number | null;
  name: string;
  email: string;
  profileImage?: string | null;
};

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   tokenExpiry: number | null;

//   // actions
//   setUser: (user: User, token: string) => void;
type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void; //NEW (important)
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,


      // ✅ Set full user (login / initial load)
      // setUser: (user, token) => {
      //   console.log("setUser:", user);

      //   // Save cookie for middleware
      //   if (typeof document !== "undefined") {
      //     // document.cookie = `token=${token}; 
      //     path =/; max-age=${60 * 60 * 24}`;
      //   }

      //   // set({ user, token });

      //   const expiry = Date.now() + 1000 * 60 * 60 * 24;

      //   set({
      //     user,
      //     token,
      //     tokenExpiry: expiry,
      //   });
      // },
      setUser: (user) => {
        set({
          user,
        });
      },
      // Update only part of user (PROFILE IMAGE FIX)
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : state.user,
        }));
      },


      // logout: () => {
      //   console.log("🚪 logout");

      //   if (typeof document !== "undefined") {
      //     document.cookie = "token=; path=/; max-age=0";
      //   }

      //   if (typeof localStorage !== "undefined") {
      //     localStorage.removeItem("token");
      //   }

      //   set({ user: null, token: null, tokenExpiry: null, });
      // },
      logout: () => {
        set({
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
      // partialize: (state) => ({
      //   user: state.user,
      //   token: state.token,
      //   tokenExpiry: state.tokenExpiry,
      // }),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);