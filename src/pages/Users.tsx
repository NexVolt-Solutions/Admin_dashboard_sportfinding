import { useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, Loader2, ChevronLeft, ChevronRight, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableHead, TableHeader, TableRow, TableCell
} from "@/components/ui/table";
import UserRow from "@/components/tables/UserRow";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUserListResponse } from "@/types/dashboard";
import CreateUserModal from "@/components/users/CreateUserModal";

const sports = ["All", "Football", "Basketball", "Tennis", "Volleyball", "Cricket", "Padel"];

function getDateRange(filter: string): { date_from?: string; date_to?: string } {
  if (!filter) return {};
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  if (filter === "today") {
    return { date_from: to, date_to: to };
  }
  if (filter === "week") {
    const from = new Date(now);
    from.setDate(from.getDate() - 7);
    return { date_from: from.toISOString().split("T")[0], date_to: to };
  }
  if (filter === "month") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 1);
    return { date_from: from.toISOString().split("T")[0], date_to: to };
  }
  return {};
}

export default function Users() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const limit = 10;

  const { data, isLoading, isFetching } = useQuery<AdminUserListResponse>({
    queryKey: ["users", searchTerm, sportFilter, dateFilter, locationFilter, page],
    queryFn: async () => {
      const dateRange = getDateRange(dateFilter);
      const response = await apiClient.get("/api/v1/admin/users", {
        params: {
          search: searchTerm || undefined,
          sport: sportFilter === "All" ? undefined : sportFilter,
          location: locationFilter || undefined,
          ...dateRange,
          page,
          limit
        }
      });
      return response.data;
    },
  });

  const users = useMemo(() => data?.items || [], [data]);
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setSportFilter("All");
    setDateFilter("");
    setLocationFilter("");
    setPage(1);
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">User Management</h1>
          <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">{total} total users</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl h-11 px-6 font-sans font-bold bg-[#60A5FA] hover:bg-blue-500 gap-2"
        >
          <Plus className="w-4 h-4" />
          Create User
        </Button>
      </header>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-[400px]">
          {isFetching ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          )}
          <Input
            placeholder="Search user by name or address..."
            className="pl-12 bg-[#F8FAFC] border-slate-200 rounded-xl h-12 font-sans text-[15px] focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleReset}
            className={cn(
              "px-8 py-2 rounded-xl text-[15px] font-sans font-bold whitespace-nowrap h-11 transition-all",
              !searchTerm && sportFilter === "All" && !dateFilter && !locationFilter
                ? "bg-[#60A5FA] text-white shadow-lg shadow-blue-100"
                : "bg-white border border-slate-200 text-slate-400 hover:text-[#0F172A]"
            )}
          >
            All
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "px-5 py-2 rounded-xl text-[15px] font-sans font-bold flex items-center gap-2 whitespace-nowrap h-11 transition-all border",
              sportFilter !== "All"
                ? "bg-[#60A5FA] text-white border-[#60A5FA]"
                : "bg-white border-slate-200 text-slate-400 hover:text-[#0F172A]"
            )}>
              {sportFilter === "All" ? "Sports" : sportFilter}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
              {sports.map((sport) => (
                <DropdownMenuItem
                  key={sport}
                  onClick={() => {
                    setSportFilter(sport);
                    setPage(1);
                  }}
                  className="rounded-lg font-sans font-medium cursor-pointer"
                >
                  {sport}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative group">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className={cn(
                "appearance-none px-5 py-2.5 rounded-xl text-[15px] font-sans font-bold pr-10 transition-all focus:outline-none border h-11",
                dateFilter
                  ? "bg-[#60A5FA] text-white border-[#60A5FA]"
                  : "bg-white border-slate-200 text-slate-400 hover:text-[#0F172A]"
              )}
            >
              <option value="" className="text-slate-900">Date Created</option>
              <option value="today" className="text-slate-900">Today</option>
              <option value="week" className="text-slate-900">This Week</option>
              <option value="month" className="text-slate-900">This Month</option>
            </select>
            <ChevronDown className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              dateFilter ? "text-white" : "text-slate-400"
            )} />
          </div>

          <div className="relative">
            <MapPin className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              locationFilter ? "text-white" : "text-slate-400"
            )} />
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              className={cn(
                "pl-10 w-40 rounded-xl text-[14px] font-sans font-bold h-11 border transition-all",
                locationFilter
                  ? "bg-[#60A5FA] text-white border-[#60A5FA] placeholder:text-white/70"
                  : "bg-white border-slate-200 text-slate-400"
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-none border-none overflow-hidden p-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-14">Users</TableHead>
                <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-14">Email</TableHead>
                <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-14">Location</TableHead>
                <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-14">Matches</TableHead>
                <TableHead className="font-sans font-medium text-slate-400 text-[15px] h-14 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : !isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center font-sans text-slate-400">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {isLoading && users.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ))
          ) : !isLoading && users.length === 0 ? (
            <div className="p-8 text-center font-sans text-slate-400">
              No users found matching your criteria.
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-4 space-y-3 hover:bg-slate-50/80 transition-all duration-300 cursor-pointer group rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-sans font-bold text-primary">
                    {user.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-[#0F172A]">{user.full_name}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Location: {user.location}</span>
                  <span className="text-slate-500">Matches: {user.matches}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-9 text-xs font-sans border-[#60A5FA] text-[#60A5FA] hover:bg-blue-50"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  View Profile
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-sans font-bold transition-all ${
                  page === i + 1
                    ? "bg-[#60A5FA] text-white shadow-md shadow-blue-100 border-none"
                    : "border-slate-200 text-slate-400 hover:border-primary/50"
                }`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
