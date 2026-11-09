import React, { useMemo } from "react";
import { Plus, Minus, Droplets } from "lucide-react";
import { formatNumber } from "../../utils/formatters";
import { playWaterDropChime } from "../ConsoleSidebars";
import { Button } from "../ui/button";

interface WaterTrackerProps {
  totalGlasses: number;
  targetGlasses?: number;
  isFa?: boolean;
  onAddGlass: (amount?: number) => void;
  onRemoveGlass: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  totalGlasses,
  targetGlasses = 8,
  isFa = false,
  onAddGlass,
  onRemoveGlass
}) => {
  const currentMl = totalGlasses * 250;
  const targetMl = targetGlasses * 250;
  const percent = Math.min(Math.round((totalGlasses / targetGlasses) * 100), 100);

  const handlePlus = () => {
    playWaterDropChime();
    onAddGlass(1);
  };

  const handleMinus = () => {
    onRemoveGlass();
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0284c7]/10 dark:bg-[#32ade6]/15 flex items-center justify-center text-[#0284c7] dark:text-[#32ade6]">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--apple-text-primary)]">
              {isFa ? "آب مصرفی" : "Water Intake"}
            </h4>
            <span className="text-[11px] text-[var(--apple-text-secondary)] tabular-nums">
              {isFa
                ? `${formatNumber(currentMl, true)} از ${formatNumber(targetMl, true)} میلی‌لیتر`
                : `${formatNumber(currentMl, false)} of ${formatNumber(targetMl, false)} ml`}
            </span>
          </div>
        </div>

        {/* Glasses ratio badge */}
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0284c7]/10 dark:bg-[#32ade6]/15 text-[#0284c7] dark:text-[#32ade6] tabular-nums">
          {isFa
            ? `${formatNumber(totalGlasses, true)} / ${formatNumber(targetGlasses, true)} لیوان`
            : `${formatNumber(totalGlasses, false)} / ${formatNumber(targetGlasses, false)} gl`}
        </span>
      </div>

      {/* 8 Glass segments row */}
      <div
        className="grid grid-cols-8 gap-1.5 w-full my-1"
        role="progressbar"
        aria-valuenow={totalGlasses}
        aria-valuemin={0}
        aria-valuemax={targetGlasses}
        aria-label={isFa ? "میزان آب مصرف‌شده" : "Water progress"}
      >
        {Array.from({ length: targetGlasses }).map((_, idx) => {
          const isFilled = idx < totalGlasses;
          return (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                isFilled
                  ? "bg-[#0284c7] dark:bg-[#32ade6] shadow-sm shadow-[#0284c7]/20"
                  : "bg-black/[0.06] dark:bg-white/[0.08]"
              }`}
            />
          );
        })}
      </div>

      {/* Controls: Compact circular buttons (+/- 250ml) */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[var(--apple-text-tertiary)]">
          {isFa ? "هر لیوان: ۲۵۰ میلی‌لیتر" : "1 glass = 250 ml"}
        </span>

        <div className="flex items-center gap-2">
          {/* Decrement button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={handleMinus}
            disabled={totalGlasses <= 0}
            aria-label={isFa ? "کاهش ۱ لیوان آب" : "Remove 1 glass"}
            className="w-8 h-8 rounded-full border border-[var(--apple-border)] text-xs"
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>

          {/* Increment button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePlus}
            aria-label={isFa ? "نوشیدن ۱ لیوان آب (+۲۵۰ میلی‌لیتر)" : "Drink 1 glass (+250ml)"}
            className="h-8 px-3 rounded-full flex items-center gap-1.5 bg-[#0284c7]/10 hover:bg-[#0284c7]/20 dark:bg-[#32ade6]/15 dark:hover:bg-[#32ade6]/25 text-[#0284c7] dark:text-[#32ade6] font-medium text-xs border border-[#0284c7]/20 dark:border-[#32ade6]/25"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="tabular-nums font-semibold">
              {isFa ? "+۲۵۰ مل" : "+250 ml"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
