import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@/hooks/useForm";
import FormInput from "./FormInput";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[22px] font-sans font-bold text-[#0F172A]">Security & Credentials</h3>
        <button
          onClick={() => {
            if (isEditing) setValues(initialData);
            setIsEditing(!isEditing);
          }}
          className={cn(
            "px-8 h-12 rounded-xl font-sans font-bold text-[15px] border transition-all",
            isEditing
              ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              : "border-[#60A5FA] text-[#60A5FA] hover:bg-blue-50"
          )}
        >
          {isEditing ? "Cancel" : "Edit Security"}
        </button>
      </div>

      <div className="space-y-6">
        <FormInput
          label="Current Password"
          type="password"
          name="currentPassword"
          value={values.currentPassword}
          onChange={handleChange}
          placeholder="********"
          disabled={!isEditing}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="********"
            disabled={!isEditing}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="********"
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => handleSubmit(onSave)}
            disabled={!isEditing || !isDirty || isSaving}
            className={cn(
              "px-10 py-3 rounded-xl font-sans font-bold text-[16px] text-white transition-all shadow-lg",
              (!isEditing || !isDirty || isSaving)
                ? "bg-[#60A5FA]/50 cursor-not-allowed shadow-none"
                : "bg-[#60A5FA] hover:bg-blue-500 active:scale-[0.98] shadow-blue-100"
            )}
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
