import React, { useState, useEffect } from "react";
import { Utensils, Plus, Sparkles, Droplets, Check, AlertTriangle } from "lucide-react";
import { formatNumber } from "../../utils/formatters";

export interface HistogramBarData {
  date: string;
  shortLabel: string;
  weekday: string;
  value: number;
  secondaryValue?: number;
  label: string;
  isToday?: boolean;
  status: "empty" | "under" | "optimal" | "over";
  mealCount?: number;
}

interface AppleHistogramProps {
  mode: "daily" | "water" | "distribution";
  bars: HistogramBarData[];
  goalValue: number;
  goalLabel: string;
  unit: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onGoToScanner: () => void;
  isFa: boolean;
  rangeDays?: 7 | 14;
}

export const AppleHistogram: React.FC<AppleHistogramProps> = ({
  mode,
  bars,
  goalValue,
  goalLabel,
  unit,
  selectedDate,
  onSelectDate,
  onGoToScanner,
  isFa,
  rangeDays = 7
}) => {
  const [animated, setAnimated] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<HistogramBarData | null>(null);

  // Trigger bar grow animation on load or range/mode change
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, [bars, mode, rangeDays]);

  const maxDataVal = Math.max(...bars.map((b) => b.value), 0);
  const maxScale = Math.max(goalValue * 1.35, maxDataVal * 1.25, 10);
  const hasAnyData = bars.some((b) => b.value > 0);

  // Goal line position percentage from bottom
  const goalLineBottomPct = Math.min(Math.max(Math.round((goalValue / maxScale) * 100), 14), 80);

  return (
    <div className="relative w-full flex flex-col gap-3 select-none">
      {/* Chart Canvas Area */}
      <div className="relative h-64 sm:h-72 w-full p-4 sm:p-6 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col justify-end overflow-hidden transition-colors">
        {/* Horizontal Dashed Goal Line */}
        <div
          className="absolute inset-x-4 sm:inset-x-6 border-t border-dashed border-[#30d158]/70 dark:border-[#30d158]/60 z-15 pointer-events-none flex items-center justify-start"
          style={{ bottom: `${goalLineBottomPct}%` }}
        >
          <span className="bg-[var(--apple-surface)]/95 backdrop-blur-xs border border-[#30d158]/35 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-[#10b981] dark:text-[#30d158] shadow-xs tabular-nums -translate-y-1/2">
            {goalLabel}
          </span>
        </div>

        {/* Empty State Banner (Shown when no data exists for the period) */}
        {!hasAnyData && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-[var(--apple-surface)]/70 backdrop-blur-xs rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff6947]/15 to-[#ff3b30]/15 border border-[#ff3b30]/20 flex items-center justify-center text-[#ff3b30] mb-3 shadow-xs">
              <Utensils className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--apple-text-primary)] mb-1">
              {isFa ? "هنوز وعده‌ای ثبت نشده" : "No meals logged yet"}
            </h4>
            <p className="text-xs text-[var(--apple-text-secondary)] max-w-xs mb-4">
              {isFa
                ? "اولین وعده خود را اسکن یا ثبت کنید تا نمودار روزانه شما فعال شود."
                : "Scan or record your first meal to activate your daily nutrition ring and chart."}
            </p>
            <button
              onClick={onGoToScanner}
              type="button"
              className="btn-apple-primary px-5 py-2.5 text-xs font-semibold shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFa ? "اسکن اولین وعده" : "Scan First Meal"}</span>
            </button>
          </div>
        )}

        {/* Floating Tooltip when a bar is selected / tapped */}
        {activeTooltip && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-[fadeIn_0.15s_ease-out]">
            <div className="px-3 py-1.5 rounded-full bg-[var(--apple-surface)] border border-[var(--apple-border)] shadow-md text-xs font-semibold flex items-center gap-2">
              <span className="text-[var(--apple-text-primary)]">{activeTooltip.shortLabel}:</span>
              <span className="text-[#ff3b30] tabular-nums font-bold">
                {formatNumber(activeTooltip.value, isFa)} {unit}
              </span>
              {typeof activeTooltip.mealCount === "number" && activeTooltip.mealCount > 0 && (
                <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                  ({formatNumber(activeTooltip.mealCount, isFa)} {isFa ? "وعده" : "meals"})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bars Container - Scrollable with snap on mobile for 14-day range */}
        <div className="relative z-10 flex items-end justify-between gap-2 sm:gap-3 h-full pt-6 overflow-x-auto no-scrollbar scroll-smooth">
          {bars.map((bucket) => {
            const rawHeightPct =
              bucket.value > 0 ? Math.round((bucket.value / maxScale) * 100) : 4;
            const barHeightPct = animated ? Math.min(Math.max(rawHeightPct, 6), 94) : 4;
            const isSelected = selectedDate === bucket.date;

            // Bar color logic (Apple Fitness style)
            let barStyle = "bg-black/[0.08] dark:bg-white/[0.1]";
            if (bucket.value > 0) {
              if (bucket.status === "over") {
                // Amber when over limit (>105%)
                barStyle = "bg-gradient-to-t from-[#d97706] to-[#ff9f0a] shadow-xs shadow-[#ff9f0a]/20";
              } else if (bucket.status === "optimal" || bucket.value >= goalValue) {
                // Green when on-target
                barStyle = "bg-gradient-to-t from-[#10b981] to-[#30d158] shadow-xs shadow-[#30d158]/20";
              } else if (bucket.isToday) {
                // Today highlighted in signature orange-coral
                barStyle = "bg-gradient-to-t from-[#ff6947] to-[#ff3b30] shadow-sm shadow-[#ff3b30]/30";
              } else {
                // Past days in neutral soft tone
                barStyle = "bg-gradient-to-t from-slate-400/80 to-slate-300 dark:from-zinc-600 dark:to-zinc-500";
              }
            }

            return (
              <button
                key={bucket.date}
                type="button"
                onClick={() => {
                  onSelectDate(bucket.date);
                  setActiveTooltip(bucket);
                  setTimeout(() => setActiveTooltip(null), 3500);
                }}
                aria-label={`${bucket.shortLabel}: ${formatNumber(bucket.value, isFa)} ${unit}`}
                className={`group flex-1 min-w-[32px] sm:min-w-[40px] h-full flex flex-col items-center justify-end cursor-pointer rounded-xl p-1 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ff3b30] focus-visible:outline-hidden ${
                  isSelected ? "bg-black/[0.04] dark:bg-white/[0.06] scale-102" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                }`}
              >
                {/* Value top label */}
                <span
                  className={`text-[10px] sm:text-xs font-semibold tabular-nums mb-1 transition-colors ${
                    isSelected
                      ? "text-[#ff3b30] font-bold"
                      : bucket.value > 0
                        ? "text-[var(--apple-text-primary)]"
                        : "text-[var(--apple-text-tertiary)] opacity-60"
                  }`}
                >
                  {bucket.value > 0 ? formatNumber(bucket.value, isFa) : "—"}
                </span>

                {/* Rounded-top bar */}
                <div className="w-full max-w-[42px] flex-1 flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ease-out group-hover:scale-y-102 origin-bottom ${barStyle} ${
                      !hasAnyData ? "opacity-25" : ""
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                {/* Day label footer */}
                <div className="mt-2 text-center w-full truncate">
                  <span
                    className={`block text-[11px] sm:text-xs font-medium truncate ${
                      isSelected
                        ? "text-[#ff3b30] font-bold"
                        : bucket.isToday
                          ? "text-[var(--apple-text-primary)] font-semibold"
                          : "text-[var(--apple-text-secondary)]"
                    }`}
                  >
                    {bucket.shortLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean 3-Item Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-[var(--apple-text-secondary)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#ff6947] to-[#ff3b30]" />
            <span>{isFa ? "امروز" : "Today"}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#30d158]" />
            <span>{isFa ? "در محدوده هدف" : "Within Goal"}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f0a]" />
            <span>{isFa ? "فراتر از سقف (>۱۰۵٪)" : "Over Goal (>105%)"}</span>
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--apple-text-tertiary)]">
          <span className="w-3.5 border-t border-dashed border-[#30d158]" />
          <span>{isFa ? "خط هدف روزانه" : "Daily Goal Line"}</span>
        </span>
      </div>
    </div>
  );
};
