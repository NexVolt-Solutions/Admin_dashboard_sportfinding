import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  growth?: string;
  isPositive?: boolean;
  className?: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  growth,
  isPositive = true,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-2.5 pl-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary-muted text-primary">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </div>
        {growth && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
              isPositive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {growth}
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default React.memo(StatCard);
