import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@/hooks/useForm";
import FormInput from "./FormInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdminAccount {
  full_name: string;
  email: string;
}

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: account, isLoading } = useQuery<AdminAccount>({
    queryKey: ["admin-account"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/account");
      return res.data;
    },
  });

  const { values, handleChange, handleSubmit, isDirty, setValues } = useForm({
    initialValues: {
      fullName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (account) {
      setValues({
        fullName: account.full_name,
        email: account.email,
      });
    }
  }, [account, setValues]);

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async (data: typeof values) => {
    setIsSaving(true);
    try {
      await apiClient.put("/api/v1/admin/account", {
        full_name: data.fullName,
        email: data.email,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-account"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Failed to update profile");
      } else {
        toast.error(typeof detail === "string" ? detail : "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-start justify-between">
          <Skeleton className="w-[120px] h-[120px] rounded-[32px]" />
          <Skeleton className="w-32 h-12 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-7 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between">
        <div className="relative">
          <div className={cn(
            "w-[120px] h-[120px] rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100 transition-all flex items-center justify-center",
            isEditing && "ring-2 ring-blue-500/20 border-blue-500/50"
          )}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(account?.full_name || "A")}&size=120&background=60A5FA&color=fff`}
              alt="Avatar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "px-8 h-12 rounded-xl font-sans font-bold text-[15px] border transition-all",
            isEditing
              ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              : "border-[#60A5FA] text-[#60A5FA] hover:bg-blue-50"
          )}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-[22px] font-sans font-bold text-[#0F172A]">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={!isEditing}
          />
          <FormInput
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled
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
