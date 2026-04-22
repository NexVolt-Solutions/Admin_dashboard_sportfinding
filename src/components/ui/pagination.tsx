import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function getPageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);
  const navBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={navBtn}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`dots-${i}`}
            className="inline-flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={page === p ? "page" : undefined}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30",
              page === p
                ? "bg-primary-muted text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={navBtn}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
