import { ArrowLeft, Trash2, Loader2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { toast } from "sonner";
import type { SupportRequestDetailResponse } from "@/types/dashboard";

interface RequestDetailProps {
  ticketId: string;
  onBack: () => void;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
  );
}

export default function RequestDetail({ ticketId, onBack }: RequestDetailProps) {
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useQuery<SupportRequestDetailResponse>({
    queryKey: ["support-request", ticketId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/admin/support-requests/${ticketId}`
      );
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
      await apiClient.patch(
        `/api/v1/admin/support-requests/${ticketId}/resolve`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["support-request", ticketId],
      });
      toast.success("Support request resolved");
    },
    onError: () => {
      toast.error("Failed to resolve support request");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Delete this support request? This cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="space-y-3 rounded-xl border border-border bg-card p-8 shadow-sm">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </motion.div>
    );
  }

  if (!ticket) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Support request not found.</p>
        <Button
          type="button"
          variant="link"
          onClick={onBack}
          className="mt-2"
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {ticket.subject}
          </h1>
          <p className="text-sm text-muted-foreground">
            User {ticket.user_id.slice(0, 8)} · {formatDate(ticket.submitted_at)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          {ticket.status !== "Resolved" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => resolveMutation.mutate()}
              disabled={resolveMutation.isPending}
            >
              {resolveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Resolve
            </Button>
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <article className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">
          {ticket.message}
        </p>
      </article>
    </motion.div>
  );
}
