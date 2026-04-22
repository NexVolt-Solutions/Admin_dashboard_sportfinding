import React from "react";
import { cn } from "@/lib/utils";

interface SportCardProps {
  name: string;
  level: string;
  className?: string;
}

const levelStyles: Record<string, string> = {
  beginner: "bg-primary-muted text-primary",
  intermediate: "bg-warning/15 text-warning",
  advanced: "bg-success/15 text-success",
};

const SportCard = ({ name, level, className }: SportCardProps) => {
  const style =
    levelStyles[level.toLowerCase()] ?? "bg-muted text-muted-foreground";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-xs transition-colors hover:bg-muted/40",
        className
      )}
    >
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span
        className={cn(
          "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
          style
        )}
      >
        {level}
      </span>
    </div>
  );
};

export default React.memo(SportCard);
