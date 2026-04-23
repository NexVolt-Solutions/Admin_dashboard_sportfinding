import { useEffect, useRef, useState } from "react";
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
  duration_minutes: number;
  max_players: number;
  skill_level: string;
}

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

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

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
    >
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
      <h3 className="font-heading text-base font-semibold text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function EditMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialFormRef = useRef<FormState>(emptyForm);

  const { data: match, isLoading, isError } = useQuery<MatchDetail>({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/matches/${id}`);
      return res.data;
    },
    enabled: !!id,
    onSuccess: (m) => {
      if (!m) return;
      const d = m.scheduled_at ? new Date(m.scheduled_at) : null;
      const isoDate = d ? d.toISOString().split("T")[0] : "";
      const isoTime = d
        ? `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
          ).padStart(2, "0")}`
        : "";
      const loaded: FormState = {
        title: m.title || "",
        description: m.description || "",
        facility_address: m.facility_address || "",
        location: m.location || "",
        location_name: m.location_name || "",
        latitude: m.latitude != null ? String(m.latitude) : "",
        longitude: m.longitude != null ? String(m.longitude) : "",
        date: isoDate,
        time: isoTime,
        duration_minutes: m.duration_minutes || 60,
        max_players: m.max_players || 10,
        skill_level: m.skill_level || "Beginner",
      };
      setForm(loaded);
      initialFormRef.current = loaded;
    },
  });

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      const changed =
        JSON.stringify(initialFormRef.current) !== JSON.stringify(form);
      if (changed) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
      return undefined;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (form.date && !/^\d{4}-\d{2}-\d{2}$/.test(form.date))
      next.date = "Invalid date format.";
    if (form.time && !/^\d{2}:\d{2}$/.test(form.time))
      next.time = "Invalid time format.";
    if (form.latitude !== "") {
      const lat = Number(form.latitude);
      if (Number.isNaN(lat) || lat < -90 || lat > 90)
        next.latitude = "Latitude must be between -90 and 90.";
    }
    if (form.longitude !== "") {
      const lon = Number(form.longitude);
      if (Number.isNaN(lon) || lon < -180 || lon > 180)
        next.longitude = "Longitude must be between -180 and 180.";
    }
    if (!Number.isFinite(form.duration_minutes) || form.duration_minutes < 1)
      next.duration_minutes = "Duration must be at least 1 minute.";
    if (!Number.isFinite(form.max_players) || form.max_players < 1)
      next.max_players = "Maximum players must be at least 1.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstKey = Object.keys(next)[0];
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${firstKey}"]`
      );
      if (el) el.focus();
      return false;
    }
    return true;
  };

  const mutation = useMutation(
    async (payload: Record<string, unknown>) =>
      apiClient.put(`/api/v1/admin/matches/${id}`, payload),
    {
      onSuccess: () => {
        toast.success("Match updated successfully");
        queryClient.invalidateQueries(["match", id]);
        queryClient.invalidateQueries(["matches"]);
        initialFormRef.current = form;
        navigate("/matches");
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail;
        if (Array.isArray(detail)) {
          toast.error(detail[0]?.msg || "Failed to update match");
        } else {
          toast.error(typeof detail === "string" ? detail : "Failed to update match");
        }
      },
      onSettled: () => setSaving(false),
    }
  );

  const handleSave = async () => {
    if (!id) return;
    setErrors({});
    if (!validate()) return;
    setSaving(true);

    let scheduledAt: string | undefined = undefined;
    if (form.date && form.time) {
      const [y, m, d] = form.date.split("-").map((v) => Number(v));
      const [hh, mm] = form.time.split(":").map((v) => Number(v));
      const localDate = new Date(y, m - 1, d, hh, mm, 0, 0);
      scheduledAt = localDate.toISOString();
    }

    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description || undefined,
      facility_address: form.facility_address || undefined,
      location: form.location || undefined,
      location_name: form.location_name || undefined,
      duration_minutes: form.duration_minutes,
      max_players: form.max_players,
      skill_level: form.skill_level,
    };
    if (scheduledAt) payload.scheduled_at = scheduledAt;
    if (form.latitude !== "") payload.latitude = Number(form.latitude);
    if (form.longitude !== "") payload.longitude = Number(form.longitude);

    mutation.mutate(payload);
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

  const changed = JSON.stringify(initialFormRef.current) !== JSON.stringify(form);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Edit match
          </h1>
          <p className="text-sm text-muted-foreground">
            Update schedule, location, and settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {changed && (
            <span className="text-sm text-amber-600">You have unsaved changes</span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <Card className="max-h-[calc(100vh-160px)] overflow-auto">
        <CardContent className="space-y-8 p-6 sm:p-8">
          <Section title="Match details">
            <div className="space-y-2">
              <FieldLabel htmlFor="title">Match title</FieldLabel>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-xs text-destructive mt-1">
                  {errors.title}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="min-h-32 resize-none"
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
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="pr-9"
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? "date-error" : undefined}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.date && (
                  <p id="date-error" className="text-xs text-destructive mt-1">
                    {errors.date}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="time">Time</FieldLabel>
                <div className="relative">
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="pr-9"
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? "time-error" : undefined}
                  />
                  <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.time && (
                  <p id="time-error" className="text-xs text-destructive mt-1">
                    {errors.time}
                  </p>
                )}
              </div>
            </div>
          </Section>

          <Section title="Location">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="location_name">Location name</FieldLabel>
                <Input
                  id="location_name"
                  name="location_name"
                  value={form.location_name}
                  onChange={(e) => update("location_name", e.target.value)}
                  placeholder="e.g. Central Park Court 4"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="location">City</FieldLabel>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <FieldLabel htmlFor="facility_address">Facility address</FieldLabel>
                <Input
                  id="facility_address"
                  name="facility_address"
                  value={form.facility_address}
                  onChange={(e) => update("facility_address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                  placeholder="e.g. 24.8607"
                  aria-invalid={!!errors.latitude}
                  aria-describedby={errors.latitude ? "latitude-error" : undefined}
                />
                {errors.latitude && (
                  <p id="latitude-error" className="text-xs text-destructive mt-1">
                    {errors.latitude}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                  placeholder="e.g. 67.0011"
                  aria-invalid={!!errors.longitude}
                  aria-describedby={errors.longitude ? "longitude-error" : undefined}
                />
                {errors.longitude && (
                  <p id="longitude-error" className="text-xs text-destructive mt-1">
                    {errors.longitude}
                  </p>
                )}
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
                    name="skill_level"
                    value={form.skill_level}
                    onChange={(e) => update("skill_level", e.target.value)}
                    className={cn(
                      "h-9 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors",
                      "hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30"
                    )}
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
                <FieldLabel htmlFor="duration_minutes">Duration (minutes)</FieldLabel>
                <Input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  min={1}
                  value={form.duration_minutes}
                  onChange={(e) =>
                    update(
                      "duration_minutes",
                      Math.max(1, Number(e.target.value) || 0)
                    )
                  }
                  aria-invalid={!!errors.duration_minutes}
                  aria-describedby={errors.duration_minutes ? "duration-error" : undefined}
                />
                {errors.duration_minutes && (
                  <p id="duration-error" className="text-xs text-destructive mt-1">
                    {errors.duration_minutes}
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <FieldLabel>Maximum players</FieldLabel>
                <div className="flex h-9 items-center justify-between rounded-lg border border-input bg-card px-3 shadow-xs">
                  <span className="text-sm tabular-nums text-foreground">
                    {form.max_players}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
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
                      onClick={() => update("max_players", form.max_players + 1)}
                      aria-label="Increase players"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {errors.max_players && (
                  <p className="text-xs text-destructive mt-1">{errors.max_players}</p>
                )}
              </div>
            </div>
          </Section>

          <div className="flex justify-end border-t border-border/60 pt-6">
            <Button
              type="button"
              size="lg"
              onClick={handleSave}
              disabled={saving}
            >
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
