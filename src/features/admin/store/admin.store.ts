import { create } from "zustand";

type AdminState = {
  admin: any;
  token: string | null;
  setAdmin: (admin: any, token: string) => void;
  logout: () => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  token: null,

  setAdmin: (admin, token) => {
    set({ admin, token });
  },

  logout: () => {
    document.cookie = "adminToken=; path=/; max-age=0";
    set({ admin: null, token: null });
  },
}));