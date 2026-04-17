import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
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
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + " · " + date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MatchesTable({ matches }: MatchesTableProps) {
  return (
    <div className="bg-white rounded-[24px] shadow-none border-none overflow-hidden p-6">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent border-slate-50">
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Match</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Host</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Location</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Scheduled</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 font-sans text-slate-400">
                  No matches found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
                <TableRow
                  key={match.id}
                  className="border-slate-50 hover:bg-slate-50/30 transition-colors h-[72px]"
                >
                  <TableCell className="py-3">
                    <span className="font-sans font-medium text-slate-600 text-[15px]">{match.title}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-sans text-slate-600 text-[14px] font-medium">{match.host_name}</span>
                      <span className="font-sans text-slate-400 text-[12px]">{match.host_email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-sans text-slate-500 text-[14px] py-3">{match.location}</TableCell>
                  <TableCell className="font-sans text-slate-500 text-[14px] py-3">{formatDate(match.scheduled_at)}</TableCell>
                  <TableCell className="text-right py-3">
                    <ActionMenu matchId={match.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {matches.length === 0 ? (
          <div className="p-8 text-center font-sans text-slate-400">
            No matches found.
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-sans font-bold text-[#0F172A]">{match.title}</h4>
                <ActionMenu matchId={match.id} />
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{match.host_name} · {match.host_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{match.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(match.scheduled_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
