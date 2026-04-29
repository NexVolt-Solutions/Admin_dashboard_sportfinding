import { useState, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  logApiError,
  logApiRequest,
  logApiResponse,
} from "@/lib/api-client";
import { AuthContext } from "@/context/auth-context";

const baseURL = import.meta.env.VITE_API_URL;

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
        const url = `${baseURL}/api/v1/auth/logout`;
        const payload = { refresh_token: refreshToken };
        const headers = {
          accept: "application/json",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        };

        logApiRequest({ method: "post", url, data: payload, headers });

        const response = await axios.post(url, payload, { headers });
        logApiResponse({ method: "post", url }, response.status, response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          logApiError(error);
        }
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
