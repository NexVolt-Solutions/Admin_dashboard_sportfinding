import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://api.sportfinding.com";

export const ACCESS_TOKEN_KEY = "admin_token";
export const REFRESH_TOKEN_KEY = "admin_refresh_token";

const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  refreshInFlight = (async () => {
    try {
      const { data } = await axios.post(
        `${baseURL}/api/v1/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { accept: "application/json", "Content-Type": "application/json" } }
      );
      const newAccess = data?.access_token as string | undefined;
      const newRefresh = data?.refresh_token as string | undefined;
      if (newAccess) localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
      if (newRefresh) localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
      return newAccess ?? null;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function bounceToLogin() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return apiClient.request(original);
      }
      bounceToLogin();
    } else if ((status === 401 || status === 403) && !isAuthCall) {
      bounceToLogin();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
