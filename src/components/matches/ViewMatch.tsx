import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMatchScheduledDateTimeParts } from "@/lib/match-scheduled";

interface Participant {
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    avg_rating: number;
    total_games_played: number;
  };
  role: string;
  joined_at: string;
}

interface MatchDetail {
  id: string;
  title: string;
  description: string;
  sport: string;
  skill_level: string;
  status: string;
  scheduled_at: string;
  duration_minutes: number;
  scheduled_date: string;
  scheduled_time: string;
  facility_address: string;
  location_name: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  max_players: number;
  current_players: number;
  host: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    avg_rating: number;
    total_games_played: number;
  };
  host_games_played: number;
  participants: Participant[];
  created_at: string;
}

function avatarFor(name: string, size = 64) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=${size}&background=3EA7FD&color=fff`;
}

function statusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "completed") {
    return { className: "bg-success/10 text-success", label: "Completed" };
  }
  if (normalized === "cancelled" || normalized === "canceled") {
    return { className: "bg-destructive/10 text-destructive", label: "Cancelled" };
  }
  if (normalized === "open") {
    return { className: "bg-primary-muted text-primary", label: "Pending" };
  }
  return { className: "bg-primary-muted text-primary", label: status };
}

const ViewMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: match, isLoading, isError } = useQuery<MatchDetail>({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/matches/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">Match not found.</p>
        <Button type="button" variant="outline" onClick={() => navigate("/match")}>
          Back to matches
        </Button>
      </div>
    );
  }

  const scheduled = formatMatchScheduledDateTimeParts(match.scheduled_at);
  const status = statusBadge(match.status);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Match details
          </h1>
          <p className="text-sm text-muted-foreground">
            View host, participants, and schedule.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/match")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-3 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {match.title}
            </h2>
            <p className="text-sm text-muted-foreground">{match.sport}</p>
          </div>
          <span
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
              status.className
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {status.label}
          </span>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DetailItem icon={Calendar} label="Date" value={scheduled.date} />
        <DetailItem
          icon={Clock}
          label="Time"
          value={scheduled.time}
        />
        <DetailItem
          icon={Trophy}
          label="Skill level"
          value={match.skill_level}
        />
        <DetailItem
          icon={Users}
          label="Players"
          value={`${match.current_players}/${match.max_players}`}
        />
        <DetailItem
          icon={MapPin}
          label="Location"
          value={match.location_name || match.location}
          className="lg:col-span-2"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <img
                  src={match.host.avatar_url || avatarFor(match.host.full_name)}
                  alt={match.host.full_name}
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-border"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    {match.host.full_name}{" "}
                    <span className="font-normal text-muted-foreground">· Host</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rating {match.host.avg_rating.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/60 p-4 text-center">
                <p className="font-heading text-2xl font-semibold tabular-nums text-foreground">
                  {match.host_games_played}
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Matches played
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-6 sm:p-8">
              <h3 className="font-heading text-base font-semibold text-foreground">
                About this match
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {match.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Participants
            </h3>
            <div className="max-h-[320px] space-y-2 overflow-y-auto">
              {match.participants.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No participants yet
                </p>
              ) : (
                match.participants.map((p) => (
                  <div
                    key={p.user.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60"
                  >
                    <img
                      src={p.user.avatar_url || avatarFor(p.user.full_name, 40)}
                      alt={p.user.full_name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {p.user.full_name}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {p.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}

function DetailItem({ icon: Icon, label, value, className }: DetailItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-xs",
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default ViewMatch;
