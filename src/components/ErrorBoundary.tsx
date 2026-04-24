import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

const RELOAD_FLAG = "sf_chunk_reload_attempted";

function isChunkLoadError(error: Error): boolean {
  const message = error?.message ?? "";
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error) && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
      return;
    }
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error);
    }
  }

  reset = () => {
    sessionStorage.removeItem(RELOAD_FLAG);
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred while rendering this page. Try again,
              or refresh the browser if the issue persists.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={this.reset}>
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              type="button"
              onClick={() => window.location.assign("/")}
            >
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
