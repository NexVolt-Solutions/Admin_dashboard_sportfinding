import { useEffect, useRef } from "react";

interface EditorViewProps {
  title: string;
  content: string;
  onChange: (value: string) => void;
  searchQuery?: string;
  showHeader?: boolean;
}

export default function EditorView({
  title,
  content,
  onChange,
  searchQuery,
  showHeader = true,
}: EditorViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  useEffect(() => {
    if (searchQuery && textareaRef.current) {
      const index = content.toLowerCase().indexOf(searchQuery.toLowerCase());
      if (index !== -1) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          index,
          index + searchQuery.length
        );
        const lineHeight = 28;
        const linesBefore = content.substring(0, index).split("\n").length;
        const scrollTop = (linesBefore - 1) * lineHeight;
        const parent = textareaRef.current.closest(".overflow-y-auto");
        if (parent) {
          parent.scrollTo({ top: scrollTop, behavior: "smooth" });
        }
      }
    }
  }, [searchQuery, content]);

  return (
    <div className="space-y-5">
      {showHeader && (
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          onChange(e.target.value);
          adjustHeight();
        }}
        placeholder="Start writing…"
        className="w-full resize-none overflow-hidden bg-transparent p-0 text-[15px] leading-[1.75] text-foreground/85 placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}
