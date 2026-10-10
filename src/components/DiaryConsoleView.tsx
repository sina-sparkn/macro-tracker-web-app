import React, { useState, useEffect, useMemo } from "react";
import {
  Trash2,
  Plus,
  Minus,
  BookOpen,
  Database,
  BarChart3,
  Calendar,
  Search,
  Check,
  X,
  RefreshCw,
  ArrowUpRight,
  Clock,
  Droplets,
  GlassWater,
  Flame,
  History,
  Utensils,
} from "lucide-react";
import { FoodLogItem, DailyTotals, UserProfile, ScannedLabel } from "../types";
import { TRANSLATIONS } from "../translations";
import { formatSmartPrice } from "../utils/dishLocalization";

export interface SqliteDbStats {
  engine: string;
  fileName: string;
  totalEntries: number;
  activeDays: number;
}

interface DiaryConsoleViewProps {
  diaryItems: FoodLogItem[];
  allHistoryItems: FoodLogItem[];
  recentScans?: ScannedLabel[];
  onQuickLogRecentScan?: (item: ScannedLabel, targetDate?: string, servings?: number) => void;
  onSelectRecentScan?: (item: ScannedLabel) => void;
  onRemoveRecentScan?: (idOrName: string) => void;
  selectedDate: string; // YYYY-MM-DD or "all"
  onSelectDate: (date: string) => void;
  dailyTotals: DailyTotals;
  userProfile: UserProfile;
  dbStats: SqliteDbStats;
  isSyncingDb?: boolean;
  onDeleteLogItem: (id: string) => void;
  onClearLogs: (dateFilter?: string) => void;
  onAddManualEntry: (entry: Partial<FoodLogItem>) => Promise<void> | void;
  onGoToScanner: () => void;
}

