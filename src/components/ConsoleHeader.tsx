import React from "react";
import { Sun, Moon, Laptop, Globe, Flame } from "lucide-react";
import { UserProfile, DailyTotals, ThemeMode, EffectiveTheme } from "../types";
import { TRANSLATIONS } from "../translations";
import { formatNumber } from "../utils/formatters";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ConsoleHeaderProps {
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  themeMode: ThemeMode;
  effectiveTheme: EffectiveTheme;
  devicePrefersDark: boolean;
  onSelectTheme: (mode: ThemeMode) => void;
  onToggleLanguage: () => void;
  onOpenDiary: () => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  userProfile,
  dailyTotals,
  themeMode,
  effectiveTheme,
  devicePrefersDark,
  onSelectTheme,
  onToggleLanguage,
  onOpenDiary
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 w-full apple-glass-bar border-b transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* START SIDE: BRAND IDENTITY */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ff6947] to-[#ff3b30] flex items-center justify-center p-1.5 shadow-sm shadow-[#ff3b30]/20">
            <img
              src="/apple-scan-logo.png"
              alt="NutriScan"
              className="w-full h-full object-contain filter brightness-0 invert drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--apple-text-primary)]">
              {isFa ? "نوتری‌اسکن" : "NutriScan"}
            </span>
            <span className="text-[10px] text-[var(--apple-text-tertiary)] -mt-0.5 hidden xs:inline">
              {isFa ? "پایشگر هوشمند تغذیه" : "Calorie & Macro Tracker"}
            </span>
          </div>
        </div>

        {/* END SIDE: STATUS & MINIMAL CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* DAILY CALORIE QUICK GLANCE PILL */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenDiary}
            aria-label={
              isFa
                ? `مشاهده یادداشت روزانه: ${formatNumber(dailyTotals.calories, true)} از ${formatNumber(userProfile.calorieGoal, true)} کالری`
                : `View diary: ${formatNumber(dailyTotals.calories, false)} of ${formatNumber(userProfile.calorieGoal, false)} kcal`
            }
            className="hidden sm:inline-flex items-center gap-1.5 px-3 rounded-full text-xs"
          >
            <Flame className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span className="font-semibold text-[var(--apple-text-primary)] tabular-nums">
              {formatNumber(dailyTotals.calories, isFa)}
            </span>
            <span className="text-[var(--apple-text-tertiary)] font-normal">/</span>
            <span className="text-[var(--apple-text-secondary)] tabular-nums">
              {formatNumber(userProfile.calorieGoal, isFa)}
            </span>
            <span className="text-[10px] text-[var(--apple-text-tertiary)]">
              {isFa ? "کالری" : "kcal"}
            </span>
          </Button>

          {/* THEME SEGMENTED CONTROL WITH SHADCN TOOLTIPS */}
          <TooltipProvider>
            <div
              role="radiogroup"
              aria-label={isFa ? "انتخاب پوسته" : "Theme selection"}
              className="apple-segmented-container p-1 h-9 items-center"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeMode === "light"}
                    onClick={() => onSelectTheme("light")}
                    aria-label={isFa ? "روشن" : "Light"}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      themeMode === "light"
                        ? "bg-[var(--apple-surface)] text-[var(--apple-text-primary)] shadow-sm"
                        : "text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>{isFa ? "روشن" : "Light"}</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeMode === "dark"}
                    onClick={() => onSelectTheme("dark")}
                    aria-label={isFa ? "تیره" : "Dark"}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      themeMode === "dark"
                        ? "bg-[var(--apple-surface)] text-[var(--apple-text-primary)] shadow-sm"
                        : "text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>{isFa ? "تیره" : "Dark"}</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeMode === "system"}
                    onClick={() => onSelectTheme("system")}
                    aria-label={isFa ? "خودکار بر اساس دستگاه" : "Auto / System"}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      themeMode === "system"
                        ? "bg-[var(--apple-surface)] text-[var(--apple-text-primary)] shadow-sm"
                        : "text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]"
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>{isFa ? "خودکار بر اساس سیستم" : "System Theme"}</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* LANGUAGE TOGGLE PILL */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleLanguage}
            aria-label={isFa ? "تغییر زبان به انگلیسی" : "Switch language to Persian"}
            className="rounded-full px-3 text-xs font-semibold gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--apple-text-secondary)]" />
            <span>{isFa ? "ENG" : "فا"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ConsoleHeader;
