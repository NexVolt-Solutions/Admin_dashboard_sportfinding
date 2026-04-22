import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Mail, MapPin } from "lucide-react";
import type { AdminMatch } from "@/types/dashboard";
import ActionMenu from "./ActionMenu";

interface MatchesTableProps {
  matches: AdminMatch[];
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}

export default function MatchesTable({ matches }: MatchesTableProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          No matches found for your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow
                key={match.id}
                className="border-border/60 transition-colors hover:bg-muted/50"
              >
                <TableCell className="text-sm font-medium text-foreground">
                  {match.title}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">
                      {match.host_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {match.host_email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {match.location}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(match.scheduled_at)}
                </TableCell>
                <TableCell className="text-right">
                  <ActionMenu matchId={match.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y divide-border/60 md:hidden">
        {matches.map((match) => (
          <div key={match.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold text-foreground">
                {match.title}
              </h4>
              <ActionMenu matchId={match.id} />
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">
                  {match.host_name} · {match.host_email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{match.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(match.scheduled_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
