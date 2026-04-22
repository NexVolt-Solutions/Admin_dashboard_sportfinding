import { useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, Loader2, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import UserRow from "@/components/tables/UserRow";
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
import { Pagination } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import type { AdminUserListResponse } from "@/types/dashboard";
import CreateUserModal from "@/components/users/CreateUserModal";

const sports = [
  "All",
  "Football",
  "Basketball",
  "Cricket",
  "Tennis",
  "Volleyball",
  "Badminton",
];

function getDateRange(filter: string): { date_from?: string; date_to?: string } {
  if (!filter) return {};
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  if (filter === "today") return { date_from: to, date_to: to };
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
    queryKey: [
      "users",
      searchTerm,
      sportFilter,
      dateFilter,
      locationFilter,
      page,
    ],
    queryFn: async () => {
      const dateRange = getDateRange(dateFilter);
      const response = await apiClient.get("/api/v1/admin/users", {
        params: {
          search: searchTerm || undefined,
          sport: sportFilter === "All" ? undefined : sportFilter,
          location: locationFilter || undefined,
          ...dateRange,
          page,
          limit,
        },
      });
      return response.data;
    },
  });

  const users = useMemo(() => data?.items || [], [data]);
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setSportFilter("All");
    setDateFilter("");
    setLocationFilter("");
    setPage(1);
  }, []);

  const isDefault =
    !searchTerm && sportFilter === "All" && !dateFilter && !locationFilter;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} total user{total === 1 ? "" : "s"}
          </p>
        </div>
        <Button type="button" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Create user
        </Button>
      </header>

      <section
        aria-label="Filters"
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="relative w-full lg:max-w-96">
          {isFetching ? (
            <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : (
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            placeholder="Search users by name or email…"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isDefault}
          >
            Reset
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium shadow-xs outline-none transition-colors focus-visible:ring-4 focus-visible:ring-ring/30",
                sportFilter !== "All"
                  ? "border-transparent bg-primary-muted text-primary"
                  : "border-input bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {sportFilter === "All" ? "Sport" : sportFilter}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              {sports.map((sport) => (
                <DropdownMenuItem
                  key={sport}
                  onClick={() => {
                    setSportFilter(sport);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  {sport}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Date created filter"
              className={cn(
                "h-9 appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm shadow-xs outline-none transition-colors hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30",
                dateFilter ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <option value="">Date created</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative">
            <MapPin
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                locationFilter ? "text-primary" : "text-muted-foreground"
              )}
            />
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 w-40 pl-9"
            />
          </div>
        </div>
      </section>

      <section aria-label="Users list">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Matches</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && users.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-full" />
                          <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5 w-10" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-sm text-muted-foreground"
                    >
                      No users found for your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => <UserRow key={user.id} user={user} />)
                )}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-border/60 md:hidden">
            {isLoading && users.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No users found for your filters.
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.full_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{user.location || "—"}</span>
                    <span className="tabular-nums">
                      {user.matches} matches
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
