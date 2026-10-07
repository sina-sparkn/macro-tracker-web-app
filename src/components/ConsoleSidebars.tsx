import React, { useState, useEffect, useMemo } from "react";
import { Flame, Droplets, Plus, Minus, Camera, BookOpen, Sliders } from "lucide-react";
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
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      className="hidden lg:flex w-20 border-r border-[#2a2c31] rtl:border-r-0 rtl:border-l py-6 bg-[#111214] flex-col items-center justify-between shrink-0 select-none z-20"
    >
      <div className="flex flex-col items-center gap-5 w-full">
        {/* BRAND ICON */}
        <div className="w-10 h-10 rounded-lg bg-[#ff3e00]/10 border border-[#ff3e00]/40 flex items-center justify-center text-[#ff3e00] mb-1">
          <Flame className="w-5 h-5 fill-[#ff3e00]" />
        </div>

        {/* NAVIGATION TILES */}
        <nav className="flex flex-col items-center gap-4 w-full" role="tablist">
          {/* SCAN TAB */}
          <button
            onClick={() => setActiveTab("scan")}
            type="button"
            role="tab"
            aria-selected={activeTab === "scan"}
            title={isFa ? "اسکن با دوربین" : "Scan Meal"}
            className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative group focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "scan"
                ? "bg-[#ff3e00] text-black font-bold shadow-[0_2px_14px_rgba(255,62,0,0.35)]"
                : "text-[#707070] hover:text-[#e0e0e0] hover:bg-[#18191d]"
            }`}
          >
            <Camera className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* DIARY TAB */}
          <button
            onClick={() => setActiveTab("diary")}
            type="button"
            role="tab"
            aria-selected={activeTab === "diary"}
            title={isFa ? "یادداشت روزانه" : "Food Diary"}
            className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative group focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "diary"
                ? "bg-[#ff3e00] text-black font-bold shadow-[0_2px_14px_rgba(255,62,0,0.35)]"
                : "text-[#707070] hover:text-[#e0e0e0] hover:bg-[#18191d]"
            }`}
          >
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
            {diaryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff3e00] text-black text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-sm">
                {isFa ? diaryCount.toLocaleString("fa-IR") : diaryCount}
              </span>
            )}
          </button>

          {/* GOALS TAB */}
          <button
            onClick={() => setActiveTab("profile")}
            type="button"
            role="tab"
            aria-selected={activeTab === "profile"}
            title={isFa ? "اهداف و بودجه" : "Goals & Budget"}
            className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative group focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
              activeTab === "profile"
                ? "bg-[#ff3e00] text-black font-bold shadow-[0_2px_14px_rgba(255,62,0,0.35)]"
                : "text-[#707070] hover:text-[#e0e0e0] hover:bg-[#18191d]"
            }`}
          >
            <Sliders className="w-5 h-5 stroke-[2.2]" />
          </button>
        </nav>
      </div>
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
            ml: delta * 250
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
    return () => window.removeEventListener("nutriscan_water_updated", handleWaterEvent);
  }, []);

  // Persist whenever entries or targetGlasses change
  const totalGlasses = useMemo(() => {
    return Math.max(0, entries.reduce((sum, e) => sum + e.glasses, 0));
  }, [entries]);

  const glassVolumeMl = 250;
  const waterPercent = Math.min(Math.round((totalGlasses / targetGlasses) * 100), 100);

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

  const handleLogGlasses = (glassesCount: number = 1) => {
    if (glassesCount <= 0) return;
    const now = Date.now();
    const newEntry: WaterLogEntry = {
      id: `water-${now}-${Math.random().toString(36).slice(2, 6)}`,
      time: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now,
      glasses: glassesCount,
      ml: glassesCount * glassVolumeMl
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
        ml: (last.glasses - 1) * glassVolumeMl
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

  const currentSpend = userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap = userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;
  const budgetPercent = Math.min(Math.round((currentSpend / (budgetCap || 1)) * 100), 100);
  const calPercent = Math.min(Math.round((dailyTotals.calories / (userProfile.calorieGoal || 2000)) * 100), 100);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  return (
    <aside
      aria-label={isFa ? "ماتریس سلامت روزانه" : "Health Matrix Sidebar"}
      className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#2a2c31] rtl:border-l-0 rtl:border-r p-5 pb-24 lg:pb-6 bg-[#0e1013] flex flex-col gap-5 shrink-0 select-none overflow-y-auto z-10"
    >
      {/* SECTION 1: HEALTH MATRIX & DONUT STAT */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="meta">{isFa ? "ماتریس_سلامت" : "Health_Matrix"}</span>
          <span className="font-mono text-xs text-[#ff3e00] font-bold">
            {calPercent}%
          </span>
        </div>

        {/* DONUT STAT CIRCULAR GAUGE */}
        <div className="w-[140px] h-[140px] mx-auto my-3 relative flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#1f2126"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#ff3e00"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono font-extrabold text-2xl text-[#e0e0e0] tabular-nums leading-none">
              {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
            </span>
            <span className="meta text-[9px] text-[#707070] mt-1">
              {isFa ? "کالری_ثبت_شده" : "KCAL_LOGGED"}
            </span>
          </div>
        </div>

        {/* METRIC ROWS */}
        <div className="flex flex-col gap-2 mt-3">
          {/* PROTEIN ROW */}
          <div className="row-item">
            <span className="text-[#707070] text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <span>{isFa ? "پروتئین" : "Protein"}</span>
            </span>
            <span className="font-mono text-xs text-[#e0e0e0] font-semibold tabular-nums">
              {Math.round(dailyTotals.protein)}g / {userProfile.proteinGoal || 80}g
            </span>
          </div>

          {/* CARBS ROW */}
          <div className="row-item">
            <span className="text-[#707070] text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eab308]" />
              <span>{isFa ? "کربوهیدرات" : "Carbs"}</span>
            </span>
            <span className="font-mono text-xs text-[#e0e0e0] font-semibold tabular-nums">
              {Math.round(dailyTotals.carbs)}g / {userProfile.carbsGoal || 250}g
            </span>
          </div>

          {/* FAT ROW */}
          <div className="row-item">
            <span className="text-[#707070] text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
              <span>{isFa ? "چربی" : "Fat"}</span>
            </span>
            <span className="font-mono text-xs text-[#e0e0e0] font-semibold tabular-nums">
              {Math.round(dailyTotals.fat)}g / {userProfile.fatGoal || 65}g
            </span>
          </div>

          {/* REMAINING BUDGET ROW */}
          <div className="row-item">
            <span className="text-[#707070] text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff3e00]" />
              <span>{isFa ? "هزینه وعده‌ها" : "Meal Spend"}</span>
            </span>
            <span className="font-mono text-xs text-[#ff3e00] font-bold tabular-nums">
              {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: WATER INTAKE */}
      <div className="mt-1 pt-4 border-t border-[#2a2c31]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="meta">{isFa ? "مصرف_آب" : "Water_Intake"}</span>
          <span className="font-mono text-xs text-[#60a5fa] font-bold tabular-nums">
            {waterPercent}%
          </span>
        </div>

        <div className="flex justify-between items-baseline my-1.5">
          <span className="font-mono text-2xl font-extrabold text-[#e0e0e0] tabular-nums">
            {isFa ? totalGlasses.toLocaleString("fa-IR") : totalGlasses}{" "}
            <small className="text-xs font-normal text-[#707070] font-sans">
              / {isFa ? targetGlasses.toLocaleString("fa-IR") : targetGlasses} {isFa ? "لیوان" : "gl"}
            </small>
          </span>
          <span className="font-mono text-xs text-[#707070] tabular-nums">
            {totalGlasses * 250} ml
          </span>
        </div>

        {/* 4px Progress Bar */}
        <div className="h-1 bg-[#1f2126] rounded-full overflow-hidden my-2.5">
          <div
            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] transition-all duration-300"
            style={{ width: `${Math.min(waterPercent, 100)}%` }}
          />
        </div>

        {/* Water Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleLogGlasses(1)}
            aria-label={isFa ? "نوشیدن ۱ لیوان آب" : "Drink 1 glass of water"}
            className="water-btn flex-1 flex items-center justify-center gap-1.5 !mt-0 font-mono text-xs uppercase tracking-wider"
          >
            <Droplets className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span>{isFa ? "نوشیدن ۱+ لیوان" : "DRINK +1 GLASS"}</span>
          </button>

          <button
            type="button"
            onClick={handleDecrementLatest}
            disabled={totalGlasses === 0}
            aria-label={isFa ? "کاهش ۱ لیوان آب" : "Remove 1 glass"}
            className="p-2.5 bg-[#18191d] hover:bg-[#23252a] text-[#707070] hover:text-[#e0e0e0] disabled:opacity-30 disabled:cursor-not-allowed border border-[#2a2c31] rounded-lg transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 3: HISTORY LOG SNIPPET */}
      <div className="mt-1 pt-3 border-t border-[#2a2c31]">
        <div className="bg-[#111214] border border-dashed border-[#2a2c31] rounded-xl p-3.5">
          <span className="meta">{isFa ? "تاریخچه_اسکن" : "History_Log"}</span>
          <div className="mt-1.5 text-xs text-[#e0e0e0] font-semibold truncate">
            {isFa ? "مقلوبه بادمجان و گوشت" : "Eggplant & Beef Makloubeh"}
          </div>
          <div className="font-mono text-xs text-[#ff3e00] font-bold mt-0.5">
            580 KCAL
          </div>
        </div>
      </div>
    </aside>
  );
};
