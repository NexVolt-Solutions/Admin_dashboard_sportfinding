import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import ProfileForm from "@/components/settings/ProfileForm";
import SecurityForm from "@/components/settings/SecurityForm";

type SettingsTab = "profile" | "account";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Lock },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">Settings</h1>
      </header>

      <div className="flex-1 bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row">
        {/* Vertical Tab Navigation */}
        <aside className="w-full md:w-[280px] p-6 space-y-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-sans font-bold text-[15px]",
                  isActive
                    ? "bg-[#60A5FA] text-white shadow-lg shadow-blue-100"
                    : "text-slate-400 hover:bg-slate-50 hover:text-[#0F172A]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Form Content */}
        <main className="flex-1 p-8 md:p-10 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "profile" ? <ProfileForm /> : <SecurityForm />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
