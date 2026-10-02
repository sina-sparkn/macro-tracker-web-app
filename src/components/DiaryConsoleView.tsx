import React, { useState, useMemo } from "react";
import {
  Trash2,
  Plus,
  BookOpen,
  Database,
  BarChart3,
  Calendar,
  Search,
  Check,
  X,
  RefreshCw,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { FoodLogItem, DailyTotals, UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";

export interface SqliteDbStats {
  engine: string;
  fileName: string;
  totalEntries: number;
  activeDays: number;
}

interface DiaryConsoleViewProps {
  diaryItems: FoodLogItem[];
  allHistoryItems: FoodLogItem[];
  selectedDate: string; // YYYY-MM-DD or "all"
  onSelectDate: (date: string) => void;
  dailyTotals: DailyTotals;
  userProfile: UserProfile;
  dbStats: SqliteDbStats;
  isSyncingDb?: boolean;
  onDeleteLogItem: (id: string) => void;
  onClearLogs: (dateFilter?: string) => void;
  onAddManualEntry: (entry: Partial<FoodLogItem>) => Promise<void> | void;
  onSeedSampleHistory: () => Promise<void> | void;
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
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(dateObj.getTime())) return isoDate;

  return dateObj.toLocaleDateString(isFa ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric"
  });
}

function formatWeekdayShort(isoDate: string, isFa: boolean): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return "";
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString(isFa ? "fa-IR" : "en-US", {
    weekday: "short"
  });
}

