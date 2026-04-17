import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ChevronDown, Plus, Minus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

  useEffect(() => {
    if (!match) return;
    const d = new Date(match.scheduled_at);
    const isoDate = isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
    const isoTime = isNaN(d.getTime())
      ? ""
      : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
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
      duration_minutes: match.duration_minutes || 60,
      max_players: match.max_players || 10,
      skill_level: match.skill_level || "Beginner",
    });
  }, [match]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const scheduledAt =
        form.date && form.time
          ? new Date(`${form.date}T${form.time}`).toISOString()
          : undefined;

      const payload: Record<string, unknown> = {
        title: form.title,
        description: form.description,
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
        toast.error(typeof detail === "string" ? detail : "Failed to update match");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <Skeleton className="h-[600px] w-full rounded-[40px]" />
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="max-w-5xl mx-auto p-10 text-center space-y-4">
        <p className="font-sans text-slate-400">Match not found.</p>
        <button
          onClick={() => navigate("/match")}
          className="text-[#60A5FA] font-sans font-bold"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">Matches Management</h1>
          <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">Edit Match</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-sans font-medium text-[16px] mt-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <Card className="border-none shadow-none rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-12 space-y-10">
          {/* Match Details */}
          <div className="space-y-6">
            <h3 className="text-[20px] font-sans font-bold text-[#0F172A]">Match Details</h3>
            <div className="space-y-2.5">
              <label className="text-[14px] font-sans font-medium text-slate-400">Match Title</label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[14px] font-sans font-medium text-slate-400">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="bg-white border-slate-200 rounded-xl min-h-[120px] font-sans text-[15px] focus:ring-primary/20 resize-none p-4"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-6">
            <h3 className="text-[20px] font-sans font-bold text-[#0F172A]">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20 pr-12"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Time</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20 pr-12"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-[20px] font-sans font-bold text-[#0F172A]">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Location Name</label>
                <Input
                  value={form.location_name}
                  onChange={(e) => update("location_name", e.target.value)}
                  className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
                  placeholder="e.g. Central Park Court 4"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2.5 md:col-span-2">
                <label className="text-[14px] font-sans font-medium text-slate-400">Facility Address</label>
                <Input
                  value={form.facility_address}
                  onChange={(e) => update("facility_address", e.target.value)}
                  className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                  className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
                  placeholder="e.g. 24.8607"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                  className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
                  placeholder="e.g. 67.0011"
                />
              </div>
            </div>
          </div>

          {/* Match Settings */}
          <div className="space-y-6">
            <h3 className="text-[20px] font-sans font-bold text-[#0F172A]">Match Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Skill Level</label>
                <div className="relative">
                  <select
                    value={form.skill_level}
                    onChange={(e) => update("skill_level", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20 px-5 appearance-none outline-none text-[#0F172A]"
                  >
                    {skillLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-sans font-medium text-slate-400">Duration (minutes)</label>
                <Input
                  type="number"
                  min={1}
                  value={form.duration_minutes}
                  onChange={(e) => update("duration_minutes", Math.max(1, Number(e.target.value) || 0))}
                  className="bg-white border-slate-200 rounded-xl h-14 font-sans text-[15px] focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2.5 md:col-span-2">
                <label className="text-[14px] font-sans font-medium text-slate-400">Maximum Players</label>
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl h-14 px-5">
                  <span className="font-sans text-[15px] text-[#0F172A]">{form.max_players}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => update("max_players", Math.max(1, form.max_players - 1))}
                      className="p-1 hover:bg-slate-50 rounded transition-colors"
                      aria-label="Decrease players"
                    >
                      <Minus className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => update("max_players", form.max_players + 1)}
                      className="p-1 hover:bg-slate-50 rounded transition-colors"
                      aria-label="Increase players"
                    >
                      <Plus className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#60A5FA] text-white px-14 py-3.5 rounded-xl font-sans font-bold text-[16px] shadow-lg shadow-blue-100 hover:bg-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
