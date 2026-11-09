import React from "react";
import { Plus } from "lucide-react";
import { ScannedLabel, UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";
import { formatNumber, formatPriceDisplay } from "../utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./ui/dialog";
import { Button } from "./ui/button";

interface NutritionModalProps {
  scannedResult: ScannedLabel | null;
  portionServings: number;
  userProfile: UserProfile;
  setPortionServings: (val: number) => void;
  onClose: () => void;
  onLogToDiary: () => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({
  scannedResult,
  portionServings,
  userProfile,
  setPortionServings,
  onClose,
  onLogToDiary
}) => {
  if (!scannedResult) return null;

  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const calories = Math.round(scannedResult.calories * portionServings);
  const protein = Number((scannedResult.protein * portionServings).toFixed(1));
  const carbs = Number((scannedResult.totalCarbohydrate * portionServings).toFixed(1));
  const fat = Number((scannedResult.totalFat * portionServings).toFixed(1));
  const sodium = Math.round(scannedResult.sodium * portionServings);

  return (
    <Dialog open={!!scannedResult} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-[28px] border-[var(--apple-border)]">
        {/* HEADER */}
        <DialogHeader className="p-5 sm:p-6 border-b border-[var(--apple-border)] text-start">
          <div className="flex flex-col gap-1 min-w-0 pr-8 rtl:pr-0 rtl:pl-8">
            <span className="text-xs font-semibold text-[#ff3b30] uppercase tracking-wider">
              {isFa ? "ارزش و مشخصات غذایی" : "Nutrition Facts"}
            </span>
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-[var(--apple-text-primary)] leading-snug break-words">
              {scannedResult.productName}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-xs text-[var(--apple-text-secondary)] mt-0.5">
              {scannedResult.brand && <span>{scannedResult.brand}</span>}
              {scannedResult.brand && <span>•</span>}
              <span>{scannedResult.servingSize || (isFa ? "۱ سهم" : "1 serving")}</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* BODY (SCROLLABLE) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* PORTION ADJUSTER */}
          <div className="p-4 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-[var(--apple-text-primary)] block">
                {isFa ? "تعداد سهم مصرفی" : "Portion Multiplier"}
              </span>
              <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                {isFa ? "تنظیم متناسب کالری و درشت‌مغذی‌ها" : "Scales all nutritional values"}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setPortionServings(Math.max(0.5, portionServings - 0.5))}
                aria-label={isFa ? "کاهش سهم" : "Decrease portion"}
                className="w-8 h-8 rounded-full border border-[var(--apple-border)] hover:border-[#ff3b30] font-bold text-sm"
              >
                -
              </Button>
              <span className="text-sm font-bold text-[var(--apple-text-primary)] w-10 text-center tabular-nums">
                {isFa ? `${formatNumber(portionServings, true, 1)}×` : `${portionServings}×`}
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setPortionServings(portionServings + 0.5)}
                aria-label={isFa ? "افزایش سهم" : "Increase portion"}
                className="w-8 h-8 rounded-full border border-[var(--apple-border)] hover:border-[#ff3b30] font-bold text-sm"
              >
                +
              </Button>
            </div>
          </div>

          {/* HERO CALORIES & 3 MACROS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Calories (Hero) */}
            <div className="p-3 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-center flex flex-col justify-center">
              <span className="text-[10px] text-[var(--apple-text-secondary)] font-medium uppercase">
                {isFa ? "انرژی کل" : "Energy"}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#ff3b30] tabular-nums my-0.5">
                {formatNumber(calories, isFa)}
              </span>
              <span className="text-[10px] text-[var(--apple-text-tertiary)]">
                {isFa ? "کالری" : "kcal"}
              </span>
            </div>

            {/* Protein */}
            <div className="p-3 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-center flex flex-col justify-center">
              <span className="text-[10px] text-[var(--apple-text-secondary)] font-medium uppercase">
                {isFa ? "پروتئین" : "Protein"}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#0a84ff] tabular-nums my-0.5">
                {formatNumber(protein, isFa, 1)}
              </span>
              <span className="text-[10px] text-[var(--apple-text-tertiary)]">
                {isFa ? "گرم" : "g"}
              </span>
            </div>

            {/* Carbs */}
            <div className="p-3 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-center flex flex-col justify-center">
              <span className="text-[10px] text-[var(--apple-text-secondary)] font-medium uppercase">
                {isFa ? "کربوهیدرات" : "Carbs"}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#ff9f0a] tabular-nums my-0.5">
                {formatNumber(carbs, isFa, 1)}
              </span>
              <span className="text-[10px] text-[var(--apple-text-tertiary)]">
                {isFa ? "گرم" : "g"}
              </span>
            </div>

            {/* Fat */}
            <div className="p-3 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-center flex flex-col justify-center">
              <span className="text-[10px] text-[var(--apple-text-secondary)] font-medium uppercase">
                {isFa ? "چربی" : "Fat"}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#ff375f] tabular-nums my-0.5">
                {formatNumber(fat, isFa, 1)}
              </span>
              <span className="text-[10px] text-[var(--apple-text-tertiary)]">
                {isFa ? "گرم" : "g"}
              </span>
            </div>
          </div>

          {/* SECONDARY MICROS & COST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--apple-text-secondary)]">{isFa ? "سدیم:" : "Sodium:"}</span>
                <span className="font-semibold text-[var(--apple-text-primary)] tabular-nums">
                  {isFa ? `${formatNumber(sodium, true)} میلی‌گرم` : `${formatNumber(sodium, false)} mg`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--apple-text-secondary)]">{isFa ? "کلسترول:" : "Cholesterol:"}</span>
                <span className="font-semibold text-[var(--apple-text-primary)] tabular-nums">
                  {isFa ? `${formatNumber(scannedResult.cholesterol || 0, true)} میلی‌گرم` : `${formatNumber(scannedResult.cholesterol || 0, false)} mg`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--apple-text-secondary)]">{isFa ? "فیبر:" : "Fiber:"}</span>
                <span className="font-semibold text-[var(--apple-text-primary)] tabular-nums">
                  {isFa ? `${formatNumber(scannedResult.dietaryFiber || 0, true)} گرم` : `${formatNumber(scannedResult.dietaryFiber || 0, false)} g`}
                </span>
              </div>
            </div>

            {!userProfile.hidePrices && (
              <div className="p-4 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col justify-between">
                <span className="text-[var(--apple-text-secondary)]">
                  {isFa ? "برآورد هزینه این سهم" : "Estimated Portion Cost"}
                </span>
                <div className="text-lg font-bold text-[var(--apple-text-primary)] tabular-nums my-1">
                  {formatPriceDisplay(
                    scannedResult.estimatedPrice?.amountToman,
                    scannedResult.estimatedPrice?.amountUSD,
                    userProfile,
                    portionServings
                  )}
                </div>
                <span className="text-[10px] text-[var(--apple-text-tertiary)]">
                  {isFa ? "بر اساس میانگین بازار روز ایران" : "Based on domestic market index"}
                </span>
              </div>
            )}
          </div>

          {/* SUMMARY / NOTES */}
          {scannedResult.summary && (
            <div className="p-4 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-xs text-[var(--apple-text-secondary)] leading-relaxed">
              <span className="font-semibold text-[var(--apple-text-primary)] block mb-1">
                {isFa ? "تحلیل هوشمند نوتری‌اسکن:" : "Smart Food Analysis:"}
              </span>
              <p>{scannedResult.summary}</p>
            </div>
          )}

          {/* INGREDIENTS LIST */}
          {scannedResult.ingredientsList && scannedResult.ingredientsList.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-xs">
              <span className="font-semibold text-[var(--apple-text-primary)] block mb-1.5">
                {isFa ? "ترکیبات و مواد تشکیل‌دهنده:" : "Ingredients:"}
              </span>
              <p className="text-[var(--apple-text-secondary)] leading-relaxed">
                {scannedResult.ingredientsList.join(" · ")}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 sm:p-6 border-t border-[var(--apple-border)] flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-5 py-3 text-xs sm:text-sm font-medium rounded-full"
          >
            {isFa ? "انصراف" : "Cancel"}
          </Button>

          <Button
            onClick={onLogToDiary}
            className="flex-1 py-3 text-xs sm:text-sm font-semibold shadow-lg rounded-full"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isFa
                ? `ثبت در یادداشت (${formatNumber(calories, true)} کالری)`
                : `Add to Diary (${formatNumber(calories, false)} kcal)`}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionModal;
