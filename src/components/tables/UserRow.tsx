import React, { useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/dashboard";

interface UserRowProps {
  user: AdminUser;
}

const UserRow = ({ user }: UserRowProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const normalizedStatus = user.status.toLowerCase();
  const isBlocked = normalizedStatus === "blocked";

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const blockMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/v1/admin/users/${id}/block`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User status updated");
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(`Delete ${user.full_name}? This cannot be undone.`)) {
        deleteMutation.mutate(user.id);
      }
    },
    [user.id, user.full_name, deleteMutation]
  );

  const handleBlock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      blockMutation.mutate(user.id);
    },
    [user.id, blockMutation]
  );

  const handleRowClick = useCallback(() => {
    navigate(`/users/${user.id}`);
  }, [navigate, user.id]);

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TableRow
      onClick={handleRowClick}
      className="group cursor-pointer border-border/60 transition-colors hover:bg-muted/50"
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
            {initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {user.full_name}
            </span>
            {isBlocked && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
                Blocked
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {user.location || "—"}
      </TableCell>
      <TableCell className="text-sm font-medium tabular-nums text-foreground">
        {user.matches}
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
            )}
            aria-label="Row actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem
              onClick={() => navigate(`/users/${user.id}`)}
              className="cursor-pointer"
            >
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBlock} className="cursor-pointer">
              {isBlocked ? "Unblock user" : "Block user"}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              className="cursor-pointer"
            >
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(UserRow);
