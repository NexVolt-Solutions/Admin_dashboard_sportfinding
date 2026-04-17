import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

interface ActionMenuProps {
  matchId: string;
}

export default function ActionMenu({ matchId }: ActionMenuProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/admin/matches/${matchId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Match deleted");
    },
    onError: () => {
      toast.error("Failed to delete match");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-full transition-colors outline-none">
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-[0_10px_40px_rgba(0,0,0,0.08)] min-w-[180px] p-2 bg-white z-[100]">
        <DropdownMenuItem className="focus:bg-slate-50 rounded-xl py-2.5 px-4">
          <Link to={`/match/view/${matchId}`} className="flex items-center gap-3 text-[13px] font-sans font-medium text-slate-600 w-full">
            <Eye className="w-4 h-4 text-slate-400" />
            View Match
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="focus:bg-slate-50 rounded-xl py-2.5 px-4">
          <Link to={`/match/edit/${matchId}`} className="flex items-center gap-3 text-[13px] font-sans font-medium text-slate-600 w-full">
            <Edit2 className="w-4 h-4 text-slate-400" />
            Edit Match
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="focus:bg-slate-50 rounded-xl py-2.5 px-4 flex items-center gap-3 text-[13px] font-sans font-medium text-rose-500 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            if (window.confirm("Are you sure you want to delete this match?")) {
              deleteMutation.mutate();
            }
          }}
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          Delete Match
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
