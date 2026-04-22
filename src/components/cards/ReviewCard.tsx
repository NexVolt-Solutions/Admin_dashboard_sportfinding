import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  content: string;
}

const ReviewCard = ({ author, rating, date, content }: ReviewCardProps) => {
  const initial = author.charAt(0).toUpperCase();
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
          {initial}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{author}</h4>
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
            <time className="text-xs text-muted-foreground">{date}</time>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{content}</p>
        </div>
      </div>
    </article>
  );
};

export default React.memo(ReviewCard);
