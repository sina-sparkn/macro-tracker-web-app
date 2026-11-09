import React from "react";

export const FoodSkeleton: React.FC = () => {
  return (
    <div className="apple-card p-4 flex flex-col justify-between gap-3 animate-pulse pointer-events-none">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-12 rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="h-3 w-16 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
        </div>
        <div className="h-5 w-3/4 rounded bg-black/[0.06] dark:bg-white/[0.08] mt-1" />
      </div>

      <div className="pt-3 border-t border-[var(--apple-border)] flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
        <div className="h-4 w-20 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>
    </div>
  );
};
