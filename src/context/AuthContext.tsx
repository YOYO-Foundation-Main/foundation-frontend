"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ LOAD TOKEN ON REFRESH
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    console.log("🔄 Checking localStorage:", storedToken);

    if (storedToken) {
      setToken(storedToken);

      // OPTIONAL: decode token or fetch user
      setUser({ email: "Logged User" }); // TEMP
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser({ email: "Logged User" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext missing");
  return context;
};