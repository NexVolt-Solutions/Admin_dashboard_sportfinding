import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 bg-[#60A5FA]/10 rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#60A5FA]" />
        </div>
        <p className="text-primary text-xs font-sans font-bold tracking-widest">404</p>
        <h1 className="text-3xl font-sans font-bold text-[#0F172A]">Page not found</h1>
        <p className="text-slate-500 font-sans font-medium">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="rounded-xl h-11 font-sans font-bold bg-[#60A5FA] hover:bg-blue-500 px-6">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
