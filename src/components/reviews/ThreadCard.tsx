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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        isActive
          ? "border-transparent bg-primary-muted"
          : "border-transparent bg-transparent hover:bg-muted"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
            <UserIcon className="h-4 w-4" />
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
          "shrink-0 text-xs font-medium tabular-nums",
          isActive ? "text-primary/70" : "text-muted-foreground"
        )}
      >
        {reviewsCount ?? 0}
      </span>
    </button>
  );
}
