import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Droplets,
  Plus,
  Minus,
  Camera,
  BookOpen,
  Sliders,
} from "lucide-react";
import { UserProfile, DailyTotals } from "../types";
import { formatSmartPrice } from "../utils/dishLocalization";

export interface WaterLogEntry {
  id: string;
  time: string; // e.g. "09:30 AM" or "۰۹:۳۰"
  timestamp: number;
  glasses: number;
  ml: number;
  label?: string;
}

export interface WaterReminderConfig {
  enabled: boolean;
  intervalMinutes: number; // 0 = Smart Adaptive (60-90m), 45, 60, 90, 120
  soundEnabled: boolean;
  browserNotifications: boolean;
}

// Gentle 2-tone water drop chime using Web Audio API
export const playWaterDropChime = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Note 1: gentle bubble rise D5 -> A5
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

    // Note 2: high clean water droplet D6
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
    console.debug("Chime playback error:", e);
  }
};

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
      className="hidden lg:flex w-60 xl:w-64 border-r border-[#27272a] rtl:border-r-0 rtl:border-l p-4 xl:p-5 bg-[#111214] flex-col justify-between shrink-0 select-none"
    >
      <div>
        {/* BRAND BADGE */}
        <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-3.5 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#ff3e00] flex items-center justify-center text-black font-extrabold shadow-sm shrink-0">
            <Flame className="w-5 h-5" />
          </div>
<<<<<<< HEAD
          <div>
            <p className="text-xs text-[#9ca3af] mt-0.5 font-medium">
              {isFa ? "پایش هوشمند تغذیه" : "Smart Nutrition Tracker"}
            </p>
=======
          <div className="min-w-0">
            <h1 className="font-syne text-base font-extrabold text-[#f4f4f5] leading-tight truncate">
              {isFa ? "نوتری‌اسکن" : "NutriScan"}
            </h1>
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          </div>
        </div>

        {/* ACCESSIBLE NAVIGATION BUTTONS */}
        <nav className="flex flex-col gap-1.5" role="tablist">
          <button
            onClick={() => setActiveTab("scan")}
            type="button"
            role="tab"
            aria-selected={activeTab === "scan"}
            aria-label={isFa ? "اسکن غذا" : "Scan Meal"}
            className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "scan"
                ? "bg-[#ff3e00]/15 text-[#ffffff] border border-[#ff3e00]"
                : "text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#18191d] border border-transparent"
            }`}
          >
<<<<<<< HEAD
            <div className="flex items-center gap-3">
              <Camera
                className={`w-5 h-5 ${activeTab === "scan" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`}
              />
=======
            <div className="flex items-center gap-2.5">
              <Camera className={`w-4 h-4 ${activeTab === "scan" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`} />
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              <span>{isFa ? "اسکن غذا" : "Scan Meal"}</span>
            </div>
            {activeTab === "scan" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e00]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("diary")}
            type="button"
            role="tab"
            aria-selected={activeTab === "diary"}
            aria-label={isFa ? "یادداشت روزانه" : "Food Diary"}
            className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "diary"
                ? "bg-[#ff3e00]/15 text-[#ffffff] border border-[#ff3e00]"
                : "text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#18191d] border border-transparent"
            }`}
          >
<<<<<<< HEAD
            <div className="flex items-center gap-3">
              <BookOpen
                className={`w-5 h-5 ${activeTab === "diary" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`}
              />
=======
            <div className="flex items-center gap-2.5">
              <BookOpen className={`w-4 h-4 ${activeTab === "diary" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`} />
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              <span>{isFa ? "یادداشت روزانه" : "Food Diary"}</span>
            </div>
            {diaryCount > 0 ? (
              <span className="text-xs px-2 py-0.2 rounded-full bg-[#ff3e00] text-black font-bold font-mono">
                {isFa ? diaryCount.toLocaleString("fa-IR") : diaryCount}
              </span>
            ) : activeTab === "diary" ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e00]" />
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            type="button"
            role="tab"
            aria-selected={activeTab === "profile"}
<<<<<<< HEAD
            aria-label={
              isFa ? "اهداف و تنظیمات بودجه" : "Goals and Budget Settings"
            }
            className={`w-full min-h-[48px] px-3.5 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
=======
            aria-label={isFa ? "اهداف و بودجه" : "Goals & Budget"}
            className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              activeTab === "profile"
                ? "bg-[#ff3e00]/15 text-[#ffffff] border border-[#ff3e00]"
                : "text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#18191d] border border-transparent"
            }`}
          >
<<<<<<< HEAD
            <div className="flex items-center gap-3">
              <Sliders
                className={`w-5 h-5 ${activeTab === "profile" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`}
              />
=======
            <div className="flex items-center gap-2.5">
              <Sliders className={`w-4 h-4 ${activeTab === "profile" ? "text-[#ff3e00]" : "text-[#9ca3af]"}`} />
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              <span>{isFa ? "اهداف و بودجه" : "Goals & Budget"}</span>
            </div>
            {activeTab === "profile" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e00]" />
            )}
          </button>
        </nav>
      </div>
