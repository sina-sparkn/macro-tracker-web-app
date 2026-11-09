import React from "react";
import { Flame, PieChart, CreditCard, ShieldCheck, Heart } from "lucide-react";
import { DailyTotals, UserProfile } from "../../types";
import { formatNumber, formatPriceDisplay, formatMacroRatio } from "../../utils/formatters";
import { ActivityRing } from "./ActivityRing";

interface AppleSummaryCardsProps {
  dailyTotals: DailyTotals;
  userProfile: UserProfile;
  isFa: boolean;
}

export const AppleSummaryCards: React.FC<AppleSummaryCardsProps> = ({
  dailyTotals,
  userProfile,
  isFa
}) => {
  const calorieGoal = userProfile.calorieGoal || 2000;
  const proteinGoal = userProfile.proteinGoal || 80;
  const carbsGoal = userProfile.carbsGoal || 250;
  const fatGoal = userProfile.fatGoal || 65;
  const sodiumGoal = userProfile.sodiumGoal || 2300;

  const calPercent = calorieGoal > 0 ? Math.min(Math.round((dailyTotals.calories / calorieGoal) * 100), 100) : 0;
  const sodiumPercent = sodiumGoal > 0 ? Math.min(Math.round((dailyTotals.sodium / sodiumGoal) * 100), 100) : 0;

  const currentSpend =
    userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap =
    userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;
  const budgetPercent =
    budgetCap && budgetCap > 0 ? Math.min(Math.round((currentSpend / budgetCap) * 100), 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
      {/* CARD 1: TODAY'S CALORIES (MINI ACTIVITY RING) */}
      <div className="apple-card p-4.5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ff3b30]/10 flex items-center justify-center text-[#ff3b30]">
              <Flame className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h4 className="text-xs font-semibold text-[var(--apple-text-secondary)]">
              {isFa ? "کالری امروز" : "Today's Calories"}
            </h4>
          </div>
          <span className="text-xs font-bold text-[#ff3b30] tabular-nums">
            {formatNumber(calPercent, isFa)}٪
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 my-1">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-[var(--apple-text-primary)] tabular-nums">
              {formatNumber(dailyTotals.calories, isFa)}
            </span>
            <span className="text-[11px] text-[var(--apple-text-tertiary)] tabular-nums mt-0.5">
              {isFa
                ? `از ${formatNumber(calorieGoal, true)} کالری`
                : `of ${formatNumber(calorieGoal, false)} kcal`}
            </span>
          </div>

          <div className="shrink-0">
            <ActivityRing
              current={dailyTotals.calories}
              goal={calorieGoal}
              size={54}
              strokeWidth={5}
              isFa={isFa}
              showCenterText={false}
            >
              <Flame className="w-4 h-4 text-[#ff3b30]" />
            </ActivityRing>
          </div>
        </div>

        {/* Slim progress bar */}
        <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff6947] to-[#ff3b30] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${calPercent}%` }}
          />
        </div>
      </div>

      {/* CARD 2: NUTRIENT BALANCE (3 MINI BARS: PROTEIN, CARBS, FAT) */}
      <div className="apple-card p-4.5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0a84ff]/10 flex items-center justify-center text-[#0a84ff]">
              <PieChart className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h4 className="text-xs font-semibold text-[var(--apple-text-secondary)]">
              {isFa ? "تعادل درشت‌مغذی‌ها" : "Nutrient Balance"}
            </h4>
          </div>
        </div>

        {/* 3 Mini Macro Bars */}
        <div className="flex flex-col gap-2 my-0.5">
          {/* Protein */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--apple-text-secondary)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a84ff]" />
                <span>{isFa ? "پروتئین" : "Protein"}</span>
              </span>
              <span className="font-medium text-[var(--apple-text-primary)] tabular-nums">
                {formatMacroRatio(dailyTotals.protein, proteinGoal, isFa)}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-[#0a84ff]/15 overflow-hidden">
              <div
                className="h-full bg-[#0a84ff] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(Math.round((dailyTotals.protein / proteinGoal) * 100), 100)}%`
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--apple-text-secondary)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />
                <span>{isFa ? "کربوهیدرات" : "Carbs"}</span>
              </span>
              <span className="font-medium text-[var(--apple-text-primary)] tabular-nums">
                {formatMacroRatio(dailyTotals.carbs, carbsGoal, isFa)}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-[#ff9f0a]/15 overflow-hidden">
              <div
                className="h-full bg-[#ff9f0a] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(Math.round((dailyTotals.carbs / carbsGoal) * 100), 100)}%`
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--apple-text-secondary)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff375f]" />
                <span>{isFa ? "چربی" : "Fat"}</span>
              </span>
              <span className="font-medium text-[var(--apple-text-primary)] tabular-nums">
                {formatMacroRatio(dailyTotals.fat, fatGoal, isFa)}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-[#ff375f]/15 overflow-hidden">
              <div
                className="h-full bg-[#ff375f] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(Math.round((dailyTotals.fat / fatGoal) * 100), 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: TOTAL MEAL COST (SPEND VS BUDGET CAP) */}
      <div className="apple-card p-4.5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#30d158]/10 flex items-center justify-center text-[#30d158]">
              <CreditCard className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h4 className="text-xs font-semibold text-[var(--apple-text-secondary)]">
              {isFa ? "هزینه وعده‌های امروز" : "Today's Meal Spend"}
            </h4>
          </div>
          <span className="text-xs font-bold text-[#30d158] tabular-nums">
            {formatNumber(budgetPercent, isFa)}٪
          </span>
        </div>

        <div className="flex flex-col my-1">
          <span className="text-xl sm:text-2xl font-extrabold text-[var(--apple-text-primary)] tabular-nums truncate">
            {userProfile.hidePrices
              ? isFa
                ? "فقط کالری"
                : "Calorie-Only"
              : formatPriceDisplay(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal, userProfile)}
          </span>
          <span className="text-[11px] text-[var(--apple-text-tertiary)] tabular-nums mt-0.5">
            {isFa
              ? `سقف بودجه: ${formatPriceDisplay(userProfile.dailyBudgetToman, userProfile.dailyBudgetUSD, userProfile)}`
              : `Budget: ${formatPriceDisplay(userProfile.dailyBudgetToman, userProfile.dailyBudgetUSD, userProfile)}`}
          </span>
        </div>

        <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPercent > 100 ? "bg-amber-500" : "bg-[#30d158]"
            }`}
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
      </div>

      {/* CARD 4: SODIUM LIMIT */}
      <div className="apple-card p-4.5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ff9f0a]/10 flex items-center justify-center text-[#ff9f0a]">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h4 className="text-xs font-semibold text-[var(--apple-text-secondary)]">
              {isFa ? "سقف مصرف سدیم" : "Sodium Limit"}
            </h4>
          </div>
          <span
            className={`text-xs font-bold tabular-nums ${
              sodiumPercent > 90 ? "text-amber-500" : "text-[var(--apple-text-secondary)]"
            }`}
          >
            {formatNumber(sodiumPercent, isFa)}٪
          </span>
        </div>

        <div className="flex flex-col my-1">
          <span className="text-xl sm:text-2xl font-extrabold text-[var(--apple-text-primary)] tabular-nums">
            {formatNumber(dailyTotals.sodium, isFa)}
            <span className="text-xs font-normal text-[var(--apple-text-tertiary)] mx-1">
              {isFa ? "میلی‌گرم" : "mg"}
            </span>
          </span>
          <span className="text-[11px] text-[var(--apple-text-tertiary)] tabular-nums mt-0.5">
            {isFa
              ? `حداکثر مجاز: ${formatNumber(sodiumGoal, true)} میلی‌گرم`
              : `Max Cap: ${formatNumber(sodiumGoal, false)} mg`}
          </span>
        </div>

        <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              sodiumPercent > 100 ? "bg-red-500" : "bg-gradient-to-r from-[#ff6947] to-[#ff3b30]"
            }`}
            style={{ width: `${sodiumPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
