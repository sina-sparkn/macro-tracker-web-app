import React from "react";
import { formatNumber } from "../../utils/formatters";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";

interface MacroSplitSummaryProps {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  isFa?: boolean;
}

export const MacroSplitSummary: React.FC<MacroSplitSummaryProps> = ({
  calorieGoal,
  proteinGoal,
  carbsGoal,
  fatGoal,
  isFa = false
}) => {
  const proteinKcal = Math.round(proteinGoal * 4);
  const carbsKcal = Math.round(carbsGoal * 4);
  const fatKcal = Math.round(fatGoal * 9);
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal;

  const validTotal = totalMacroKcal > 0 ? totalMacroKcal : 1;
  const proteinPct = Math.min(Math.max(Math.round((proteinKcal / validTotal) * 100), 0), 100);
  const carbsPct = Math.min(Math.max(Math.round((carbsKcal / validTotal) * 100), 0), 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  const diffKcal = totalMacroKcal - calorieGoal;
  const diffPct = calorieGoal > 0 ? Math.abs(diffKcal) / calorieGoal : 0;
  const isAligned = diffPct <= 0.10;

  return (
    <div className="p-4 sm:p-4.5 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col gap-3 select-none transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--apple-text-primary)]">
            {isFa ? "توزیع انرژی درشت‌مغذی‌ها" : "Macro Energy Distribution"}
          </span>
          <span className="text-[11px] text-[var(--apple-text-tertiary)] tabular-nums">
            {isFa
              ? `(مجموع: ${formatNumber(totalMacroKcal, true)} کالری)`
              : `(Sum: ${formatNumber(totalMacroKcal, false)} kcal)`}
          </span>
        </div>

        {/* Alignment badge using shadcn Badge */}
        <Badge
          variant={isAligned ? "success" : "destructive"}
          className="text-[11px] font-medium"
        >
          {isAligned ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isFa ? "هماهنگ با هدف کالری" : "Balanced with goal"}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                {isFa
                  ? `${formatNumber(Math.abs(diffKcal), true)} کالری ${diffKcal > 0 ? "بیشتر" : "کمتر"}`
                  : `${Math.abs(diffKcal)} kcal ${diffKcal > 0 ? "surplus" : "deficit"}`}
              </span>
            </>
          )}
        </Badge>
      </div>

      {/* Segmented Stacked Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden flex flex-row rtl:flex-row shadow-xs">
        {/* Protein (Blue) */}
        <div
          style={{ width: `${proteinPct}%` }}
          className="h-full bg-[#0a84ff] transition-[width] duration-300 ease-out"
          title={`${isFa ? "پروتئین" : "Protein"}: ${proteinPct}%`}
        />
        {/* Carbs (Amber) */}
        <div
          style={{ width: `${carbsPct}%` }}
          className="h-full bg-[#ff9f0a] transition-[width] duration-300 ease-out"
          title={`${isFa ? "کربوهیدرات" : "Carbs"}: ${carbsPct}%`}
        />
        {/* Fat (Pink) */}
        <div
          style={{ width: `${fatPct}%` }}
          className="h-full bg-[#ff375f] transition-[width] duration-300 ease-out"
          title={`${isFa ? "چربی" : "Fat"}: ${fatPct}%`}
        />
      </div>

      {/* Stat legend row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-0.5">
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Protein */}
          <div className="inline-flex items-center gap-1.5 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#0a84ff] shrink-0" />
            <span className="font-medium text-[var(--apple-text-secondary)]">
              {isFa ? "پروتئین:" : "Protein:"}
            </span>
            <span className="font-semibold text-[var(--apple-text-primary)]">
              {formatNumber(proteinPct, isFa)}٪
            </span>
            <span className="text-[11px] text-[var(--apple-text-tertiary)] hidden xs:inline">
              ({formatNumber(proteinKcal, isFa)} {isFa ? "کالری" : "kcal"})
            </span>
          </div>

          {/* Carbs */}
          <div className="inline-flex items-center gap-1.5 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#ff9f0a] shrink-0" />
            <span className="font-medium text-[var(--apple-text-secondary)]">
              {isFa ? "کربوهیدرات:" : "Carbs:"}
            </span>
            <span className="font-semibold text-[var(--apple-text-primary)]">
              {formatNumber(carbsPct, isFa)}٪
            </span>
            <span className="text-[11px] text-[var(--apple-text-tertiary)] hidden xs:inline">
              ({formatNumber(carbsKcal, isFa)} {isFa ? "کالری" : "kcal"})
            </span>
          </div>

          {/* Fat */}
          <div className="inline-flex items-center gap-1.5 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#ff375f] shrink-0" />
            <span className="font-medium text-[var(--apple-text-secondary)]">
              {isFa ? "چربی:" : "Fat:"}
            </span>
            <span className="font-semibold text-[var(--apple-text-primary)]">
              {formatNumber(fatPct, isFa)}٪
            </span>
            <span className="text-[11px] text-[var(--apple-text-tertiary)] hidden xs:inline">
              ({formatNumber(fatKcal, isFa)} {isFa ? "کالری" : "kcal"})
            </span>
          </div>
        </div>

        {/* Calorie conversion formula hint */}
        <span className="text-[10.5px] text-[var(--apple-text-tertiary)] hidden md:inline">
          {isFa ? "پ: ۴ · ک: ۴ · چ: ۹ کالری/گرم" : "P: 4 · C: 4 · F: 9 kcal/g"}
        </span>
      </div>
    </div>
  );
};
