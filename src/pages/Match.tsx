import { memo, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const limit = 10;

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
    <main className="space-y-8">
      <header>
        <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">Matches Management</h1>
        <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">{total} total matches</p>
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

      <section aria-label="Matches List">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white" />
            ))}
          </div>
        ) : (
          <MatchesTable matches={matches} />
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-sans font-bold transition-all ${
                  page === i + 1
                    ? "bg-[#60A5FA] text-white shadow-md shadow-blue-100 border-none"
                    : "border-slate-200 text-slate-400 hover:border-primary/50"
                }`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </main>
  );
};

export default memo(Match);
