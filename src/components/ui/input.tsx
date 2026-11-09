import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[var(--apple-border)] bg-[var(--apple-surface-secondary)] px-3.5 py-2 text-base sm:text-xs text-[var(--apple-text-primary)] shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-[var(--apple-text-tertiary)] focus-visible:outline-none focus-visible:border-[var(--apple-accent)] focus-visible:ring-2 focus-visible:ring-[var(--apple-accent-glow)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
