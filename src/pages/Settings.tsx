import { useState } from "react";
import { User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import ProfileForm from "@/components/settings/ProfileForm";
import SecurityForm from "@/components/settings/SecurityForm";

type SettingsTab = "profile" | "account";

const tabs: { id: SettingsTab; label: string; icon: typeof User; description: string }[] = [
  { id: "profile", label: "Profile", icon: User, description: "Your personal details" },
  { id: "account", label: "Security", icon: Lock, description: "Password & credentials" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, security and preferences
        </p>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] items-start">
        {/* Sidebar card (taller) */}
        <aside className="rounded-xl border border-border bg-card shadow-sm p-3 flex flex-col gap-1 h-full min-h-[450px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  strokeWidth={isActive ? 2.25 : 2}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Active form card */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {activeTab === "profile" ? <ProfileForm /> : <SecurityForm />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
