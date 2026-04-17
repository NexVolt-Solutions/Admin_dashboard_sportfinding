import React from "react";
import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";

interface ThreadCardProps {
  userName: string;
  avatarUrl?: string;
  reviewsCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ThreadCard({ userName, avatarUrl, reviewsCount, isActive, onClick }: ThreadCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group relative overflow-hidden",
        isActive
          ? "bg-[#F8FAFC] border-slate-100 shadow-none"
          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
      )}
    >
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-[#60A5FA]" />
          </div>
        )}
        <h4 className="font-sans font-bold text-[16px] text-[#0F172A] leading-none">
          {userName}
        </h4>
      </div>

      <span className="text-[12px] font-sans text-slate-400 font-medium">
        {reviewsCount || 0} reviews
      </span>
    </button>
  );
}
