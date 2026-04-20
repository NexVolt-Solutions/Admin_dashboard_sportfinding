import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/api-client";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const baseURL = import.meta.env.VITE_API_URL || "https://api.sportfinding.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const queryClient = useQueryClient();

  const login = useCallback((accessToken: string, refreshToken?: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setToken(accessToken);
  }, []);

  const logout = useCallback(async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setToken(null);
    queryClient.clear();

    if (refreshToken) {
      try {
        await axios.post(
          `${baseURL}/api/v1/auth/logout`,
          { refresh_token: refreshToken },
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
          }
        );
      } catch {
        // best-effort — local state is already cleared
      }
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
