import React, { useState, useEffect, useMemo } from "react";
import { Camera, BookOpen, Sliders, Droplets, CreditCard } from "lucide-react";
import { UserProfile, DailyTotals } from "../types";
import { formatNumber, formatPriceDisplay } from "../utils/formatters";
import { ActivityRing } from "./apple/ActivityRing";
import { MacroBar } from "./apple/MacroBar";
import { WaterTracker } from "./apple/WaterTracker";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export interface WaterLogEntry {
  id: string;
  time: string;
  timestamp: number;
  glasses: number;
  ml: number;
  label?: string;
}

// Gentle 2-tone water drop chime using Web Audio API
export const playWaterDropChime = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28);
    gain2.gain.setValueAtTime(0.1, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Audio context may be restricted without gesture
  }
};

export const IconBar: React.FC<{
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  diaryCount: number;
  currentLang?: string;
}> = () => {
  return null;
};

/* ==========================================================================
   ICON RAIL: FLOATING PILL-SHAPED DOCK WITH SF-STYLE LINE ICONS & TOOLTIPS
   ========================================================================== */
export const NavPane: React.FC<{
  activeTab: "scan" | "diary" | "profile";
  setActiveTab: (tab: "scan" | "diary" | "profile") => void;
  diaryCount: number;
  currentLang: string;
}> = ({ activeTab, setActiveTab, diaryCount, currentLang }) => {
  const isFa = currentLang === "fa";

  const navItems = [
    {
      id: "scan" as const,
      label: isFa ? "اسکن غذا" : "Scan",
      icon: Camera
    },
    {
      id: "diary" as const,
      label: isFa ? "یادداشت روزانه" : "Diary",
      icon: BookOpen,
      count: diaryCount
    },
    {
      id: "profile" as const,
      label: isFa ? "اهداف و تنظیمات" : "Goals",
      icon: Sliders
    }
  ];

  return (
    <aside
      aria-label={isFa ? "ناوبری اصلی" : "Main Navigation"}
      className="hidden lg:flex w-20 py-8 px-2.5 flex-col items-center justify-start shrink-0 select-none z-30"
    >
      {/* Floating Pill Dock */}
      <TooltipProvider>
        <nav
          role="tablist"
          className="apple-glass-bar backdrop-blur-xl border rounded-full p-2 flex flex-col items-center gap-3 shadow-sm transition-colors"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={item.label}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer relative ${
                      isActive
                        ? "bg-[var(--apple-surface)] dark:bg-white/12 text-[#ff3b30] shadow-sm"
                        : "text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side={isFa ? "left" : "right"}>
                  <span>{item.label}</span>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
};

/* ==========================================================================
   HEALTH SUMMARY & VITALS SIDEBAR (APPLE HEALTH / FITNESS STYLE)
   ========================================================================== */
export const VitalsPane: React.FC<{
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  onLogRecommendedDish?: () => void;
  waterGlasses?: number;
  onWaterChange?: (glasses: number) => void;
}> = ({ userProfile, dailyTotals, waterGlasses: propWater, onWaterChange }) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";

  const getTodayDateStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getV2StorageKey = () => `nutriscan_water_v2_${getTodayDateStr()}`;
  const getLegacyStorageKey = () => `nutriscan_water_${getTodayDateStr()}`;

  const [targetGlasses, setTargetGlasses] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(getV2StorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.targetGlasses === "number" && parsed.targetGlasses > 0) {
          return parsed.targetGlasses;
        }
      }
    } catch {}
    return 8;
  });

  const [entries, setEntries] = useState<WaterLogEntry[]>(() => {
    try {
      const raw = localStorage.getItem(getV2StorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.entries)) {
          return parsed.entries;
        }
      }
    } catch {}

    try {
      const legacy = localStorage.getItem(getLegacyStorageKey());
      if (legacy !== null) {
        const count = Math.max(0, parseInt(legacy, 10) || 0);
        if (count > 0) {
          return [
            {
              id: `legacy-${Date.now()}`,
              time: "Earlier",
              timestamp: Date.now() - 3600000,
              glasses: count,
              ml: count * 250
            }
          ];
        }
      }
    } catch {}

    if (typeof propWater === "number" && propWater > 0) {
      return [
        {
          id: `prop-${Date.now()}`,
          time: "Initial",
          timestamp: Date.now(),
          glasses: propWater,
          ml: propWater * 250
        }
      ];
    }

    return [];
  });

  useEffect(() => {
    const handleWaterEvent = () => {
      try {
        const raw = localStorage.getItem(getV2StorageKey());
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.entries)) {
            setEntries(parsed.entries);
          }
          if (typeof parsed.targetGlasses === "number") {
            setTargetGlasses(parsed.targetGlasses);
          }
        }
      } catch {}
    };
    window.addEventListener("nutriscan_water_updated", handleWaterEvent);
    return () => window.removeEventListener("nutriscan_water_updated", handleWaterEvent);
  }, []);

  const totalGlasses = useMemo(() => {
    return Math.max(0, entries.reduce((sum, e) => sum + e.glasses, 0));
  }, [entries]);

  const saveState = (newEntries: WaterLogEntry[], newTarget: number = targetGlasses) => {
    setEntries(newEntries);
    setTargetGlasses(newTarget);
    const newTotal = Math.max(0, newEntries.reduce((sum, e) => sum + e.glasses, 0));

    try {
      localStorage.setItem(
        getV2StorageKey(),
        JSON.stringify({ entries: newEntries, targetGlasses: newTarget })
      );
      localStorage.setItem(getLegacyStorageKey(), String(newTotal));
      window.dispatchEvent(new Event("nutriscan_water_updated"));
    } catch (e) {
      console.warn("Could not save water data to localStorage:", e);
    }

    if (onWaterChange) {
      onWaterChange(newTotal);
    }
  };

  const handleAddGlass = (count: number = 1) => {
    if (count <= 0) return;
    const now = Date.now();
    const newEntry: WaterLogEntry = {
      id: `water-${now}-${Math.random().toString(36).slice(2, 6)}`,
      time: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now,
      glasses: count,
      ml: count * 250
    };
    saveState([...entries, newEntry]);
  };

  const handleRemoveGlass = () => {
    if (entries.length === 0) return;
    const last = entries[entries.length - 1];
    if (last.glasses > 1) {
      const updated = entries.slice(0, -1).concat({
        ...last,
        glasses: last.glasses - 1,
        ml: (last.glasses - 1) * 250
      });
      saveState(updated);
    } else {
      saveState(entries.slice(0, -1));
    }
  };

  const currentSpend =
    userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap =
    userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;

  return (
    <aside
      aria-label={isFa ? "خلاصه سلامت روزانه" : "Health Summary Sidebar"}
      className="w-full lg:w-80 p-4 sm:p-6 flex flex-col gap-5 shrink-0 select-none overflow-y-auto"
    >
      {/* CARD 1: ACTIVITY RING & MACRO PROGRESS */}
      <Card className="apple-card border-[var(--apple-border)]">
        <CardContent className="p-5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--apple-text-primary)]">
              {isFa ? "خلاصه سلامت" : "Activity Summary"}
            </h3>
            <span className="text-xs font-medium text-[#ff3b30] tabular-nums">
              {userProfile.calorieGoal > 0
                ? `${formatNumber(Math.round((dailyTotals.calories / userProfile.calorieGoal) * 100), isFa)}%`
                : "0%"}
            </span>
          </div>

          {/* Apple Fitness Activity Ring */}
          <div className="flex justify-center py-2">
            <ActivityRing
              current={dailyTotals.calories}
              goal={userProfile.calorieGoal || 2000}
              size={170}
              strokeWidth={13}
              isFa={isFa}
              label={isFa ? "کالری ثبت‌شده" : "Active Calories"}
            />
          </div>

          {/* Slim Macro Progress Bars */}
          <div className="flex flex-col gap-3.5 pt-2 border-t border-[var(--apple-border)]">
            <MacroBar
              type="protein"
              label={isFa ? "پروتئین" : "Protein"}
              current={dailyTotals.protein}
              goal={userProfile.proteinGoal || 80}
              isFa={isFa}
            />
            <MacroBar
              type="carbs"
              label={isFa ? "کربوهیدرات" : "Carbohydrates"}
              current={dailyTotals.carbs}
              goal={userProfile.carbsGoal || 250}
              isFa={isFa}
            />
            <MacroBar
              type="fat"
              label={isFa ? "چربی" : "Fat"}
              current={dailyTotals.fat}
              goal={userProfile.fatGoal || 65}
              isFa={isFa}
            />
          </div>

          {/* Daily Spend Row */}
          {!userProfile.hidePrices && (
            <div className="pt-3 border-t border-[var(--apple-border)] flex items-center justify-between text-xs">
              <span className="text-[var(--apple-text-secondary)] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[var(--apple-text-tertiary)]" />
                <span>{isFa ? "هزینه وعده‌های امروز" : "Today's Meal Spend"}</span>
              </span>
              <span className="font-semibold text-[var(--apple-text-primary)] tabular-nums">
                {formatPriceDisplay(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal, userProfile)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CARD 2: WATER TRACKER */}
      <Card className="apple-card border-[var(--apple-border)]">
        <CardContent className="p-5">
          <WaterTracker
            totalGlasses={totalGlasses}
            targetGlasses={targetGlasses}
            isFa={isFa}
            onAddGlass={handleAddGlass}
            onRemoveGlass={handleRemoveGlass}
          />
        </CardContent>
      </Card>
    </aside>
  );
};
