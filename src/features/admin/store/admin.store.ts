import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Matches API response: { id, email, role }
type Admin = {
  id: number;
  email: string;
  role: string;
};

type AdminAuthState = {
  admin: Admin | null;
  adminToken: string | null;
  setAdmin: (admin: Admin, token: string) => void;
  logoutAdmin: () => void;
};

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      adminToken: null,

      setAdmin: (admin, token) => {
        // ✅ Save cookie for middleware protection
        if (typeof document !== "undefined") {
          document.cookie = `adminToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
        set({ admin, adminToken: token });
      },

      logoutAdmin: () => {
        if (typeof document !== "undefined") {
          document.cookie = "adminToken=; path=/; max-age=0";
        }
        set({ admin: null, adminToken: null });
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        admin: state.admin,
        adminToken: state.adminToken,
      }),
    }
  )
);