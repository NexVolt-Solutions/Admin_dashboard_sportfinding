import { useEffect } from "react";
import { Loader2, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LANDING_LOGIN_URL =
  (import.meta.env.VITE_LANDING_LOGIN_URL as string | undefined) ??
  "https://sportfinding.com/login";

export default function Login() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.replace("/");
    } else {
      window.location.replace(LANDING_LOGIN_URL);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-[420px] text-center">
        <div className="w-16 h-16 bg-[#60A5FA] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-sans font-bold text-[#0F172A] tracking-tight">
          SportFinding
        </h1>
        <p className="text-slate-400 font-sans font-medium mt-1 mb-8">
          Admin Dashboard
        </p>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}
