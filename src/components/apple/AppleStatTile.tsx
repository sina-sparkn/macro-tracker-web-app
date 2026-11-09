import React from "react";

interface AppleStatTileProps {
  label: string;
  value: string;
  unit?: string;
  subtitle?: string;
  accentColor?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const AppleStatTile: React.FC<AppleStatTileProps> = ({
  label,
  value,
  unit,
  subtitle,
  accentColor,
  icon: Icon
}) => {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col justify-between gap-1 min-w-0 transition-colors">
      <div className="flex items-center justify-between text-xs text-[var(--apple-text-secondary)] font-medium">
        <span className="truncate">{label}</span>
        {Icon && (
          <span className="shrink-0 opacity-70">
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-0.5">
        <span
          className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums truncate leading-none"
          style={{ color: accentColor || "var(--apple-text-primary)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-medium text-[var(--apple-text-tertiary)] shrink-0">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="text-[11px] text-[var(--apple-text-tertiary)] truncate leading-tight">
          {subtitle}
        </span>
      )}
    </div>
  );
};
