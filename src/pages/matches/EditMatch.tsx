import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  formatMatchScheduledAt,
  getMatchScheduleInputsFromIso,
  matchScheduleInputsToUtcIso,
} from "@/lib/match-scheduled";

interface MatchDetail {
  id: string;
  title: string;
  description: string;
  sport: string;
  skill_level: string;
  status: string;
  scheduled_at: string;
  duration_minutes: number;
  facility_address: string;
  location_name: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  max_players: number;
}

interface FormState {
  title: string;
  description: string;
  facility_address: string;
  location: string;
  location_name: string;
  latitude: string;
  longitude: string;
  date: string;
  time: string;
  sport: string;
  duration_minutes: number;
  max_players: number;
  skill_level: string;
}

const sports = [
  "Football",
  "Basketball",
  "Cricket",
  "Tennis",
  "Volleyball",
  "Badminton",
];

const durationOptions = [30, 45, 60, 90, 120, 150, 180];

const emptyForm: FormState = {
  title: "",
  description: "",
  facility_address: "",
  location: "",
  location_name: "",
  latitude: "",
  longitude: "",
  date: "",
  time: "",
  sport: "Football",
  duration_minutes: 60,
  max_players: 10,
  skill_level: "Beginner",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium text-muted-foreground">
      {children}
    </label>
  );
}

export default function EditMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: match, isLoading, isError } = useQuery<MatchDetail>({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/matches/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  function formatScheduledPreview(date: string, time: string) {
    const iso = matchScheduleInputsToUtcIso(date, time);
    return iso ? formatMatchScheduledAt(iso) : "—";
  }

  useEffect(() => {
    if (!match) return;
    const { date: isoDate, time: isoTime } = getMatchScheduleInputsFromIso(
      match.scheduled_at
    );
    setForm({
      title: match.title || "",
      description: match.description || "",
      facility_address: match.facility_address || "",
      location: match.location || "",
      location_name: match.location_name || "",
      latitude: match.latitude != null ? String(match.latitude) : "",
      longitude: match.longitude != null ? String(match.longitude) : "",
      date: isoDate,
      time: isoTime,
      sport: match.sport || "Football",
      duration_minutes: match.duration_minutes || 60,
      max_players: match.max_players || 10,
      skill_level: match.skill_level || "Beginner",
    });
  }, [match]);

  useEffect(() => {
    if (!match) return;
    if (match.status?.toLowerCase() === "completed") {
      toast.error("Completed matches cannot be edited.");
      navigate("/match", { replace: true });
    }
  }, [match, navigate]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const scheduledAt = matchScheduleInputsToUtcIso(form.date, form.time);

      const payload: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        sport: form.sport,
        facility_address: form.facility_address,
        location: form.location,
        location_name: form.location_name || undefined,
        duration_minutes: form.duration_minutes,
        max_players: form.max_players,
        skill_level: form.skill_level,
      };
      if (scheduledAt) payload.scheduled_at = scheduledAt;
      if (form.latitude) payload.latitude = Number(form.latitude);
      if (form.longitude) payload.longitude = Number(form.longitude);

      await apiClient.put(`/api/v1/admin/matches/${id}`, payload);
      toast.success("Match updated successfully");
      navigate("/match");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Failed to update match");
      } else {
        toast.error(
          typeof detail === "string" ? detail : "Failed to update match"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
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

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex items-start justify-between gap-3 pt-1">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Edit Match
          </h1>
          <p className="text-sm text-muted-foreground">
            Update schedule, location, and match settings.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mt-1 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      <Card size="lg" className="max-h-none border-border/60 shadow-none">
        <CardContent className="space-y-5 p-8">
          <section className="space-y-4">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Match Details
            </h3>
            <div className="space-y-1.5">
              <FieldLabel>Match title</FieldLabel>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="h-12"
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="min-h-[88px] resize-none"
                disabled
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Schedule
            </h3>
            <p className="text-xs text-muted-foreground">
              Current schedule: {formatScheduledPreview(form.date, form.time)}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <FieldLabel>Date</FieldLabel>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Time</FieldLabel>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Location</FieldLabel>
              <div className="relative">
                <select
                  aria-label="Location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  disabled
                  className={cn(
                    "h-12 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors",
                    "hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30"
                  )}
                >
                  <option value="Peshawar">Peshawar</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FieldLabel>Match Duration</FieldLabel>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  disabled
                  onClick={() => {
                    const fallback = form.location || form.facility_address;
                    const query = encodeURIComponent(fallback || "sport facility");
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${query}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  Select on Map
                </button>
              </div>
              <div className="relative">
                <select
                  aria-label="Match Duration"
                  value={String(form.duration_minutes)}
                  onChange={(e) => update("duration_minutes", Number(e.target.value))}
                  disabled
                  className={cn(
                    "h-12 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors",
                    "hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30"
                  )}
                >
                  {durationOptions.map((min) => (
                    <option key={min} value={min}>
                      {`${Math.floor(min / 60) > 0 ? `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}` : `0:${String(min).padStart(2, "0")}`} min`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Sports Type
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <FieldLabel>Sports Type</FieldLabel>
                <div className="relative">
                  <select
                    aria-label="Sports Type"
                    value={form.sport}
                    onChange={(e) => update("sport", e.target.value)}
                    disabled
                    className={cn(
                      "h-12 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors",
                      "hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30"
                    )}
                  >
                    {sports.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Maximum players</FieldLabel>
                <div className="flex h-12 items-center justify-between rounded-lg border border-input bg-card px-3 shadow-xs">
                  <span className="text-sm tabular-nums text-foreground">
                    {form.max_players}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled
                      onClick={() =>
                        update("max_players", Math.max(1, form.max_players - 1))
                      }
                      aria-label="Decrease players"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled
                      onClick={() => update("max_players", form.max_players + 1)}
                      aria-label="Increase players"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end border-t border-border/60 pt-5">
            <Button
              type="button"
              className="h-10 min-w-[144px] rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


