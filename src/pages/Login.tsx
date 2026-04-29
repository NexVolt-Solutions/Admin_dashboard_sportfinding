import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trophy, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { DEV_BYPASS_TOKEN } from "@/lib/api-client";
import { redirectToLandingLogin } from "@/lib/landing";

const IS_DEV = import.meta.env.DEV;

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [devToken, setDevToken] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    if (!IS_DEV) {
      redirectToLandingLogin();
    }
  }, [isAuthenticated, navigate]);

  const handleDevQuickLogin = () => {
    login(devToken.trim() || DEV_BYPASS_TOKEN, "dev-bypass-refresh");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <Trophy className="h-7 w-7" strokeWidth={2} />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          SportFinding
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Admin Dashboard
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          {!IS_DEV ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Redirecting to sign-in…
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 text-left">
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  Sign in
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  The login form lives on the landing app. Continue there to
                  sign in for real, or use the dev shortcut below.
                </p>
              </div>

              <button
                type="button"
                onClick={redirectToLandingLogin}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 active:translate-y-px"
              >
                Continue to landing login
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="relative my-1 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Dev only
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="dev-token"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Paste an access token (optional)
                </label>
                <input
                  id="dev-token"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={devToken}
                  onChange={(e) => setDevToken(e.target.value)}
                  placeholder="Bearer token from /auth/login"
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-xs outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30"
                />
                <button
                  type="button"
                  onClick={handleDevQuickLogin}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
                >
                  {devToken.trim() ? "Use this token" : "Skip auth (UI only)"}
                </button>
                <p className="text-[11px] text-muted-foreground">
                  Skipping renders the layout but real API calls will 401.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
