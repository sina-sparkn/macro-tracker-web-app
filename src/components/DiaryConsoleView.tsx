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
  const currentRate = userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0
    ? userProfile.exchangeRateTomanPerUSD
    : 230000;

  const formatPrice = (toman?: number, usd?: number) => {
    if (userProfile.currency === "IRT") {
      if (toman !== undefined && toman > 0) {
        return `${toman.toLocaleString("fa-IR")} تومان`;
      }
      if (usd !== undefined && usd > 0) {
        return `${Math.round(usd * currentRate).toLocaleString("fa-IR")} تومان`;
      }
      return "-";
    }
    if (usd !== undefined && usd > 0) {
      return `$${usd.toFixed(2)}`;
    }
    if (toman !== undefined && toman > 0) {
      return `$${(toman / currentRate).toFixed(2)}`;
    }
    return "-";
  };

  const calPercent = Math.min(Math.round((dailyTotals.calories / (userProfile.calorieGoal || 2000)) * 100), 100);
  const proteinPercent = Math.min(Math.round((dailyTotals.protein / (userProfile.proteinGoal || 130)) * 100), 100);
  const carbsPercent = Math.min(Math.round((dailyTotals.carbs / (userProfile.carbsGoal || 220)) * 100), 100);
  const fatPercent = Math.min(Math.round((dailyTotals.fat / (userProfile.fatGoal || 65)) * 100), 100);
  const sodiumPercent = Math.min(Math.round((dailyTotals.sodium / (userProfile.sodiumGoal || 2300)) * 100), 100);

  const currentSpend = userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap = userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;
  const budgetPercent = Math.min(Math.round((currentSpend / (budgetCap || 1)) * 100), 100);

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-24 sm:pb-28 lg:pb-8">
      {/* HEADER STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <span className="text-xs text-[#ff3e00] font-bold uppercase tracking-wide block">
            {isFa ? "دفترچه روزانه تغذیه" : "DAILY NUTRITION LOG"}
          </span>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f4f4f5] mt-1">
            {isFa ? "یادداشت و گزارش دریافتی روزانه" : "Daily Dietary Journal"}
          </h2>
        </div>

        {diaryItems.length > 0 && (
          <button
            onClick={onClearLogs}
            type="button"
            aria-label={isFa ? "پاک کردن تمام موارد ثبت‌شده امروز" : "Reset daily meal records"}
            className="btn-cmd-dim text-xs py-2.5 px-4 self-start sm:self-auto cursor-pointer flex items-center gap-2 hover:border-red-500 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>{isFa ? "پاک کردن تمام موارد" : "Clear All Entries"}</span>
          </button>
        )}
      </div>

      {/* INTAKE TELEMETRY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CALORIE PROGRESS CARD */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>{isFa ? "کالری مصرفی" : "Calorie Intake"}</span>
            <span className="text-[#ff3e00] font-bold">{isFa ? `${calPercent.toLocaleString("fa-IR")}٪` : `${calPercent}%`}</span>
          </div>
          <div className="font-syne text-3xl font-extrabold text-[#ffffff]">
            {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
            <span className="text-xs font-normal text-[#9ca3af] ml-1 rtl:mr-1 rtl:ml-0">
              {isFa ? "کالری" : "kcal"}
            </span>
          </div>
          <div className="text-xs text-[#9ca3af] mt-1 mb-3">
            {isFa ? `هدف روزانه: ${userProfile.calorieGoal.toLocaleString("fa-IR")}` : `Target: ${userProfile.calorieGoal} kcal`}
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${calPercent > 100 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(calPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* MACRONUTRIENT BARS */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5 flex flex-col justify-between">
          <div className="text-xs text-[#9ca3af] mb-2 font-medium">
            {isFa ? "تعادل درشت‌مغذی‌ها" : "Macro Balance"}
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `پروتئین: ${Math.round(dailyTotals.protein).toLocaleString("fa-IR")} از ${userProfile.proteinGoal.toLocaleString("fa-IR")} گرم`
                    : `Protein: ${Math.round(dailyTotals.protein)}g / ${userProfile.proteinGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">{proteinPercent}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `کربوهیدرات: ${Math.round(dailyTotals.carbs).toLocaleString("fa-IR")} از ${userProfile.carbsGoal.toLocaleString("fa-IR")} گرم`
                    : `Carbs: ${Math.round(dailyTotals.carbs)}g / ${userProfile.carbsGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">{carbsPercent}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `چربی: ${Math.round(dailyTotals.fat).toLocaleString("fa-IR")} از ${userProfile.fatGoal.toLocaleString("fa-IR")} گرم`
                    : `Fat: ${Math.round(dailyTotals.fat)}g / ${userProfile.fatGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">{fatPercent}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MEAL SPEND */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>{isFa ? "هزینه کل غذاها" : "Meal Spend"}</span>
            <span className="text-[#ff3e00] font-bold">{budgetPercent}%</span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#f4f4f5]">
            {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
          </div>
          <div className="text-xs text-[#9ca3af] mt-1 mb-3">
            {isFa
              ? `بودجه: ${userProfile.currency === "IRT" ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} تومان` : `$${userProfile.dailyBudgetUSD}`}`
              : `Budget: ${userProfile.currency === "IRT" ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} T` : `$${userProfile.dailyBudgetUSD}`}`}
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetPercent > 100 ? "bg-red-500" : budgetPercent > 80 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* SODIUM WATCH */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>{isFa ? "سقف مصرف سدیم" : "Sodium Intake"}</span>
            <span className={sodiumPercent > 90 ? "text-amber-400 font-bold" : "text-[#9ca3af]"}>
              {sodiumPercent}%
            </span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#f4f4f5]">
            {isFa ? dailyTotals.sodium.toLocaleString("fa-IR") : dailyTotals.sodium}{" "}
            <span className="text-xs font-normal text-[#9ca3af]">{isFa ? "میلی‌گرم" : "mg"}</span>
          </div>
          <div className="text-xs text-[#9ca3af] mt-1 mb-3">
            {isFa
              ? `حداکثر مجاز: ${userProfile.sodiumGoal.toLocaleString("fa-IR")} میلی‌گرم`
              : `Max Target: ${userProfile.sodiumGoal} mg`}
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${sodiumPercent > 100 ? "bg-red-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(sodiumPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* LOGGED MEALS LIST */}
      <section className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#f4f4f5] uppercase tracking-wide">
            {isFa ? `وعده‌های ثبت‌شده (${diaryItems.length.toLocaleString("fa-IR")})` : `Recorded Meals (${diaryItems.length})`}
          </h3>
          <button
            onClick={onGoToScanner}
            type="button"
            aria-label={isFa ? "اسکن و افزودن وعده غذایی جدید" : "Scan and add new meal"}
            className="text-xs text-[#ff3e00] hover:underline cursor-pointer flex items-center gap-1 font-semibold focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? "ثبت وعده جدید" : "Add Meal"}</span>
          </button>
        </div>

        {diaryItems.length === 0 ? (
          <div className="bg-[#111214] border border-dashed border-[#27272a] rounded-lg p-10 text-center">
            <BookOpen className="w-12 h-12 text-[#9ca3af] mx-auto mb-3 opacity-60" />
            <h4 className="font-syne text-lg font-bold text-[#f4f4f5] mb-1">
              {isFa ? "هیچ وعده‌ای برای امروز ثبت نشده است" : "No Meals Logged Today"}
            </h4>
            <p className="text-sm text-[#9ca3af] max-w-sm mx-auto mb-5">
              {isFa
                ? "از دوربین برای اسکن بشقاب غذا یا از نمونه‌های آماده برای ثبت کالری و درشت‌مغذی‌ها استفاده کنید."
                : "Scan a meal with your camera or select from preset foods to start tracking your daily intake."}
            </p>
            <button
              onClick={onGoToScanner}
              type="button"
              className="btn-cmd px-6 py-2.5 cursor-pointer text-sm"
            >
              {isFa ? "شروع اسکن غذا" : "Start Meal Scan"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {diaryItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] rounded-lg p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#ff3e00] bg-[#18191d] px-2.5 py-1 rounded border border-[#27272a] shrink-0">
                    #{isFa ? (idx + 1).toLocaleString("fa-IR") : idx + 1}
                  </span>
                  <div>
                    <h4 className="font-syne sm:font-vazirmatn text-base font-bold text-[#f4f4f5]">
                      {item.productName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af] mt-1">
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

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#27272a]">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-[#ff3e00] font-bold text-sm">
                      {isFa ? `${item.caloriesTotal.toLocaleString("fa-IR")} کالری` : `${item.caloriesTotal} kcal`}
                    </span>
                    <span className="text-[#d4d4d8] hidden sm:inline">
                      {isFa
                        ? `پ: ${item.proteinTotal}g | ک: ${item.carbsTotal}g | چ: ${item.fatTotal}g`
                        : `P: ${item.proteinTotal}g | C: ${item.carbsTotal}g | F: ${item.fatTotal}g`}
                    </span>
                    {(item.priceToman || item.priceUSD) && (
                      <span className="px-2 py-0.5 bg-[#18191d] rounded border border-[#27272a] text-[#f4f4f5] font-medium">
                        {formatPrice(item.priceToman, item.priceUSD)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteLogItem(item.id)}
                    type="button"
                    aria-label={isFa ? `حذف ${item.productName}` : `Delete ${item.productName}`}
                    className="min-h-[44px] min-w-[44px] p-2 text-[#9ca3af] hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM CLEARANCE SPACER FOR MOBILE NAV DOCK */}
      <div className="h-12 lg:hidden shrink-0" aria-hidden="true" />
    </div>
  );
};

export default DiaryConsoleView;
