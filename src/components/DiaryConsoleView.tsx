import React from "react";
import { Trash2, Plus, AlertTriangle, BookOpen, Flame, DollarSign, Activity } from "lucide-react";
import { FoodLogItem, DailyTotals, UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";

interface DiaryConsoleViewProps {
  diaryItems: FoodLogItem[];
  dailyTotals: DailyTotals;
  userProfile: UserProfile;
  onDeleteLogItem: (id: string) => void;
  onClearLogs: () => void;
  onGoToScanner: () => void;
}

export const DiaryConsoleView: React.FC<DiaryConsoleViewProps> = ({
  diaryItems,
  dailyTotals,
  userProfile,
  onDeleteLogItem,
  onClearLogs,
  onGoToScanner
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const formatPrice = (toman?: number, usd?: number) => {
    if (userProfile.currency === "IRT" && toman !== undefined) {
      return `${toman.toLocaleString("fa-IR")} تومان`;
    }
    if (usd !== undefined) {
      return `$${usd.toFixed(2)}`;
    }
    return "-";
  };

  const calPercent = Math.min(Math.round((dailyTotals.calories / userProfile.calorieGoal) * 100), 100);
  const proteinPercent = Math.min(Math.round((dailyTotals.protein / userProfile.proteinGoal) * 100), 100);
  const carbsPercent = Math.min(Math.round((dailyTotals.carbs / userProfile.carbsGoal) * 100), 100);
  const fatPercent = Math.min(Math.round((dailyTotals.fat / userProfile.fatGoal) * 100), 100);
  const sodiumPercent = Math.min(Math.round((dailyTotals.sodium / userProfile.sodiumGoal) * 100), 100);

  const currentSpend = userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap = userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;
  const budgetPercent = Math.min(Math.round((currentSpend / (budgetCap || 1)) * 100), 100);

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* HEADER STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2c31] pb-4">
        <div>
          <span className="font-mono text-[10px] text-[#ff3e00] tracking-widest uppercase block">
            DIETARY_JOURNAL // DAILY_LOG
          </span>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#e0e0e0] mt-0.5">
            {isFa ? "یادداشت و گزارش روزانه تغذیه" : "DAILY NUTRITION LOG"}
          </h2>
        </div>

        {diaryItems.length > 0 && (
          <button
            onClick={onClearLogs}
            className="btn-cmd-dim text-xs py-2 px-3 self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>RESET_DAILY_LOG</span>
          </button>
        )}
      </div>

      {/* INTAKE TELEMETRY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CALORIE PROGRESS CARD */}
        <div className="bg-[#111214] border border-[#2a2c31] p-5">
          <div className="flex justify-between items-center text-xs font-mono text-[#707070] mb-2">
            <span>CALORIC_INTAKE</span>
            <span className="text-[#ff3e00] font-bold">{calPercent}%</span>
          </div>
          <div className="font-syne text-3xl font-extrabold text-[#ff3e00]">
            {String(dailyTotals.calories).padStart(4, "0")}
          </div>
          <div className="text-[11px] font-mono text-[#707070] mt-1 mb-3">
            TARGET: {userProfile.calorieGoal} KCAL
          </div>
          <div className="w-full bg-[#1a1b1e] h-2">
            <div
              className={`h-full ${calPercent > 100 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(calPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* MACRONUTRIENT BARS */}
        <div className="bg-[#111214] border border-[#2a2c31] p-5 flex flex-col justify-between">
          <div className="font-mono text-xs text-[#707070] mb-2 uppercase">
            MACRO_BALANCE
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            <div>
              <div className="flex justify-between text-[#e0e0e0] mb-0.5">
                <span>P: {Math.round(dailyTotals.protein)}g / {userProfile.proteinGoal}g</span>
                <span className="text-[#ff3e00]">{proteinPercent}%</span>
              </div>
              <div className="w-full bg-[#1a1b1e] h-1.5">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e0e0e0] mb-0.5">
                <span>C: {Math.round(dailyTotals.carbs)}g / {userProfile.carbsGoal}g</span>
                <span className="text-[#ff3e00]">{carbsPercent}%</span>
              </div>
              <div className="w-full bg-[#1a1b1e] h-1.5">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#e0e0e0] mb-0.5">
                <span>F: {Math.round(dailyTotals.fat)}g / {userProfile.fatGoal}g</span>
                <span className="text-[#ff3e00]">{fatPercent}%</span>
              </div>
              <div className="w-full bg-[#1a1b1e] h-1.5">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MEAL SPEND */}
        <div className="bg-[#111214] border border-[#2a2c31] p-5">
          <div className="flex justify-between items-center text-xs font-mono text-[#707070] mb-2">
            <span>EXPENDITURE</span>
            <span className="text-[#ff3e00] font-bold">{budgetPercent}%</span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#e0e0e0]">
            {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
          </div>
          <div className="text-[11px] font-mono text-[#707070] mt-1 mb-3">
            BUDGET: {userProfile.currency === "IRT" ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} T` : `$${userProfile.dailyBudgetUSD}`}
          </div>
          <div className="w-full bg-[#1a1b1e] h-2">
            <div
              className={`h-full ${budgetPercent > 100 ? "bg-red-500" : budgetPercent > 80 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* SODIUM & WATER WATCH */}
        <div className="bg-[#111214] border border-[#2a2c31] p-5">
          <div className="flex justify-between items-center text-xs font-mono text-[#707070] mb-2">
            <span>SODIUM_LIMIT</span>
            <span className={sodiumPercent > 90 ? "text-amber-400 font-bold" : "text-[#707070]"}>
              {sodiumPercent}%
            </span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#e0e0e0]">
            {dailyTotals.sodium} <span className="text-xs font-mono text-[#707070]">MG</span>
          </div>
          <div className="text-[11px] font-mono text-[#707070] mt-1 mb-3">
            MAX RECOMMENDED: {userProfile.sodiumGoal} MG
          </div>
          <div className="w-full bg-[#1a1b1e] h-2">
            <div
              className={`h-full ${sodiumPercent > 100 ? "bg-red-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(sodiumPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* LOGGED MEALS LIST */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-3 font-mono text-xs text-[#707070]">
          <span>RECORDED_ENTRIES ({diaryItems.length})</span>
          <button
            onClick={onGoToScanner}
            className="text-[#ff3e00] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD_NEW_SCAN</span>
          </button>
        </div>

        {diaryItems.length === 0 ? (
          <div className="bg-[#111214] border border-dashed border-[#2a2c31] p-12 text-center">
            <BookOpen className="w-10 h-10 text-[#707070] mx-auto mb-3 opacity-60" />
            <h4 className="font-syne text-lg font-bold text-[#e0e0e0] mb-1">
              {isFa ? "هیچ وعده‌ای برای امروز ثبت نشده است" : "NO ENTRIES RECORDED TODAY"}
            </h4>
            <p className="text-xs text-[#707070] max-w-sm mx-auto mb-5">
              {isFa
                ? "از دوربین یا اسکنر برچسب برای ثبت دقیق اطلاعات کالری و هزینه استفاده کنید."
                : "Scan a meal or pick from preset entries to populate your dietary record."}
            </p>
            <button
              onClick={onGoToScanner}
              className="btn-cmd px-6 py-2.5 cursor-pointer font-mono text-xs"
            >
              INITIALIZE_SCANNER
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {diaryItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-[#111214] border border-[#2a2c31] hover:border-[#ff3e00] p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-mono text-[10px] text-[#ff3e00] bg-[#08090a] px-2 py-1 border border-[#2a2c31] shrink-0">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-syne sm:font-vazirmatn text-base font-bold text-[#e0e0e0]">
                      {item.productName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#707070] mt-0.5">
                      <span>{item.loggedAt}</span>
                      <span>•</span>
                      <span>{item.servingSizeText}</span>
                      {item.brand && (
                        <>
                          <span>•</span>
                          <span>{item.brand}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#2a2c31]">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-[#ff3e00] font-bold">
                      {item.caloriesTotal} KCAL
                    </span>
                    <span className="text-[#707070]">
                      P: {item.proteinTotal}g | C: {item.carbsTotal}g | F: {item.fatTotal}g
                    </span>
                    {(item.priceToman || item.priceUSD) && (
                      <span className="px-2 py-0.5 bg-[#08090a] border border-[#2a2c31] text-[#e0e0e0]">
                        {formatPrice(item.priceToman, item.priceUSD)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteLogItem(item.id)}
                    className="p-1.5 text-[#707070] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DiaryConsoleView;
