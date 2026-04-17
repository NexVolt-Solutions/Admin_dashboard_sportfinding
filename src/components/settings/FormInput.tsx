import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  isTextArea?: boolean;
  className?: string;
  disabled?: boolean;
}

const FormInput = React.memo(({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  isTextArea = false,
  className,
  disabled = false,
}: FormInputProps) => {
  const inputClasses = cn(
    "w-full px-5 py-4 rounded-xl border border-slate-200 bg-[#F8FAFC] font-sans text-[15px] font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#60A5FA] transition-all",
    error ? "border-rose-500" : "border-slate-200",
    isTextArea ? "min-h-[140px] resize-none leading-relaxed" : "h-14",
    disabled && "opacity-60 cursor-not-allowed bg-slate-50"
  );

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block font-sans font-medium text-[14px] text-slate-400">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
        />
      )}
      {error && (
        <p className="text-xs text-destructive font-sans">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
