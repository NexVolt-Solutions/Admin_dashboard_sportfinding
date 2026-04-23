import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MatchDetail {
  id: string;
  title: string;
  description?: string;
  sport?: string;
  skill_level?: string;
  status?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  facility_address?: string;
  location_name?: string | null;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  max_players?: number;
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
  duration_minutes: number;
  max_players: number;
  skill_level: string;
}

const skillLevels = ["Beginner", "Intermediate", "Advanced"] as const;
type SkillLevel = (typeof skillLevels)[number];

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
  duration_minutes: 60,
  max_players: 10,
  skill_level: "Beginner",
};

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

/**
 * Convert local date (YYYY-MM-DD) and time (HH:mm) into an ISO string (UTC).
 * This treats the provided date/time as local time and returns the ISO representation.
 */
function localDateTimeToISOString(dateStr: string, timeStr: string): string | undefined {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh = 0, mm = 0] = (timeStr || "").split(":").map((v) => Number(v || 0));
  const dt = new Date(y, m - 1, d, hh, mm, 0);
  return Number.isFinite(dt.getTime()) ? dt.toISOString() : undefined;
}

export default function EditMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: match, isLoading, isError } = useQuery<MatchDetail>({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/matches/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (!match) return;
    const d = match.scheduled_at ? new Date(match.scheduled_at) : null;
    const isoDate = d && !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
    const isoTime =
      d && !isNaN(d.getTime())
        ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
        : "";
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
      duration_minutes: match.duration_minutes ?? 60,
      max_players: match.max_players ?? 10,
      skill_level: (match.skill_level as SkillLevel) || "Beginner",
    });
  }, [match]);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  // NOTE: Confirm whether the PUT endpoint should be /api/v1/admin/matches/:id or /api/v1/matches/:id
  const updateMatchMutation = useMutation(
    async (payload: Record<string, unknown>) => {
      return apiClient.put(`/api/v1/admin/matches/${id}`, payload);
    },
    {
      onSuccess: () => {
        toast.success("Match updated successfully");
        queryClient.invalidateQueries(["match", id]);
        queryClient.invalidateQueries(["matches"]);
        navigate("/matches"); // navigate to list route; adjust if your route differs
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail;
        if (Array.isArray(detail)) {
          toast.error(detail[0]?.msg || "Failed to update match");
        } else if (typeof detail === "string") {
          toast.error(detail);
        } else {
          toast.error("Failed to update match");
        }
      },
    }
  );

  const saving = updateMatchMutation.isLoading;

  const handleSave = async () => {
    // Basic validation
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.date && form.time) {
      toast.error("Please select a date for the provided time");
      return;
    }

    // Build scheduled_at explicitly from local date/time
    const scheduledAt = localDateTimeToISOString(form.date, form.time);

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      facility_address: form.facility_address?.trim() || undefined,
      location: form.location?.trim() || undefined,
      location_name: form.location_name?.trim() || undefined,
      duration_minutes: Number(form.duration_minutes) || 60,
      max_players: Number(form.max_players) || 1,
      skill_level: form.skill_level || undefined,
    };

    if (scheduledAt) payload.scheduled_at = scheduledAt;

    if (form.latitude) {
      const lat = parseFloat(form.latitude);
      if (Number.isFinite(lat)) payload.latitude = lat;
      else {
        toast.error("Latitude must be a valid number");
        return;
      }
    }

    if (form.longitude) {
      const lng = parseFloat(form.longitude);
      if (Number.isFinite(lng)) payload.longitude = lng;
      else {
        toast.error("Longitude must be a valid number");
        return;
      }
    }

    updateMatchMutation.mutate(payload);
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
        <Button type="button" variant="outline" onClick={() => navigate("/matches")}>
          Back to matches
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8" aria-busy={saving}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Edit match
          </h1>
          <p className="text-sm text-muted-foreground">Update schedule, location, and settings.</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      <Card>
        <CardContent className="space-y-8 p-6 sm:p-8">
          <Section title="Match details">
            <div className="space-y-2">
              <FieldLabel htmlFor="title">Match title</FieldLabel>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="min-h-32 resize-none"
                disabled={saving}
              />
            </div>
          </Section>

          <Section title="Schedule">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="pr-9"
                    disabled={saving}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="time">Time</FieldLabel>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="pr-9"
                    disabled={saving}
                  />
                  <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Location">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="location_name">Location name</FieldLabel>
                <Input
                  id="location_name"
                  value={form.location_name}
                  onChange={(e) => update("location_name", e.target.value)}
                  placeholder="e.g. Central Park Court 4"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="location">City</FieldLabel>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <FieldLabel htmlFor="facility_address">Facility address</FieldLabel>
                <Input
                  id="facility_address"
                  value={form.facility_address}
                  onChange={(e) => update("facility_address", e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                  placeholder="e.g. 24.8607"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                  placeholder="e.g. 67.0011"
                  disabled={saving}
                />
              </div>
            </div>
          </Section>

          <Section title="Match settings">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="skill_level">Skill level</FieldLabel>
                <div className="relative">
                  <select
                    id="skill_level"
                    value={form.skill_level}
                    onChange={(e) => update("skill_level", e.target.value)}
                    className={cn(
                      "h-9 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors",
                      "hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30"
                    )}
                    disabled={saving}
                  >
                    {skillLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="duration_minutes">Duration minutes</FieldLabel>
                <Input
                  id="duration_minutes"
                  type="number"
                  min={1}
                  value={form.duration_minutes}
                  onChange={(e) =>
                    update("duration_minutes", Math.max(1, Number(e.target.value) || 0))
                  }
                  disabled={saving}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <FieldLabel>Maximum players</FieldLabel>
                <div className="flex h-9 items-center justify-between rounded-lg border border-input bg-card px-3 shadow-xs">
                  <span className="text-sm tabular-nums text-foreground">{form.max_players}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => update("max_players", Math.max(1, form.max_players - 1))}
                      aria-label="Decrease players"
                      disabled={saving}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => update("max_players", form.max_players + 1)}
                      aria-label="Increase players"
                      disabled={saving}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <div className="flex justify-end border-t border-border/60 pt-6">
            <Button type="button" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
