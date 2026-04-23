import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { AdminAccountResponse } from "@/types/dashboard";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: account } = useQuery<AdminAccountResponse>({
    queryKey: ["admin-account"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/account");
      return res.data;
    },
  });

  const initials =
    account?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 lg:px-6 backdrop-blur-md lg:justify-end">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm sm:text-base font-semibold text-foreground leading-tight">
            {account?.full_name || "Admin"}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {account?.email || ""}
          </p>
        </div>
        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-1 ring-border">
          <AvatarImage
            src={
              account
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    account.full_name
                  )}&size=72&background=3EA7FD&color=fff&bold=true`
                : ""
            }
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
