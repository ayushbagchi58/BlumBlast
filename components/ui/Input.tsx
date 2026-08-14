import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "glass";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", label, error, helperText, leftIcon, rightIcon, disabled, variant = "default", value, defaultValue, onChange, ...props },
    ref
  ) => {
    const isGlass = variant === "glass";
    
    // Build input props conditionally to avoid controlled/uncontrolled conflicts
    const inputProps: Record<string, unknown> = {
      ref,
      type,
      disabled,
      className: cn(
        "w-full rounded-lg border px-4 py-2.5 transition-colors duration-200",
        isGlass
          ? "bg-white/10 text-white placeholder:text-white/50 border-white/20 hover:border-white/30 focus:border-white/40 focus:bg-white/15 backdrop-blur-sm"
          : "bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 hover:border-gray-400",
        "focus:border-transparent focus:outline-none focus:ring-2",
        isGlass ? "focus:ring-blue-400/50" : "focus:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && (isGlass ? "border-red-300 focus:ring-red-400/50" : "border-red-500 focus:ring-red-500"),
        leftIcon && "pl-10",
        rightIcon && "pr-10",
        className
      ),
      ...props,
    };

    // Only add value/onChange if provided (controlled), otherwise use defaultValue (uncontrolled)
    if (value !== undefined || onChange !== undefined) {
      inputProps.value = value ?? '';
      if (onChange) inputProps.onChange = onChange;
    } else if (defaultValue !== undefined) {
      inputProps.defaultValue = defaultValue;
    }
    
    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            "mb-1.5 block text-sm font-medium",
            isGlass ? "text-white" : "text-gray-700"
          )}>
            {label}
            {props.required && <span className={cn("ml-1", isGlass ? "text-red-300" : "text-red-500")}>*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              isGlass ? "text-white/70" : "text-gray-400"
            )}>{leftIcon}</div>
          )}

          <input {...inputProps} />

          {rightIcon && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              isGlass ? "text-white/70" : "text-gray-400"
            )}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className={cn(
            "mt-1.5 flex items-center gap-1 text-sm",
            isGlass ? "text-red-300" : "text-red-600"
          )}>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && <p className={cn(
          "mt-1.5 text-sm",
          isGlass ? "text-white/80" : "text-gray-500"
        )}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
