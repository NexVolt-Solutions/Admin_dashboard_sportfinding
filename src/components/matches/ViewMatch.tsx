import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft, Calendar, Clock, MapPin, Users, Trophy
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=60A5FA&color=fff`;
}

function formatTime(time: string) {
  if (!time) return "—";
  const [hStr, m] = time.split(":");
  const h = Number(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${m} ${ampm}`;
}

const ViewMatch = () => {
  const { id } = useParams();

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
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-40 w-full rounded-[24px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-[24px]" />
          <Skeleton className="h-64 rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="font-sans text-slate-400">Match not found.</p>
        <Link to="/match" className="text-[#60A5FA] font-sans font-bold">
          Go back
        </Link>
      </div>
    );
  }

  const dateLabel = match.scheduled_date
    ? new Date(match.scheduled_date).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <main className="space-y-6 max-w-5xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">Matches Management</h1>
          <p className="text-slate-400 font-sans font-medium">View Match</p>
        </div>
        <Link
          to="/match"
          className="flex items-center gap-2 text-slate-500 hover:text-[#0F172A] transition-colors font-sans font-bold"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Link>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm border border-slate-50"
      >
        <div>
          <h2 className="text-[28px] font-sans font-bold text-[#0F172A] leading-tight mb-1">{match.title}</h2>
          <p className="text-slate-400 font-sans font-medium">{match.sport}</p>
        </div>
        <div className={cn(
          "px-6 py-2 rounded-xl font-sans font-bold text-[14px]",
          match.status === "Completed" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
        )}>
          {match.status}
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetailItem icon={<Calendar className="w-5 h-5" />} label="Date" value={dateLabel} />
        <DetailItem icon={<Clock className="w-5 h-5" />} label="Time" value={formatTime(match.scheduled_time)} />
        <DetailItem icon={<Trophy className="w-5 h-5" />} label="Skill Level" value={match.skill_level} />
        <DetailItem icon={<Users className="w-5 h-5" />} label="Players" value={`${match.current_players}/${match.max_players}`} />
        <DetailItem icon={<MapPin className="w-5 h-5" />} label="Location" value={match.location_name || match.location} className="lg:col-span-2" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          <section className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-50">
            <div className="flex items-start gap-4 mb-6">
              <img
                src={match.host.avatar_url || avatarFor(match.host.full_name)}
                alt={match.host.full_name}
                className="w-16 h-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h3 className="text-lg font-sans font-bold text-[#0F172A]">{match.host.full_name} (Host)</h3>
                <p className="text-sm text-slate-400 mb-1">Rating: {match.host.avg_rating.toFixed(1)}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <p className="text-[24px] font-sans font-bold text-[#0F172A]">{match.host_games_played}</p>
              <p className="text-xs text-slate-400 font-sans font-bold uppercase tracking-wider">Matches Played</p>
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-50 space-y-4">
            <h3 className="text-lg font-sans font-bold text-[#0F172A]">About this match</h3>
            <p className="text-slate-500 leading-relaxed font-sans whitespace-pre-wrap">
              {match.description || "No description provided."}
            </p>
          </section>
        </div>

        <section className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-50 h-fit flex flex-col">
          <h3 className="text-lg font-sans font-bold text-[#0F172A] mb-6">Participants</h3>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {match.participants.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-sm font-sans italic">No participants yet</p>
            ) : (
              match.participants.map((p) => (
                <div key={p.user.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <img
                    src={p.user.avatar_url || avatarFor(p.user.full_name, 40)}
                    alt={p.user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-sans font-bold text-[#0F172A]">{p.user.full_name}</p>
                    <p className="text-xs text-slate-400 font-sans">{p.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

const DetailItem = ({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: string; className?: string }) => (
  <div className={cn("bg-white rounded-[20px] p-5 shadow-sm border border-slate-50 flex items-center gap-4", className)}>
    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-sans font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[15px] font-sans font-bold text-[#0F172A]">{value}</p>
    </div>
  </div>
);

export default ViewMatch;
