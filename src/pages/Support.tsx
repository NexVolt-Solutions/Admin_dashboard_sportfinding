import { useState, memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SupportTable, { Ticket } from "@/components/support/SupportTable";
import RequestDetail from "@/components/support/RequestDetail";
import { TicketStatus } from "@/components/support/StatusBadge";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
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

  const { data, isLoading } = useQuery<SupportListResponse>({
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

  const handleStatusChange = async (id: string, newStatus: TicketStatus) => {
    try {
      await apiClient.patch(`/api/v1/admin/support-requests/${id}`, {
        status: newStatus,
      });
    } catch {
      // status update — will be wired when endpoint spec is provided
    }
  };

  return (
    <main className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">Support Request</h1>
        <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">
          {total} total requests
        </p>
      </header>

      <AnimatePresence mode="wait">
        {!selectedTicketId ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <section aria-label="Search and Filters" className="relative w-full lg:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search support requests..."
                className="pl-12 bg-[#F8FAFC] border-slate-200 rounded-xl h-12 font-sans text-[15px] focus:ring-primary/20"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </section>

            <section aria-label="Support Tickets">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[80px] w-full rounded-[40px] bg-white" />
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="bg-white rounded-[24px] p-12 text-center">
                  <p className="font-sans text-slate-400">No support requests found.</p>
                </div>
              ) : (
                <SupportTable
                  tickets={tickets}
                  onView={(ticket) => setSelectedTicketId(ticket.id)}
                  onStatusChange={handleStatusChange}
                />
              )}
            </section>
          </motion.div>
        ) : (
          <RequestDetail
            key="detail"
            ticketId={selectedTicketId}
            onBack={() => setSelectedTicketId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default memo(Support);
