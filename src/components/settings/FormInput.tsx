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

const baseField =
  "w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-muted-foreground hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60";

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
  const fieldClasses = cn(
    baseField,
    isTextArea ? "min-h-35 resize-none py-2.5 leading-relaxed" : "h-10 py-2",
    error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={fieldClasses}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={fieldClasses}
          disabled={disabled}
          autoComplete="off"
        />
      )}
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
