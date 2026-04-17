import React from "react";
import { cn } from "@/lib/utils";

interface SportCardProps {
  name: string;
  level: string;
  className?: string;
  key?: React.Key;
}

const SportCard = ({ name, level, className }: SportCardProps) => {
  const isIntermediate = level.toLowerCase() === "intermediate";
  const isAdvanced = level.toLowerCase() === "advanced";
  const isBeginner = level.toLowerCase() === "beginner";

  return (
    <div className={cn(
      "bg-[#E0F2FE]/40 border border-transparent rounded-2xl p-7 flex items-center justify-between transition-all hover:bg-[#E0F2FE]/60",
      className
    )}>
      <span className="font-sans font-bold text-[18px] text-[#0F172A]">{name}</span>
      <span className={cn(
        "text-[14px] font-sans font-medium px-8 py-2.5 rounded-2xl border bg-white text-[#60A5FA] border-blue-100 shadow-sm"
      )}>
        {level}
      </span>
    </div>
  );
};

export default React.memo(SportCard);
