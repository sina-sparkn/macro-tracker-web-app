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
    <div className="fixed inset-0 z-50 bg-[#08090a]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#111214] border-2 border-[#2a2c31] hover:border-[#ff3e00]/80 transition-colors w-full max-w-2xl my-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#2a2c31] flex items-start justify-between gap-3 bg-[#08090a]">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#ff3e00] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 bg-[#ff3e00]" />
              <span>SPECTRAL_ANALYSIS // COMPLETE</span>
            </div>
            <h3 className="font-syne sm:font-vazirmatn text-xl sm:text-2xl font-extrabold text-[#e0e0e0] leading-tight">
              {scannedResult.productName}
            </h3>
            <p className="font-mono text-xs text-[#707070] mt-0.5">
              {scannedResult.brand} • {scannedResult.servingSize}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#707070] hover:text-[#ff3e00] hover:bg-[#1a1b1e] border border-[#2a2c31] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* PORTION ADJUSTER */}
          <div className="bg-[#08090a] border border-[#2a2c31] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
            <div>
              <span className="text-xs text-[#e0e0e0] block font-bold">
                PORTION_MULTIPLIER
              </span>
              <span className="text-[10px] text-[#707070]">
                Scaling all calorie and cost values
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPortionServings(Math.max(0.5, portionServings - 0.5))}
                className="w-8 h-8 bg-[#111214] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] flex items-center justify-center font-bold cursor-pointer"
              >
                -
              </button>
              <span className="font-syne text-lg font-bold text-[#ff3e00] w-12 text-center">
                {portionServings}x
              </span>
              <button
                onClick={() => setPortionServings(portionServings + 0.5)}
                className="w-8 h-8 bg-[#111214] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] flex items-center justify-center font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* MACRONUTRIENT HIGHLIGHTS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#08090a] border border-[#2a2c31] p-3 text-center">
              <span className="text-[10px] text-[#707070] uppercase block">ENERGY</span>
              <span className="font-syne text-2xl font-extrabold text-[#ff3e00] block my-0.5">
                {calories}
              </span>
              <span className="text-[9px] text-[#707070]">KCAL</span>
            </div>

            <div className="bg-[#08090a] border border-[#2a2c31] p-3 text-center">
              <span className="text-[10px] text-[#707070] uppercase block">PROTEIN</span>
              <span className="font-syne text-2xl font-extrabold text-[#e0e0e0] block my-0.5">
                {protein}g
              </span>
              <span className="text-[9px] text-[#707070]">BUILDER</span>
            </div>

            <div className="bg-[#08090a] border border-[#2a2c31] p-3 text-center">
              <span className="text-[10px] text-[#707070] uppercase block">CARBS</span>
              <span className="font-syne text-2xl font-extrabold text-[#e0e0e0] block my-0.5">
                {carbs}g
              </span>
              <span className="text-[9px] text-[#707070]">FUEL</span>
            </div>

            <div className="bg-[#08090a] border border-[#2a2c31] p-3 text-center">
              <span className="text-[10px] text-[#707070] uppercase block">FAT</span>
              <span className="font-syne text-2xl font-extrabold text-[#e0e0e0] block my-0.5">
                {fat}g
              </span>
              <span className="text-[9px] text-[#707070]">LIPIDS</span>
            </div>
          </div>

          {/* SECONDARY VITALS & COST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-[#08090a] border border-[#2a2c31] p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#707070]">SODIUM:</span>
                <span className="text-[#e0e0e0] font-bold">{sodium} mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">CHOLESTEROL:</span>
                <span className="text-[#e0e0e0] font-bold">{scannedResult.cholesterol || 0} mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">FIBER:</span>
                <span className="text-[#e0e0e0] font-bold">{scannedResult.dietaryFiber || 0} g</span>
              </div>
            </div>

            <div className="bg-[#08090a] border border-[#2a2c31] p-3.5 flex flex-col justify-between">
              <span className="text-[#707070] text-[10px] uppercase">ESTIMATED_PORTION_COST</span>
              <div className="font-syne text-xl font-bold text-[#ff3e00] my-1">
                {formatPrice(
                  scannedResult.estimatedPrice?.amountToman,
                  scannedResult.estimatedPrice?.amountUSD
                )}
              </div>
              <span className="text-[9px] text-[#707070]">
                Market average ingredient wholesale value
              </span>
            </div>
          </div>

          {/* SUMMARY & INTELLIGENCE */}
          {scannedResult.summary && (
            <div className="bg-[#08090a] border border-[#2a2c31] p-4 text-xs font-mono text-[#a0a0a0] leading-relaxed">
              <span className="text-[#ff3e00] font-bold block mb-1">
                INTELLIGENCE_SUMMARY:
              </span>
              <p>{scannedResult.summary}</p>
            </div>
          )}

          {/* INGREDIENTS LIST */}
          {scannedResult.ingredientsList && scannedResult.ingredientsList.length > 0 && (
            <div className="bg-[#08090a] border border-[#2a2c31] p-4">
              <span className="text-[10px] font-mono text-[#707070] uppercase tracking-wider block mb-2">
                VERIFIED_INGREDIENTS ({scannedResult.ingredientsList.length})
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {scannedResult.ingredientsList.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#111214] border border-[#2a2c31] text-[#e0e0e0]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-[#2a2c31] bg-[#08090a] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="btn-cmd-dim px-5 py-2.5 cursor-pointer font-mono text-xs"
          >
            DISMISS
          </button>

          <button
            onClick={onLogToDiary}
            className="btn-cmd flex-1 py-2.5 cursor-pointer font-mono text-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>LOG_ENTRY ({calories} KCAL)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionModal;
