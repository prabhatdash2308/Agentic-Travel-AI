/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { loadUserFromStorage, saveUserToStorage, removeUserFromStorage } from "../utils/auth";
import type { User } from "./AuthContext.types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());

  const signIn = useCallback((email: string, name?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: name ?? email.split("@")[0],
    };
    saveUserToStorage(newUser);
    setUser(newUser);
  }, []);

  const signOut = useCallback(() => {
    removeUserFromStorage();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
