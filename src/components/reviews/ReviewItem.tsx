import { Trash2 } from "lucide-react";

interface ReviewItemProps {
  reviewerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  onDelete?: () => void;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  // Match the Figma screenshot style: "2:34 PM"
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ReviewItem({
  reviewerName,
  rating: _rating,
  comment,
  createdAt,
  onDelete,
}: ReviewItemProps) {
  const safeComment = comment?.trim() ? comment : "—";

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-none transition-shadow hover:shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h5 className="text-sm font-semibold text-foreground">
              {reviewerName}
            </h5>
            <time className="text-xs text-muted-foreground tabular-nums">
              {formatTime(createdAt)}
            </time>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {safeComment}
          </p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete review"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-destructive transition-[background-color,color] hover:bg-destructive/10 hover:text-destructive focus-visible:ring-4 focus-visible:ring-ring/30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
