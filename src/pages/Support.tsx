import { useState, memo } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import RequestDetail from "@/components/support/RequestDetail";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Ticket {
  id: string;
  user: { name: string; email: string };
  subject: string;
  created_at: string;
  status: string;
}

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
  const limit = 5;

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
            {/* Header */}
            <header className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Support
              </h1>
              <p className="text-sm text-muted-foreground">
                {total.toLocaleString()} total request{total === 1 ? "" : "s"}
              </p>
            </header>

            {/* Search */}
            <section aria-label="Search" className="relative w-full lg:max-w-md">
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

            {/* Tickets */}
            <section aria-label="Support list">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                {/* Desktop table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading && tickets.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i} className="border-border/60">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="flex flex-col gap-1.5">
                                  <Skeleton className="h-3.5 w-28" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-3.5 w-36" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-3.5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-3.5 w-16" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : tickets.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-80 text-center text-sm text-muted-foreground"
                          >
                            No support requests found for your filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        tickets.map((ticket) => (
                          <TableRow key={ticket.id} className="border-border/60">
                            <TableCell>{ticket.user.name}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{ticket.status}</TableCell>
                            <TableCell className="text-right">
                              <button
                                onClick={() => setSelectedTicketId(ticket.id)}
                                className="text-primary hover:underline"
                              >
                                View
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile list */}
                <div className="divide-y divide-border/60 md:hidden">
                  {isLoading && tickets.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-3 p-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-full" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-full rounded-md" />
                      </div>
                    ))
                  ) : tickets.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No support requests found for your filters.
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                            {ticket.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {ticket.user.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {ticket.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{ticket.status}</span>
                          <span className="tabular-nums">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Pagination */}
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
