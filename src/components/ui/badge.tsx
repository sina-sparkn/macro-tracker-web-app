import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-[#ff6947] to-[#ff3b30] text-white shadow-xs",
        secondary:
          "border-transparent bg-[var(--apple-surface-secondary)] text-[var(--apple-text-secondary)]",
        destructive:
          "border-transparent bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20",
        outline:
          "border border-[var(--apple-border)] text-[var(--apple-text-primary)] bg-[var(--apple-surface)]",
        protein:
          "border-transparent bg-[#0a84ff]/10 text-[#0a84ff] dark:text-[#0a84ff]",
        carbs:
          "border-transparent bg-[#ff9f0a]/10 text-[#ff9f0a] dark:text-[#ff9f0a]",
        fat:
          "border-transparent bg-[#ff375f]/10 text-[#ff375f] dark:text-[#ff375f]",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    children?: React.ReactNode;
    className?: string;
    title?: string;
  };

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
