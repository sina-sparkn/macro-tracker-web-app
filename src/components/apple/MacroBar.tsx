import React, { useEffect, useState } from "react";
import { formatMacroRatio } from "../../utils/formatters";

export type MacroType = "protein" | "carbs" | "fat";

interface MacroBarProps {
  type: MacroType;
  label: string;
  current: number;
  goal: number;
  isFa?: boolean;
}

const MACRO_CONFIG: Record<
  MacroType,
  { colorClass: string; bgClass: string; dotColor: string }
> = {
  protein: {
    colorClass: "bg-[#007aff] dark:bg-[#0a84ff]",
    bgClass: "bg-[#007aff]/10 dark:bg-[#0a84ff]/15",
    dotColor: "#0a84ff"
  },
  carbs: {
    colorClass: "bg-[#d97706] dark:bg-[#ff9f0a]",
    bgClass: "bg-[#d97706]/10 dark:bg-[#ff9f0a]/15",
    dotColor: "#ff9f0a"
  },
  fat: {
    colorClass: "bg-[#e11d48] dark:bg-[#ff375f]",
    bgClass: "bg-[#e11d48]/10 dark:bg-[#ff375f]/15",
    dotColor: "#ff375f"
  }
};

export const MacroBar: React.FC<MacroBarProps> = ({
  type,
  label,
  current,
  goal,
  isFa = false
}) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const cfg = MACRO_CONFIG[type];

  const percent = goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedWidth(percent);
    }, 120);
    return () => clearTimeout(timeout);
  }, [percent]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label and Ratio */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-[var(--apple-text-secondary)]">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: cfg.dotColor }}
          />
          <span>{label}</span>
        </div>
        <span className="font-medium text-[var(--apple-text-primary)] tabular-nums">
          {formatMacroRatio(current, goal, isFa)}
        </span>
      </div>

      {/* Slim rounded progress bar filling from right in RTL, from left in LTR */}
      <div
        className={`w-full h-2 rounded-full overflow-hidden ${cfg.bgClass} relative`}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={`${label}: ${current} / ${goal}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.colorClass}`}
          style={{
            width: `${animatedWidth}%`
          }}
        />
      </div>
    </div>
  );
};
