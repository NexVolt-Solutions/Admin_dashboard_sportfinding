import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge, { TicketStatus } from "./StatusBadge";

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  submitted_at: string;
  status: TicketStatus;
}

interface SupportTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " " + date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

export default function SupportTable({ tickets, onView, onStatusChange }: SupportTableProps) {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent border-slate-50">
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12 pl-6">User ID</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Subject</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Date/Time</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12">Status</TableHead>
              <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-12 text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors h-[72px]">
                <TableCell className="font-sans text-[#0F172A] font-medium text-[15px] py-0 pl-6 max-w-[180px] truncate" title={ticket.user_id}>
                  {ticket.user_id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-sans text-slate-500 font-medium text-[15px] py-0 max-w-[300px] truncate">
                  {ticket.subject}
                </TableCell>
                <TableCell className="font-sans text-slate-500 font-medium text-[15px] py-0">{formatDate(ticket.submitted_at)}</TableCell>
                <TableCell className="py-0">
                  <StatusBadge
                    status={ticket.status}
                    onStatusChange={(status) => onStatusChange(ticket.id, status)}
                  />
                </TableCell>
                <TableCell className="text-right py-0 pr-6">
                  <div className="flex items-center justify-end gap-4 group">
                    <button aria-label="More options" className="p-2 text-slate-400 hover:text-[#0F172A] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onView(ticket)}
                      className="opacity-0 group-hover:opacity-100 transition-all h-9 px-4 rounded-xl font-sans text-[12px] font-bold border border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white whitespace-nowrap"
                    >
                      View Request
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-50">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-sans font-bold text-[#0F172A]">{ticket.user_id.slice(0, 8)}...</span>
                <span className="font-sans text-sm text-slate-500 truncate max-w-[200px]">{ticket.subject}</span>
              </div>
              <StatusBadge
                status={ticket.status}
                onStatusChange={(status) => onStatusChange(ticket.id, status)}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-sans text-[13px] text-slate-400 font-medium">{formatDate(ticket.submitted_at)}</span>
              <button
                onClick={() => onView(ticket)}
                className="h-9 px-4 rounded-xl font-sans text-[12px] font-bold border border-[#60A5FA] text-[#60A5FA]"
              >
                View Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
