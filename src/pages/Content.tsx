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
      const res = await apiClient.get(`/api/v1/admin/content/${encodeURIComponent(sectionName)}`);
      return res.data as { section: string; title: string; content: string };
    },
  });

  // Sync editor content when data loads or tab changes
  useEffect(() => {
    if (data?.content !== undefined) {
      setCurrentContent(data.content);
    }
  }, [data]);

  const filteredTabs = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return Object.keys(sectionMap) as ContentTab[];
    return (Object.keys(sectionMap) as ContentTab[]).filter((tab) => {
      return sectionLabels[tab].toLowerCase().includes(s);
    });
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
      await apiClient.put(`/api/v1/admin/content/${encodeURIComponent(sectionName)}`, {
        title: data?.title || sectionLabels[activeTab],
        content: currentContent,
      });
      queryClient.invalidateQueries({ queryKey: ["content", sectionName] });
      toast.success("Content saved successfully");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">
          Content Management
        </h1>
        <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">
          Edit platform content and policies
        </p>
      </header>

      <section aria-label="Controls" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search Content..."
            className="pl-12 bg-[#F8FAFC] border-slate-200 rounded-xl h-12 font-sans text-[15px] focus:ring-primary/20"
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

      <section aria-label="Editor" className="flex-1 bg-white rounded-[24px] p-8 md:p-10 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <EditorView
            title={data?.title || sectionLabels[activeTab]}
            content={currentContent}
            onChange={setCurrentContent}
            searchQuery={search}
          />
        )}
      </section>

      <SaveAction onSave={handleSave} disabled={!isDirty || isLoading || isSaving} isSaving={isSaving} />
    </main>
  );
};

export default memo(Content);
