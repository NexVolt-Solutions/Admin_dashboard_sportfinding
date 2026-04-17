import React, { useState, memo, useMemo } from "react";
import { Search, Trash2, MessageSquare, User as UserIcon } from "lucide-react";
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

  // Fetch users for the left panel
  const { data: usersData, isLoading: isLoadingUsers } = useQuery<ReviewUsersResponse>({
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

  // Fetch reviews for the selected user
  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery<UserReviewsResponse>({
    queryKey: ["user-reviews", activeThread],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/admin/reviews/users/${activeThread}`, {
        params: { page: 1, limit: 50 },
      });
      return res.data;
    },
    enabled: !!activeThread,
  });

  const reviews = reviewsData?.items || [];

  // Delete review mutation
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

  const activeUser = useMemo(() => 
    users.find(u => u.id === activeThread), 
    [users, activeThread]
  );

  return (
    <main className="h-full flex flex-col space-y-6">
      <header className={cn(activeThread && "hidden lg:block")}>
        <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">
          Reviews Moderation
        </h1>
        <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">
          Monitor and moderate profile reviews
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 overflow-hidden relative">
        {/* Left Pane: Thread Sidebar */}
        <section 
          aria-label="Threads"
          className={cn(
            "flex flex-col space-y-4 overflow-hidden transition-all duration-300 bg-white rounded-[24px] p-6",
            activeThread && "hidden lg:flex"
          )}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search users.."
              className="pl-12 bg-[#F8FAFC] border-slate-200 rounded-xl h-12 font-sans text-[15px] focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {isLoadingUsers ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-50 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
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
              <div className="text-center py-10 text-slate-400 font-sans">
                No users found
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Moderation Feed */}
        <section 
          aria-label="Moderation Feed"
          className={cn(
            "bg-white rounded-[24px] overflow-hidden flex flex-col transition-all duration-300",
            !activeThread && "hidden lg:flex",
            activeThread && "flex"
          )}
        >
          {activeThread ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveThread(null)}
                    className="lg:hidden text-[#60A5FA] font-sans font-bold text-sm flex items-center gap-2"
                  >
                    ←
                  </button>
                  <div className="flex items-center gap-3">
                    {activeUser?.avatar_url ? (
                      <img src={activeUser.avatar_url} alt={activeUser.full_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-[#60A5FA]" />
                      </div>
                    )}
                    <h2 className="font-sans font-bold text-[#0F172A] leading-tight">
                      {activeUser?.full_name}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-sans font-bold text-slate-500">
                    {activeUser?.reviews_count} Reviews
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                <AnimatePresence mode="popLayout">
                  {isLoadingReviews ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 rounded-2xl border border-slate-50 space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </motion.div>
                    ))
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
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
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-sans text-[#0F172A] font-bold">No reviews found</p>
                        <p className="font-sans text-slate-400 text-sm">This user hasn't received any reviews yet.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-[#60A5FA] opacity-40" />
              </div>
              <div className="max-w-xs space-y-2">
                <h3 className="font-sans font-bold text-xl text-[#0F172A]">Select a User</h3>
                <p className="font-sans text-slate-400 text-[15px]">
                  Choose a user from the left panel to moderate their reviews and messages.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="rounded-[24px] border-none shadow-2xl max-w-[400px]">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-2">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <DialogTitle className="text-xl font-sans font-bold text-[#0F172A]">Delete Review?</DialogTitle>
            <DialogDescription className="text-slate-500 font-sans text-[15px]">
              This action cannot be undone. This review will be permanently removed from the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-0 mt-6">
            <Button
              variant="ghost"
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-xl font-sans font-bold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="flex-1 rounded-xl font-sans font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default memo(Reviews);
