import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: account } = useQuery<{ full_name: string; email: string }>({
    queryKey: ["admin-account"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/account");
      return res.data;
    },
  });

  const initials = account?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-[64px] bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between lg:justify-end px-4 sm:px-6 z-40 shadow-sm">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        title="Open menu"
        className="lg:hidden p-2 text-sidebarText hover:bg-muted rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary/10">
          <AvatarImage
            src={account ? `https://ui-avatars.com/api/?name=${encodeURIComponent(account.full_name)}&size=40&background=60A5FA&color=fff` : ""}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-primary text-white font-sans font-bold text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="text-left hidden sm:block">
          <p className="text-[15px] font-sans font-bold text-[#0F172A] leading-tight">
            {account?.full_name || "Admin"}
          </p>
          <p className="text-xs text-slate-400 font-sans">
            {account?.email || ""}
          </p>
        </div>
      </div>
    </header>
  );
}
