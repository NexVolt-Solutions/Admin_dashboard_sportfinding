import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.sportfinding.com";

function readTokensFromHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return {
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token") ?? undefined,
  };
}

async function verifyAdmin(accessToken: string, signal: AbortSignal): Promise<boolean> {
  const response = await axios.get(`${API_URL}/api/v1/admin/account`, {
    headers: { accept: "application/json", Authorization: `Bearer ${accessToken}` },
    validateStatus: () => true,
    signal,
  });
  return response.status === 200;
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    const redirectToLogin = (message: string, delay = 1500) => {
      setError(message);
      redirectTimer = setTimeout(() => navigate("/login", { replace: true }), delay);
    };

    const { accessToken, refreshToken } = readTokensFromHash();

    if (!accessToken) {
      redirectToLogin("Missing access token. Redirecting…", 1200);
    } else {
      verifyAdmin(accessToken, controller.signal)
        .then((isAdmin) => {
          if (controller.signal.aborted) return;
          if (!isAdmin) {
            redirectToLogin("This account doesn't have admin access. Redirecting…");
            return;
          }
          login(accessToken, refreshToken);
          window.history.replaceState(null, "", "/");
          navigate("/", { replace: true });
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          redirectToLogin("Could not verify your session. Redirecting…");
        });
    }

    return () => {
      controller.abort();
      clearTimeout(redirectTimer);
    };
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">
          {error ?? "Signing you in…"}
        </p>
      </div>
    </div>
  );
}
