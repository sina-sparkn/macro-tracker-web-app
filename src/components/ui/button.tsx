import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#ff6947] to-[#ff3b30] text-white shadow-md shadow-[#ff3b30]/20 hover:brightness-105 active:scale-[0.97]",
        destructive:
          "bg-red-500 text-white shadow-xs hover:bg-red-600 active:bg-red-700",
        outline:
          "border border-[var(--apple-border)] bg-[var(--apple-surface)] text-[var(--apple-text-primary)] hover:bg-[var(--apple-surface-secondary)] hover:border-[var(--apple-border-strong)]",
        secondary:
          "bg-[var(--apple-surface-secondary)] text-[var(--apple-text-primary)] border border-[var(--apple-border)] hover:bg-[var(--apple-surface-tertiary)] hover:border-[var(--apple-border-strong)]",
        ghost:
          "text-[var(--apple-text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[var(--apple-text-primary)]",
        link: "text-[var(--apple-accent)] underline-offset-4 hover:underline",
        pill: "btn-apple-primary",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-full px-3.5 text-xs",
        lg: "h-13 rounded-full px-8 text-base",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
