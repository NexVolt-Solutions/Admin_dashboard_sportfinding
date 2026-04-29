const DEFAULT_LANDING_LOGIN_URL = import.meta.env.DEV
  ? "http://localhost:3000/login"
  : "https://sportfinding.com/login/";

export const LANDING_LOGIN_URL =
  (import.meta.env.VITE_LANDING_LOGIN_URL as string | undefined) ??
  DEFAULT_LANDING_LOGIN_URL;

export function redirectToLandingLogin() {
  window.location.assign(LANDING_LOGIN_URL);
}