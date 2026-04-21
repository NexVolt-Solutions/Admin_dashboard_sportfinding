import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-muted text-primary">
          <Compass className="h-7 w-7" strokeWidth={2} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          404
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button size="lg">
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
