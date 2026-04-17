import { ArrowLeft, Trash2, Loader2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge, { TicketStatus } from "./StatusBadge";
import { toast } from "sonner";

interface SupportRequestDetail {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  submitted_at: string;
  status: TicketStatus;
}

interface RequestDetailProps {
  ticketId: string;
  onBack: () => void;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " " + date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

export default function RequestDetail({ ticketId, onBack }: RequestDetailProps) {
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useQuery<SupportRequestDetail>({
    queryKey: ["support-request", ticketId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/admin/support-requests/${ticketId}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/admin/support-requests/${ticketId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
      toast.success("Support request deleted");
      onBack();
    },
    onError: () => {
      toast.error("Failed to delete support request");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch(`/api/v1/admin/support-requests/${ticketId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
      queryClient.invalidateQueries({ queryKey: ["support-request", ticketId] });
      toast.success("Support request resolved");
    },
    onError: () => {
      toast.error("Failed to resolve support request");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this support request?")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0F172A] font-sans font-bold text-[15px] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
        <div className="bg-white rounded-[24px] p-8 md:p-10 min-h-[500px] space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </motion.div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-slate-400">Support request not found.</p>
        <button onClick={onBack} className="text-[#60A5FA] font-sans font-bold mt-2">
          Go back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">{ticket.subject}</h1>
          <p className="text-[14px] text-slate-400 font-sans font-medium mt-1">
            User: {ticket.user_id.slice(0, 8)}... &middot; {formatDate(ticket.submitted_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} onStatusChange={() => {}} />
          {ticket.status !== "Solved" && (
            <button
              onClick={() => resolveMutation.mutate()}
              disabled={resolveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#10B981] hover:bg-emerald-50 font-sans font-bold text-[13px] transition-colors"
            >
              {resolveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Resolve
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-50 font-sans font-bold text-[13px] transition-colors"
          >
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0F172A] font-sans font-bold text-[15px] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <article className="bg-white rounded-[24px] p-8 md:p-10 min-h-[500px]">
        <div className="prose prose-slate max-w-none">
          <p className="font-sans text-[18px] leading-[2] text-slate-500 font-medium whitespace-pre-wrap">
            {ticket.message}
          </p>
        </div>
      </article>
    </motion.div>
  );
}
