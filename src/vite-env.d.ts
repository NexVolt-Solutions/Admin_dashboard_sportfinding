/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_LANDING_LOGIN_URL: string;
  /** IANA zone for match schedule display, e.g. Asia/Karachi. Use "browser" for OS local time. */
  readonly VITE_MATCH_DISPLAY_TIMEZONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
