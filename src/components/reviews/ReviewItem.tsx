import { Trash2, Star } from "lucide-react";

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

export default function ReviewItem({ reviewerName, rating, comment, createdAt, onDelete }: ReviewItemProps) {
  return (
    <article className="group p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all duration-200">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h5 className="font-sans font-bold text-[16px] text-[#0F172A]">
              {reviewerName}
            </h5>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <time className="text-[13px] font-sans font-medium text-slate-400">
              {formatDate(createdAt)}
            </time>
          </div>
          <p className="font-sans text-[15px] text-slate-500 font-medium leading-relaxed">
            {comment}
          </p>
        </div>

        <button
          onClick={onDelete}
          className="p-2.5 rounded-xl text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
          aria-label="Delete review"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
}