export const DiaryConsoleView: React.FC<DiaryConsoleViewProps> = ({
  diaryItems,
  allHistoryItems,
  selectedDate,
  onSelectDate,
  dailyTotals,
  userProfile,
  dbStats,
  isSyncingDb = false,
  onDeleteLogItem,
  onClearLogs,
  onAddManualEntry,
  onSeedSampleHistory,
  onGoToScanner
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const currentRate =
    userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0
      ? userProfile.exchangeRateTomanPerUSD
      : 230000;

  // Histogram view controls
  const [histogramMode, setHistogramMode] = useState<"daily" | "distribution">("daily");
  const [histogramRangeDays, setHistogramRangeDays] = useState<7 | 14>(7);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Inline confirmation for clearing logs (avoids window.confirm)
  const [confirmingClear, setConfirmingClear] = useState(false);

  // Manual / Past Entry Drawer State
  const [showAddPastModal, setShowAddPastModal] = useState(false);
  const [manualProductName, setManualProductName] = useState("");
  const [manualBrand, setManualBrand] = useState("");
  const [manualDate, setManualDate] = useState(() =>
    selectedDate === "all" ? getLocalIsoDate(0) : selectedDate
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
    if (userProfile.currency === "IRT") {
      if (toman !== undefined && toman > 0) {
        return `${toman.toLocaleString(isFa ? "fa-IR" : "en-US")} ${isFa ? "تومان" : "Toman"}`;
      }
      if (usd !== undefined && usd > 0) {
        return `${Math.round(usd * currentRate).toLocaleString(isFa ? "fa-IR" : "en-US")} ${
          isFa ? "تومان" : "Toman"
        }`;
      }
      return "-";
    }
    if (usd !== undefined && usd > 0) {
      return `$${usd.toFixed(2)}`;
    }
    if (toman !== undefined && toman > 0) {
      return `$${(toman / currentRate).toFixed(2)}`;
    }
    return "-";
  };

  const calorieGoal = userProfile.calorieGoal || 2000;
  const proteinGoal = userProfile.proteinGoal || 80;
  const carbsGoal = userProfile.carbsGoal || 250;
  const fatGoal = userProfile.fatGoal || 65;
  const sodiumGoal = userProfile.sodiumGoal || 2300;

  const calPercent = Math.min(Math.round((dailyTotals.calories / calorieGoal) * 100), 100);
  const proteinPercent = Math.min(Math.round((dailyTotals.protein / proteinGoal) * 100), 100);
  const carbsPercent = Math.min(Math.round((dailyTotals.carbs / carbsGoal) * 100), 100);
  const fatPercent = Math.min(Math.round((dailyTotals.fat / fatGoal) * 100), 100);
  const sodiumPercent = Math.min(Math.round((dailyTotals.sodium / sodiumGoal) * 100), 100);

  const currentSpend =
    userProfile.currency === "IRT" ? dailyTotals.costTomanTotal : dailyTotals.costUSDTotal;
  const budgetCap =
    userProfile.currency === "IRT" ? userProfile.dailyBudgetToman : userProfile.dailyBudgetUSD;
  const budgetPercent = Math.min(Math.round((currentSpend / (budgetCap || 1)) * 100), 100);

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
        (item) => (item.entryDate || getLocalIsoDate(0)) === iso
      );
      const cals = dayEntries.reduce((sum, item) => sum + (item.caloriesTotal || 0), 0);
      const prot = dayEntries.reduce((sum, item) => sum + (item.proteinTotal || 0), 0);
      const carb = dayEntries.reduce((sum, item) => sum + (item.carbsTotal || 0), 0);
      const fatVal = dayEntries.reduce((sum, item) => sum + (item.fatTotal || 0), 0);
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
        status
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
        totalCalories: 0
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
        totalCalories: 0
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
        totalCalories: 0
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
        totalCalories: 0
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
        totalCalories: 0
      }
    ];

    for (const item of allHistoryItems) {
      const c = item.caloriesTotal || 0;
      const targetBin = bins.find((b) => c >= b.min && c <= b.max) || bins[bins.length - 1];
      targetBin.count += 1;
      targetBin.totalCalories += c;
    }

    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    const totalMeals = Math.max(allHistoryItems.length, 1);

    return bins.map((b) => ({
      ...b,
      heightPercent: Math.round((b.count / maxCount) * 100),
      sharePercent: Math.round((b.count / totalMeals) * 100)
    }));
  }, [allHistoryItems]);

  // Histogram summary metrics
  const histogramSummary = useMemo(() => {
    const activeDays = dailyHistogramBuckets.filter((d) => d.calories > 0);
    const totalPeriodCals = activeDays.reduce((acc, d) => acc + d.calories, 0);
    const avgDailyCals =
      activeDays.length > 0 ? Math.round(totalPeriodCals / activeDays.length) : 0;
    const peakDay = dailyHistogramBuckets.reduce(
      (max, d) => (d.calories > max.calories ? d : max),
      dailyHistogramBuckets[0] || { calories: 0, shortLabel: "-", date: "" }
    );
    const daysOnTarget = activeDays.filter((d) => d.calories <= calorieGoal * 1.05).length;
    const maxScaleCalories = Math.max(
      calorieGoal * 1.25,
      ...dailyHistogramBuckets.map((d) => d.calories * 1.1),
      1000
    );

    return {
      avgDailyCals,
      peakDay,
      daysOnTarget,
      activeDaysCount: activeDays.length,
      maxScaleCalories
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
    return Array.from(baseDates).sort((a, b) => b.localeCompare(a)).slice(0, 8);
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
        (item.entryDate && item.entryDate.includes(q))
    );
  }, [diaryItems, searchQuery]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualProductName.trim()) return;

    const tomanVal = Number(manualPriceToman) || 0;
    const usdVal = tomanVal > 0 ? Number((tomanVal / currentRate).toFixed(2)) : 0;

    await onAddManualEntry({
      entryDate: manualDate || getLocalIsoDate(0),
      loggedAt: manualTime || "13:00",
      productName: manualProductName.trim(),
      brand: manualBrand.trim() || (isFa ? "ثبت در پایگاه داده SQLite" : "SQLite Diary Record"),
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
      priceUSD: usdVal
    });

    setManualProductName("");
    setShowAddPastModal(false);
    if (manualDate && selectedDate !== "all") {
      onSelectDate(manualDate);
    }
  };

  const goalLineBottomPercent = Math.min(
    Math.max(Math.round((calorieGoal / histogramSummary.maxScaleCalories) * 100), 10),
    92
  );

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full pb-24 sm:pb-28 lg:pb-10">
      {/* HEADER STRIP & SQLITE DATABASE STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af] font-mono">
            <span className="text-[#ff3e00] font-bold uppercase tracking-wide">
              {isFa ? "پایگاه داده تغذیه SQLite" : "SQLITE NUTRITION DATABASE"}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 text-[#d4d4d8]">
              <Database className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>{dbStats.fileName}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {isFa
                ? `${dbStats.totalEntries.toLocaleString("fa-IR")} رکورد در ${dbStats.activeDays.toLocaleString("fa-IR")} روز`
                : `${dbStats.totalEntries} records across ${dbStats.activeDays} days`}
            </span>
            {isSyncingDb && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#ff3e00] inline-flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  {isFa ? "در حال همگام‌سازی..." : "Syncing..."}
                </span>
              </>
            )}
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f4f4f5] mt-1">
            {isFa
              ? "دفترچه خاطرات غذایی و هیستوگرام کالری"
              : "Dietary Journal & Calorie Intake Histogram"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setManualDate(selectedDate === "all" ? getLocalIsoDate(0) : selectedDate);
              setShowAddPastModal((prev) => !prev);
            }}
            type="button"
            className="px-4 py-2 bg-[#ff3e00] hover:bg-[#e03600] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isFa ? "ثبت وعده در تاریخ دلخواه" : "Record Past / Custom Meal"}</span>
          </button>

          {diaryItems.length > 0 && !confirmingClear && (
            <button
              onClick={() => setConfirmingClear(true)}
              type="button"
              className="btn-cmd-dim text-xs py-2 px-3.5 cursor-pointer flex items-center gap-1.5 hover:border-red-500 hover:text-red-400 whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>
                {selectedDate === "all"
                  ? isFa
                    ? "پاک کردن کل تاریخچه"
                    : "Clear All History"
                  : isFa
                  ? "پاک کردن این روز"
                  : "Clear Selected Day"}
              </span>
            </button>
          )}

          {confirmingClear && (
            <div className="flex items-center gap-1.5 bg-[#18191d] border border-red-500/50 rounded-lg px-2.5 py-1.5">
              <span className="text-xs text-red-300 font-medium whitespace-nowrap">
                {isFa ? "حذف قطعی از SQLite؟" : "Delete from SQLite?"}
              </span>
              <button
                onClick={() => {
                  onClearLogs(selectedDate === "all" ? undefined : selectedDate);
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

      {/* INLINE FORM: RECORD PAST OR CUSTOM ENTRY INTO SQLITE */}
      {showAddPastModal && (
        <form
          onSubmit={handleManualSubmit}
          className="bg-[#111214] border border-[#ff3e00]/60 rounded-lg p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div>
              <h3 className="font-syne text-base font-bold text-[#f4f4f5]">
                {isFa
                  ? "ثبت وعده غذایی گذشته یا دستی در پایگاه داده SQLite"
                  : "Record Past or Custom Meal Entry in SQLite"}
              </h3>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {isFa
                  ? "هر وعده غذایی از روزهای گذشته یا امروز را مستقیم در فایل پایگاه داده ذخیره کنید تا در هیستوگرام محاسبه شود."
                  : "Log meals for any past date or today directly into the SQLite database to update the calorie histogram."}
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
            {[
              {
                nameEn: "Ghormeh Sabzi & Rice",
                nameFa: "قورمه سبزی با برنج",
                cal: 420,
                p: 28,
                c: 38,
                f: 16,
                toman: 950000
              },
              {
                nameEn: "Chelo Kabab Koobideh",
                nameFa: "چلوکباب کوبیده",
                cal: 680,
                p: 38,
                c: 62,
                f: 28,
                toman: 1150000
              },
              {
                nameEn: "Zereshk Polo ba Morgh",
                nameFa: "زرشک پلو با مرغ زعفرانی",
                cal: 590,
                p: 36,
                c: 64,
                f: 18,
                toman: 850000
              },
              {
                nameEn: "Persian Omelette & Sangak",
                nameFa: "املت گوجه با نان سنگک",
                cal: 440,
                p: 22,
                c: 36,
                f: 22,
                toman: 360000
              }
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
                placeholder={isFa ? "مثلاً: چلوکباب سلطانی یا سالاد سزار" : "e.g. Grilled Salmon Bowl"}
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
                placeholder={isFa ? "خانگی یا نام رستوران" : "Home Kitchen / Restaurant"}
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
                {isFa ? "ذخیره در پایگاه داده SQLite" : "Save Entry to SQLite"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* CALORIE INTAKE HISTOGRAM PANEL */}
      <section
        aria-label={isFa ? "نمودار هیستوگرام دریافت کالری" : "Calorie Intake Histogram"}
        className="bg-[#111214] border border-[#27272a] rounded-lg p-5 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
              <BarChart3 className="w-4 h-4 text-[#ff3e00]" />
              <span className="font-semibold text-[#f4f4f5]">
                {isFa ? "هیستوگرام تحلیل دریافت کالری" : "Calorie Intake Histogram"}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {histogramMode === "daily"
                  ? isFa
                    ? `روند ${histogramRangeDays.toLocaleString("fa-IR")} روز اخیر در برابر هدف روزانه`
                    : `${histogramRangeDays}-day daily calorie intake vs target cap`
                  : isFa
                  ? "توزیع فراوانی وعده‌ها بر اساس بازه‌های کالری"
                  : "Meal frequency distribution across calorie brackets"}
              </span>
            </div>
            <p className="text-xs text-[#9ca3af] mt-1">
              {histogramMode === "daily"
                ? isFa
                  ? "روی ستون هر روز کلیک کنید تا وعده‌های ثبت‌شده آن تاریخ را در لیست پایین مشاهده یا ویرایش کنید."
                  : "Click any day bar to inspect or manage the recorded food entries for that specific date."
                : isFa
                ? "تحلیل آماری تمام وعده‌های ذخیره‌شده در SQLite بر اساس حجم کالری هر وعده."
                : "Statistical breakdown of all SQLite recorded meals grouped by per-meal calorie brackets."}
            </p>
          </div>

          {/* SEGMENTED CONTROLS FOR HISTOGRAM MODE & RANGE */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1 p-1 bg-[#08090a] border border-[#27272a] rounded-lg">
              <button
                type="button"
                onClick={() => setHistogramMode("daily")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  histogramMode === "daily"
                    ? "bg-[#ff3e00] text-black font-bold"
                    : "text-[#9ca3af] hover:text-[#f4f4f5]"
                }`}
              >
                {isFa ? "هیستوگرام روزانه" : "Daily Timeline"}
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

            {histogramMode === "daily" && (
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
                : histogramSummary.peakDay.calories.toLocaleString("en-US")}{" "}
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
                    1
                  ).toLocaleString("fa-IR")} روز`
                : `${histogramSummary.daysOnTarget} / ${Math.max(
                    histogramSummary.activeDaysCount,
                    1
                  )} days`}
            </span>
          </div>
        </div>

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
                      ? Math.round((bucket.calories / histogramSummary.maxScaleCalories) * 100)
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
                        isSelected ? "bg-[#ff3e00]/10 ring-1 ring-[#ff3e00]" : "hover:bg-[#18191d]/70"
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
                  <span>{isFa ? "در محدوده هدف کالری" : "Within Daily Calorie Target"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span>{isFa ? "فراتر از سقف روزانه (>۱۰۵٪)" : "Above Target Cap (>105%)"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 border-t border-dashed border-[#22c55e]" />
                  <span>{isFa ? "مرز هدف روزانه" : "Daily Goal Threshold"}</span>
                </span>
              </div>

              {allHistoryItems.length < 4 && (
                <button
                  type="button"
                  onClick={onSeedSampleHistory}
                  className="text-xs text-[#ff3e00] hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {isFa
                      ? "بارگذاری داده‌های نمونه ۷ روز گذشته در SQLite"
                      : "Load 7-Day Sample History into SQLite"}
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* MODE 2: MEAL CALORIE BRACKET FREQUENCY HISTOGRAM */
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
                      style={{ width: `${Math.max(bin.heightPercent, bin.count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>

                <div className="sm:w-40 shrink-0 flex sm:justify-end items-center gap-2 text-xs font-mono tabular-nums">
                  <span className="text-[#ff3e00] font-bold">
                    {isFa ? `${bin.count.toLocaleString("fa-IR")} وعده` : `${bin.count} meals`}
                  </span>
                  <span className="text-[#9ca3af]">·</span>
                  <span className="text-[#d4d4d8]">
                    {isFa ? `${bin.sharePercent.toLocaleString("fa-IR")}٪` : `${bin.sharePercent}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DATE FILTER & PAST ENTRIES SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111214] border border-[#27272a] rounded-lg p-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Calendar className="w-4 h-4 text-[#ff3e00] shrink-0 mr-1 rtl:ml-1 rtl:mr-0" />
          <button
            type="button"
            onClick={() => onSelectDate("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedDate === "all"
                ? "bg-[#ff3e00] text-black font-bold"
                : "bg-[#18191d] text-[#d4d4d8] hover:text-white"
            }`}
          >
            {isFa
              ? `همه روزها (${allHistoryItems.length.toLocaleString("fa-IR")})`
              : `All History (${allHistoryItems.length})`}
          </button>

          {recentDateTabs.map((iso) => {
            const countForDay = allHistoryItems.filter(
              (i) => (i.entryDate || getLocalIsoDate(0)) === iso
            ).length;
            const isSelected = selectedDate === iso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectDate(iso)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#ff3e00] text-black font-bold"
                    : "bg-[#18191d] text-[#d4d4d8] hover:text-white"
                }`}
              >
                <span>{formatShortDateLabel(iso, isFa)}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isSelected ? "text-black/80" : "text-[#9ca3af]"
                  }`}
                >
                  ({isFa ? countForDay.toLocaleString("fa-IR") : countForDay})
                </span>
              </button>
            );
          })}
        </div>

        {/* DATE PICKER JUMP */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="diary-date-jump" className="text-xs text-[#9ca3af] whitespace-nowrap">
            {isFa ? "انتخاب تاریخ:" : "Jump to date:"}
          </label>
          <input
            id="diary-date-jump"
            type="date"
            value={selectedDate === "all" ? getLocalIsoDate(0) : selectedDate}
            max={getLocalIsoDate(0)}
            onChange={(e) => {
              if (e.target.value) onSelectDate(e.target.value);
            }}
            className="bg-[#08090a] border border-[#27272a] focus:border-[#ff3e00] rounded-md px-2.5 py-1 text-xs text-[#f4f4f5] font-mono tabular-nums outline-none"
          />
        </div>
      </div>

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
              {isFa ? `${calPercent.toLocaleString("fa-IR")}٪` : `${calPercent}%`}
            </span>
          </div>
          <div className="font-syne text-3xl font-extrabold text-[#ffffff] tabular-nums">
            {isFa ? dailyTotals.calories.toLocaleString("fa-IR") : dailyTotals.calories}
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
                <span className="text-[#ff3e00] font-semibold">{proteinPercent}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `کربوهیدرات: ${Math.round(dailyTotals.carbs).toLocaleString("fa-IR")} از ${carbsGoal.toLocaleString("fa-IR")} گرم`
                    : `Carbs: ${Math.round(dailyTotals.carbs)}g / ${carbsGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">{carbsPercent}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#d4d4d8] mb-1">
                <span>
                  {isFa
                    ? `چربی: ${Math.round(dailyTotals.fat).toLocaleString("fa-IR")} از ${fatGoal.toLocaleString("fa-IR")} گرم`
                    : `Fat: ${Math.round(dailyTotals.fat)}g / ${fatGoal}g`}
                </span>
                <span className="text-[#ff3e00] font-semibold">{fatPercent}%</span>
              </div>
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff3e00]" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MEAL SPEND */}
        <div className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
          <div className="flex justify-between items-center text-xs text-[#9ca3af] mb-2 font-medium">
            <span>{isFa ? "هزینه کل وعده‌ها" : "Meal Spend"}</span>
            <span className="text-[#ff3e00] font-bold tabular-nums">{budgetPercent}%</span>
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
                sodiumPercent > 90 ? "text-amber-400 font-bold" : "text-[#9ca3af]"
              }`}
            >
              {sodiumPercent}%
            </span>
          </div>
          <div className="font-syne text-2xl font-bold text-[#f4f4f5] tabular-nums">
            {isFa ? dailyTotals.sodium.toLocaleString("fa-IR") : dailyTotals.sodium}{" "}
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
                  ? `تمامی وعده‌های ثبت‌شده در SQLite (${filteredDiaryItems.length.toLocaleString("fa-IR")})`
                  : `All SQLite Recorded Meals (${filteredDiaryItems.length})`
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
                placeholder={isFa ? "جستجو در وعده‌ها..." : "Search recorded meals..."}
                className="bg-[#111214] border border-[#27272a] focus:border-[#ff3e00] rounded-lg pl-8 pr-3 rtl:pr-8 rtl:pl-3 py-1.5 text-xs text-[#f4f4f5] outline-none w-48 sm:w-56"
              />
            </div>

            <button
              onClick={onGoToScanner}
              type="button"
              aria-label={isFa ? "اسکن و افزودن وعده غذایی جدید" : "Scan and add new meal"}
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
                ? "می‌توانید یک وعده غذایی جدید با دوربین اسکن کنید، وعده‌های گذشته را دستی ثبت نمایید یا داده‌های نمونه ۷ روزه را بارگذاری کنید."
                : "Scan a meal with your camera, record a past meal entry manually, or load the 7-day sample history into SQLite."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
                {isFa ? "ثبت دستی وعده در این تاریخ" : "Record Entry for This Date"}
              </button>
              {allHistoryItems.length === 0 && (
                <button
                  onClick={onSeedSampleHistory}
                  type="button"
                  className="btn-cmd-dim px-4 py-2.5 cursor-pointer text-xs font-semibold text-[#ff3e00]"
                >
                  {isFa ? "بارگذاری تاریخچه نمونه ۷ روزه" : "Seed 7-Day Sample Data"}
                </button>
              )}
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
                        <span className="font-sans">{item.servingSizeText}</span>
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
                      <span aria-hidden="true" className="text-[#3f3f46] hidden sm:inline">
                        ·
                      </span>
                      <span className="text-[#d4d4d8] hidden sm:inline">
                        {isFa
                          ? `پ: ${item.proteinTotal}g · ک: ${item.carbsTotal}g · چ: ${item.fatTotal}g`
                          : `P: ${item.proteinTotal}g · C: ${item.carbsTotal}g · F: ${item.fatTotal}g`}
                      </span>
                      {(item.priceToman || item.priceUSD) ? (
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
                        isFa ? `حذف ${item.productName}` : `Delete ${item.productName}`
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