function getLocalIsoDate(daysAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDateLabel(isoDate: string, isFa: boolean): string {
  const today = getLocalIsoDate(0);
  const yesterday = getLocalIsoDate(1);
  if (isoDate === today) return isFa ? "امروز" : "Today";
  if (isoDate === yesterday) return isFa ? "دیروز" : "Yesterday";

  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const dateObj = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );
  if (isNaN(dateObj.getTime())) return isoDate;

  return dateObj.toLocaleDateString(isFa ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatWeekdayShort(isoDate: string, isFa: boolean): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return "";
  const dateObj = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString(isFa ? "fa-IR" : "en-US", {
    weekday: "short",
  });
}

export const DiaryConsoleView: React.FC<DiaryConsoleViewProps> = ({
  diaryItems,
  allHistoryItems,
  recentScans = [],
  onQuickLogRecentScan,
  onSelectRecentScan,
  onRemoveRecentScan,
  selectedDate,
  onSelectDate,
  dailyTotals,
  userProfile,
  dbStats,
  isSyncingDb = false,
  onDeleteLogItem,
  onClearLogs,
  onAddManualEntry,
  onGoToScanner,
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const currentRate =
    userProfile.exchangeRateTomanPerUSD &&
    userProfile.exchangeRateTomanPerUSD > 0
      ? userProfile.exchangeRateTomanPerUSD
      : 230000;

  // Scan History Quick-Add Modal State
  const [showScanHistoryModal, setShowScanHistoryModal] = useState(false);
  const [scanHistoryTargetDate, setScanHistoryTargetDate] = useState(() =>
    selectedDate === "all" ? getLocalIsoDate(0) : selectedDate,
  );
  const [scanHistorySearch, setScanHistorySearch] = useState("");
  const [loggedScanHistoryId, setLoggedScanHistoryId] = useState<string | null>(null);
  const [scanHistoryServings, setScanHistoryServings] = useState<Record<string, number>>({});

  const handleAddScanToDiary = (item: ScannedLabel, servings = 1) => {
    if (onQuickLogRecentScan) {
      const targetDate = scanHistoryTargetDate || (selectedDate !== "all" ? selectedDate : getLocalIsoDate(0));
      onQuickLogRecentScan(item, targetDate, servings);
      const id = item.id || item.productName;
      setLoggedScanHistoryId(id);
      setTimeout(() => {
        setLoggedScanHistoryId((curr) => (curr === id ? null : curr));
      }, 2500);
    }
  };

  const filteredScanHistoryItems = useMemo(() => {
    if (!scanHistorySearch.trim()) return recentScans;
    const q = scanHistorySearch.toLowerCase();
    return recentScans.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(q))
    );
  }, [recentScans, scanHistorySearch]);

  // Histogram view controls
  const [histogramMode, setHistogramMode] = useState<
    "daily" | "water" | "distribution"
  >("daily");
  const [histogramRangeDays, setHistogramRangeDays] = useState<7 | 14>(7);
  const [waterDataVersion, setWaterDataVersion] = useState<number>(0);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Inline confirmation for clearing logs (avoids window.confirm)
  const [confirmingClear, setConfirmingClear] = useState(false);

  // Manual / Past Entry Drawer State
  const [showAddPastModal, setShowAddPastModal] = useState(false);
  const [manualProductName, setManualProductName] = useState("");
  const [manualBrand, setManualBrand] = useState("");
  const [manualDate, setManualDate] = useState(() =>
    selectedDate === "all" ? getLocalIsoDate(0) : selectedDate,
  );
  const [manualTime, setManualTime] = useState("13:30");
  const [manualCalories, setManualCalories] = useState("450");
  const [manualProtein, setManualProtein] = useState("28");
  const [manualCarbs, setManualCarbs] = useState("42");
  const [manualFat, setManualFat] = useState("16");
  const [manualSodium, setManualSodium] = useState("480");
  const [manualServingSize, setManualServingSize] = useState("1 plate (350g)");
  const [manualPriceToman, setManualPriceToman] = useState("850000");

  const formatPrice = (toman?: number, usd?: number) => {
    if (userProfile.hidePrices) {
      return isFa ? "حالت فقط کالری" : "Calorie-Only";
    }
    return formatSmartPrice(toman, usd, userProfile, 1) || "-";
  };

  const calorieGoal = userProfile.calorieGoal || 2000;
  const proteinGoal = userProfile.proteinGoal || 80;
  const carbsGoal = userProfile.carbsGoal || 250;
  const fatGoal = userProfile.fatGoal || 65;
  const sodiumGoal = userProfile.sodiumGoal || 2300;

  const calPercent = Math.min(
    Math.round((dailyTotals.calories / calorieGoal) * 100),
    100,
  );
  const proteinPercent = Math.min(
    Math.round((dailyTotals.protein / proteinGoal) * 100),
    100,
  );
  const carbsPercent = Math.min(
    Math.round((dailyTotals.carbs / carbsGoal) * 100),
    100,
  );
  const fatPercent = Math.min(
    Math.round((dailyTotals.fat / fatGoal) * 100),
    100,
  );
  const sodiumPercent = Math.min(
    Math.round((dailyTotals.sodium / sodiumGoal) * 100),
    100,
  );

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

  // Build daily calorie histogram data for the last N days (chronological left-to-right)
  const dailyHistogramBuckets = useMemo(() => {
    const days: {
      date: string;
      shortLabel: string;
      weekday: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      mealCount: number;
      percentOfGoal: number;
      status: "empty" | "under" | "optimal" | "over";
    }[] = [];

    for (let i = histogramRangeDays - 1; i >= 0; i--) {
      const iso = getLocalIsoDate(i);
      const dayEntries = allHistoryItems.filter(
        (item) => (item.entryDate || getLocalIsoDate(0)) === iso,
      );
      const cals = dayEntries.reduce(
        (sum, item) => sum + (item.caloriesTotal || 0),
        0,
      );
      const prot = dayEntries.reduce(
        (sum, item) => sum + (item.proteinTotal || 0),
        0,
      );
      const carb = dayEntries.reduce(
        (sum, item) => sum + (item.carbsTotal || 0),
        0,
      );
      const fatVal = dayEntries.reduce(
        (sum, item) => sum + (item.fatTotal || 0),
        0,
      );
      const pct = Math.round((cals / calorieGoal) * 100);

      let status: "empty" | "under" | "optimal" | "over" = "optimal";
      if (cals === 0) status = "empty";
      else if (pct > 105) status = "over";
      else if (pct < 60) status = "under";

      days.push({
        date: iso,
        shortLabel: formatShortDateLabel(iso, isFa),
        weekday: formatWeekdayShort(iso, isFa),
        calories: cals,
        protein: Math.round(prot),
        carbs: Math.round(carb),
        fat: Math.round(fatVal),
        mealCount: dayEntries.length,
        percentOfGoal: pct,
        status,
      });
    }
    return days;
  }, [allHistoryItems, histogramRangeDays, calorieGoal, isFa]);

  // Build meal calorie distribution frequency histogram (statistical bins across recorded meals)
  const mealDistributionBins = useMemo(() => {
    const bins = [
      {
        id: "bin-1",
        rangeEn: "0–250 kcal",
        rangeFa: "۰ تا ۲۵۰ کالری",
        categoryEn: "Light / Snack",
        categoryFa: "میان وعده / سبک",
        min: 0,
        max: 250,
        count: 0,
        totalCalories: 0,
      },
      {
        id: "bin-2",
        rangeEn: "251–450 kcal",
        rangeFa: "۲۵۱ تا ۴۵۰ کالری",
        categoryEn: "Balanced Dish",
        categoryFa: "وعده متعادل",
        min: 251,
        max: 450,
        count: 0,
        totalCalories: 0,
      },
      {
        id: "bin-3",
        rangeEn: "451–650 kcal",
        rangeFa: "۴۵۱ تا ۶۵۰ کالری",
        categoryEn: "Standard Meal",
        categoryFa: "غذای کامل",
        min: 451,
        max: 650,
        count: 0,
        totalCalories: 0,
      },
      {
        id: "bin-4",
        rangeEn: "651–850 kcal",
        rangeFa: "۶۵۱ تا ۸۵۰ کالری",
        categoryEn: "Hearty Plate",
        categoryFa: "وعده پرکالری",
        min: 651,
        max: 850,
        count: 0,
        totalCalories: 0,
      },
      {
        id: "bin-5",
        rangeEn: "851+ kcal",
        rangeFa: "بیش از ۸۵۰ کالری",
        categoryEn: "High-Calorie Feast",
        categoryFa: "وعده سنگین",
        min: 851,
        max: Infinity,
        count: 0,
        totalCalories: 0,
      },
    ];

    for (const item of allHistoryItems) {
      const c = item.caloriesTotal || 0;
      const targetBin =
        bins.find((b) => c >= b.min && c <= b.max) || bins[bins.length - 1];
      targetBin.count += 1;
      targetBin.totalCalories += c;
    }

    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    const totalMeals = Math.max(allHistoryItems.length, 1);

    return bins.map((b) => ({
      ...b,
      heightPercent: Math.round((b.count / maxCount) * 100),
      sharePercent: Math.round((b.count / totalMeals) * 100),
    }));
  }, [allHistoryItems]);

  // Histogram summary metrics
  const histogramSummary = useMemo(() => {
    const activeDays = dailyHistogramBuckets.filter((d) => d.calories > 0);
    const totalPeriodCals = activeDays.reduce((acc, d) => acc + d.calories, 0);
    const avgDailyCals =
      activeDays.length > 0
        ? Math.round(totalPeriodCals / activeDays.length)
        : 0;
    const peakDay = dailyHistogramBuckets.reduce(
      (max, d) => (d.calories > max.calories ? d : max),
      dailyHistogramBuckets[0] || { calories: 0, shortLabel: "-", date: "" },
    );
    const daysOnTarget = activeDays.filter(
      (d) => d.calories <= calorieGoal * 1.05,
    ).length;
    const maxScaleCalories = Math.max(
      calorieGoal * 1.25,
      ...dailyHistogramBuckets.map((d) => d.calories * 1.1),
      1000,
    );

    return {
      avgDailyCals,
      peakDay,
      daysOnTarget,
      activeDaysCount: activeDays.length,
      maxScaleCalories,
    };
  }, [dailyHistogramBuckets, calorieGoal]);

  // Distinct dates available for quick filter strip
  const recentDateTabs = useMemo(() => {
    const baseDates = new Set<string>();
    for (let i = 0; i < 7; i++) {
      baseDates.add(getLocalIsoDate(i));
    }
    for (const item of allHistoryItems) {
      if (item.entryDate) baseDates.add(item.entryDate);
    }
    return Array.from(baseDates)
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 8);
  }, [allHistoryItems]);

  // Filtered entries for the table
  const filteredDiaryItems = useMemo(() => {
    if (!searchQuery.trim()) return diaryItems;
    const q = searchQuery.toLowerCase();
    return diaryItems.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(q)) ||
        (item.entryDate && item.entryDate.includes(q)),
    );
  }, [diaryItems, searchQuery]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualProductName.trim()) return;

    const tomanVal = Number(manualPriceToman) || 0;
    const usdVal =
      tomanVal > 0 ? Number((tomanVal / currentRate).toFixed(2)) : 0;

    await onAddManualEntry({
      entryDate: manualDate || getLocalIsoDate(0),
      loggedAt: manualTime || "13:00",
      productName: manualProductName.trim(),
      brand:
        manualBrand.trim() || (isFa ? "ثبت در پایگاه داده " : "Diary Record"),
      foodType: "dish",
      cuisine: isFa ? "ایرانی / ملل" : "Custom Entry",
      servingsCount: 1,
      servingSizeText: manualServingSize.trim() || "1 serving",
      caloriesTotal: Math.max(0, Math.round(Number(manualCalories) || 0)),
      proteinTotal: Math.max(0, Number(Number(manualProtein || 0).toFixed(1))),
      carbsTotal: Math.max(0, Number(Number(manualCarbs || 0).toFixed(1))),
      fatTotal: Math.max(0, Number(Number(manualFat || 0).toFixed(1))),
      sodiumTotal: Math.max(0, Math.round(Number(manualSodium) || 0)),
      priceToman: tomanVal,
      priceUSD: usdVal,
    });

    setManualProductName("");
    setShowAddPastModal(false);
    if (manualDate && selectedDate !== "all") {
      onSelectDate(manualDate);
    }
  };

  const goalLineBottomPercent = Math.min(
    Math.max(
      Math.round((calorieGoal / histogramSummary.maxScaleCalories) * 100),
      10,
    ),
    92,
  );

  // Sync water updates across tabs/sidebars
  useEffect(() => {
    const handleWaterSync = () => {
      setWaterDataVersion((v) => v + 1);
    };
    window.addEventListener("nutriscan_water_updated", handleWaterSync);
    window.addEventListener("storage", handleWaterSync);
    return () => {
      window.removeEventListener("nutriscan_water_updated", handleWaterSync);
      window.removeEventListener("storage", handleWaterSync);
    };
  }, []);

  // Helper to read water for a given date from localStorage
  const getStoredWaterForDate = (isoDate: string) => {
    try {
      const rawV2 = localStorage.getItem(`nutriscan_water_v2_${isoDate}`);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        const target =
          typeof parsed.targetGlasses === "number" && parsed.targetGlasses > 0
            ? parsed.targetGlasses
            : 8;
        const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
        const totalGlasses = entries.reduce(
          (s: number, e: { glasses?: number }) => s + (Number(e.glasses) || 0),
          0,
        );
        return {
          glasses: totalGlasses,
          ml: totalGlasses * 250,
          targetGlasses: target,
        };
      }
      const legacy = localStorage.getItem(`nutriscan_water_${isoDate}`);
      if (legacy !== null) {
        const g = Math.max(0, parseInt(legacy, 10) || 0);
        return {
          glasses: g,
          ml: g * 250,
          targetGlasses: 8,
        };
      }
    } catch {}
    return { glasses: 0, ml: 0, targetGlasses: 8 };
  };

  // Helper to update water for a date
  const updateWaterForDate = (
    isoDate: string,
    newGlasses: number,
    target: number = 8,
  ) => {
    const safeGlasses = Math.max(0, newGlasses);
    const now = Date.now();
    const newEntry =
      safeGlasses > 0
        ? [
            {
              id: `diary-${isoDate}-${now}`,
              time: new Date(now).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              timestamp: now,
              glasses: safeGlasses,
              ml: safeGlasses * 250,
            },
          ]
        : [];

    try {
      localStorage.setItem(
        `nutriscan_water_v2_${isoDate}`,
        JSON.stringify({ entries: newEntry, targetGlasses: target }),
      );
      localStorage.setItem(`nutriscan_water_${isoDate}`, String(safeGlasses));
      window.dispatchEvent(new Event("nutriscan_water_updated"));
    } catch (e) {
      console.warn("Could not save water data to localStorage:", e);
    }
    setWaterDataVersion((v) => v + 1);
  };

  // Build daily water histogram data
  const dailyWaterBuckets = useMemo(() => {
    // Reference waterDataVersion so this recomputes on changes
    void waterDataVersion;
    const days: {
      date: string;
      shortLabel: string;
      weekday: string;
      glasses: number;
      ml: number;
      targetGlasses: number;
      percentOfGoal: number;
      status: "empty" | "under" | "optimal" | "over";
    }[] = [];

    for (let i = histogramRangeDays - 1; i >= 0; i--) {
      const iso = getLocalIsoDate(i);
      const data = getStoredWaterForDate(iso);
      const target = data.targetGlasses || 8;
      const pct = Math.round((data.glasses / target) * 100);

      let status: "empty" | "under" | "optimal" | "over" = "optimal";
      if (data.glasses === 0) status = "empty";
      else if (pct >= 100) status = "optimal";
      else if (pct < 60) status = "under";

      days.push({
        date: iso,
        shortLabel: formatShortDateLabel(iso, isFa),
        weekday: formatWeekdayShort(iso, isFa),
        glasses: data.glasses,
        ml: data.ml,
        targetGlasses: target,
        percentOfGoal: pct,
        status,
      });
    }
    return days;
  }, [histogramRangeDays, isFa, waterDataVersion]);

  // Water histogram summary metrics
  const waterHistogramSummary = useMemo(() => {
    const totalGlasses = dailyWaterBuckets.reduce(
      (sum, b) => sum + b.glasses,
      0,
    );
    const activeDays = dailyWaterBuckets.filter((b) => b.glasses > 0);
    const targetGlasses =
      dailyWaterBuckets[dailyWaterBuckets.length - 1]?.targetGlasses || 8;
    const maxDayGlasses = Math.max(
      ...dailyWaterBuckets.map((b) => b.glasses),
      0,
    );
    const maxScaleGlasses = Math.max(targetGlasses + 2, maxDayGlasses + 1, 10);
    const avgDailyGlasses =
      Math.round((totalGlasses / Math.max(histogramRangeDays, 1)) * 10) / 10;
    const avgDailyMl = Math.round(avgDailyGlasses * 250);
    const daysOnTarget = dailyWaterBuckets.filter(
      (b) => b.glasses >= b.targetGlasses,
    ).length;
    const peakDay = dailyWaterBuckets.reduce(
      (peak, b) => (b.glasses > peak.glasses ? b : peak),
      dailyWaterBuckets[0] || { date: "", shortLabel: "-", glasses: 0, ml: 0 },
    );
    const adherencePercent = Math.round(
      (daysOnTarget / Math.max(histogramRangeDays, 1)) * 100,
    );

    return {
      totalGlasses,
      activeDaysCount: activeDays.length,
      targetGlasses,
      maxScaleGlasses,
      avgDailyGlasses,
      avgDailyMl,
      daysOnTarget,
      peakDay,
      adherencePercent,
    };
  }, [dailyWaterBuckets, histogramRangeDays]);

  const waterGoalLineBottomPercent = Math.min(
    Math.max(
      Math.round(
        (waterHistogramSummary.targetGlasses /
          waterHistogramSummary.maxScaleGlasses) *
          100,
      ),
      15,
    ),
    90,
  );

  // Selected date water data for the quick control strip
  const effectiveSelectedDate =
    selectedDate === "all" ? getLocalIsoDate(0) : selectedDate;
  const currentSelectedWater = useMemo(() => {
    void waterDataVersion;
    return getStoredWaterForDate(effectiveSelectedDate);
  }, [effectiveSelectedDate, waterDataVersion]);

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full pb-24 sm:pb-28 lg:pb-10">
      {/* HEADER STRIP & SQLITE DATABASE STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-5">
        <div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f4f4f5] mt-1">
            {isFa
              ? " خاطرات غذایی و هیستوگرام کالری"
              : "Dietary Journal & Calorie Intake Histogram"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {recentScans && recentScans.length > 0 && (
            <button
              onClick={() => {
                setScanHistoryTargetDate(selectedDate === "all" ? getLocalIsoDate(0) : selectedDate);
                setShowScanHistoryModal(true);
              }}
              type="button"
              className="px-3.5 py-2 bg-[#18191d] hover:bg-[#23252a] text-[#e0e0e0] border border-[#2a2c31] hover:border-[#ff3e00] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              title={t.addFromScanHistory}
            >
              <History className="w-4 h-4 text-[#ff3e00]" />
              <span>{t.addFromScanHistory}</span>
              <span className="bg-[#ff3e00] text-black text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {isFa ? recentScans.length.toLocaleString("fa-IR") : recentScans.length}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              setManualDate(
                selectedDate === "all" ? getLocalIsoDate(0) : selectedDate,
              );
              setShowAddPastModal((prev) => !prev);
            }}
            type="button"
            className="px-4 py-2 bg-[#ff3e00] hover:bg-[#e03600] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isFa ? "ثبت وعده در تاریخ دلخواه" : "Record Past / Custom Meal"}
            </span>
          </button>

          {confirmingClear && (
            <div className="flex items-center gap-1.5 bg-[#18191d] border border-red-500/50 rounded-lg px-2.5 py-1.5">
              <span className="text-xs text-red-300 font-medium whitespace-nowrap">
                {isFa ? "حذف قطعی ؟" : "Delete?"}
              </span>
              <button
                onClick={() => {
                  onClearLogs(
                    selectedDate === "all" ? undefined : selectedDate,
                  );
                  setConfirmingClear(false);
                }}
                type="button"
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isFa ? "بله" : "Confirm"}</span>
              </button>
              <button
                onClick={() => setConfirmingClear(false)}
                type="button"
                className="px-2 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] text-xs rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SCAN HISTORY QUICK-ADD MODAL */}
      {showScanHistoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div
            className="bg-[#111214] border border-[#2a2c31] rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="p-4 sm:p-5 border-b border-[#2a2c31] flex items-center justify-between gap-3 bg-[#18191d]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#ff3e00]/15 border border-[#ff3e00]/40 flex items-center justify-center text-[#ff3e00] shrink-0">
                  <History className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-syne text-base sm:text-lg font-bold text-[#f4f4f5] truncate">
                      {t.addFromScanHistory}
                    </h3>
                    <span className="bg-[#ff3e00]/20 text-[#ff3e00] border border-[#ff3e00]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                      {isFa ? `${recentScans.length.toLocaleString("fa-IR")} مورد` : `${recentScans.length} Scans`}
                    </span>
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-0.5 truncate">
                    {t.scanHistorySubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScanHistoryModal(false)}
                type="button"
                className="p-2 text-[#9ca3af] hover:text-white rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTROLS: TARGET DATE & SEARCH */}
            <div className="p-4 border-b border-[#2a2c31] bg-[#18191d] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#9ca3af] whitespace-nowrap font-medium">
                  {isFa ? "ثبت در تاریخ:" : "Add to date:"}
                </span>
                <input
                  type="date"
                  value={scanHistoryTargetDate}
                  onChange={(e) => setScanHistoryTargetDate(e.target.value)}
                  className="bg-[#18191d] border border-[#2a2c31] rounded-lg px-2.5 py-1.5 text-xs text-[#e0e0e0] font-mono focus:border-[#ff3e00] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setScanHistoryTargetDate(getLocalIsoDate(0))}
                  className={`px-2 py-1 text-[11px] rounded font-mono border cursor-pointer ${
                    scanHistoryTargetDate === getLocalIsoDate(0)
                      ? "bg-[#ff3e00] text-black border-[#ff3e00] font-bold"
                      : "bg-[#18191d] text-[#9ca3af] border-[#2a2c31] hover:text-white"
                  }`}
                >
                  {isFa ? "امروز" : "Today"}
                </button>
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#707070] absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={scanHistorySearch}
                  onChange={(e) => setScanHistorySearch(e.target.value)}
                  placeholder={t.searchScanHistory}
                  className="w-full bg-[#18191d] border border-[#2a2c31] rounded-lg pl-8 pr-7 rtl:pl-7 rtl:pr-8 py-1.5 text-xs text-[#e0e0e0] placeholder-[#707070] focus:border-[#ff3e00] focus:outline-none"
                />
                {scanHistorySearch && (
                  <button
                    type="button"
                    onClick={() => setScanHistorySearch("")}
                    className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 text-[#707070] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* SCANNED ITEMS LIST */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[58vh] space-y-3">
              {filteredScanHistoryItems.length > 0 ? (
                filteredScanHistoryItems.map((item) => {
                  const id = item.id || item.productName;
                  const isJustLogged = loggedScanHistoryId === id;
                  const servings = scanHistoryServings[id] || 1;

                  return (
                    <div
                      key={id}
                      className="bg-[#18191d] border border-[#2a2c31] hover:border-[#ff3e00]/50 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#707070] mb-1">
                          <Clock className="w-3 h-3 text-[#ff3e00] shrink-0" />
                          <span>{item.scannedAt || (isFa ? "ثبت‌شده" : "Scanned")}</span>
                          {item.cuisine && (
                            <span className="px-1.5 py-0.2 rounded bg-[#2a2c31] text-[#a1a1aa] text-[9px]">
                              {item.cuisine}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-[#f4f4f5] leading-snug truncate">
                          {item.productName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono mt-1 text-[#9ca3af]">
                          <span className="text-[#ff3e00] font-bold">
                            {Math.round(item.calories * servings)} kcal
                          </span>
                          <span>•</span>
                          <span className="text-[#38bdf8]">
                            P: {(item.protein * servings).toFixed(1)}g
                          </span>
                          <span>•</span>
                          <span className="text-amber-400">
                            C: {(item.totalCarbohydrate * servings).toFixed(1)}g
                          </span>
                          <span>•</span>
                          <span className="text-rose-400">
                            F: {(item.totalFat * servings).toFixed(1)}g
                          </span>
                          {item.estimatedPrice && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-bold">
                                {formatSmartPrice(
                                  item.estimatedPrice.amountToman ? item.estimatedPrice.amountToman * servings : undefined,
                                  item.estimatedPrice.amountUSD ? Number((item.estimatedPrice.amountUSD * servings).toFixed(2)) : undefined,
                                  userProfile,
                                  1
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* SERVING & ACTION BUTTONS */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <div className="flex items-center bg-[#111214] border border-[#2a2c31] rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              setScanHistoryServings((prev) => ({
                                ...prev,
                                [id]: Math.max(0.5, (prev[id] || 1) - 0.5),
                              }))
                            }
                            className="px-2 py-1 text-xs text-[#9ca3af] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 text-xs font-mono text-[#e0e0e0] font-bold min-w-6 text-center">
                            {servings}x
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setScanHistoryServings((prev) => ({
                                ...prev,
                                [id]: (prev[id] || 1) + 0.5,
                              }))
                            }
                            className="px-2 py-1 text-xs text-[#9ca3af] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddScanToDiary(item, servings)}
                          type="button"
                          className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                            isJustLogged
                              ? "!bg-emerald-500 !text-black border !border-emerald-400"
                              : "bg-[#ff3e00] hover:bg-[#ff5722] text-black border border-[#ff3e00]"
                          }`}
                        >
                          {isJustLogged ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{t.addedToDiary}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{t.addToDiary}</span>
                            </>
                          )}
                        </button>

                        {onSelectRecentScan && (
                          <button
                            onClick={() => {
                              onSelectRecentScan(item);
                              setShowScanHistoryModal(false);
                            }}
                            type="button"
                            title={t.viewDetails}
                            className="p-2 rounded-lg bg-[#23252a] hover:bg-[#2e3138] text-[#e0e0e0] border border-[#2a2c31] hover:border-[#ff3e00] transition-colors cursor-pointer"
                          >
                            <Utensils className="w-3.5 h-3.5 text-[#ff3e00]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4">
                  <History className="w-10 h-10 text-[#707070] mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-[#f4f4f5] mb-1">
                    {t.noRecentScans}
                  </p>
                  <p className="text-xs text-[#9ca3af] max-w-sm mx-auto">
                    {isFa
                      ? "غذاهایی که با دوربین اسکن می‌کنید در اینجا نمایش داده می‌شوند و می‌توانید آن‌ها را دوباره به دفترچه اضافه کنید."
                      : "Foods you scan with the camera will appear here so you can re-add them to your diary anytime."}
                  </p>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-3.5 sm:p-4 border-t border-[#2a2c31] bg-[#18191d] flex items-center justify-between">
              <span className="text-[11px] text-[#707070] font-mono">
                {isFa
                  ? `افزودن به تاریخ: ${scanHistoryTargetDate}`
                  : `Target Date: ${scanHistoryTargetDate}`}
              </span>
              <button
                type="button"
                onClick={() => setShowScanHistoryModal(false)}
                className="px-4 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#e0e0e0] text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INLINE FORM: RECORD PAST OR CUSTOM ENTRY INTO SQLITE */}
      {showAddPastModal && (
        <form
          onSubmit={handleManualSubmit}
          className="bg-[#111214] border border-[#ff3e00]/60 rounded-lg p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {isFa
                  ? "هر وعده غذایی از روزهای گذشته یا امروز را مستقیم در فایل پایگاه داده ذخیره کنید تا در هیستوگرام محاسبه شود."
                  : "Log meals for any past date or today directly into the database to update the calorie histogram."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPastModal(false)}
              className="p-1.5 text-[#9ca3af] hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* QUICK FILL PRESETS FOR FAST PAST LOGGING */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#9ca3af]">
              {isFa ? "پر کردن سریع:" : "Quick-fill preset:"}
            </span>
            {recentScans && recentScans.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowScanHistoryModal(true);
                  setShowAddPastModal(false);
                }}
                className="px-2.5 py-1 bg-[#18191d] hover:bg-[#23252a] text-[#ff3e00] border border-[#ff3e00]/50 rounded text-xs font-medium cursor-pointer inline-flex items-center gap-1 shadow-sm"
              >
                <History className="w-3.5 h-3.5" />
                <span>{isFa ? `انتخاب از سوابق اسکن (${recentScans.length})` : `Pick from Scan History (${recentScans.length})`}</span>
              </button>
            )}
            {[
              {
                nameEn: "Ghormeh Sabzi & Rice",
                nameFa: "قورمه سبزی با برنج",
                cal: 420,
                p: 28,
                c: 38,
                f: 16,
                toman: 950000,
              },
              {
                nameEn: "Chelo Kabab Koobideh",
                nameFa: "چلوکباب کوبیده",
                cal: 680,
                p: 38,
                c: 62,
                f: 28,
                toman: 1150000,
              },
              {
                nameEn: "Zereshk Polo ba Morgh",
                nameFa: "زرشک پلو با مرغ زعفرانی",
                cal: 590,
                p: 36,
                c: 64,
                f: 18,
                toman: 850000,
              },
              {
                nameEn: "Persian Omelette & Sangak",
                nameFa: "املت گوجه با نان سنگک",
                cal: 440,
                p: 22,
                c: 36,
                f: 22,
                toman: 360000,
              },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setManualProductName(isFa ? preset.nameFa : preset.nameEn);
                  setManualCalories(String(preset.cal));
                  setManualProtein(String(preset.p));
                  setManualCarbs(String(preset.c));
                  setManualFat(String(preset.f));
                  setManualPriceToman(String(preset.toman));
                }}
                className="px-2.5 py-1 bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] hover:border-[#ff3e00] text-[#d4d4d8] rounded transition-colors cursor-pointer whitespace-nowrap"
              >
                {isFa ? preset.nameFa : preset.nameEn} ({preset.cal} kcal)
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "نام غذا یا خوراکی *" : "Food / Dish Name *"}
              </label>
              <input
                type="text"
                required
                value={manualProductName}
                onChange={(e) => setManualProductName(e.target.value)}
                placeholder={
                  isFa
                    ? "مثلاً: چلوکباب سلطانی یا سالاد سزار"
                    : "e.g. Grilled Salmon Bowl"
                }
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "تاریخ وعده (میلادی)" : "Entry Date"}
              </label>
              <input
                type="date"
                required
                value={manualDate}
                max={getLocalIsoDate(0)}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] font-mono tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "ساعت مصرف" : "Time Logged"}
              </label>
              <input
                type="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] font-mono tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "کالری کل (kcal) *" : "Total Calories (kcal) *"}
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                required
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#ff3e00] font-mono font-bold tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "پروتئین (گرم)" : "Protein (g)"}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] font-mono tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "کربوهیدرات (گرم)" : "Carbs (g)"}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] font-mono tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "چربی (گرم)" : "Fat (g)"}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={manualFat}
                onChange={(e) => setManualFat(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] font-mono tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "اندازه سهم" : "Serving Size"}
              </label>
              <input
                type="text"
                value={manualServingSize}
                onChange={(e) => setManualServingSize(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "رستوران / منبع" : "Brand / Source"}
              </label>
              <input
                type="text"
                value={manualBrand}
                onChange={(e) => setManualBrand(e.target.value)}
                placeholder={
                  isFa ? "خانگی یا نام رستوران" : "Home Kitchen / Restaurant"
                }
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {isFa ? "هزینه تخمینی (تومان)" : "Est. Cost (Toman)"}
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={manualPriceToman}
                onChange={(e) => setManualPriceToman(e.target.value)}
                className="w-full bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-lg px-3 py-2 text-[#f4f4f5] font-mono tabular-nums outline-none"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#ff3e00] hover:bg-[#e03600] text-black font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {isFa ? "ذخیره در پایگاه داده" : "Save Entry"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* CALORIE & WATER INTAKE HISTOGRAM PANEL */}
      <section
        aria-label={
          histogramMode === "water"
            ? isFa
              ? "نمودار هیستوگرام مصرف آب"
              : "Water Intake Histogram"
            : isFa
              ? "نمودار هیستوگرام دریافت کالری"
              : "Calorie Intake Histogram"
        }
        className="bg-[#111214] border border-[#27272a] rounded-lg p-5 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
              {histogramMode === "water" ? (
                <Droplets className="w-4 h-4 text-cyan-400" />
              ) : (
                <BarChart3 className="w-4 h-4 text-[#ff3e00]" />
              )}
              <span className="font-semibold text-[#f4f4f5]">
                {histogramMode === "water"
                  ? isFa
                    ? "هیستوگرام تحلیل مصرف آب"
                    : "Daily Water Intake Histogram"
                  : isFa
                    ? "هیستوگرام تحلیل دریافت کالری"
                    : "Calorie Intake Histogram"}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {histogramMode === "water"
                  ? isFa
                    ? `روند ${histogramRangeDays.toLocaleString("fa-IR")} روز اخیر در برابر هدف روزانه ۸ لیوان`
                    : `${histogramRangeDays}-day hydration trend vs daily 8-glass target`
                  : histogramMode === "daily"
                    ? isFa
                      ? `روند ${histogramRangeDays.toLocaleString("fa-IR")} روز اخیر در برابر هدف روزانه`
                      : `${histogramRangeDays}-day daily calorie intake vs target cap`
                    : isFa
                      ? "توزیع فراوانی وعده‌ها بر اساس بازه‌های کالری"
                      : "Meal frequency distribution across calorie brackets"}
              </span>
            </div>
            <p className="text-xs text-[#9ca3af] mt-1">
              {histogramMode === "water"
                ? isFa
                  ? "روی ستون هر روز کلیک کنید تا مصرف آب آن تاریخ را مشاهده و با دکمه‌های + و - به سادگی تنظیم کنید."
                  : "Click any day bar to inspect water intake or quickly log/adjust glasses with + and -."
                : histogramMode === "daily"
                  ? isFa
                    ? "روی ستون هر روز کلیک کنید تا وعده‌های ثبت‌شده آن تاریخ را در لیست پایین مشاهده یا ویرایش کنید."
                    : "Click any day bar to inspect or manage the recorded food entries for that specific date."
                  : isFa
                    ? "تحلیل آماری تمام وعده‌های ذخیره‌شده بر اساس حجم کالری هر وعده."
                    : "Statistical breakdown of all recorded meals grouped by per-meal calorie brackets."}
            </p>
          </div>

          {/* SEGMENTED CONTROLS FOR HISTOGRAM MODE & RANGE */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1 p-1 bg-[#08090a] border border-[#27272a] rounded-lg">
              <button
                type="button"
                onClick={() => setHistogramMode("daily")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  histogramMode === "daily"
                    ? "bg-[#ff3e00] text-black font-bold"
                    : "text-[#9ca3af] hover:text-[#f4f4f5]"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{isFa ? "کالری روزانه" : "Daily Calories"}</span>
              </button>
              <button
                type="button"
                onClick={() => setHistogramMode("water")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  histogramMode === "water"
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "text-cyan-400 hover:text-cyan-300"
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{isFa ? " آب" : "Water "}</span>
              </button>
              <button
                type="button"
                onClick={() => setHistogramMode("distribution")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  histogramMode === "distribution"
                    ? "bg-[#ff3e00] text-black font-bold"
                    : "text-[#9ca3af] hover:text-[#f4f4f5]"
                }`}
              >
                {isFa ? "توزیع بازه‌های کالری" : "Calorie Brackets"}
              </button>
            </div>

            {(histogramMode === "daily" || histogramMode === "water") && (
              <div className="flex items-center gap-1 p-1 bg-[#08090a] border border-[#27272a] rounded-lg">
                <button
                  type="button"
                  onClick={() => setHistogramRangeDays(7)}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    histogramRangeDays === 7
                      ? "bg-[#27272a] text-[#f4f4f5] font-bold"
                      : "text-[#9ca3af] hover:text-[#f4f4f5]"
                  }`}
                >
                  {isFa ? "۷ روز" : "7D"}
                </button>
                <button
                  type="button"
                  onClick={() => setHistogramRangeDays(14)}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    histogramRangeDays === 14
                      ? "bg-[#27272a] text-[#f4f4f5] font-bold"
                      : "text-[#9ca3af] hover:text-[#f4f4f5]"
                  }`}
                >
                  {isFa ? "۱۴ روز" : "14D"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* HISTOGRAM SUMMARY METRICS ROW */}
        {histogramMode === "water" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#27272a] text-xs">
            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "میانگین مصرف روزانه" : "Period Daily Average"}
              </span>
              <span className="font-mono text-lg font-bold text-cyan-400 tabular-nums mt-0.5 block">
                {isFa
                  ? waterHistogramSummary.avgDailyGlasses.toLocaleString(
                      "fa-IR",
                    )
                  : waterHistogramSummary.avgDailyGlasses}{" "}
                <span className="text-xs font-normal text-[#9ca3af]">
                  {isFa ? "لیوان/روز" : "gl/day"}
                </span>
                <span className="text-[11px] font-normal text-[#71717a] ml-1">
                  (
                  {isFa
                    ? waterHistogramSummary.avgDailyMl.toLocaleString("fa-IR")
                    : waterHistogramSummary.avgDailyMl}{" "}
                  ml)
                </span>
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "بیشترین مصرف در یک روز" : "Peak Day Hydration"}
              </span>
              <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums mt-0.5 block">
                {isFa
                  ? waterHistogramSummary.peakDay.glasses.toLocaleString(
                      "fa-IR",
                    )
                  : waterHistogramSummary.peakDay.glasses}{" "}
                <span className="text-xs font-normal text-[#9ca3af]">
                  {isFa ? "لیوان" : "glasses"}
                </span>
                <span className="text-xs font-normal text-[#71717a] ml-1">
                  ({waterHistogramSummary.peakDay.shortLabel})
                </span>
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "هدف روزانه آب" : "Daily Water Target"}
              </span>
              <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums mt-0.5 block">
                {isFa
                  ? waterHistogramSummary.targetGlasses.toLocaleString("fa-IR")
                  : waterHistogramSummary.targetGlasses}{" "}
                <span className="text-xs font-normal text-[#9ca3af]">
                  {isFa ? "لیوان (۲۰۰۰ ml)" : "glasses (2,000 ml)"}
                </span>
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "پایبندی به هدف آب" : "Hydration Adherence"}
              </span>
              <span className="font-mono text-lg font-bold text-[#f4f4f5] tabular-nums mt-0.5 block">
                {isFa
                  ? `${waterHistogramSummary.daysOnTarget.toLocaleString("fa-IR")} از ${histogramRangeDays.toLocaleString("fa-IR")} روز`
                  : `${waterHistogramSummary.daysOnTarget} / ${histogramRangeDays} days`}
                <span className="text-xs font-normal text-cyan-400 ml-1.5">
                  (
                  {isFa
                    ? waterHistogramSummary.adherencePercent.toLocaleString(
                        "fa-IR",
                      )
                    : waterHistogramSummary.adherencePercent}
                  %)
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#27272a] text-xs">
            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "میانگین روزانه دوره" : "Period Daily Average"}
              </span>
              <span className="font-mono text-lg font-bold text-[#f4f4f5] tabular-nums mt-0.5 block">
                {isFa
                  ? histogramSummary.avgDailyCals.toLocaleString("fa-IR")
                  : histogramSummary.avgDailyCals.toLocaleString("en-US")}{" "}
                <span className="text-xs font-normal text-[#9ca3af]">
                  {isFa ? "کالری/روز" : "kcal/day"}
                </span>
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "بیشترین دریافت روزانه" : "Peak Day Intake"}
              </span>
              <span className="font-mono text-lg font-bold text-[#ff3e00] tabular-nums mt-0.5 block">
                {isFa
                  ? histogramSummary.peakDay.calories.toLocaleString("fa-IR")
                  : histogramSummary.peakDay.calories.toLocaleString(
                      "en-US",
                    )}{" "}
                <span className="text-xs font-normal text-[#9ca3af]">
                  ({histogramSummary.peakDay.shortLabel})
                </span>
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "سقف هدف روزانه" : "Daily Target Cap"}
              </span>
              <span className="font-mono text-lg font-bold text-[#22c55e] tabular-nums mt-0.5 block">
                {isFa
                  ? calorieGoal.toLocaleString("fa-IR")
                  : calorieGoal.toLocaleString("en-US")}{" "}
                <span className="text-xs font-normal text-[#9ca3af]">
                  {isFa ? "کالری" : "kcal"}
                </span>
              </span>
            </div>

            <div>
              <span className="text-[#9ca3af] block">
                {isFa ? "پایبندی به هدف" : "Goal Adherence"}
              </span>
              <span className="font-mono text-lg font-bold text-[#f4f4f5] tabular-nums mt-0.5 block">
                {isFa
                  ? `${histogramSummary.daysOnTarget.toLocaleString("fa-IR")} از ${Math.max(
                      histogramSummary.activeDaysCount,
                      1,
                    ).toLocaleString("fa-IR")} روز`
                  : `${histogramSummary.daysOnTarget} / ${Math.max(
                      histogramSummary.activeDaysCount,
                      1,
                    )} days`}
              </span>
            </div>
          </div>
        )}

        {/* MODE 1: DAILY CALORIE INTAKE BAR HISTOGRAM */}
        {histogramMode === "daily" ? (
          <div className="pt-6">
            <div className="relative h-60 sm:h-64 w-full bg-[#08090a] border border-[#27272a] rounded-lg px-3 sm:px-5 pt-8 pb-3 flex flex-col justify-end">
              {/* HORIZONTAL TARGET GOAL LINE */}
              <div
                className="absolute inset-x-3 sm:inset-x-5 border-t border-dashed border-[#22c55e]/70 z-10 pointer-events-none flex items-center justify-between"
                style={{ bottom: `${goalLineBottomPercent}%` }}
              >
                <span className="bg-[#08090a]/90 px-1.5 py-0.5 text-[10px] font-mono text-[#22c55e] tabular-nums -mt-5">
                  {isFa
                    ? `خط هدف: ${calorieGoal.toLocaleString("fa-IR")} کالری`
                    : `Target: ${calorieGoal} kcal`}
                </span>
              </div>

              {/* BARS CONTAINER */}
              <div className="relative z-20 flex items-end justify-between gap-1.5 sm:gap-3 h-full pt-4">
                {dailyHistogramBuckets.map((bucket) => {
                  const rawHeightPct =
                    bucket.calories > 0
                      ? Math.round(
                          (bucket.calories /
                            histogramSummary.maxScaleCalories) *
                            100,
                        )
                      : 4;
                  const barHeightPct = Math.min(Math.max(rawHeightPct, 6), 96);
                  const isSelected = selectedDate === bucket.date;

                  let barColorClass = "bg-[#ff3e00] hover:bg-[#ff5722]";
                  let statusText = isFa ? "نرمال" : "On Track";
                  if (bucket.status === "empty") {
                    barColorClass = "bg-[#27272a] hover:bg-[#3f3f46]";
                    statusText = isFa ? "خالی" : "0 kcal";
                  } else if (bucket.status === "over") {
                    barColorClass = "bg-amber-500 hover:bg-amber-400";
                    statusText = isFa ? "بیش از هدف" : "Over Cap";
                  } else if (bucket.status === "under") {
                    barColorClass = "bg-[#ff3e00]/75 hover:bg-[#ff3e00]";
                    statusText = isFa ? "سبک" : "Light";
                  }

                  return (
                    <button
                      key={bucket.date}
                      type="button"
                      onClick={() => onSelectDate(bucket.date)}
                      aria-label={`${bucket.shortLabel}: ${bucket.calories} kcal (${bucket.mealCount} meals)`}
                      className={`group flex-1 h-full flex flex-col items-center justify-end cursor-pointer rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
                        isSelected
                          ? "bg-[#ff3e00]/10 ring-1 ring-[#ff3e00]"
                          : "hover:bg-[#18191d]/70"
                      }`}
                    >
                      {/* CALORIE VALUE TOP LABEL */}
                      <span
                        className={`text-[10px] sm:text-xs font-mono tabular-nums mb-1 transition-colors ${
                          isSelected
                            ? "text-[#ff3e00] font-bold"
                            : bucket.calories > 0
                              ? "text-[#d4d4d8]"
                              : "text-[#71717a]"
                        }`}
                      >
                        {bucket.calories > 0
                          ? isFa
                            ? bucket.calories.toLocaleString("fa-IR")
                            : bucket.calories
                          : "0"}
                      </span>

                      {/* BAR TRACK */}
                      <div className="w-full max-w-[44px] flex-1 flex items-end justify-center">
                        <div
                          className={`w-full rounded-t transition-transform duration-150 group-hover:scale-y-[1.02] origin-bottom ${barColorClass}`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      {/* DATE & MEAL COUNT FOOTER */}
                      <div className="mt-2 text-center leading-tight w-full truncate">
                        <span
                          className={`block text-[10px] sm:text-xs font-semibold truncate ${
                            isSelected ? "text-[#ff3e00]" : "text-[#f4f4f5]"
                          }`}
                        >
                          {bucket.shortLabel}
                        </span>
                        <span className="hidden sm:block text-[10px] text-[#9ca3af] font-mono tabular-nums mt-0.5">
                          {bucket.mealCount > 0
                            ? isFa
                              ? `${bucket.mealCount.toLocaleString("fa-IR")} وعده · ${statusText}`
                              : `${bucket.mealCount}m · ${statusText}`
                            : statusText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HISTOGRAM LEGEND & ACTION STRIP */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-[#9ca3af]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#ff3e00]" />
                  <span>
                    {isFa
                      ? "در محدوده هدف کالری"
                      : "Within Daily Calorie Target"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span>
                    {isFa
                      ? "فراتر از سقف روزانه (>۱۰۵٪)"
                      : "Above Target Cap (>105%)"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 border-t border-dashed border-[#22c55e]" />
                  <span>
                    {isFa ? "مرز هدف روزانه" : "Daily Goal Threshold"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : histogramMode === "water" ? (
          /* MODE 2: DAILY WATER INTAKE BAR HISTOGRAM */
          <div className="pt-6">
            <div className="relative h-60 sm:h-64 w-full bg-[#08090a] border border-[#27272a] rounded-lg px-3 sm:px-5 pt-8 pb-3 flex flex-col justify-end">
              {/* HORIZONTAL TARGET WATER GOAL LINE */}
              <div
                className="absolute inset-x-3 sm:inset-x-5 border-t border-dashed border-cyan-400/80 z-10 pointer-events-none flex items-center justify-between"
                style={{ bottom: `${waterGoalLineBottomPercent}%` }}
              >
                <span className="bg-[#08090a]/95 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-500/30 rounded-xs tabular-nums -mt-5">
                  {isFa
                    ? `هدف: ${waterHistogramSummary.targetGlasses.toLocaleString("fa-IR")} لیوان (${(waterHistogramSummary.targetGlasses * 250).toLocaleString("fa-IR")} ml)`
                    : `Target: ${waterHistogramSummary.targetGlasses} gl (${waterHistogramSummary.targetGlasses * 250} ml)`}
                </span>
              </div>

              {/* WATER BARS CONTAINER */}
              <div className="relative z-20 flex items-end justify-between gap-1.5 sm:gap-3 h-full pt-4">
                {dailyWaterBuckets.map((bucket) => {
                  const rawHeightPct =
                    bucket.glasses > 0
                      ? Math.round(
                          (bucket.glasses /
                            waterHistogramSummary.maxScaleGlasses) *
                            100,
                        )
                      : 4;
                  const barHeightPct = Math.min(Math.max(rawHeightPct, 6), 96);
                  const isSelected = effectiveSelectedDate === bucket.date;

                  let barColorClass = "bg-cyan-500 hover:bg-cyan-400";
                  let statusText = isFa ? "در حال مصرف" : "In Progress";
                  if (bucket.status === "empty") {
                    barColorClass = "bg-[#27272a] hover:bg-[#3f3f46]";
                    statusText = isFa ? "بدون ثبت" : "0 gl";
                  } else if (
                    bucket.status === "optimal" ||
                    bucket.glasses >= bucket.targetGlasses
                  ) {
                    barColorClass =
                      "bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.4)]";
                    statusText = isFa ? "هدف محقق شد" : "Goal Met";
                  } else if (bucket.status === "under") {
                    barColorClass = "bg-cyan-600 hover:bg-cyan-500";
                    statusText = isFa ? "کمتر از هدف" : "Under";
                  }

                  return (
                    <button
                      key={bucket.date}
                      type="button"
                      onClick={() => onSelectDate(bucket.date)}
                      aria-label={`${bucket.shortLabel}: ${bucket.glasses} glasses (${bucket.ml} ml)`}
                      className={`group flex-1 h-full flex flex-col items-center justify-end cursor-pointer rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                        isSelected
                          ? "ring-1 ring-cyan-400"
                          : ""
                      }`}
                    >
                      {/* WATER GLASSES TOP LABEL */}
                      <span
                        className={`text-[10px] sm:text-xs font-mono tabular-nums mb-1 transition-colors ${
                          isSelected
                            ? "text-cyan-300 font-bold"
                            : bucket.glasses > 0
                              ? "text-[#d4d4d8]"
                              : "text-[#71717a]"
                        }`}
                      >
                        {bucket.glasses > 0
                          ? isFa
                            ? `${bucket.glasses.toLocaleString("fa-IR")} ل`
                            : `${bucket.glasses} gl`
                          : "0"}
                      </span>

                      {/* BAR TRACK */}
                      <div className="w-full max-w-[44px] flex-1 flex items-end justify-center">
                        <div
                          className={`w-full rounded-t transition-transform duration-150 group-hover:scale-y-[1.02] origin-bottom ${barColorClass}`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      {/* DATE & HYDRATION FOOTER */}
                      <div className="mt-2 text-center leading-tight w-full truncate">
                        <span
                          className={`block text-[10px] sm:text-xs font-semibold truncate ${
                            isSelected ? "text-cyan-400" : "text-[#f4f4f5]"
                          }`}
                        >
                          {bucket.shortLabel}
                        </span>
                        <span className="hidden sm:block text-[10px] text-[#9ca3af] font-mono tabular-nums mt-0.5">
                          {bucket.glasses > 0
                            ? isFa
                              ? `${bucket.ml.toLocaleString("fa-IR")} ml · ${statusText}`
                              : `${bucket.ml} ml · ${statusText}`
                            : statusText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK WATER LOG / ADJUST FOR SELECTED DATE */}
            <div className="mt-4 p-3.5 bg-[#08090a] border border-cyan-500/25 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <GlassWater className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#f4f4f5] flex items-center gap-2">
                    <span>
                      {isFa
                        ? `میزان مصرف آب در تاریخ ${formatShortDateLabel(effectiveSelectedDate, true)}`
                        : `Water Logged for ${formatShortDateLabel(effectiveSelectedDate, false)}`}
                    </span>
                    {effectiveSelectedDate === getLocalIsoDate(0) && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded  text-cyan-300 border border-cyan-500/30 font-mono">
                        {isFa ? "امروز" : "Today"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#9ca3af] font-mono tabular-nums mt-0.5 flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold text-sm">
                      {isFa
                        ? currentSelectedWater.glasses.toLocaleString("fa-IR")
                        : currentSelectedWater.glasses}
                    </span>
                    <span className="text-[#71717a]">
                      /{" "}
                      {isFa
                        ? (
                            currentSelectedWater.targetGlasses || 8
                          ).toLocaleString("fa-IR")
                        : currentSelectedWater.targetGlasses || 8}{" "}
                      {isFa ? "لیوان" : "gl"}
                    </span>
                    <span className="text-[#52525b]">·</span>
                    <span className="text-[#d4d4d8]">
                      {isFa
                        ? currentSelectedWater.ml.toLocaleString("fa-IR")
                        : currentSelectedWater.ml}{" "}
                      ml
                    </span>
                    <span className="text-[#52525b]">·</span>
                    <span
                      className={`text-[11px] font-medium ${
                        currentSelectedWater.glasses >=
                        (currentSelectedWater.targetGlasses || 8)
                          ? "text-emerald-400 font-semibold"
                          : "text-cyan-300"
                      }`}
                    >
                      {Math.round(
                        (currentSelectedWater.glasses /
                          (currentSelectedWater.targetGlasses || 8)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* + AND - BUTTONS FOR SELECTED DATE */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    updateWaterForDate(
                      effectiveSelectedDate,
                      Math.max(0, currentSelectedWater.glasses - 1),
                      currentSelectedWater.targetGlasses || 8,
                    )
                  }
                  disabled={currentSelectedWater.glasses === 0}
                  aria-label={isFa ? "کاهش ۱ لیوان آب" : "Remove 1 glass"}
                  className="px-3 py-1.5 bg-[#18191d] hover:bg-[#27272a] disabled:opacity-30 disabled:cursor-not-allowed text-[#d4d4d8] hover:text-white border border-[#27272a] rounded-md font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <span>{isFa ? "۱-" : "-1"}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateWaterForDate(
                      effectiveSelectedDate,
                      currentSelectedWater.glasses + 1,
                      currentSelectedWater.targetGlasses || 8,
                    )
                  }
                  aria-label={isFa ? "افزودن ۱ لیوان آب" : "Add 1 glass"}
                  className="px-3 py-1.5  text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 hover:border-cyan-400 rounded-md font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isFa ? "۱" : "1"}</span>
                </button>
              </div>
            </div>

            {/* WATER HISTOGRAM LEGEND & ACTION STRIP */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-[#9ca3af]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                  <span>
                    {isFa ? "تحقق هدف (۱۰۰٪+)" : "Target Met (100%+)"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500" />
                  <span>
                    {isFa ? "در حال مصرف (<۱۰۰٪)" : "In Progress (<100%)"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 border-t border-dashed border-cyan-400" />
                  <span>
                    {isFa ? "خط هدف ۸ لیوان (۲۰۰۰ ml)" : "Daily 8-Glass Target"}
                  </span>
                </span>
              </div>


            </div>
          </div>
        ) : (
          /* MODE 3: MEAL CALORIE BRACKET FREQUENCY HISTOGRAM */
          <div className="pt-5 space-y-3">
            {mealDistributionBins.map((bin) => (
              <div
                key={bin.id}
                className="bg-[#08090a] border border-[#27272a] rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="sm:w-48 shrink-0">
                  <div className="font-mono text-xs font-bold text-[#f4f4f5] tabular-nums">
                    {isFa ? bin.rangeFa : bin.rangeEn}
                  </div>
                  <div className="text-[11px] text-[#9ca3af]">
                    {isFa ? bin.categoryFa : bin.categoryEn}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="w-full bg-[#18191d] h-6 rounded overflow-hidden flex items-center p-0.5">
                    <div
                      className="h-full bg-[#ff3e00] rounded-xs transition-all"
                      style={{
                        width: `${Math.max(bin.heightPercent, bin.count > 0 ? 6 : 0)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="sm:w-40 shrink-0 flex sm:justify-end items-center gap-2 text-xs font-mono tabular-nums">
                  <span className="text-[#ff3e00] font-bold">
                    {isFa
                      ? `${bin.count.toLocaleString("fa-IR")} وعده`
                      : `${bin.count} meals`}
                  </span>
                  <span className="text-[#9ca3af]">·</span>
                  <span className="text-[#d4d4d8]">
                    {isFa
                      ? `${bin.sharePercent.toLocaleString("fa-IR")}٪`
                      : `${bin.sharePercent}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DATE PICKER JUMP */}

      {/* INTAKE TELEMETRY DASHBOARD FOR SELECTED VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CALORIE PROGRESS CARD */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>
              {selectedDate === "all"
                ? isFa
                  ? "مجموع کالری تاریخچه"
                  : "Total Recorded Calories"
                : isFa
                  ? `کالری (${formatShortDateLabel(selectedDate, true)})`
                  : `Calorie Intake (${formatShortDateLabel(selectedDate, false)})`}
            </span>
            <span className="text-[#ff3e00] font-bold font-mono tabular-nums">
              {isFa
                ? `${calPercent.toLocaleString("fa-IR")}٪`
                : `${calPercent}%`}
            </span>
          </div>
          <div className="font-syne text-3xl font-extrabold text-[#ffffff] tabular-nums">
            {isFa
              ? dailyTotals.calories.toLocaleString("fa-IR")
              : dailyTotals.calories}
            <span className="text-xs font-normal text-[#9ca3af] ml-1 rtl:mr-1 rtl:ml-0">
              {isFa ? "کالری" : "kcal"}
            </span>
          </div>
          <div className="text-xs text-[#9ca3af] mt-1 mb-3 tabular-nums">
            {isFa
              ? `هدف روزانه: ${calorieGoal.toLocaleString("fa-IR")}`
              : `Daily Target: ${calorieGoal} kcal`}
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${calPercent > 100 ? "bg-amber-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(calPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* MACRONUTRIENT BARS */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5 flex flex-col justify-between">
          <div className="text-xs text-[#9ca3af] mb-2 font-medium">
            {isFa ? "تعادل درشت‌مغذی‌ها" : "Macro Balance"}
          </div>
          <div className="space-y-2.5 text-xs tabular-nums">
            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `پروتئین: ${Math.round(dailyTotals.protein).toLocaleString("fa-IR")} از ${proteinGoal.toLocaleString("fa-IR")} گرم`
                    : `Protein: ${Math.round(dailyTotals.protein)}g / ${proteinGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">
                  {proteinPercent}%
                </span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff3e00]"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `کربوهیدرات: ${Math.round(dailyTotals.carbs).toLocaleString("fa-IR")} از ${carbsGoal.toLocaleString("fa-IR")} گرم`
                    : `Carbs: ${Math.round(dailyTotals.carbs)}g / ${carbsGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">
                  {carbsPercent}%
                </span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff3e00]"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `چربی: ${Math.round(dailyTotals.fat).toLocaleString("fa-IR")} از ${fatGoal.toLocaleString("fa-IR")} گرم`
                    : `Fat: ${Math.round(dailyTotals.fat)}g / ${fatGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">
                  {fatPercent}%
                </span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff3e00]"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MEAL SPEND */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>{isFa ? "هزینه کل وعده‌ها" : "Meal Spend"}</span>
            <span className="text-[#ff3e00] font-bold tabular-nums">
              {budgetPercent}%
            </span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#f4f4f5] tabular-nums">
            {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal)}
          </div>
          <div className="text-xs text-[#9ca3af] mt-1 mb-3 tabular-nums">
            {isFa
              ? `بودجه روزانه: ${
                  userProfile.currency === "IRT"
                    ? `${(userProfile.dailyBudgetToman || 1800000).toLocaleString("fa-IR")} تومان`
                    : `$${userProfile.dailyBudgetUSD}`
                }`
              : `Budget: ${
                  userProfile.currency === "IRT"
                    ? `${(userProfile.dailyBudgetToman || 1800000).toLocaleString("en-US")} T`
                    : `$${userProfile.dailyBudgetUSD}`
                }`}
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                budgetPercent > 100
                  ? "bg-red-500"
                  : budgetPercent > 80
                    ? "bg-amber-500"
                    : "bg-[#ff3e00]"
              } transition-all`}
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* SODIUM WATCH */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>{isFa ? "سقف مصرف سدیم" : "Sodium Intake"}</span>
            <span
              className={`tabular-nums ${
                sodiumPercent > 90
                  ? "text-amber-400 font-bold"
                  : "text-[#9ca3af]"
              }`}
            >
              {sodiumPercent}%
            </span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#f4f4f5] tabular-nums">
            {isFa
              ? dailyTotals.sodium.toLocaleString("fa-IR")
              : dailyTotals.sodium}{" "}
            <span className="text-xs font-normal text-[#9ca3af]">
              {isFa ? "میلی‌گرم" : "mg"}
            </span>
          </div>
          <div className="text-xs text-[#9ca3af] mt-1 mb-3 tabular-nums">
            {isFa
              ? `حداکثر مجاز: ${sodiumGoal.toLocaleString("fa-IR")} میلی‌گرم`
              : `Max Target: ${sodiumGoal} mg`}
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${sodiumPercent > 100 ? "bg-red-500" : "bg-[#ff3e00]"} transition-all`}
              style={{ width: `${Math.min(sodiumPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* LOGGED MEALS LIST FROM SQLITE */}
      <section className="mt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#f4f4f5] uppercase tracking-wide">
              {selectedDate === "all"
                ? isFa
                  ? `تمامی وعده‌های ثبت‌شده در پایگاه داده (${filteredDiaryItems.length.toLocaleString("fa-IR")})`
                  : `All Database Recorded Meals (${filteredDiaryItems.length})`
                : isFa
                  ? `وعده‌های ثبت‌شده — ${formatShortDateLabel(selectedDate, true)} (${filteredDiaryItems.length.toLocaleString("fa-IR")})`
                  : `Recorded Meals — ${formatShortDateLabel(selectedDate, false)} (${filteredDiaryItems.length})`}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* SEARCH INPUT */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFa ? "جستجو در وعده‌ها..." : "Search recorded meals..."
                }
                className="bg-[#111214] border border-[#27272a] focus:border-[#ff3e00] rounded-lg pl-8 pr-3 rtl:pr-8 rtl:pl-3 py-1.5 text-xs text-[#f4f4f5] outline-none w-48 sm:w-56"
              />
            </div>

            <button
              onClick={onGoToScanner}
              type="button"
              aria-label={
                isFa ? "اسکن و افزودن وعده غذایی جدید" : "Scan and add new meal"
              }
              className="text-xs text-[#ff3e00] hover:underline cursor-pointer flex items-center gap-1 font-semibold focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isFa ? "اسکن وعده جدید" : "Scan New Meal"}</span>
            </button>
          </div>
        </div>

        {filteredDiaryItems.length === 0 ? (
          <div className="bg-[#111214] border border-dashed border-[#27272a] rounded-lg p-10 text-center">
            <BookOpen className="w-12 h-12 text-[#9ca3af] mx-auto mb-3 opacity-60" />
            <h4 className="font-syne text-lg font-bold text-[#f4f4f5] mb-1">
              {isFa
                ? "هیچ وعده‌ای برای این بخش یافت نشد"
                : "No Meals Recorded for This Date"}
            </h4>
            <p className="text-sm text-[#9ca3af] max-w-md mx-auto mb-5">
              {isFa
                ? "می‌توانید یک وعده غذایی جدید با دوربین اسکن کنید یا وعده‌های گذشته را به صورت دستی ثبت نمایید."
                : "Scan a meal with your camera or record a past meal entry manually."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {recentScans && recentScans.length > 0 && (
                <button
                  onClick={() => {
                    setScanHistoryTargetDate(selectedDate === "all" ? getLocalIsoDate(0) : selectedDate);
                    setShowScanHistoryModal(true);
                  }}
                  type="button"
                  className="px-5 py-2.5 bg-[#ff3e00] hover:bg-[#ff5722] text-black rounded-lg cursor-pointer text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                >
                  <History className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isFa
                      ? `افزودن از سوابق اسکن (${recentScans.length})`
                      : `Add from Scan History (${recentScans.length})`}
                  </span>
                </button>
              )}
              <button
                onClick={onGoToScanner}
                type="button"
                className="btn-cmd px-5 py-2.5 cursor-pointer text-xs font-bold"
              >
                {isFa ? "شروع اسکن غذا" : "Start Meal Scan"}
              </button>
              <button
                onClick={() => setShowAddPastModal(true)}
                type="button"
                className="btn-cmd-dim px-4 py-2.5 cursor-pointer text-xs font-semibold"
              >
                {isFa
                  ? "ثبت دستی وعده در این تاریخ"
                  : "Record Entry for This Date"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDiaryItems.map((item, idx) => {
              const itemDate = item.entryDate || getLocalIsoDate(0);
              return (
                <div
                  key={item.id}
                  className="bg-[#111214] border border-[#27272a] hover:border-[#ff3e00]/70 rounded-lg p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-[#ff3e00] tabular-nums shrink-0">
                      #{isFa ? (idx + 1).toLocaleString("fa-IR") : idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-syne sm:font-vazirmatn text-base font-bold text-[#f4f4f5] truncate">
                        {item.productName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af] mt-1 font-mono tabular-nums">
                        <span className="text-[#d4d4d8] font-sans font-medium">
                          {formatShortDateLabel(itemDate, isFa)} ({itemDate})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#71717a]" />
                          {item.loggedAt}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">
                          {item.servingSizeText}
                        </span>
                        {item.brand && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-sans">{item.brand}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#27272a] shrink-0">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums">
                      <span className="text-[#ff3e00] font-bold text-sm">
                        {isFa
                          ? `${item.caloriesTotal.toLocaleString("fa-IR")} کالری`
                          : `${item.caloriesTotal} kcal`}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[#3f3f46] hidden sm:inline"
                      >
                        ·
                      </span>
                      <span className="text-[#d4d4d8] hidden sm:inline">
                        {isFa
                          ? `پ: ${item.proteinTotal}g · ک: ${item.carbsTotal}g · چ: ${item.fatTotal}g`
                          : `P: ${item.proteinTotal}g · C: ${item.carbsTotal}g · F: ${item.fatTotal}g`}
                      </span>
                      {item.priceToman || item.priceUSD ? (
                        <>
                          <span aria-hidden="true" className="text-[#3f3f46]">
                            ·
                          </span>
                          <span className="text-[#f4f4f5] font-medium font-sans">
                            {formatPrice(item.priceToman, item.priceUSD)}
                          </span>
                        </>
                      ) : null}
                    </div>

                    <button
                      onClick={() => onDeleteLogItem(item.id)}
                      type="button"
                      aria-label={
                        isFa
                          ? `حذف ${item.productName}`
                          : `Delete ${item.productName}`
                      }
                      className="min-h-[40px] min-w-[40px] p-2 text-[#9ca3af] hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BOTTOM CLEARANCE SPACER FOR MOBILE NAV DOCK */}
      <div className="h-12 lg:hidden shrink-0" aria-hidden="true" />
    </div>
  );
};

export default DiaryConsoleView;
