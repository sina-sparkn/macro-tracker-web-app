import React from "react";
import { Globe, Flame, BookOpen } from "lucide-react";
import { UserProfile, DailyTotals } from "../types";
import { TRANSLATIONS } from "../translations";

interface ConsoleHeaderProps {
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  onToggleLanguage: () => void;
  onOpenDiary: () => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  userProfile,
  dailyTotals,
  onToggleLanguage,
  onOpenDiary
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const calPercent = Math.min(
    Math.round((dailyTotals.calories / (userProfile.calorieGoal || 2000)) * 100),
    100
  );

  return (
    <header className="bg-[#111214] border-b border-[#2a2c31] px-4 sm:px-6 h-16 flex items-center justify-between gap-3 select-none shrink-0 z-30">
      {/* BRAND & APP IDENTITY */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#ff3e00]/10 border border-[#ff3e00]/40 flex items-center justify-center text-[#ff3e00] shrink-0">
          <Flame className="w-5 h-5 fill-[#ff3e00]" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-[#e0e0e0] text-base sm:text-lg tracking-tight uppercase">
            {isFa ? "نوتری‌اسکن" : "NUTRISCAN"}
          </h1>
          <span className="text-[10px] font-mono text-[#ff3e00] font-bold px-1.5 py-0.5 bg-[#ff3e00]/10 rounded border border-[#ff3e00]/25">
            PRO
          </span>
        </div>
      </div>

      {/* RIGHT ACCESSIBLE CONTROLS */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        {/* CALORIE PROGRESS QUICK BUTTON */}
        <button
          onClick={onOpenDiary}
          type="button"
          aria-label={
            isFa
              ? `وضعیت روزانه: ${dailyTotals.calories} از ${userProfile.calorieGoal} کالری`
              : `Daily status: ${dailyTotals.calories} of ${userProfile.calorieGoal} kcal`
          }
          className="text-left rtl:text-right group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none rounded-lg p-1 transition-colors"
        >
          <div className="meta text-[9px] sm:text-[10px] text-[#707070] group-hover:text-[#ff3e00] transition-colors">
            {isFa ? "وضعیت_روزانه" : "Daily_Status"}
          </div>
          <div className="font-mono font-bold text-xs sm:text-sm text-[#e0e0e0] flex items-center gap-1.5 tabular-nums">
            <span className="text-[#ff3e00]">
              {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
            </span>
            <span className="text-[#707070] font-normal">/</span>
            <span>
              {isFa ? userProfile.calorieGoal.toLocaleString("fa-IR") : userProfile.calorieGoal}
            </span>
            <span className="text-[11px] font-normal text-[#707070]">
              {isFa ? "کالری" : "KCAL"}
            </span>
          </div>
        </button>

        {/* LANGUAGE SWITCHER */}
        <button
          onClick={onToggleLanguage}
          type="button"
          aria-label={
            isFa
              ? "تغییر زبان به انگلیسی (Switch to English)"
              : "تغییر زبان به فارسی (Switch to Persian)"
          }
          className="px-3 py-1.5 bg-[#18191d] hover:bg-[#23252a] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] text-xs font-mono font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none min-h-[36px]"
        >
          <Globe className="w-3.5 h-3.5 text-[#ff3e00] shrink-0" />
          <span>{currentLang === "en" ? "FA" : "ENG"}</span>
        </button>
      </div>
    </header>
  );
};

export default ConsoleHeader;
