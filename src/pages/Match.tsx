import { memo, useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import FilterGroup from "@/components/matches/FilterGroup";
import MatchesTable from "@/components/matches/MatchesTable";
import type { AdminMatchListResponse } from "@/types/dashboard";

function getDateRange(filter: string): { date_from?: string; date_to?: string } {
  if (!filter) return {};
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  if (filter === "today") return { date_from: to, date_to: to };
  if (filter === "week") {
    const from = new Date(now);
    from.setDate(from.getDate() - 7);
    return { date_from: from.toISOString().split("T")[0], date_to: to };
  }
  if (filter === "month") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 1);
    return { date_from: from.toISOString().split("T")[0], date_to: to };
  }
  return {};
}

const Match = () => {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isFetching } = useQuery<AdminMatchListResponse>({
    queryKey: ["matches", search, name, location, dateFilter, page],
    queryFn: async () => {
      const dateRange = getDateRange(dateFilter);
      const response = await apiClient.get("/api/v1/admin/matches", {
        params: {
          search: search || undefined,
          name: name || undefined,
          location: location || undefined,
          ...dateRange,
          page,
          limit,
        },
      });
      return response.data;
    },
  });

  const matches = useMemo(() => data?.items || [], [data]);
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleReset = useCallback(() => {
    setSearch("");
    setName("");
    setLocation("");
    setDateFilter("");
    setPage(1);
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Matches
        </h1>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString()} total match{total === 1 ? "" : "es"}
        </p>
      </header>

      <section aria-label="Filters">
        <FilterGroup
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          name={name}
          onNameChange={(v) => {
            setName(v);
            setPage(1);
          }}
          location={location}
          onLocationChange={(v) => {
            setLocation(v);
            setPage(1);
          }}
          dateFilter={dateFilter}
          onDateFilterChange={(v) => {
            setDateFilter(v);
            setPage(1);
          }}
          isFetching={isFetching}
          onReset={handleReset}
        />
      </section>

      <section aria-label="Matches list">
        {isLoading ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="divide-y divide-border/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <MatchesTable matches={matches} />
        )}
      </section>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default memo(Match);
