import React from "react";
import { cn } from "@/lib/utils";

export type ContentTab = "TOS" | "PRIVACY" | "HELP";

interface ContentSwitcherProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  availableTabs?: ContentTab[];
}

const allTabs: { id: ContentTab; label: string }[] = [
  { id: "TOS", label: "Terms of Service" },
  { id: "PRIVACY", label: "Privacy Policy" },
  { id: "HELP", label: "Help & Support" },
];

export default function ContentSwitcher({ activeTab, onTabChange, availableTabs }: ContentSwitcherProps) {
  const displayTabs = availableTabs 
    ? allTabs.filter(t => availableTabs.includes(t.id))
    : allTabs;

  return (
    <div className="flex items-center gap-3">
      {displayTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-6 h-11 font-sans font-medium text-[13px] transition-all whitespace-nowrap rounded-xl border",
            activeTab === tab.id
              ? "bg-[#60A5FA] text-white border-[#60A5FA] shadow-sm"
              : "bg-white text-[#60A5FA] border-[#60A5FA] hover:bg-blue-50"
          )}
        >
          {tab.label}
        </button>
      ))}
      {displayTabs.length === 0 && (
        <p className="text-sm text-slate-400 font-sans px-4 italic">No matching sections found</p>
      )}
    </div>
  );
}
