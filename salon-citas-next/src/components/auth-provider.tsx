// src/components/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContext {
  user: { email: string } | null | undefined;
  login: (email: string) => void;
  logout: () => void;
}

const ctx = createContext<AuthContext>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null | undefined>(undefined);

  // Al montar, leemos localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  const login = (email: string) => {
    const u = { email };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return <ctx.Provider value={{ user, login, logout }}>{children}</ctx.Provider>;
};

export const useAuth = () => useContext(ctx);
