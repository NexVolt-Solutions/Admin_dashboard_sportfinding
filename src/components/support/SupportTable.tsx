import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import type { SupportRequestStatus } from "@/types/dashboard";

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  submitted_at: string;
  status: SupportRequestStatus;
}

interface SupportTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
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

export default function SupportTable({ tickets, onView }: SupportTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                onClick={() => onView(ticket)}
                className="group cursor-pointer border-border/60 transition-colors hover:bg-muted/50"
              >
                <TableCell
                  className="font-mono text-xs text-muted-foreground"
                  title={ticket.user_id}
                >
                  {ticket.user_id.slice(0, 8)}
                </TableCell>
                <TableCell className="max-w-90 truncate text-sm font-medium text-foreground">
                  {ticket.subject}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(ticket.submitted_at)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(ticket);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y divide-border/60 md:hidden">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            type="button"
            onClick={() => onView(ticket)}
            className="flex w-full flex-col gap-2 p-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {ticket.user_id.slice(0, 8)}
                </span>
                <span className="truncate text-sm font-medium text-foreground">
                  {ticket.subject}
                </span>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(ticket.submitted_at)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
