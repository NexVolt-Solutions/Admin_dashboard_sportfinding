import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import FormInput from "./FormInput";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SecurityForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const validate = (values: typeof initialData) => {
    const errors: Record<string, string> = {};
    if (values.newPassword && values.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, isDirty, setValues } = useForm({
    initialValues: initialData,
    validate,
  });

  const onSave = async (data: typeof initialData) => {
    setIsSaving(true);
    try {
      await apiClient.patch("/api/v1/admin/account/password", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_new_password: data.confirmPassword,
      });
      toast.success("Password changed successfully");
      setIsEditing(false);
      setValues(initialData);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Failed to change password");
      } else {
        toast.error(typeof detail === "string" ? detail : "Failed to change password");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Security & credentials
          </h3>
          <p className="text-sm text-muted-foreground">
            Update the password used to sign in to the admin dashboard.
          </p>
        </div>
        <Button
          type="button"
          variant={isEditing ? "secondary" : "outline"}
          onClick={() => {
            if (isEditing) setValues(initialData);
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="space-y-5">
        <FormInput
          label="Current password"
          type="password"
          name="currentPassword"
          value={values.currentPassword}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={!isEditing}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormInput
            label="New password"
            type="password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="At least 8 characters"
            disabled={!isEditing}
          />
          <FormInput
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Re-enter new password"
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="button"
            size="lg"
            onClick={() => handleSubmit(onSave)}
            disabled={!isEditing || !isDirty || isSaving}
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
      </div>
    </div>
  );
}
