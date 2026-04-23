import { Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  onDelete?: () => void;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ReviewItem({
  reviewerName,
  rating,
  comment,
  createdAt,
  onDelete,
}: ReviewItemProps) {
  return (
    <article className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-sm font-semibold text-foreground">
              {reviewerName}
            </h5>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < rating
                      ? "fill-warning text-warning"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">·</span>
            <time className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </time>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{comment}</p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete review"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-[opacity,color,background-color] hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-4 focus-visible:ring-ring/30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
