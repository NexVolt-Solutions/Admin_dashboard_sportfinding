import { useState, useMemo, useEffect, memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ContentSwitcher, { ContentTab } from "@/components/content/ContentSwitcher";
import EditorView from "@/components/content/EditorView";
import SaveAction from "@/components/content/SaveAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const sectionMap: Record<ContentTab, string> = {
  TOS: "terms-of-service",
  PRIVACY: "privacy-policy",
  HELP: "help-support",
};

const sectionLabels: Record<ContentTab, string> = {
  TOS: "Terms of Service",
  PRIVACY: "Privacy Policy",
  HELP: "Help & Support",
};

const Content = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>("TOS");
  const [currentContent, setCurrentContent] = useState("");
  const [search, setSearch] = useState("");

  const sectionName = sectionMap[activeTab];

  const { data, isLoading } = useQuery({
    queryKey: ["content", sectionName],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/admin/content/${encodeURIComponent(sectionName)}`
      );
      return res.data as { section: string; title: string; content: string };
    },
  });

  useEffect(() => {
    if (data?.content !== undefined) {
      setCurrentContent(data.content);
    }
  }, [data]);

  const filteredTabs = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return Object.keys(sectionMap) as ContentTab[];
    return (Object.keys(sectionMap) as ContentTab[]).filter((tab) =>
      sectionLabels[tab].toLowerCase().includes(s)
    );
  }, [search]);

  useEffect(() => {
    if (search && !filteredTabs.includes(activeTab) && filteredTabs.length > 0) {
      setActiveTab(filteredTabs[0]);
    }
  }, [filteredTabs, activeTab, search]);

  const isDirty = useMemo(() => {
    return data?.content !== undefined && currentContent !== data.content;
  }, [currentContent, data]);

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      await apiClient.put(
        `/api/v1/admin/content/${encodeURIComponent(sectionName)}`,
        {
          title: data?.title || sectionLabels[activeTab],
          content: currentContent,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["content", sectionName] });
      toast.success("Content saved successfully");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Content
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit platform policies and help articles
        </p>
      </header>

      <section
        aria-label="Controls"
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="relative w-full lg:max-w-96">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ContentSwitcher
          activeTab={activeTab}
          onTabChange={setActiveTab}
          availableTabs={filteredTabs}
        />
      </section>

      <section
        aria-label="Editor"
        className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        {isLoading ? (
          <>
            <div className="flex flex-col gap-1 mb-3">
              <Skeleton className="h-7 w-64" />
            </div>

            <div className="max-h-[52vh] md:max-h-[44vh] overflow-y-auto">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1 mb-3">
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                {data?.title || sectionLabels[activeTab]}
              </h2>
            </div>

            <div className="max-h-[52vh] md:max-h-[44vh] overflow-y-auto">
              <EditorView
                title={data?.title || sectionLabels[activeTab]}
                content={currentContent}
                onChange={setCurrentContent}
                searchQuery={search}
                showHeader={false}
              />
            </div>
          </>
        )}
      </section>

      <SaveAction
        onSave={handleSave}
        disabled={!isDirty || isLoading || isSaving}
        isSaving={isSaving}
      />
    </div>
  );
};

export default memo(Content);
