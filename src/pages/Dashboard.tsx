import { memo, lazy, Suspense } from "react";
import { Users, Trophy, Zap, UserPlus } from "lucide-react";
import StatCard from "@/components/cards/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { DashboardStats } from "@/types/dashboard";

// Lazy load heavy chart components
const UserActivityChart = lazy(() => import("@/components/dashboard/UserActivityChart"));
const MatchesPerDayChart = lazy(() => import("@/components/dashboard/MatchesPerDayChart"));
const PopularSportsChart = lazy(() => import("@/components/dashboard/PopularSportsChart"));

const ChartSkeleton = () => <Skeleton className="h-[350px] w-full rounded-xl" />;

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/admin/dashboard");
      return response.data;
    },
  });

  return (
    <main className="space-y-5">
      <header className="mb-6">
        <h1 className="text-3xl font-sans font-bold text-[#0F172A] mb-1 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 font-sans font-medium">Platform overview and analytics</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading && !stats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats?.total_users.toLocaleString() || "0"}
            />
            <StatCard
              icon={Trophy}
              label="Total Matches"
              value={stats?.total_matches.toLocaleString() || "0"}
            />
            <StatCard
              icon={Zap}
              label="Active Matches"
              value={stats?.active_matches.toLocaleString() || "0"}
            />
            <StatCard
              icon={UserPlus}
              label="New Users Today"
              value={stats?.new_users_today.toLocaleString() || "0"}
            />
          </>
        )}
      </section>

      <section aria-label="Activity Charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Suspense fallback={<ChartSkeleton />}>
          <UserActivityChart data={stats?.total_users_by_month || []} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <MatchesPerDayChart data={stats?.matches_per_day || []} />
        </Suspense>
      </section>

      <section aria-label="Popularity Analytics">
        <Suspense fallback={<ChartSkeleton />}>
          <PopularSportsChart data={stats?.most_popular_sports || []} />
        </Suspense>
      </section>
    </main>
  );
};

export default memo(Dashboard);
