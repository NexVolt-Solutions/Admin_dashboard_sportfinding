import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api-client";
import { Loader2, Trophy } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/api/v1/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token || response.data.token;
      if (token) {
        login(token);
        navigate("/", { replace: true });
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Login failed");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#60A5FA] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-sans font-bold text-[#0F172A] tracking-tight">
            SportFinding
          </h1>
          <p className="text-slate-400 font-sans font-medium mt-1">
            Admin Dashboard
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-sans font-bold text-[#0F172A] mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-sans font-semibold text-slate-500">
                Email
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-sans font-semibold text-slate-500">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-500 font-sans font-medium bg-rose-50 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl h-12 font-sans font-bold bg-[#60A5FA] hover:bg-blue-500 text-base"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
