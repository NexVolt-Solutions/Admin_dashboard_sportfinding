import { cn } from "@/lib/utils";
import type { SupportRequestStatus } from "@/types/dashboard";

export type TicketStatus = SupportRequestStatus;

interface StatusBadgeProps {
  status: SupportRequestStatus;
}

const statusStyles: Record<SupportRequestStatus, string> = {
  Open: "bg-primary-muted text-primary",
  Resolved: "bg-success/10 text-success",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
        statusStyles[status]
      )}
    >
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          status === "Open" ? "bg-primary" : "bg-success"
        )}
      />
      {status}
    </span>
  );
}
