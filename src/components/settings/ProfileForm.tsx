import { useState, useEffect } from "react";
import { useForm } from "@/hooks/useForm";
import FormInput from "./FormInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminAccountResponse } from "@/types/dashboard";

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: account, isLoading } = useQuery<AdminAccountResponse>({
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
        toast.error(
          typeof detail === "string" ? detail : "Failed to update profile"
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-8">
        <div className="flex items-start justify-between">
          <Skeleton className="h-24 w-24 rounded-2xl" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "h-24 w-24 overflow-hidden rounded-2xl bg-muted ring-1 ring-border transition-all",
            isEditing && "ring-2 ring-primary/40"
          )}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              account?.full_name || "A"
            )}&size=120&background=3EA7FD&color=fff`}
            alt="Avatar"
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <Button
          type="button"
          variant={isEditing ? "ghost" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit profile"}
        </Button>
      </div>

      <section className="space-y-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Personal information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Full name"
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

        <div className="flex justify-end pt-2">
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
      </section>
    </div>
  );
}
