export const LANDING_LOGIN_URL =
  (import.meta.env.VITE_LANDING_LOGIN_URL as string | undefined) ??
  (import.meta.env.DEV
    ? "http://localhost:3000/login"
    : "https://app.sportfinding.com/login");
