import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SaveActionProps {
  onSave: () => void;
  disabled?: boolean;
  isSaving?: boolean;
}

export default function SaveAction({ onSave, disabled, isSaving }: SaveActionProps) {
  return (
    <div className="flex justify-end pt-6">
      <button
        onClick={onSave}
        disabled={disabled}
        className={cn(
          "px-14 py-3.5 rounded-xl font-sans font-bold text-[16px] text-white transition-all shadow-lg shadow-blue-100",
          disabled
            ? "bg-[#60A5FA]/50 cursor-not-allowed"
            : "bg-[#60A5FA] hover:bg-blue-500 active:scale-[0.98]"
        )}
      >
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
      </button>
    </div>
  );
}
