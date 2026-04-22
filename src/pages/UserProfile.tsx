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
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading user profile…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4 py-20 text-center">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          User not found
        </h2>
        <Button type="button" variant="outline" onClick={() => navigate("/users")}>
          Back to users
        </Button>
      </div>
    );
  }

  const userStats: { label: string; value: React.ReactNode }[] = [
    { label: "Email", value: user.email },
    { label: "Status", value: user.status },
    { label: "Matches", value: (user.matches || 0).toLocaleString() },
    { label: "Location", value: user.location || "—" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          User profile
        </h1>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-4">
          <ProfileCard
            name={user.full_name}
            location={user.location || "—"}
            avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.full_name
            )}&size=200&background=3EA7FD&color=fff`}
          />
        </section>

        <section
          aria-label="Quick stats"
          className="grid grid-cols-2 gap-4 lg:col-span-8 sm:grid-cols-2"
        >
          {userStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="space-y-1 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="truncate text-base font-semibold text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
};

export default memo(UserProfile);
