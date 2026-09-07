import React from "react";
import { Globe, Terminal, Activity } from "lucide-react";
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

  return (
    <header className="bg-[#111214] border-b border-[#2a2c31] px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] font-mono select-none shrink-0 z-30">
      {/* LEFT TELEMETRY STRIP */}
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 text-[#ff3e00]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3e00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3e00]" />
          </span>
          <span className="font-bold tracking-wider">
            {isFa ? "شناسه پایانه: ۰۴۳-نوتری" : "TERMINAL_ID: 043-X"}
          </span>
        </div>

        <span className="hidden md:inline text-[#2a2c31]">|</span>
        <span className="hidden md:inline text-[#707070] tracking-wide">
          {isFa ? "هسته سیستم: موتور هوشمند تحلیل تغذیه" : "SYSTEM CORE: ANALYSIS ENGINE"}
        </span>
      </div>

      {/* RIGHT TELEMETRY CONTROLS */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <button
          onClick={onOpenDiary}
          className="bg-[#08090a] hover:bg-[#16171a] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] transition-colors px-2.5 py-1 text-[10px] sm:text-[11px] font-mono cursor-pointer flex items-center gap-2"
          title={t.dailyCalorieIntake}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e00]" />
          <span className="text-[#ff3e00] font-bold">
            {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : String(dailyTotals.calories).padStart(4, "0")}
          </span>
          <span className="text-[#707070]">
            / {isFa ? `${userProfile.calorieGoal.toLocaleString("fa-IR")} کالری` : `${userProfile.calorieGoal} KCAL`}
          </span>
        </button>

        <button
          onClick={onToggleLanguage}
          className="px-2.5 py-1 bg-[#08090a] hover:bg-[#16171a] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] hover:text-[#ff3e00] text-[10px] sm:text-[11px] font-mono uppercase transition-colors cursor-pointer flex items-center gap-1.5"
          title={t.switchLanguage}
        >
          <Globe className="w-3 h-3 text-[#ff3e00]" />
          <span>{currentLang === "en" ? "FA (فارسی)" : "EN (English)"}</span>
        </button>
      </div>
    </header>
  );
};

export default ConsoleHeader;
