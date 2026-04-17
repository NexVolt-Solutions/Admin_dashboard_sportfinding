import { useState } from "react";
import {
  Dialog,
  DialogContent,
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

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
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
        toast.error(typeof message === "string" ? message : "Failed to create user");
      }
    },
  });

  const canSubmit = fullName.trim() && email.trim() && password.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-sans font-bold text-[#0F172A]">
            Create New User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-sans font-semibold text-slate-500">Full Name</Label>
            <Input
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-sans font-semibold text-slate-500">Email</Label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-sans font-semibold text-slate-500">Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#60A5FA] focus:ring-[#60A5FA]/20"
            />
            <span className="text-sm font-sans font-semibold text-slate-500">Admin privileges</span>
          </label>
        </div>

        <DialogFooter className="flex gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl h-12 px-8 font-sans font-bold border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !canSubmit}
            className="rounded-xl h-12 px-8 font-sans font-bold bg-[#60A5FA] hover:bg-blue-500"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
