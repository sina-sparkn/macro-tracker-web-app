import React, { useState, useRef, useEffect } from "react";
import { Globe, Flame, Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";
import { UserProfile, DailyTotals, ThemeMode, EffectiveTheme } from "../types";
import { TRANSLATIONS } from "../translations";

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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Quick 1-click toggle between light & dark
  const handleQuickToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (themeMode === "system") {
      // Switch to the opposite of current device theme
      onSelectTheme(devicePrefersDark ? "light" : "dark");
    } else if (effectiveTheme === "dark") {
      onSelectTheme("light");
    } else {
      onSelectTheme("dark");
    }
  };

  const getThemeButtonLabel = () => {
    if (themeMode === "system") {
      return isFa ? "دستگاه" : "Auto";
    }
    return effectiveTheme === "dark" ? (isFa ? "تیره" : "Dark") : (isFa ? "روشن" : "Light");
  };

  return (
    <header className="bg-[#111214] border-b border-[#2a2c31] px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3 select-none shrink-0 z-30 transition-colors">
      {/* BRAND & APP IDENTITY */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#ff3e00]/10 border border-[#ff3e00]/40 flex items-center justify-center text-[#ff3e00] shrink-0">
          <Flame className="w-5 h-5 fill-[#ff3e00]" />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h1 className="font-extrabold text-[#e0e0e0] text-sm sm:text-lg tracking-tight uppercase truncate">
            {isFa ? "نوتری‌اسکن" : "NUTRISCAN"}
          </h1>

        </div>
      </div>

      {/* RIGHT ACCESSIBLE CONTROLS */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 shrink-0">
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

          <div className="font-mono font-bold text-xs sm:text-sm text-[#e0e0e0] flex items-center gap-1.5 tabular-nums">
            <span className="text-[#ff3e00]">
              {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
            </span>
            <span className="text-[#707070] font-normal">/</span>
            <span className="hidden xs:inline">
              {isFa ? userProfile.calorieGoal.toLocaleString("fa-IR") : userProfile.calorieGoal}
            </span>
            <span className="text-[11px] font-normal text-[#707070]">
              {isFa ? "کالری" : "KCAL"}
            </span>
          </div>
        </button>

        {/* THEME SELECTOR & QUICK TOGGLE */}
        <div className="relative" ref={menuRef}>
          <div className="flex items-stretch bg-[#18191d] border border-[#2a2c31] hover:border-[#ff3e00] rounded-md transition-colors min-h-[36px]">
            {/* Direct 1-Click Toggle Button */}
            <button
              type="button"
              onClick={handleQuickToggle}
              title={
                isFa
                  ? `پوسته فعلی: ${getThemeButtonLabel()} (کلیک برای تغییر سریع)`
                  : `Current theme: ${getThemeButtonLabel()} (Click to toggle)`
              }
              aria-label={t.themeToggleAria}
              className="px-2.5 sm:px-3 flex items-center gap-1.5 text-xs font-mono font-semibold text-[#e0e0e0] hover:text-[#ff3e00] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none transition-colors"
            >
              {effectiveTheme === "dark" ? (
                <Moon className="w-4 h-4 text-[#ff3e00] shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-[#ea580c] shrink-0" />
              )}
              <span className="hidden sm:inline">{getThemeButtonLabel()}</span>
            </button>

            {/* Menu Trigger Chevron */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={isFa ? "انتخاب حالت پوسته" : "Theme selection options"}
              aria-expanded={menuOpen}
              className="px-1.5 border-l rtl:border-l-0 rtl:border-r border-[#2a2c31] hover:bg-[#23252a] text-[#707070] hover:text-[#e0e0e0] flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* THEME DROPDOWN MENU */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-1.5 w-48 sm:w-52 bg-[#111214] border border-[#2a2c31] rounded-lg shadow-2xl py-1.5 z-50 animate-[fadeIn_0.15s_ease-out]"
            >
              {/* Header label */}
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#707070] border-b border-[#2a2c31]/60 mb-1">
                {t.theme}
              </div>

              {/* Option 1: Light */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectTheme("light");
                  setMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 text-left rtl:text-right cursor-pointer transition-colors ${
                  themeMode === "light"
                    ? "bg-[#ff3e00]/15 text-[#ff3e00] font-bold"
                    : "text-[#e0e0e0] hover:bg-[#18191d]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#ea580c] shrink-0" />
                  <span>{t.themeLight}</span>
                </div>
                {themeMode === "light" && <Check className="w-3.5 h-3.5 text-[#ff3e00]" />}
              </button>

              {/* Option 2: Dark */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectTheme("dark");
                  setMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 text-left rtl:text-right cursor-pointer transition-colors ${
                  themeMode === "dark"
                    ? "bg-[#ff3e00]/15 text-[#ff3e00] font-bold"
                    : "text-[#e0e0e0] hover:bg-[#18191d]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-[#ff3e00] shrink-0" />
                  <span>{t.themeDark}</span>
                </div>
                {themeMode === "dark" && <Check className="w-3.5 h-3.5 text-[#ff3e00]" />}
              </button>

              {/* Option 3: System (Device theme) */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectTheme("system");
                  setMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 text-left rtl:text-right cursor-pointer transition-colors ${
                  themeMode === "system"
                    ? "bg-[#ff3e00]/15 text-[#ff3e00] font-bold"
                    : "text-[#e0e0e0] hover:bg-[#18191d]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Laptop className="w-4 h-4 text-[#3b82f6] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{t.themeSystem}</span>
                    <span className="text-[10px] text-[#707070] font-normal truncate">
                      {isFa
                        ? `پوسته سیستم: ${devicePrefersDark ? "تیره" : "روشن"}`
                        : `Device: ${devicePrefersDark ? "Dark" : "Light"}`}
                    </span>
                  </div>
                </div>
                {themeMode === "system" && <Check className="w-3.5 h-3.5 text-[#ff3e00] shrink-0" />}
              </button>
            </div>
          )}
        </div>

        {/* LANGUAGE SWITCHER */}
        <button
          onClick={onToggleLanguage}
          type="button"
          aria-label={
            isFa
              ? "تغییر زبان به انگلیسی (Switch to English)"
              : "تغییر زبان به فارسی (Switch to Persian)"
          }
          className="px-2.5 sm:px-3 py-1.5 bg-[#18191d] hover:bg-[#23252a] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] text-xs font-mono font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none min-h-[36px]"
        >
          <Globe className="w-3.5 h-3.5 text-[#ff3e00] shrink-0" />
          <span>{currentLang === "en" ? "FA" : "ENG"}</span>
        </button>
      </div>
    </header>
  );
};

export default ConsoleHeader;
