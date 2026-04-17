import React, { useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import type { AdminUser } from "@/types/dashboard";

interface UserRowProps {
  user: AdminUser;
}

const UserRow = ({ user }: UserRowProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    }
  });

  const blockMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/v1/admin/users/${id}/block`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User blocked successfully");
    },
    onError: () => {
      toast.error("Failed to block user");
    }
  });

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      deleteMutation.mutate(user.id);
    }
  }, [user.id, user.full_name, deleteMutation]);

  const handleBlock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    blockMutation.mutate(user.id);
  }, [user.id, blockMutation]);

  const handleRowClick = useCallback(() => {
    navigate(`/users/${user.id}`);
  }, [navigate, user.id]);

  return (
    <TableRow
      onClick={handleRowClick}
      className="border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer"
    >
      <TableCell className="py-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#60A5FA] flex items-center justify-center text-white font-sans font-bold text-lg shadow-sm">
            {user.full_name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-[#0F172A] text-base">{user.full_name}</span>
            {user.status && user.status !== "active" && (
              <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">{user.status}</span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="font-sans text-slate-400 font-medium">{user.email}</TableCell>
      <TableCell className="font-sans text-slate-400 font-medium">{user.location}</TableCell>
      <TableCell className="font-sans text-[#0F172A] font-semibold">{user.matches}</TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-[#0F172A] font-bold" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-[0_10px_40px_rgba(0,0,0,0.08)] min-w-[140px] p-2 bg-white">
            <DropdownMenuItem className="focus:bg-slate-50 rounded-xl py-2 px-4">
              <Link to={`/users/${user.id}`} className="text-[13px] font-sans font-medium text-slate-500 cursor-pointer block w-full text-center">
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleBlock}
              className="focus:bg-slate-50 rounded-xl py-2.5 px-4 text-[13px] font-sans font-medium text-amber-500 cursor-pointer block w-full text-center"
            >
              {user.status === "blocked" ? "Unblock" : "Block"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="focus:bg-slate-50 rounded-xl py-2.5 px-4 text-[13px] font-sans font-medium text-rose-500 cursor-pointer block w-full text-center"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(UserRow);
