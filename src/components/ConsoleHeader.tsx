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
    <header className="bg-[#111214] border-b border-[#27272a] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 select-none shrink-0 z-30">
      {/* BRAND & APP IDENTITY */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#ff3e00]/15 border border-[#ff3e00]/50 flex items-center justify-center text-[#ff3e00] shrink-0">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-syne font-extrabold text-[#f4f4f5] text-sm sm:text-base tracking-tight whitespace-nowrap">
              {isFa ? "نوتری‌اسکن" : "NutriScan"}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#ff3e00] font-semibold px-1.5 py-0.5 bg-[#ff3e00]/10 rounded whitespace-nowrap">
              {isFa ? "هوشمند" : "AI"}
            </span>
          </div>
          <span className="hidden md:block text-xs text-[#9ca3af] leading-none mt-0.5 whitespace-nowrap">
            {isFa ? "تحلیل هوشمند ارزش غذایی و کالری" : "Smart Nutrition & Calorie Tracking"}
          </span>
        </div>
      </div>

      {/* RIGHT ACCESSIBLE CONTROLS */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* CALORIE PROGRESS QUICK BUTTON */}
        <button
          onClick={onOpenDiary}
          type="button"
          aria-label={
            isFa
              ? `مشاهده یادداشت روزانه: ${dailyTotals.calories} از ${userProfile.calorieGoal} کالری`
              : `View daily log: ${dailyTotals.calories} of ${userProfile.calorieGoal} kcal`
          }
          className="bg-[#18191d] hover:bg-[#222429] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] transition-colors px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-mono cursor-pointer flex items-center gap-1.5 sm:gap-2 focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none min-h-[40px] sm:min-h-[44px] shrink-0 whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#ff3e00] shrink-0" />
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs whitespace-nowrap">
            <span className="text-[#ff3e00] font-bold">
              {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
            </span>
            <span className="text-[#9ca3af] text-[11px] sm:text-xs">
              {isFa ? "کالری" : "kcal"}
            </span>
            <span className="hidden sm:inline text-[#9ca3af]">
              / {isFa ? `${userProfile.calorieGoal.toLocaleString("fa-IR")}` : `${userProfile.calorieGoal}`}
            </span>
            <span className="hidden md:inline text-[11px] text-[#9ca3af] bg-[#27272a] px-1.5 py-0.5 rounded">
              {isFa ? `${calPercent.toLocaleString("fa-IR")}٪` : `${calPercent}%`}
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
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#18191d] hover:bg-[#222429] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] hover:text-[#ff3e00] text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none min-h-[40px] sm:min-h-[44px] shrink-0 whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff3e00] shrink-0" />
          <span className="sm:hidden font-bold text-xs uppercase font-mono">
            {currentLang === "en" ? "FA" : "EN"}
          </span>
          <span className="hidden sm:inline font-medium">
            {currentLang === "en" ? "فارسی" : "English"}
          </span>
        </button>
      </div>
    </header>
  );
};

export default ConsoleHeader;
