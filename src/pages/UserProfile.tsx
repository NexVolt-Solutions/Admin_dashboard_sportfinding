import { memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProfileCard from "@/components/cards/ProfileCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { AdminUser } from "@/types/dashboard";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery<AdminUser>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/admin/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sidebarText font-sans">Loading user profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-sans font-bold text-darkText">User not found</h2>
        <Button variant="link" onClick={() => navigate("/users")}>Back to Users</Button>
      </div>
    );
  }

  const userStats = [
    { label: "Email", value: user.email },
    { label: "Status", value: user.status },
    { label: "Matches Played", value: user.matches || 0 },
    { label: "Location", value: user.location || "N/A" },
  ];

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <nav className="flex items-center justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-darkText transition-colors font-sans font-medium text-[15px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-4">
          <ProfileCard
            name={user.full_name}
            location={user.location || "N/A"}
            avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&size=200&background=60A5FA&color=fff`}
          />
        </section>

        <div className="lg:col-span-8 space-y-6">
          <section aria-label="Quick Stats" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {userStats.map((stat) => (
              <Card key={stat.label} className="border-none shadow-none rounded-xl bg-[#E0F2FE]/50">
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-sans font-medium text-[#334155] mb-1 break-all">{stat.value}</h3>
                  <p className="text-[11px] text-slate-400 font-sans font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
};

export default memo(UserProfile);
