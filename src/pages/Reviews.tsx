import { useState, memo, useMemo } from "react";
import {
  Search,
  Trash2,
  MessageSquare,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import ThreadCard from "@/components/reviews/ThreadCard";
import ReviewItem from "@/components/reviews/ReviewItem";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReviewUser {
  id: string;
  full_name: string;
  avatar_url: string;
  reviews_count: number;
}

interface ReviewUsersResponse {
  items: ReviewUser[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface UserReviewsResponse {
  user: ReviewUser;
  items: Review[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

const Reviews = () => {
  const queryClient = useQueryClient();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: usersData, isLoading: isLoadingUsers, isFetching } =
    useQuery<ReviewUsersResponse>({
      queryKey: ["review-users", search],
      queryFn: async () => {
        const res = await apiClient.get("/api/v1/admin/reviews/users", {
          params: {
            search: search || undefined,
            page: 1,
            limit: 50,
          },
        });
        return res.data;
      },
    });

  const users = usersData?.items || [];

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useQuery<UserReviewsResponse>({
      queryKey: ["user-reviews", activeThread],
      queryFn: async () => {
        const res = await apiClient.get(
          `/api/v1/admin/reviews/users/${activeThread}`,
          {
            params: { page: 1, limit: 50 },
          }
        );
        return res.data;
      },
      enabled: !!activeThread,
    });

  const reviews = reviewsData?.items || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reviews", activeThread] });
      queryClient.invalidateQueries({ queryKey: ["review-users"] });
      toast.success("Review deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  const activeUser = useMemo(
    () => users.find((u) => u.id === activeThread),
    [users, activeThread]
  );

  return (
    <div className="flex h-full flex-col gap-8">
      <header className={cn("flex flex-col gap-1", activeThread && "hidden lg:flex")}>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor and moderate profile reviews
        </p>
      </header>

      <div className="relative grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[360px_1fr]">
        <section
          aria-label="Threads"
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
            activeThread && "hidden lg:flex"
          )}
        >
          <div className="border-b border-border/60 p-3">
            <div className="relative">
              {isFetching ? (
                <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              ) : (
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                placeholder="Search users…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-3">
            {isLoadingUsers ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <ThreadCard
                  key={user.id}
                  userName={user.full_name}
                  avatarUrl={user.avatar_url}
                  reviewsCount={user.reviews_count}
                  isActive={activeThread === user.id}
                  onClick={() => setActiveThread(user.id)}
                />
              ))
            ) : (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </section>

        <section
          aria-label="Moderation"
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
            !activeThread && "hidden lg:flex"
          )}
        >
          {activeThread ? (
            <>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/60 bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveThread(null)}
                    aria-label="Back to threads"
                    className="lg:hidden"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {activeUser?.avatar_url ? (
                    <img
                      src={activeUser.avatar_url}
                      alt={activeUser.full_name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                      {activeUser?.full_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {activeUser?.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activeUser?.reviews_count} review
                      {activeUser?.reviews_count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-6">
                <AnimatePresence mode="popLayout">
                  {isLoadingReviews ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-2/3" />
                      </motion.div>
                    ))
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ReviewItem
                          reviewerName={review.reviewer_name}
                          rating={review.rating}
                          comment={review.comment}
                          createdAt={review.created_at}
                          onDelete={() => setDeleteId(review.id)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">
                          No reviews yet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This user hasn't received any reviews.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  No user review yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose a user from the left to view and moderate their reviews.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete review?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The review will be permanently removed
              from the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(Reviews);
