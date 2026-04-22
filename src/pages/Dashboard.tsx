import { memo, lazy, Suspense } from "react";
import { Users, Trophy, Zap, UserPlus } from "lucide-react";
import StatCard from "@/components/cards/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { DashboardStats } from "@/types/dashboard";

const UserActivityChart = lazy(
  () => import("@/components/dashboard/UserActivityChart")
);
const MatchesPerDayChart = lazy(
  () => import("@/components/dashboard/MatchesPerDayChart")
);
const PopularSportsChart = lazy(
  () => import("@/components/dashboard/PopularSportsChart")
);

/**
 * ChartSkeleton
 */
const ChartSkeleton = ({ className = "" }: { className?: string }) => (
  <Skeleton className={`h-96 w-full rounded-xl ${className}`} />
);

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/admin/dashboard");
      return response.data;
    },
  });

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and analytics
        </p>
      </header>

      {/* Key metrics: stat cards — reduced height (h-20) */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isLoading && !stats
          ? [0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          : (
              <>
                <StatCard
                  className="h-30"
                  icon={Users}
                  label="Total Users"
                  value={stats?.total_users.toLocaleString() || "0"}
                />
                <StatCard
                  className="h-30"
                  icon={Trophy}
                  label="Total Matches"
                  value={stats?.total_matches.toLocaleString() || "0"}
                />
                <StatCard
                  className="h-30"
                  icon={Zap}
                  label="Active Matches"
                  value={stats?.active_matches.toLocaleString() || "0"}
                />
                <StatCard
                  className="h-30"
                  icon={UserPlus}
                  label="New Users Today"
                  value={stats?.new_users_today.toLocaleString() || "0"}
                />
              </>
            )}
      </section>

      {/* Activity charts */}
      <section
        aria-label="Activity charts"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <Suspense fallback={<ChartSkeleton className="lg:col-span-2" />}>
          <UserActivityChart data={stats?.total_users_by_month || []} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <MatchesPerDayChart data={stats?.matches_per_day || []} />
        </Suspense>
      </section>

      {/* Sport popularity */}
      <section aria-label="Sport popularity">
        <Suspense fallback={<ChartSkeleton />}>
          <PopularSportsChart data={stats?.most_popular_sports || []} />
        </Suspense>
      </section>
    </div>
  );
};

export default memo(Dashboard);
