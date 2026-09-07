import React from "react";
import { Terminal, Camera, BookOpen, Sliders, Cpu, Activity, DollarSign, Coins } from "lucide-react";
import { UserProfile, DailyTotals } from "../types";
import { TRANSLATIONS } from "../translations";
import { CYBER_RECOMMENDED_DISH } from "../App";

interface SidebarsProps {
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  diaryCount: number;
  onLogRecommendedDish: () => void;
}

export const IconBar: React.FC<{
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  diaryCount: number;
}> = ({ activeTab, setActiveTab, diaryCount }) => {
  return (
    <aside className="hidden lg:flex w-16 xl:w-20 border-r border-[#2a2c31] rtl:border-r-0 rtl:border-l flex-col items-center py-6 gap-6 bg-[#08090a]/90 shrink-0 select-none">
      <div className="w-10 h-10 border border-[#ff3e00] flex items-center justify-center text-[#ff3e00] bg-[#ff3e00]/5">
        <Terminal className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-6 text-[#707070] mt-4">
        <button
          onClick={() => setActiveTab("scan")}
          className={`p-2.5 transition-all cursor-pointer relative group ${
            activeTab === "scan" ? "text-[#ff3e00] bg-[#ff3e00]/10 border border-[#ff3e00]/40" : "hover:text-[#e0e0e0] border border-transparent"
          }`}
          title="Scanner"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab("diary")}
          className={`p-2.5 transition-all cursor-pointer relative group ${
            activeTab === "diary" ? "text-[#ff3e00] bg-[#ff3e00]/10 border border-[#ff3e00]/40" : "hover:text-[#e0e0e0] border border-transparent"
          }`}
          title="Diary"
        >
          <BookOpen className="w-5 h-5" />
          {diaryCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3e00] text-[#08090a] font-mono text-[9px] font-bold flex items-center justify-center">
              {diaryCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`p-2.5 transition-all cursor-pointer relative group ${
            activeTab === "profile" ? "text-[#ff3e00] bg-[#ff3e00]/10 border border-[#ff3e00]/40" : "hover:text-[#e0e0e0] border border-transparent"
          }`}
          title="Goals & Budget"
        >
          <Sliders className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 text-[#707070] text-[9px] font-mono">
        <Cpu className="w-4 h-4 text-[#ff3e00]/70" />
        <span className="tracking-widest uppercase text-[8px] text-[#707070]">SEC_NODE</span>
      </div>
    </aside>
  );
};

export const NavPane: React.FC<{
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  diaryCount: number;
  currentLang: string;
}> = ({ activeTab, setActiveTab, diaryCount, currentLang }) => {
  return (
    <aside className="hidden lg:flex w-64 xl:w-72 border-r border-[#2a2c31] rtl:border-r-0 rtl:border-l p-6 bg-[#111214] flex-col justify-between shrink-0 select-none">
      <div>
        {/* LOGO BOX - CYBER DATA CONSOLE */}
        <div className="border-2 border-[#ff3e00] p-4 text-center mb-8 bg-[#08090a]/40 shadow-[inset_0_0_20px_rgba(255,62,0,0.06)]">
          <h1 className="font-syne text-3xl font-extrabold text-[#ff3e00] tracking-tight leading-none">
            NUTR.
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#707070] mt-2">
            CYBER DATA CONSOLE
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("scan")}
            className={`text-left rtl:text-right w-full py-3.5 px-2 font-mono text-xs font-bold uppercase tracking-wider border-b transition-all cursor-pointer ${
              activeTab === "scan"
                ? "text-[#e0e0e0] border-b-[#ff3e00] bg-[#ff3e00]/5"
                : "text-[#707070] border-b-[#2a2c31] hover:text-[#e0e0e0] hover:border-b-[#707070]"
            }`}
          >
            01 // {currentLang === "fa" ? "اسکنر هوشمند" : "SMART SCANNER"}
          </button>

          <button
            onClick={() => setActiveTab("diary")}
            className={`text-left rtl:text-right w-full flex items-center justify-between py-3.5 px-2 font-mono text-xs font-bold uppercase tracking-wider border-b transition-all cursor-pointer ${
              activeTab === "diary"
                ? "text-[#e0e0e0] border-b-[#ff3e00] bg-[#ff3e00]/5"
                : "text-[#707070] border-b-[#2a2c31] hover:text-[#e0e0e0] hover:border-b-[#707070]"
            }`}
          >
            <span>02 // {currentLang === "fa" ? "یادداشت روزانه" : "FOOD DIARY"}</span>
            {diaryCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#ff3e00]/20 text-[#ff3e00] border border-[#ff3e00]/40 font-bold">
                {diaryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`text-left rtl:text-right w-full py-3.5 px-2 font-mono text-xs font-bold uppercase tracking-wider border-b transition-all cursor-pointer ${
              activeTab === "profile"
                ? "text-[#e0e0e0] border-b-[#ff3e00] bg-[#ff3e00]/5"
                : "text-[#707070] border-b-[#2a2c31] hover:text-[#e0e0e0] hover:border-b-[#707070]"
            }`}
          >
            03 // {currentLang === "fa" ? "اهداف و بودجه" : "GOALS & BUDGET"}
          </button>
        </nav>
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <div className="pt-6 border-t border-[#2a2c31] font-mono text-[10px] text-[#ff3e00] leading-relaxed">
        SYSTEM STATUS: ACTIVE<br />
        SECURE LINK: ESTABLISHED<br />
        <span className="text-[#707070]">HOST: LOCAL_TERMINAL</span>
      </div>
    </aside>
  );
};

export const VitalsPane: React.FC<{
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  onLogRecommendedDish: () => void;
}> = ({ userProfile, dailyTotals, onLogRecommendedDish }) => {
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

  return (
    <aside className="w-full lg:w-80 xl:w-88 border-t lg:border-t-0 lg:border-l border-[#2a2c31] rtl:border-l-0 rtl:border-r p-5 xl:p-6 bg-[#111214] flex flex-col gap-6 shrink-0 select-none">
      {/* METRIC BOX - DAILY TOTAL */}
      <div className="bg-[#111214] border border-[#2a2c31] p-5 relative overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-[#707070] uppercase tracking-wider">
            DAILY_TOTAL
          </span>
          <span className="font-mono text-[10px] text-[#ff3e00] font-bold">
            {Math.round((dailyTotals.calories / userProfile.calorieGoal) * 100)}%
          </span>
        </div>

        <div className="font-syne text-4xl xl:text-5xl font-extrabold text-[#ff3e00] tracking-tight my-2.5 leading-none">
          {String(dailyTotals.calories).padStart(4, "0")}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#707070]">
          <span>GOAL: {userProfile.calorieGoal} KCAL</span>
          <span className="text-[#e0e0e0]">
            {Math.max(0, userProfile.calorieGoal - dailyTotals.calories)} REMAINING
          </span>
        </div>

        {/* MINI MACRO TELEMETRY TAGS */}
        <div className="mt-4 pt-3 border-t border-[#2a2c31] grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
          <div className="bg-[#08090a] border border-[#2a2c31] py-1.5 px-1">
            <span className="text-[#707070] block">P</span>
            <span className="text-[#e0e0e0] font-bold">{Math.round(dailyTotals.protein)}g</span>
          </div>
          <div className="bg-[#08090a] border border-[#2a2c31] py-1.5 px-1">
            <span className="text-[#707070] block">C</span>
            <span className="text-[#e0e0e0] font-bold">{Math.round(dailyTotals.carbs)}g</span>
          </div>
          <div className="bg-[#08090a] border border-[#2a2c31] py-1.5 px-1">
            <span className="text-[#707070] block">F</span>
            <span className="text-[#e0e0e0] font-bold">{Math.round(dailyTotals.fat)}g</span>
          </div>
        </div>

        {/* FOOD SPEND TELEMETRY */}
        <div className="mt-3 bg-[#08090a] border border-[#2a2c31] p-2.5 font-mono text-[10px]">
          <div className="flex justify-between items-center text-[#707070] mb-1">
            <span>EST_SPEND:</span>
            <span className="text-[#ff3e00] font-bold">
              {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
            </span>
          </div>
          <div className="w-full bg-[#1a1b1e] h-1.5 overflow-hidden">
            <div
              className={`h-full ${budgetPercent > 90 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#707070] mt-1">
            <span>BUDGET: {userProfile.currency === "IRT" ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} T` : `$${userProfile.dailyBudgetUSD}`}</span>
            <span>{budgetPercent}%</span>
          </div>
        </div>
      </div>

      {/* DISH CARD - RECOMMENDED */}
      <div className="border border-dashed border-[#ff3e00] p-5 bg-[#ff3e00]/[0.02] relative">
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-[10px] text-[#ff3e00] font-bold tracking-wider uppercase">
            RECOMMENDED
          </span>
          <span className="font-mono text-[10px] text-[#707070]">
            {CYBER_RECOMMENDED_DISH.calories} KCAL
          </span>
        </div>

        <h3 className="font-syne sm:font-vazirmatn text-lg font-bold text-[#e0e0e0] my-1.5">
          {isFa ? CYBER_RECOMMENDED_DISH.nameFa : CYBER_RECOMMENDED_DISH.nameEn}
        </h3>

        <p className="text-xs text-[#707070] leading-relaxed mb-4">
          {isFa ? CYBER_RECOMMENDED_DISH.descFa : CYBER_RECOMMENDED_DISH.descEn}
        </p>

        {/* MACRO TAGS */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-1 bg-[#1a1b1e] border border-[#2a2c31] font-mono text-[10px] text-[#e0e0e0]">
            P: {CYBER_RECOMMENDED_DISH.protein}G
          </span>
          <span className="px-2 py-1 bg-[#1a1b1e] border border-[#2a2c31] font-mono text-[10px] text-[#e0e0e0]">
            C: {CYBER_RECOMMENDED_DISH.carbs}G
          </span>
          <span className="px-2 py-1 bg-[#1a1b1e] border border-[#2a2c31] font-mono text-[10px] text-[#e0e0e0]">
            F: {CYBER_RECOMMENDED_DISH.fat}G
          </span>
          <span className="px-2 py-1 bg-[#1a1b1e] border border-[#2a2c31] font-mono text-[10px] text-[#ff3e00]">
            {formatPrice(CYBER_RECOMMENDED_DISH.priceToman, CYBER_RECOMMENDED_DISH.priceUSD)}
          </span>
        </div>

        <button
          onClick={onLogRecommendedDish}
          className="btn-cmd w-full py-2.5 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          <span>LOG_ENTRY</span>
        </button>
      </div>

      {/* STATUS FOOTER / INTELLIGENCE REPORT */}
      <div className="mt-auto font-mono text-xs text-[#707070] border-t border-[#2a2c31] pt-4 leading-relaxed">
        <span className="text-[#ff3e00] font-bold block mb-1">
          [INTELLIGENCE_REPORT]
        </span>
        <p className="text-[11px] leading-normal text-[#a0a0a0]">
          {isFa ? CYBER_RECOMMENDED_DISH.funFactFa : CYBER_RECOMMENDED_DISH.funFactEn}
        </p>
      </div>
    </aside>
  );
};
