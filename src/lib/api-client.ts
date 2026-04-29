import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const shouldLogApi = import.meta.env.DEV;

export const ACCESS_TOKEN_KEY = "admin_token";
export const REFRESH_TOKEN_KEY = "admin_refresh_token";
export const DEV_BYPASS_TOKEN = "dev-bypass-token";

type RequestLogConfig = {
  baseURL?: string;
  url?: string;
  method?: string;
  params?: unknown;
  data?: unknown;
  headers?: unknown;
};

function redactValue(value: unknown): unknown {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (
      lower.includes("bearer ") ||
      lower.includes("token") ||
      lower.includes("password")
    ) {
      return "[REDACTED]";
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        const normalizedKey = key.toLowerCase();
        if (
          normalizedKey.includes("authorization") ||
          normalizedKey.includes("token") ||
          normalizedKey.includes("password") ||
          normalizedKey.includes("secret")
        ) {
          return [key, "[REDACTED]"];
        }

        return [key, redactValue(nestedValue)];
      })
    );
  }

  return value;
}

function getRequestLabel(config: Pick<RequestLogConfig, "method" | "baseURL" | "url">) {
  const method = (config.method ?? "GET").toUpperCase();
  const url = `${config.baseURL ?? ""}${config.url ?? ""}`;
  return `[API] ${method} ${url}`;
}

export function logApiRequest(config: RequestLogConfig) {
  if (!shouldLogApi) return;
  const label = getRequestLabel(config);
  console.groupCollapsed(`${label} request`);
  console.log("method:", (config.method ?? "GET").toUpperCase());
  console.log("url:", `${config.baseURL ?? ""}${config.url ?? ""}`);
  if (config.params !== undefined) {
    console.log("params:", redactValue(config.params));
  }
  if (config.data !== undefined) {
    console.log("body:", redactValue(config.data));
  }
  if (config.headers !== undefined) {
    console.log("headers:", redactValue(config.headers));
  }
  console.groupEnd();
}

export function logApiResponse(config: RequestLogConfig, status: number, data: unknown) {
  if (!shouldLogApi) return;
  const label = getRequestLabel(config);
  console.groupCollapsed(`${label} response`);
  console.log("status:", status);
  console.log("data:", redactValue(data));
  console.groupEnd();
}

export function logApiError(error: AxiosError) {
  if (!shouldLogApi) return;
  const config = error.config;
  const label = getRequestLabel({
    method: config?.method,
    baseURL: config?.baseURL,
    url: config?.url,
  });
  console.groupCollapsed(`${label} error`);
  console.log("status:", error.response?.status ?? "NETWORK_ERROR");
  if (config?.params !== undefined) {
    console.log("params:", redactValue(config.params));
  }
  if (config?.data !== undefined) {
    console.log("body:", redactValue(config.data));
  }
  console.error("data:", redactValue(error.response?.data));
  console.groupEnd();
}

function isDevBypass() {
  return (
    import.meta.env.DEV &&
    localStorage.getItem(ACCESS_TOKEN_KEY) === DEV_BYPASS_TOKEN
  );
}

const apiClient = axios.create({ baseURL, timeout: 30_000 });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  logApiRequest(config);
  return config;
});

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  refreshInFlight = (async () => {
    try {
      const refreshUrl = `${baseURL}/api/v1/auth/refresh`;
      const refreshPayload = { refresh_token: refreshToken };
      const refreshConfig = {
        headers: { accept: "application/json", "Content-Type": "application/json" },
      };

      logApiRequest({
        method: "post",
        url: refreshUrl,
        data: refreshPayload,
        headers: refreshConfig.headers,
      });

      const { data, status } = await axios.post(
        refreshUrl,
        refreshPayload,
        refreshConfig
      );
      logApiResponse({ method: "post", url: refreshUrl }, status, data);
      const newAccess = data?.access_token as string | undefined;
      const newRefresh = data?.refresh_token as string | undefined;
      if (newAccess) localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
      if (newRefresh) localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
      return newAccess ?? null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logApiError(error);
      }
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

function shouldTryRefresh(error: AxiosError, isAuthCall: boolean) {
  if (isAuthCall) return false;

  const status = error.response?.status;
  if (status === 401 || status === 403) return true;

  // Some backends may incorrectly return 404 for expired auth.
  if (status === 404) {
    const detail = String((error.response?.data as { detail?: unknown } | undefined)?.detail ?? "")
      .toLowerCase();
    const hasBearerChallenge = Boolean(error.response?.headers?.["www-authenticate"]);
    return (
      detail.includes("token") ||
      detail.includes("expired") ||
      detail.includes("unauthorized") ||
      hasBearerChallenge
    );
  }

  return false;
}

apiClient.interceptors.response.use(
  (response) => {
    logApiResponse(response.config, response.status, response.data);
    return response;
  },
  async (error: AxiosError) => {
    logApiError(error);
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/refresh");
    const shouldRefresh = shouldTryRefresh(error, isAuthCall);

    if (shouldRefresh && isDevBypass()) {
      // Dev-only: let the UI shell stay rendered on auth failures so the
      // dashboard can be previewed without a real backend session.
      return Promise.reject(error);
    }

    if (shouldRefresh && original && !original._retry) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiClient.request(original);
      }
      bounceToLogin();
    } else if (shouldRefresh) {
      bounceToLogin();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
