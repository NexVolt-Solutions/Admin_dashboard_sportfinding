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

export default function ContentSwitcher({
  activeTab,
  onTabChange,
  availableTabs,
}: ContentSwitcherProps) {
  const displayTabs = availableTabs
    ? allTabs.filter((t) => availableTabs.includes(t.id))
    : allTabs;

  if (displayTabs.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        No matching sections
      </p>
    );
  }

  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-xs"
    >
      {displayTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive ? "true" : "false"}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex h-8 items-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-muted text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
