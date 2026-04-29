import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";
import type { SportType } from "@/types/dashboard";

interface ThreadCardProps {
  userName: string;
  avatarUrl?: string;
  reviewsCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const SPORTS: readonly SportType[] = [
  "Football",
  "Basketball",
  "Cricket",
  "Tennis",
  "Volleyball",
  "Badminton",
];

function splitNameAndSport(fullName: string): {
  displayName: string;
  sportLabel?: SportType;
} {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return { displayName: fullName };

  const maybeSport = parts[parts.length - 1] as SportType;
  if (SPORTS.includes(maybeSport)) {
    return {
      displayName: parts.slice(0, -1).join(" "),
      sportLabel: maybeSport,
    };
  }

  return { displayName: fullName };
}

export default function ThreadCard({
  userName,
  avatarUrl,
  reviewsCount,
  isActive,
  onClick,
}: ThreadCardProps) {
  // Hide the card if there are no reviews
  if (!reviewsCount || reviewsCount === 0) {
    return null;
  }

  const { displayName, sportLabel } = splitNameAndSport(userName);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        isActive
          ? "border-primary/40 bg-primary-muted"
          : "border-border/60 bg-card hover:bg-muted/50"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
            <UserIcon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-semibold",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            {displayName}
          </p>
          {sportLabel ? (
            <p
              className={cn(
                "truncate text-xs",
                isActive ? "text-primary/70" : "text-muted-foreground"
              )}
            >
              {sportLabel}
            </p>
          ) : null}
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 text-xs font-medium tabular-nums",
          isActive ? "text-primary/70" : "text-muted-foreground"
        )}
      >
        {reviewsCount} {reviewsCount === 1 ? "review" : "reviews"}
      </span>
    </button>
  );
}
