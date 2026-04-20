import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy } from "lucide-react";

const LANDING_LOGIN_URL =
  (import.meta.env.VITE_LANDING_LOGIN_URL as string | undefined) ??
  "https://sportfinding.com/login";

export default function Login() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.replace(LANDING_LOGIN_URL);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

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

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-slate-500 font-sans font-medium">
            Redirecting to the sign-in page...
          </p>
          <Button
            onClick={() => window.location.replace(LANDING_LOGIN_URL)}
            className="w-full rounded-xl h-12 font-sans font-bold bg-[#60A5FA] hover:bg-blue-500 text-base"
          >
            Continue to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
