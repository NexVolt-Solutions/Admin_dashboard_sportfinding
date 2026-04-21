import React, { useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Trophy,
  MessageSquare,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
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
  { icon: MessageSquare, label: "Reviews", path: "/reviews" },
  { icon: FileText, label: "Content", path: "/content" },
  { icon: HelpCircle, label: "Support", path: "/support" },
  { icon: Settings, label: "Settings", path: "/settings" },
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

  const renderedMenuItems = useMemo(
    () =>
      menuItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== "/" && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-primary-muted text-primary"
                : "text-sidebarText hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-sidebarText group-hover:text-foreground"
              )}
              strokeWidth={isActive ? 2.25 : 1.75}
            />
            <span className="truncate">{item.label}</span>
            {isActive && (
              <span
                aria-hidden
                className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary"
              />
            )}
          </Link>
        );
      }),
    [location.pathname, onClose]
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-65 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img
            src={Logo}
            alt=""
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="font-heading text-lg font-bold tracking-tight text-foreground truncate">
            SportFinding
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          title="Close menu"
          className="rounded-md p-1.5 text-sidebarText transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pt-4 pb-2">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {renderedMenuItems}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