<<<<<<< HEAD

      {/* QUICK STATUS INFO */}
      <div className="pt-4 border-t border-[#27272a] text-xs text-[#9ca3af]">
        <div className="flex items-center gap-2 text-[#22c55e] font-medium mb-1">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span>{isFa ? "آماده تحلیل و اسکن هوشمند" : "System Ready"}</span>
        </div>
        <p className="text-[11px] text-[#71717a] leading-relaxed">
          {isFa
            ? "شناسایی کالری، ماکروها و تفکیک هزینه"
            : "Calories, macros & cost parsing"}
        </p>
      </div>
=======
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
    </aside>
  );
};

export const VitalsPane: React.FC<{
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
  onLogRecommendedDish?: () => void;
  waterGlasses?: number;
  onWaterChange?: (glasses: number) => void;
}> = ({ userProfile, dailyTotals, waterGlasses: propWater, onWaterChange }) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";

  // Persistent water intake storage keys for today
  const getTodayDateStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getV2StorageKey = () => `nutriscan_water_v2_${getTodayDateStr()}`;
  const getLegacyStorageKey = () => `nutriscan_water_${getTodayDateStr()}`;

  // State: daily entries and target
  const [targetGlasses, setTargetGlasses] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(getV2StorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          typeof parsed.targetGlasses === "number" &&
          parsed.targetGlasses > 0
        ) {
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
              ml: count * 250,
            },
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
          ml: propWater * 250,
        },
      ];
    }

    return [];
  });

  // Synchronize when propWater changes from outside
  useEffect(() => {
    if (typeof propWater === "number") {
      const currentTotal = entries.reduce((sum, e) => sum + e.glasses, 0);
      if (propWater !== currentTotal) {
        if (propWater === 0) {
          setEntries([]);
        } else if (propWater > currentTotal) {
          const delta = propWater - currentTotal;
          const newEntry: WaterLogEntry = {
            id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            time: "Sync",
            timestamp: Date.now(),
            glasses: delta,
            ml: delta * 250,
          };
          setEntries((prev) => [...prev, newEntry]);
        }
      }
    }
  }, [propWater]);

  // Synchronize when water updates in other components (e.g. DiaryConsoleView)
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
    return () =>
      window.removeEventListener("nutriscan_water_updated", handleWaterEvent);
  }, []);

  // Persist whenever entries or targetGlasses change
  const totalGlasses = useMemo(() => {
    return Math.max(
      0,
      entries.reduce((sum, e) => sum + e.glasses, 0),
    );
  }, [entries]);

  const glassVolumeMl = 250;
  const waterPercent = Math.min(
    Math.round((totalGlasses / targetGlasses) * 100),
    100,
  );

  const saveState = (
    newEntries: WaterLogEntry[],
    newTarget: number = targetGlasses,
  ) => {
    setEntries(newEntries);
    setTargetGlasses(newTarget);
    const newTotal = Math.max(
      0,
      newEntries.reduce((sum, e) => sum + e.glasses, 0),
    );

    try {
      localStorage.setItem(
        getV2StorageKey(),
        JSON.stringify({ entries: newEntries, targetGlasses: newTarget }),
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

  const handleLogGlasses = (glassesCount: number = 1) => {
    if (glassesCount <= 0) return;
    const now = Date.now();
    const newEntry: WaterLogEntry = {
      id: `water-${now}-${Math.random().toString(36).slice(2, 6)}`,
      time: new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now,
      glasses: glassesCount,
      ml: glassesCount * glassVolumeMl,
    };
    saveState([...entries, newEntry]);
  };

  const handleDecrementLatest = () => {
    if (entries.length === 0) return;
    const last = entries[entries.length - 1];
    if (last.glasses > 1) {
      const updated = entries.slice(0, -1).concat({
        ...last,
        glasses: last.glasses - 1,
        ml: (last.glasses - 1) * glassVolumeMl,
      });
      saveState(updated);
    } else {
      saveState(entries.slice(0, -1));
    }
  };

  const formatPrice = (toman: number, usd: number) => {
    if (userProfile.hidePrices) {
      return isFa ? "فقط کالری" : "Calorie-Only";
    }
    return formatSmartPrice(toman, usd, userProfile, 1) || "-";
  };

  const currentSpend =
    userProfile.currency === "IRT"
      ? dailyTotals.costTomanTotal
      : dailyTotals.costUSDTotal;
  const budgetCap =
    userProfile.currency === "IRT"
      ? userProfile.dailyBudgetToman
      : userProfile.dailyBudgetUSD;
  const budgetPercent = Math.min(
    Math.round((currentSpend / (budgetCap || 1)) * 100),
    100,
  );
  const calPercent = Math.min(
    Math.round(
      (dailyTotals.calories / (userProfile.calorieGoal || 2000)) * 100,
    ),
    100,
  );

  return (
    <aside
      aria-label={isFa ? "خلاصه وضعیت دریافت روزانه" : "Daily Vitals Summary"}
      className="w-full lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-[#27272a] rtl:border-l-0 rtl:border-r p-5 pb-28 lg:pb-5 bg-[#111214] flex flex-col gap-5 shrink-0 select-none overflow-y-auto"
    >
      {/* DAILY CALORIE SUMMARY CARD */}
      <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4 sm:p-5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#9ca3af] font-medium truncate">
            {isFa ? "کالری روزانه" : "Daily Calories"}
          </span>
          <span className="text-[#ff3e00] font-bold text-xs sm:text-sm font-mono tabular-nums shrink-0 ml-1">
            {isFa ? `${calPercent.toLocaleString("fa-IR")}٪` : `${calPercent}%`}
          </span>
        </div>

<<<<<<< HEAD
        <div className="font-syne text-4xl font-extrabold text-[#ffffff] my-2 leading-tight">
          {isFa
            ? dailyTotals.calories.toLocaleString("fa-IR")
            : dailyTotals.calories}
          <span className="text-sm font-normal text-[#9ca3af] ml-1.5 rtl:mr-1.5 rtl:ml-0">
=======
        <div className="font-syne text-3xl sm:text-4xl font-extrabold text-[#ffffff] my-2 leading-tight flex items-baseline gap-1 truncate">
          <span>{isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}</span>
          <span className="text-xs sm:text-sm font-normal text-[#9ca3af]">
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
            {isFa ? "کالری" : "kcal"}
          </span>
        </div>

<<<<<<< HEAD
        <div className="flex items-center justify-between text-xs text-[#d4d4d8] pt-2 border-t border-[#27272a]">
          <span>
            {isFa
              ? `هدف: ${userProfile.calorieGoal.toLocaleString("fa-IR")}`
              : `Goal: ${userProfile.calorieGoal}`}
=======
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#d4d4d8] pt-2 border-t border-[#27272a]">
          <span className="truncate">
            {isFa ? `هدف: ${userProfile.calorieGoal.toLocaleString("fa-IR")}` : `Goal: ${userProfile.calorieGoal}`}
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          </span>
          <span className="text-[#ff3e00] font-medium shrink-0 ml-1">
            {isFa
              ? `${Math.max(0, userProfile.calorieGoal - dailyTotals.calories).toLocaleString("fa-IR")} باقیمانده`
              : `${Math.max(0, userProfile.calorieGoal - dailyTotals.calories)} left`}
          </span>
        </div>

        {/* MACRO SUMMARY BADGES */}
<<<<<<< HEAD
        <div className="mt-4 pt-3 border-t border-[#27272a] grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded">
            <span className="text-[#9ca3af] block text-[11px]">
              {isFa ? "پروتئین" : "Protein"}
            </span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block font-mono tabular-nums">
              {Math.round(dailyTotals.protein)} {isFa ? "گ" : "g"}
            </span>
          </div>
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded">
            <span className="text-[#9ca3af] block text-[11px]">
              {isFa ? "کربوهیدرات" : "Carbs"}
            </span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block font-mono tabular-nums">
              {Math.round(dailyTotals.carbs)} {isFa ? "گ" : "g"}
            </span>
          </div>
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded">
            <span className="text-[#9ca3af] block text-[11px]">
              {isFa ? "چربی" : "Fat"}
            </span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block font-mono tabular-nums">
=======
        <div className="mt-3 pt-3 border-t border-[#27272a] grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded min-w-0">
            <span className="text-[#9ca3af] block text-[10px] sm:text-[11px] truncate">{isFa ? "پروتئین" : "Protein"}</span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block font-mono text-xs tabular-nums truncate">
              {Math.round(dailyTotals.protein)} {isFa ? "گ" : "g"}
            </span>
          </div>
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded min-w-0">
            <span className="text-[#9ca3af] block text-[10px] sm:text-[11px] truncate">{isFa ? "کربوهیدرات" : "Carbs"}</span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block font-mono text-xs tabular-nums truncate">
              {Math.round(dailyTotals.carbs)} {isFa ? "گ" : "g"}
            </span>
          </div>
          <div className="bg-[#08090a] border border-[#27272a] p-2 rounded min-w-0">
            <span className="text-[#9ca3af] block text-[10px] sm:text-[11px] truncate">{isFa ? "چربی" : "Fat"}</span>
            <span className="text-[#f4f4f5] font-bold mt-0.5 block font-mono text-xs tabular-nums truncate">
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              {Math.round(dailyTotals.fat)} {isFa ? "گ" : "g"}
            </span>
          </div>
        </div>

        {/* ESTIMATED FOOD SPEND */}
<<<<<<< HEAD
        <div className="mt-4 bg-[#08090a] border border-[#27272a] p-3 rounded-lg text-xs">
          <div className="flex justify-between items-center text-[#d4d4d8] mb-1.5">
            <span>{isFa ? "هزینه تخمینی وعده‌ها:" : "Est. Meal Spend:"}</span>
            <span className="text-[#ff3e00] font-bold text-sm">
              {formatPrice(
                dailyTotals.costTomanTotal,
                dailyTotals.costUSDTotal,
              )}
=======
        <div className="mt-3.5 bg-[#08090a] border border-[#27272a] p-3 rounded-lg text-xs">
          <div className="flex justify-between items-center text-[#d4d4d8] mb-1.5 min-w-0">
            <span className="truncate">{isFa ? "هزینه تخمینی:" : "Meal Spend:"}</span>
            <span className="text-[#ff3e00] font-bold text-xs sm:text-sm shrink-0 ml-1">
              {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
            </span>
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${budgetPercent > 90 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#9ca3af] mt-1.5 min-w-0">
            <span className="truncate">
              {isFa ? "بودجه: " : "Budget: "}
              {userProfile.currency === "IRT"
                ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} تومان`
                : `$${userProfile.dailyBudgetUSD}`}
            </span>
            <span className="font-mono tabular-nums shrink-0 ml-1">{budgetPercent}%</span>
          </div>
        </div>
      </div>

      {/* DAILY WATER INTAKE - SUPER MINIMAL */}
      <div className="bg-[#18191d] border border-[#27272a] rounded-lg p-4">
        {/* HEADER: Title & Counter */}
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{isFa ? "آب" : "water"}</span>
          </div>
          <div>
            <span className="font-syne font-extrabold text-base text-white font-mono tabular-nums">
              {isFa ? totalGlasses.toLocaleString("fa-IR") : totalGlasses}
            </span>
            <span className="text-xs text-[#71717a] font-normal ml-1 rtl:mr-1 rtl:ml-0 font-mono">
              / {isFa ? targetGlasses.toLocaleString("fa-IR") : targetGlasses}{" "}
              {isFa ? "لیوان" : "gl"}
            </span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-300 ${
              waterPercent >= 100
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                : "bg-cyan-400"
            }`}
            style={{ width: `${Math.min(waterPercent, 100)}%` }}
          />
        </div>

        {/* + AND - BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLogGlasses(1)}
            aria-label={isFa ? "افزودن ۱ لیوان آب" : "Add 1 glass of water"}
            className="flex-1 py-2 bg-cyan-950/50 hover:bg-cyan-900/60 active:scale-95 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 hover:border-cyan-400 rounded-md font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isFa ? "۱" : "1"}</span>
          </button>

          <button
            type="button"
            onClick={handleDecrementLatest}
            disabled={totalGlasses === 0}
            aria-label={isFa ? "کاهش ۱ لیوان آب" : "Remove 1 glass of water"}
            className="py-2 px-4 bg-[#08090a] hover:bg-[#18191d] active:scale-95 text-[#d4d4d8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#27272a] rounded-md font-bold text-sm flex items-center justify-center transition-all cursor-pointer"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </aside>
  );
};
