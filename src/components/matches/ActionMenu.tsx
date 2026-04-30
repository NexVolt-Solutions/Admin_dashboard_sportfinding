import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
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

interface ActionMenuProps {
  matchId: string;
  status?: string;
}

export default function ActionMenu({ matchId, status }: ActionMenuProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isCompleted = status?.toLowerCase() === "completed";

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
      <DropdownMenuTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/30"
        aria-label="Match actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[176px]">
        <DropdownMenuItem onClick={() => navigate(`/match/view/${matchId}`)}>
          <Eye className="h-4 w-4" />
          View match
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (isCompleted) {
              toast.error("Completed matches cannot be edited.");
              return;
            }
            navigate(`/match/edit/${matchId}`);
          }}
        >
          <Edit2 className="h-4 w-4" />
          Edit match
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            if (window.confirm("Delete this match? This cannot be undone.")) {
              deleteMutation.mutate();
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete match
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
