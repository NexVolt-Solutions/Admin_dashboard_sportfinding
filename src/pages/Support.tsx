import { useState, memo } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import SupportTable, { Ticket } from "@/components/support/SupportTable";
import RequestDetail from "@/components/support/RequestDetail";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

interface SupportListResponse {
  items: Ticket[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

const Support = () => {
  const [search, setSearch] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching } = useQuery<SupportListResponse>({
    queryKey: ["support-requests", search, page],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/support-requests", {
        params: {
          search: search || undefined,
          page,
          limit,
        },
      });
      return res.data;
    },
  });

  const tickets = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!selectedTicketId ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <header className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Support
              </h1>
              <p className="text-sm text-muted-foreground">
                {total.toLocaleString()} total request{total === 1 ? "" : "s"}
              </p>
            </header>

            <section aria-label="Search" className="relative w-full lg:max-w-96">
              {isFetching ? (
                <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              ) : (
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                placeholder="Search support requests…"
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </section>

            <section aria-label="Support tickets">
              {isLoading ? (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="divide-y divide-border/60">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4"
                      >
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="ml-auto h-6 w-16 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <SupportTable
                  tickets={tickets}
                  onView={(ticket) => setSelectedTicketId(ticket.id)}
                />
              )}
            </section>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </motion.div>
        ) : (
          <RequestDetail
            key="detail"
            ticketId={selectedTicketId}
            onBack={() => setSelectedTicketId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(Support);
