import React, { useMemo } from "react";
import { LayoutDashboard, Users, Trophy, MessageSquare, FileText, HelpCircle, Settings, LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/assets/assets";
import { useAuth } from "@/context/AuthContext";

const LANDING_LOGIN_URL =
  (import.meta.env.VITE_LANDING_LOGIN_URL as string | undefined) ??
  "https://sportfinding.com/login";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Trophy, label: "Match", path: "/match" },
  { icon: MessageSquare, label: "Reviews Moderation", path: "/reviews" },
  { icon: FileText, label: "Content Management", path: "/content" },
  { icon: HelpCircle, label: "Support Request", path: "/support" },
  { icon: Settings, label: "Setting", path: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.replace(LANDING_LOGIN_URL);
  };

  const renderedMenuItems = useMemo(() => {
    return menuItems.map((item) => {
      const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
      return (
        <Link
          key={item.label}
          to={item.path}
          onClick={() => {
            if (window.innerWidth < 1024) onClose();
          }}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-sans font-medium text-base relative group",
            isActive
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "text-sidebarText hover:bg-slate-50 hover:text-darkText"
          )}
        >
          <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2px]" : "stroke-[1.5px]")} />
          <span>{item.label}</span>
          {/* {isActive && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#1D4ED8] rounded-l-full" />
          )} */}
        </Link>
      );
    });
  }, [location.pathname, onClose]);

  return (
    <aside className={cn(
      "w-[280px] h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center ">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Trophy className="w-6 h-6 text-white" />
          </div> */}
          <img src={Logo} alt="Logo" className="w-20 h-20 " />
          <span className="font-heading text-2xl font-bold text-[#0F172A] tracking-tight">SportFinding</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          title="Close menu"
          className="lg:hidden p-2 text-sidebarText hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {renderedMenuItems}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[#EF4444] hover:bg-destructive/10 transition-colors font-sans font-medium">
          <LogOut className="w-5 h-5 stroke-[2px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
