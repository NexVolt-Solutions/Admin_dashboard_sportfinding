import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
}: CreateUserModalProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setIsAdmin(false);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/api/v1/admin/users", {
        full_name: fullName,
        email,
        password,
        is_admin: isAdmin,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail;
      if (Array.isArray(message)) {
        toast.error(message[0]?.msg || "Failed to create user");
      } else {
        toast.error(
          typeof message === "string" ? message : "Failed to create user"
        );
      }
    },
  });

  const canSubmit = fullName.trim() && email.trim() && password.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a new user to the platform. They'll receive sign-in credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="create-fullname">Full name</Label>
            <Input
              id="create-fullname"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="create-password">Password</Label>
            <Input
              id="create-password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary accent-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <span className="text-sm text-foreground">Grant admin privileges</span>
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !canSubmit}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create user"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
