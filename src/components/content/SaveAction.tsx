import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveActionProps {
  onSave: () => void;
  disabled?: boolean;
  isSaving?: boolean;
}

export default function SaveAction({
  onSave,
  disabled,
  isSaving,
}: SaveActionProps) {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        size="lg"
        onClick={onSave}
        disabled={disabled || isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </div>
  );
}
