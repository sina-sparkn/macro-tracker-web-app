import React from "react";
import { X, Plus, AlertTriangle, CheckCircle2, ShieldCheck, Scale, Receipt } from "lucide-react";
import { ScannedLabel, UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";
import { formatSmartPrice } from "../utils/dishLocalization";

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
    if (userProfile.hidePrices) {
      return isFa ? "حالت فقط کالری" : "Calorie-Only Mode";
    }
    return formatSmartPrice(toman, usd, userProfile, portionServings) || "-";
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
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#ff3e00] font-bold uppercase tracking-wide mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e00]" />
              <span>{isFa ? "ارزش غذایی" : "Nutrition Facts"}</span>
            </div>
            <h3 id="modal-title" className="font-syne sm:font-vazirmatn text-lg sm:text-xl font-extrabold text-[#f4f4f5] leading-snug break-words">
              {scannedResult.productName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
              {scannedResult.brand && (
                <span className="text-[#a1a1aa] font-medium truncate max-w-[200px]">
                  {scannedResult.brand}
                </span>
              )}
              {scannedResult.brand && (
                <span className="text-[#52525b] select-none" aria-hidden="true">•</span>
              )}
              <span className="inline-flex items-center gap-1 text-[#d4d4d8] font-mono text-xs">
                <span className="text-[#ff3e00] font-semibold">{isFa ? "سهم:" : "Serving:"}</span>
                <span className="truncate max-w-[220px]">{scannedResult.servingSize || (isFa ? "۱ سهم" : "1 serving")}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label={isFa ? "بستن پنجره" : "Close dialog"}
            className="min-h-[40px] min-w-[40px] p-2 text-[#9ca3af] hover:text-[#f4f4f5] hover:bg-[#27272a] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* PORTION ADJUSTER */}
          <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-sm text-[#f4f4f5] block font-bold">
                {isFa ? "تعداد سهم" : "Portion Multiplier"}
              </span>
              <span className="text-xs text-[#9ca3af]">
                {isFa ? "تنظیم ضریب سهم مصرفی" : "Scales nutrition and cost"}
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => setPortionServings(Math.max(0.5, portionServings - 0.5))}
                type="button"
                aria-label={isFa ? "کاهش سهم" : "Decrease portion"}
                className="w-9 h-9 rounded-lg bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] flex items-center justify-center font-bold text-base cursor-pointer"
              >
                -
              </button>
              <span className="font-syne text-base font-bold text-[#ff3e00] w-10 text-center font-mono">
                {portionServings}x
              </span>
              <button
                onClick={() => setPortionServings(portionServings + 0.5)}
                type="button"
                aria-label={isFa ? "افزایش سهم" : "Increase portion"}
                className="w-9 h-9 rounded-lg bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] flex items-center justify-center font-bold text-base cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* MACRONUTRIENT HIGHLIGHTS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 font-mono">
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-2.5 text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] uppercase block truncate">{isFa ? "انرژی" : "ENERGY"}</span>
              <span className="font-syne text-xl sm:text-2xl font-extrabold text-[#ff3e00] block my-0.5 truncate">
                {isFa ? calories.toLocaleString("fa-IR") : calories}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "کالری" : "kcal"}</span>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-2.5 text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] uppercase block truncate">{isFa ? "پروتئین" : "PROTEIN"}</span>
              <span className="font-syne text-xl sm:text-2xl font-extrabold text-sky-400 block my-0.5 truncate">
                {isFa ? `${protein.toLocaleString("fa-IR")}g` : `${protein}g`}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "گرم" : "g"}</span>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-2.5 text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] uppercase block truncate">{isFa ? "کربوهیدرات" : "CARBS"}</span>
              <span className="font-syne text-xl sm:text-2xl font-extrabold text-amber-400 block my-0.5 truncate">
                {isFa ? `${carbs.toLocaleString("fa-IR")}g` : `${carbs}g`}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "گرم" : "g"}</span>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-2.5 text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] uppercase block truncate">{isFa ? "چربی" : "FAT"}</span>
              <span className="font-syne text-xl sm:text-2xl font-extrabold text-rose-400 block my-0.5 truncate">
                {isFa ? `${fat.toLocaleString("fa-IR")}g` : `${fat}g`}
              </span>
              <span className="text-xs text-[#9ca3af]">{isFa ? "گرم" : "g"}</span>
            </div>
          </div>

          {/* SECONDARY VITALS & COST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9ca3af]">{isFa ? "سدیم:" : "Sodium:"}</span>
                <span className="text-[#f4f4f5] font-bold">
                  {isFa ? `${sodium.toLocaleString("fa-IR")} mg` : `${sodium} mg`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9ca3af]">{isFa ? "کلسترول:" : "Cholesterol:"}</span>
                <span className="text-[#f4f4f5] font-bold">
                  {isFa ? `${(scannedResult.cholesterol || 0).toLocaleString("fa-IR")} mg` : `${scannedResult.cholesterol || 0} mg`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9ca3af]">{isFa ? "فیبر:" : "Fiber:"}</span>
                <span className="text-[#f4f4f5] font-bold">
                  {isFa ? `${(scannedResult.dietaryFiber || 0).toLocaleString("fa-IR")} g` : `${scannedResult.dietaryFiber || 0} g`}
                </span>
              </div>
            </div>

            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 flex flex-col justify-between">
              <span className="text-[#9ca3af] text-xs font-medium">
                {isFa ? "هزینه این سهم" : "Portion Cost"}
              </span>
              <div className="font-syne text-xl font-bold text-[#ff3e00] my-1">
                {formatPrice(
                  scannedResult.estimatedPrice?.amountToman,
                  scannedResult.estimatedPrice?.amountUSD
                )}
              </div>
              <span className="text-xs text-[#9ca3af]">
                {isFa ? "برآورد بر مبنای قیمت بازار" : "Market ingredient estimate"}
              </span>
            </div>
          </div>

          {/* SUMMARY & INTELLIGENCE */}
          {scannedResult.summary && (
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4 text-xs text-[#d4d4d8] leading-relaxed">
              <strong className="text-[#ff3e00] block mb-1">
                {isFa ? "نکات تغذیه:" : "Nutrition Notes:"}
              </strong>
              <p>{scannedResult.summary}</p>
            </div>
          )}

          {/* INGREDIENTS LIST */}
          {scannedResult.ingredientsList && scannedResult.ingredientsList.length > 0 && (
            <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 text-xs text-[#9ca3af]">
              <span className="font-semibold text-[#f4f4f5] block mb-1">
                {isFa ? "مواد تشکیل‌دهنده:" : "Ingredients:"}
              </span>
              <p className="leading-relaxed text-[#d4d4d8]">
                {scannedResult.ingredientsList.join(" · ")}
              </p>
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
