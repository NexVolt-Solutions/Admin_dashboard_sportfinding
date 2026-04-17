import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TicketStatus = "Open" | "Closed" | "Solved";

interface StatusBadgeProps {
  status: TicketStatus;
  onStatusChange: (newStatus: TicketStatus) => void;
}

const statusStyles: Record<TicketStatus, string> = {
  Solved: "text-[#10B981] bg-[#DCFCE7]",
  Closed: "text-[#EF4444] bg-[#FEE2E2]",
  Open: "text-[#60A5FA] bg-[#E0F2FE]",
};

export default function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[14px] font-sans font-bold transition-all hover:opacity-80 outline-none",
          statusStyles[status]
        )}
      >
        {status}
        <ChevronDown className="w-4 h-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        <DropdownMenuItem onClick={() => onStatusChange("Open")} className="font-sans text-sm">
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Solved")} className="font-sans text-sm">
          Solved
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Closed")} className="font-sans text-sm">
          Closed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
