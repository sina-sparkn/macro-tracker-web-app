import React from "react";
import { X, Plus, AlertTriangle, CheckCircle2, ShieldCheck, Scale, Receipt } from "lucide-react";
import { ScannedLabel, UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";

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

  const formatPrice = (toman?: number, usd?: number) => {
    if (userProfile.currency === "IRT" && toman !== undefined) {
      return `${(toman * portionServings).toLocaleString("fa-IR")} تومان`;
    }
    if (usd !== undefined) {
      return `$${(usd * portionServings).toFixed(2)}`;
    }
    return "-";
  };

  const calories = Math.round(scannedResult.calories * portionServings);
  const protein = Number((scannedResult.protein * portionServings).toFixed(1));
  const carbs = Number((scannedResult.totalCarbohydrate * portionServings).toFixed(1));
  const fat = Number((scannedResult.totalFat * portionServings).toFixed(1));
  const sodium = Math.round(scannedResult.sodium * portionServings);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 bg-[#08090a]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-[#111214] border border-[#27272a] rounded-xl w-full max-w-2xl my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#27272a] flex items-start justify-between gap-3 bg-[#18191d]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#ff3e00] font-bold uppercase tracking-wide mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ff3e00]" />
              <span>{isFa ? "ارزش غذایی تحلیل‌شده" : "Verified Nutrition Analysis"}</span>
            </div>
            <h3 id="modal-title" className="font-syne sm:font-vazirmatn text-xl sm:text-2xl font-extrabold text-[#f4f4f5] leading-tight">
              {scannedResult.productName}
            </h3>
            <p className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              {scannedResult.brand && (
                <span className="text-[#a1a1aa] font-medium tracking-wide">
                  {scannedResult.brand}
                </span>
              )}
              {scannedResult.brand && (
                <span className="text-[#52525b] select-none" aria-hidden="true">•</span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff3e00]/15 border border-[#ff3e00]/30 text-[#f4f4f5] font-semibold tracking-tight shadow-sm">
                <Scale className="w-3.5 h-3.5 text-[#ff3e00] shrink-0" />
                <span className="text-[#ff3e00] font-bold text-[11px] uppercase tracking-wider">
                  {isFa ? "اندازه سهم:" : "Portion:"}
                </span>
                <span className="text-[#ffffff] font-bold text-xs">
                  {scannedResult.servingSize || (isFa ? "۱ سهم استاندارد" : "1 standard serving")}
                </span>
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label={isFa ? "بستن پنجره" : "Close dialog"}
            className="min-h-[44px] min-w-[44px] p-2 text-[#9ca3af] hover:text-[#f4f4f5] hover:bg-[#27272a] rounded-lg transition-colors cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* PORTION ADJUSTER */}
          <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-sm text-[#f4f4f5] block font-bold">
                {isFa ? "تعداد سهم مصرفی" : "Portion Serving Multiplier"}
              </span>
              <span className="text-xs text-[#9ca3af]">
                {isFa ? "محاسبه مجدد کالری و هزینه بر اساس سهم انتخابی" : "Scales nutrition and cost based on servings"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPortionServings(Math.max(0.5, portionServings - 0.5))}
                type="button"
                aria-label={isFa ? "کاهش سهم" : "Decrease portion"}
                className="w-10 h-10 rounded-lg bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] flex items-center justify-center font-bold text-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
              >
                -
              </button>
              <span className="font-syne text-lg font-bold text-[#ff3e00] w-12 text-center">
                {portionServings}x
              </span>
              <button
                onClick={() => setPortionServings(portionServings + 0.5)}
                type="button"
                aria-label={isFa ? "افزایش سهم" : "Increase portion"}
                className="w-10 h-10 rounded-lg bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] flex items-center justify-center font-bold text-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
              >
                +
              </button>
            </div>
          </div>

          {/* MACRONUTRIENT HIGHLIGHTS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3 text-center">
              <span className="text-xs text-[#9ca3af] uppercase block">{isFa ? "انرژی" : "ENERGY"}</span>
              <span className="font-syne text-2xl font-extrabold text-[#ff3e00] block my-0.5">
                {isFa ? calories.toLocaleString("fa-IR") : calories}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "کالری" : "kcal"}</span>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3 text-center">
              <span className="text-xs text-[#9ca3af] uppercase block">{isFa ? "پروتئین" : "PROTEIN"}</span>
              <span className="font-syne text-2xl font-extrabold text-[#f4f4f5] block my-0.5">
                {isFa ? `${protein.toLocaleString("fa-IR")} گرم` : `${protein}g`}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "سازنده عضلات" : "builder"}</span>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3 text-center">
              <span className="text-xs text-[#9ca3af] uppercase block">{isFa ? "کربوهیدرات" : "CARBS"}</span>
              <span className="font-syne text-2xl font-extrabold text-[#f4f4f5] block my-0.5">
                {isFa ? `${carbs.toLocaleString("fa-IR")} گرم` : `${carbs}g`}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "تأمین سوخت" : "fuel"}</span>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3 text-center">
              <span className="text-xs text-[#9ca3af] uppercase block">{isFa ? "چربی سالم" : "FAT"}</span>
              <span className="font-syne text-2xl font-extrabold text-[#f4f4f5] block my-0.5">
                {isFa ? `${fat.toLocaleString("fa-IR")} گرم` : `${fat}g`}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "چربی مفید" : "lipids"}</span>
            </div>
          </div>

          {/* SECONDARY VITALS & COST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9ca3af]">{isFa ? "سدیم:" : "Sodium:"}</span>
                <span className="text-[#f4f4f5] font-bold">
                  {isFa ? `${sodium.toLocaleString("fa-IR")} میلی‌گرم` : `${sodium} mg`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9ca3af]">{isFa ? "کلسترول:" : "Cholesterol:"}</span>
                <span className="text-[#f4f4f5] font-bold">
                  {isFa ? `${(scannedResult.cholesterol || 0).toLocaleString("fa-IR")} میلی‌گرم` : `${scannedResult.cholesterol || 0} mg`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9ca3af]">{isFa ? "فیبر خوراکی:" : "Fiber:"}</span>
                <span className="text-[#f4f4f5] font-bold">
                  {isFa ? `${(scannedResult.dietaryFiber || 0).toLocaleString("fa-IR")} گرم` : `${scannedResult.dietaryFiber || 0} g`}
                </span>
              </div>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 flex flex-col justify-between">
              <span className="text-[#9ca3af] text-xs font-medium">
                {isFa ? "هزینه تخمینی این سهم" : "Estimated Portion Cost"}
              </span>
              <div className="font-syne text-xl font-bold text-[#ff3e00] my-1">
                {formatPrice(
                  scannedResult.estimatedPrice?.amountToman,
                  scannedResult.estimatedPrice?.amountUSD
                )}
              </div>
              <span className="text-xs text-[#9ca3af]">
                {isFa ? "میانگین قیمت تهیه مواد اولیه در بازار" : "Market average ingredient wholesale value"}
              </span>
            </div>
          </div>

          {/* SUMMARY & INTELLIGENCE */}
          {scannedResult.summary && (
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4 text-xs text-[#d4d4d8] leading-relaxed">
              <strong className="text-[#ff3e00] block mb-1">
                {isFa ? "تحلیل تغذیه‌ای:" : "Nutritional Summary:"}
              </strong>
              <p>{scannedResult.summary}</p>
            </div>
          )}

          {/* INGREDIENTS LIST */}
          {scannedResult.ingredientsList && scannedResult.ingredientsList.length > 0 && (
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4">
              <span className="text-xs text-[#9ca3af] font-medium block mb-2">
                {isFa
                  ? `مواد اولیه تشکیل‌دهنده (${scannedResult.ingredientsList.length.toLocaleString("fa-IR")})`
                  : `Ingredients (${scannedResult.ingredientsList.length})`}
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {scannedResult.ingredientsList.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#111214] border border-[#27272a] rounded text-[#f4f4f5]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-[#27272a] bg-[#18191d] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            type="button"
            className="btn-cmd-dim px-5 py-2.5 cursor-pointer text-xs"
          >
            {isFa ? "انصراف" : "Cancel"}
          </button>

          <button
            onClick={onLogToDiary}
            type="button"
            className="btn-cmd flex-1 py-2.5 cursor-pointer text-xs flex items-center justify-center gap-2 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isFa ? `ثبت در دفترچه (${calories.toLocaleString("fa-IR")} کالری)` : `Add to Diary (${calories} kcal)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionModal;
