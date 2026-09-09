import React from "react";
import { Camera, BookOpen, Sliders, Flame } from "lucide-react";
import { UserProfile, DailyTotals } from "../types";

interface SidebarsProps {
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  diaryCount: number;
}

export const IconBar: React.FC<{
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  diaryCount: number;
  currentLang?: string;
}> = () => {
  // Merged into NavPane to eliminate redundant sidebars and reduce clutter
  return null;
};

export const NavPane: React.FC<{
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  diaryCount: number;
  currentLang: string;
}> = ({ activeTab, setActiveTab, diaryCount, currentLang }) => {
  const isFa = currentLang === "fa";

  return (
    <aside
      aria-label={isFa ? "ناوبری اصلی" : "Main Navigation"}
      className="hidden lg:flex w-64 xl:w-72 border-r border-[#27272a] rtl:border-r-0 rtl:border-l p-5 bg-[#111214] flex-col justify-between shrink-0 select-none"
    >
      <div>
        {/* BRAND BADGE */}
        <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#ff3e00] flex items-center justify-center text-black font-extrabold shadow-md">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-syne text-lg font-extrabold text-[#f4f4f5] leading-tight">
              {isFa ? "نوتری‌اسکن" : "NutriScan"}
            </h1>
            <p className="text-xs text-[#9ca3af] mt-0.5 font-medium">
              {isFa ? "پایش هوشمند تغذیه" : "Smart Nutrition Tracker"}
            </p>
          </div>
        </div>

        {/* ACCESSIBLE NAVIGATION BUTTONS */}
        <nav className="flex flex-col gap-2" role="tablist">
          <button
            onClick={() => setActiveTab("scan")}
            type="button"
            role="tab"
            aria-selected={activeTab === "scan"}
            aria-label={isFa ? "اسکن غذا با هوش مصنوعی" : "Scan food with AI"}
            className={`w-full min-h-[48px] px-3.5 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "scan"
                ? "bg-[#ff3e00]/15 text-[#ffffff] border border-[#ff3e00]"
                : "text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#18191d] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Camera className={`w-5 h-5 ${activeTab === "scan" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`} />
              <span>{isFa ? "اسکن غذا" : "Scan Meal"}</span>
            </div>
            {activeTab === "scan" && (
              <span className="w-2 h-2 rounded-full bg-[#ff3e00]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("diary")}
            type="button"
            role="tab"
            aria-selected={activeTab === "diary"}
            aria-label={isFa ? "یادداشت روزانه غذاها" : "Daily Food Diary"}
            className={`w-full min-h-[48px] px-3.5 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "diary"
                ? "bg-[#ff3e00]/15 text-[#ffffff] border border-[#ff3e00]"
                : "text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#18191d] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className={`w-5 h-5 ${activeTab === "diary" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`} />
              <span>{isFa ? "یادداشت روزانه" : "Food Diary"}</span>
            </div>
            {diaryCount > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff3e00] text-black font-bold">
                {isFa ? diaryCount.toLocaleString("fa-IR") : diaryCount}
              </span>
            ) : activeTab === "diary" ? (
              <span className="w-2 h-2 rounded-full bg-[#ff3e00]" />
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            type="button"
            role="tab"
            aria-selected={activeTab === "profile"}
            aria-label={isFa ? "اهداف و تنظیمات بودجه" : "Goals and Budget Settings"}
            className={`w-full min-h-[48px] px-3.5 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "profile"
                ? "bg-[#ff3e00]/15 text-[#ffffff] border border-[#ff3e00]"
                : "text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#18191d] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders className={`w-5 h-5 ${activeTab === "profile" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`} />
              <span>{isFa ? "اهداف و بودجه" : "Goals & Budget"}</span>
            </div>
            {activeTab === "profile" && (
              <span className="w-2 h-2 rounded-full bg-[#ff3e00]" />
            )}
          </button>
        </nav>
      </div>

      {/* QUICK STATUS INFO */}
      <div className="pt-4 border-t border-[#27272a] text-xs text-[#9ca3af]">
        <div className="flex items-center gap-2 text-[#22c55e] font-medium mb-1">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span>{isFa ? "آماده تحلیل و اسکن هوشمند" : "System Ready"}</span>
        </div>
        <p className="text-[11px] text-[#71717a] leading-relaxed">
          {isFa ? "شناسایی کالری، ماکروها و تفکیک هزینه" : "Calories, macros & cost parsing"}
        </p>
      </div>
    </aside>
  );
};

export const VitalsPane: React.FC<{
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  onLogRecommendedDish?: () => void;
}> = ({ userProfile, dailyTotals }) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";

  const formatPrice = (toman: number, usd: number) => {
    if (userProfile.currency === "IRT") {
      return `${toman.toLocaleString("fa-IR")} تومان`;
    }
    return `$${usd.toFixed(2)}`;
  };

  const currentSpend = userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap = userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;
  const budgetPercent = Math.min(Math.round((currentSpend / (budgetCap || 1)) * 100), 100);
  const calPercent = Math.min(Math.round((dailyTotals.calories / (userProfile.calorieGoal || 2000)) * 100), 100);

  return (
    <aside
      aria-label={isFa ? "خلاصه وضعیت دریافت روزانه" : "Daily Vitals Summary"}
      className="w-full lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-[#27272a] rtl:border-l-0 rtl:border-r p-5 pb-28 lg:pb-5 bg-[#111214] flex flex-col gap-5 shrink-0 select-none"
    >
      {/* DAILY CALORIE SUMMARY CARD */}
      <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#9ca3af] font-medium">
            {isFa ? "مجموع کالری دریافتی روزانه" : "Daily Calorie Intake"}
          </span>
          <span className="text-[#ff3e00] font-bold text-sm">
            {isFa ? `${calPercent.toLocaleString("fa-IR")}٪` : `${calPercent}%`}
          </span>
        </div>

        <div className="font-syne text-4xl font-extrabold text-[#ffffff] my-2 leading-tight">
          {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
          <span className="text-sm font-normal text-[#9ca3af] ml-1.5 rtl:mr-1.5 rtl:ml-0">
            {isFa ? "کالری" : "kcal"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#d4d4d8] pt-2 border-t border-[#27272a]">
          <span>
            {isFa ? `هدف: ${userProfile.calorieGoal.toLocaleString("fa-IR")}` : `Goal: ${userProfile.calorieGoal}`}
          </span>
          <span className="text-[#ff3e00] font-medium">
            {isFa
              ? `${Math.max(0, userProfile.calorieGoal - dailyTotals.calories).toLocaleString("fa-IR")} باقیمانده`
              : `${Math.max(0, userProfile.calorieGoal - dailyTotals.calories)} remaining`}
          </span>
        </div>

        {/* MACRO SUMMARY BADGES */}
        <div className="mt-4 pt-3 border-t border-[#27272a] grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded">
            <span className="text-[#9ca3af] block text-[11px]">{isFa ? "پروتئین" : "Protein"}</span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block">
              {Math.round(dailyTotals.protein)} {isFa ? "گ" : "g"}
            </span>
          </div>
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded">
            <span className="text-[#9ca3af] block text-[11px]">{isFa ? "کربوهیدرات" : "Carbs"}</span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block">
              {Math.round(dailyTotals.carbs)} {isFa ? "گ" : "g"}
            </span>
          </div>
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded">
            <span className="text-[#9ca3af] block text-[11px]">{isFa ? "چربی" : "Fat"}</span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block">
              {Math.round(dailyTotals.fat)} {isFa ? "گ" : "g"}
            </span>
          </div>
        </div>

        {/* ESTIMATED FOOD SPEND */}
        <div className="mt-4 bg-[#08090a] border border-[#27272a] p-3 rounded-lg text-xs">
          <div className="flex justify-between items-center text-[#d4d4d8] mb-1.5">
            <span>{isFa ? "هزینه تخمینی وعده‌ها:" : "Est. Meal Spend:"}</span>
            <span className="text-[#ff3e00] font-bold text-sm">
              {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
            </span>
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetPercent > 90 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#9ca3af] mt-1.5">
            <span>
              {isFa ? "بودجه: " : "Budget: "}
              {userProfile.currency === "IRT"
                ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} تومان`
                : `$${userProfile.dailyBudgetUSD}`}
            </span>
            <span>{budgetPercent}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
