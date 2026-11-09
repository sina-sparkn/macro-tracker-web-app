import React from "react";

export interface SegmentOption<T extends string | number> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AppleSegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function AppleSegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className = "",
  size = "md"
}: AppleSegmentedControlProps<T>) {
  const padClass = size === "sm" ? "py-1 px-2.5 sm:px-3 text-xs" : "py-1.5 px-2.5 sm:px-3.5 text-xs";

  return (
    <div
      role="radiogroup"
      className={`apple-segmented-container relative select-none max-w-full overflow-x-auto no-scrollbar flex items-center ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.id === value;
        const Icon = opt.icon;
        return (
          <button
            key={String(opt.id)}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.id)}
            className={`apple-segmented-item flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-200 cursor-pointer ${padClass} ${
              isActive ? "apple-segmented-item-active" : ""
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
