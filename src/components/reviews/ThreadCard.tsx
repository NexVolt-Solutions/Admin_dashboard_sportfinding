import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";

interface ThreadCardProps {
  userName: string;
  avatarUrl?: string;
  reviewsCount?: number;
  isActive?: boolean;
  onClick?: () => void;
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

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        // kept original visual intent, added horizontal sizing and top alignment
        "group relative flex w-full max-w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors self-start min-w-[420px]",
        isActive
          ? "border-transparent bg-primary-muted"
          : "border-transparent bg-transparent hover:bg-muted"
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
            <UserIcon className="h-5 w-5" />
          </div>
        )}
        <span
          className={cn(
            "truncate text-sm font-medium",
            isActive ? "text-primary" : "text-foreground"
          )}
        >
          {userName}
        </span>
      </div>

      <span
        className={cn(
          "shrink-0 text-sm font-medium tabular-nums",
          isActive ? "text-primary/70" : "text-muted-foreground"
        )}
      >
        {reviewsCount}
      </span>
    </button>
  );
}
