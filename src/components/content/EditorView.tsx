import React, { useEffect, useRef } from "react";

interface EditorViewProps {
  title: string;
  content: string;
  onChange: (value: string) => void;
  searchQuery?: string;
}

export default function EditorView({ title, content, onChange, searchQuery }: EditorViewProps) {
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

  // Handle search highlighting
  useEffect(() => {
    if (searchQuery && textareaRef.current) {
      const index = content.toLowerCase().indexOf(searchQuery.toLowerCase());
      if (index !== -1) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(index, index + searchQuery.length);
        
        // Scroll to the selection if possible
        const lineHeight = 36; // Approx leading-[2] * 18px
        const linesBefore = content.substring(0, index).split("\n").length;
        const scrollTop = (linesBefore - 1) * lineHeight;
        
        // Since it's auto-height and in a scrollable container, we might need to scroll the parent
        const parent = textareaRef.current.closest(".overflow-y-auto");
        if (parent) {
          parent.scrollTo({
            top: scrollTop,
            behavior: "smooth"
          });
        }
      }
    }
  }, [searchQuery, content]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[24px] font-sans font-bold text-[#0F172A]">
          {title}
        </h2>
        <p className="text-[13px] text-slate-400 font-sans">
          Markdown supported: <code className="text-slate-500">## Heading</code>, <code className="text-slate-500">- bullet</code>, <code className="text-slate-500">**bold**</code>
        </p>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          onChange(e.target.value);
          adjustHeight();
        }}
        className="w-full font-sans text-[18px] leading-[2] text-slate-500 font-medium bg-transparent border-none focus:ring-0 resize-none p-0 overflow-hidden"
        placeholder="Start writing..."
      />
    </div>
  );
}
