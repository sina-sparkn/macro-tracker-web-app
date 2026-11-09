import React, { useState, useEffect, useMemo } from "react";
import {
  Trash2,
  Plus,
  BookOpen,
  Calendar,
  Search,
  Check,
  X,
  Clock,
  Droplets,
  Flame,
  History,
  Utensils,
  BarChart3,
  Sparkles
} from "lucide-react";
import { FoodLogItem, DailyTotals, UserProfile, ScannedLabel } from "../types";
import { TRANSLATIONS } from "../translations";
import { formatNumber, formatPriceDisplay, formatPercent, formatDaysRatio } from "../utils/formatters";
import { AppleSegmentedControl, SegmentOption } from "./apple/AppleSegmentedControl";
import { AppleStatTile } from "./apple/AppleStatTile";
import { AppleHistogram, HistogramBarData } from "./apple/AppleHistogram";
import { AppleSummaryCards } from "./apple/AppleSummaryCards";
import { MealDrawerModal } from "./apple/MealDrawerModal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

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
  selectedDate: string;
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
  onGoToScanner
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Histogram view controls
  const [histogramMode, setHistogramMode] = useState<"daily" | "water" | "distribution">("daily");
  const [histogramRangeDays, setHistogramRangeDays] = useState<7 | 14>(7);
  const [waterDataVersion, setWaterDataVersion] = useState<number>(0);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingClear, setConfirmingClear] = useState(false);

  // Manual / Past Entry Modal State
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

  // Scan History Modal State
  const [showScanHistoryModal, setShowScanHistoryModal] = useState(false);
  const [scanHistoryTargetDate, setScanHistoryTargetDate] = useState(() =>
    selectedDate === "all" ? getLocalIsoDate(0) : selectedDate
  );
  const [scanHistorySearch, setScanHistorySearch] = useState("");
  const [loggedScanHistoryId, setLoggedScanHistoryId] = useState<string | null>(null);

  const calorieGoal = userProfile.calorieGoal || 2000;

  // Listen to water updates
  useEffect(() => {
    const handleWaterSync = () => setWaterDataVersion((v) => v + 1);
    window.addEventListener("nutriscan_water_updated", handleWaterSync);
    return () => window.removeEventListener("nutriscan_water_updated", handleWaterSync);
  }, []);

  const getStoredWaterForDate = (isoDate: string) => {
    try {
      const rawV2 = localStorage.getItem(`nutriscan_water_v2_${isoDate}`);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        const target = typeof parsed.targetGlasses === "number" ? parsed.targetGlasses : 8;
        const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
        const totalGlasses = entries.reduce((acc: number, cur: any) => acc + (cur.glasses || 0), 0);
        return { glasses: totalGlasses, targetGlasses: target };
      }
    } catch {}
    return { glasses: 0, targetGlasses: 8 };
  };

  // Build daily calorie histogram buckets (7 or 14 days, chronological)
  const dailyHistogramBuckets = useMemo<HistogramBarData[]>(() => {
    const days: HistogramBarData[] = [];
    const todayIso = getLocalIsoDate(0);

    for (let i = histogramRangeDays - 1; i >= 0; i--) {
      const iso = getLocalIsoDate(i);
      const dayEntries = allHistoryItems.filter(
        (item) => (item.entryDate || todayIso) === iso
      );
      const cals = dayEntries.reduce((sum, item) => sum + (item.caloriesTotal || 0), 0);
      const pct = calorieGoal > 0 ? Math.round((cals / calorieGoal) * 100) : 0;

      let status: "empty" | "under" | "optimal" | "over" = "optimal";
      if (cals === 0) status = "empty";
      else if (pct > 105) status = "over";
      else if (pct < 60) status = "under";

      days.push({
        date: iso,
        shortLabel: formatShortDateLabel(iso, isFa),
        weekday: formatWeekdayShort(iso, isFa),
        value: cals,
        label: formatShortDateLabel(iso, isFa),
        isToday: iso === todayIso,
        status,
        mealCount: dayEntries.length
      });
    }
    return days;
  }, [allHistoryItems, histogramRangeDays, calorieGoal, isFa]);

  // Build daily water histogram buckets
  const dailyWaterBuckets = useMemo<HistogramBarData[]>(() => {
    const days: HistogramBarData[] = [];
    const todayIso = getLocalIsoDate(0);

    for (let i = histogramRangeDays - 1; i >= 0; i--) {
      const iso = getLocalIsoDate(i);
      const data = getStoredWaterForDate(iso);
      const target = data.targetGlasses || 8;
      const pct = Math.round((data.glasses / target) * 100);

      let status: "empty" | "under" | "optimal" | "over" = "under";
      if (data.glasses === 0) status = "empty";
      else if (pct >= 100) status = "optimal";

      days.push({
        date: iso,
        shortLabel: formatShortDateLabel(iso, isFa),
        weekday: formatWeekdayShort(iso, isFa),
        value: data.glasses,
        secondaryValue: data.glasses * 250,
        label: formatShortDateLabel(iso, isFa),
        isToday: iso === todayIso,
        status
      });
    }
    return days;
  }, [histogramRangeDays, isFa, waterDataVersion]);

  // Calorie Distribution Brackets
  const mealDistributionBins = useMemo<HistogramBarData[]>(() => {
    const bins = [
      { id: "bin-1", rangeEn: "0–250", rangeFa: "۰ تا ۲۵۰", min: 0, max: 250 },
      { id: "bin-2", rangeEn: "250–500", rangeFa: "۲۵۰ تا ۵۰۰", min: 250, max: 500 },
      { id: "bin-3", rangeEn: "500–750", rangeFa: "۵۰۰ تا ۷۵۰", min: 500, max: 750 },
      { id: "bin-4", rangeEn: "750–1000", rangeFa: "۷۵۰ تا ۱,۰۰۰", min: 750, max: 1000 },
      { id: "bin-5", rangeEn: "1000+", rangeFa: "۱,۰۰۰+", min: 1000, max: Infinity }
    ];

    return bins.map((bin) => {
      const count = allHistoryItems.filter((item) => {
        const c = item.caloriesTotal || 0;
        return c >= bin.min && c < bin.max;
      }).length;

      return {
        date: bin.id,
        shortLabel: isFa ? bin.rangeFa : bin.rangeEn,
        weekday: "",
        value: count,
        label: isFa ? bin.rangeFa : bin.rangeEn,
        status: count > 0 ? "optimal" : "empty"
      };
    });
  }, [allHistoryItems, isFa]);

  // Stats Calculations
  const activeDays = dailyHistogramBuckets.filter((d) => d.value > 0);
  const totalPeriodCals = activeDays.reduce((acc, d) => acc + d.value, 0);
  const avgDailyCals = activeDays.length > 0 ? Math.round(totalPeriodCals / activeDays.length) : 0;
  const peakDay = dailyHistogramBuckets.reduce(
    (max, d) => (d.value > max.value ? d : max),
    dailyHistogramBuckets[0] || { value: 0, shortLabel: "—" }
  );
  const daysOnTarget = activeDays.filter((d) => d.status === "optimal" || d.value >= calorieGoal).length;
  const adherencePct = activeDays.length > 0 ? Math.round((daysOnTarget / activeDays.length) * 100) : 0;

  // Active chart bars based on mode
  const activeBars =
    histogramMode === "water"
      ? dailyWaterBuckets
      : histogramMode === "distribution"
        ? mealDistributionBins
        : dailyHistogramBuckets;

  const activeGoalValue =
    histogramMode === "water" ? 8 : histogramMode === "distribution" ? 5 : calorieGoal;

  const activeGoalLabel =
    histogramMode === "water"
      ? isFa
        ? `هدف: ۸ لیوان (۲٬۰۰۰ ml)`
        : `Target: 8 gl (2,000 ml)`
      : histogramMode === "distribution"
        ? isFa
          ? `شاخص تعادل`
          : `Benchmark`
        : isFa
          ? `هدف: ${formatNumber(calorieGoal, true)} کالری`
          : `Target: ${formatNumber(calorieGoal, false)} kcal`;

  const activeUnit =
    histogramMode === "water"
      ? isFa
        ? "لیوان"
        : "glasses"
      : histogramMode === "distribution"
        ? isFa
          ? "وعده"
          : "meals"
        : isFa
          ? "کالری"
          : "kcal";

  // Filtered Meals List
  const todayIso = getLocalIsoDate(0);
  const filteredDiaryItems = useMemo(() => {
    let items = diaryItems;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.productName.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q))
      );
    }
    return items;
  }, [diaryItems, searchQuery]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tomanVal = Number(manualPriceToman) || 0;
    const rate = userProfile.exchangeRateTomanPerUSD || 230000;
    const usdVal = tomanVal > 0 ? Number((tomanVal / rate).toFixed(2)) : undefined;

    await onAddManualEntry({
      entryDate: manualDate || todayIso,
      loggedAt: manualTime || "13:30",
      productName: manualProductName.trim() || (isFa ? "وعده دستی" : "Custom Meal"),
      brand: manualBrand.trim() || (isFa ? "ثبت دستی" : "Manual Log"),
      caloriesTotal: Math.round(Number(manualCalories) || 0),
      proteinTotal: Number(Number(manualProtein || 0).toFixed(1)),
      carbsTotal: Number(Number(manualCarbs || 0).toFixed(1)),
      fatTotal: Number(Number(manualFat || 0).toFixed(1)),
      sodiumTotal: Math.round(Number(manualSodium || 0)),
      servingSizeText: manualServingSize || "1 serving",
      priceToman: tomanVal > 0 ? tomanVal : undefined,
      priceUSD: usdVal
    });

    setShowAddPastModal(false);
    setManualProductName("");
    setManualBrand("");
  };

  const handleQuickAddScan = (item: ScannedLabel) => {
    if (onQuickLogRecentScan) {
      const targetDate =
        scanHistoryTargetDate || (selectedDate !== "all" ? selectedDate : todayIso);
      onQuickLogRecentScan(item, targetDate, 1);
      const id = item.id || item.productName;
      setLoggedScanHistoryId(id);
      setTimeout(() => setLoggedScanHistoryId(null), 2500);
    }
  };

  // Mode segmented options
  const modeOptions: SegmentOption<"daily" | "water" | "distribution">[] = [
    { id: "daily", label: isFa ? "کالری روزانه" : "Calories", icon: Flame },
    { id: "water", label: isFa ? "مصرف آب" : "Water", icon: Droplets },
    { id: "distribution", label: isFa ? "توزیع کالری" : "Brackets", icon: BarChart3 }
  ];

  const rangeOptions: SegmentOption<7 | 14>[] = [
    { id: 7, label: isFa ? "۷ روز" : "7D" },
    { id: 14, label: isFa ? "۱۴ روز" : "14D" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full select-none pb-28 lg:pb-12">
      {/* ====================================================================
          1. PAGE HEADER (TITLE, DATE RANGE SUBTITLE, PRIMARY PILL / MOBILE FAB)
          ==================================================================== */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--apple-text-primary)]">
            {isFa ? "خاطرات غذایی" : "Food Diary"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--apple-text-secondary)] mt-0.5">
            {isFa
              ? `${formatNumber(histogramRangeDays, true)} روز اخیر · ${formatShortDateLabel(getLocalIsoDate(histogramRangeDays - 1), true)} تا ${formatShortDateLabel(todayIso, true)}`
              : `Last ${histogramRangeDays} days · ${formatShortDateLabel(getLocalIsoDate(histogramRangeDays - 1), false)} – ${formatShortDateLabel(todayIso, false)}`}
          </p>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {recentScans && recentScans.length > 0 && (
            <button
              onClick={() => {
                setScanHistoryTargetDate(selectedDate === "all" ? todayIso : selectedDate);
                setShowScanHistoryModal(true);
              }}
              type="button"
              className="btn-apple-secondary h-11 px-4 text-xs font-semibold shadow-xs"
            >
              <History className="w-4 h-4 text-[#ff3b30]" />
              <span>{isFa ? "سوابق اسکن" : "Scan History"}</span>
            </button>
          )}

          <Button
            onClick={() => setShowAddPastModal(true)}
            className="h-11 px-5 text-xs font-semibold shadow-md rounded-full"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isFa ? "ثبت وعده در تاریخ دلخواه" : "Add Meal on Custom Date"}</span>
          </Button>
        </div>
      </section>

      {/* ====================================================================
          2. INSIGHTS CARD (HERO HISTOGRAM, SEGMENTED CONTROLS, 4 STAT TILES)
          ==================================================================== */}
      <Card className="apple-card border-[var(--apple-border)]">
        <CardContent className="p-5 sm:p-7 flex flex-col gap-6">
          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--apple-border)]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[var(--apple-text-primary)]">
              {histogramMode === "water"
                ? isFa
                  ? "نمودار هیدراتاسیون"
                  : "Water Intake"
                : histogramMode === "distribution"
                  ? isFa
                    ? "توزیع آماری وعده‌ها"
                    : "Calorie Brackets"
                  : isFa
                    ? "نمودار دریافت کالری"
                    : "Calorie Intake"}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {/* Mode Switch */}
            <AppleSegmentedControl
              options={modeOptions}
              value={histogramMode}
              onChange={setHistogramMode}
              className="w-full sm:w-auto"
            />

            {/* Range Switch (7 / 14 Days) */}
            {histogramMode !== "distribution" && (
              <AppleSegmentedControl
                options={rangeOptions}
                value={histogramRangeDays}
                onChange={setHistogramRangeDays}
                size="sm"
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </div>

        {/* 4 Clean Stat Tiles (Desktop: 4 columns, Mobile: 2x2 grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          <AppleStatTile
            label={isFa ? "میانگین روزانه" : "Daily Average"}
            value={avgDailyCals > 0 ? formatNumber(avgDailyCals, isFa) : "—"}
            unit={avgDailyCals > 0 ? (isFa ? "کالری" : "kcal") : undefined}
            subtitle={isFa ? "در دوره انتخابی" : "Over active days"}
          />

          <AppleStatTile
            label={isFa ? "بیشترین دریافت" : "Highest Intake"}
            value={peakDay.value > 0 ? formatNumber(peakDay.value, isFa) : "—"}
            unit={peakDay.value > 0 ? (isFa ? "کالری" : "kcal") : undefined}
            subtitle={peakDay.value > 0 ? `(${peakDay.shortLabel})` : isFa ? "ثبت نشده" : "None"}
            accentColor={peakDay.value > 0 ? "#ff3b30" : undefined}
          />

          <AppleStatTile
            label={isFa ? "سقف هدف روزانه" : "Daily Goal Cap"}
            value={formatNumber(calorieGoal, isFa)}
            unit={isFa ? "کالری" : "kcal"}
            subtitle={isFa ? "شاخص بهینه تغذیه" : "Personalized target"}
            accentColor="#10b981"
          />

          <AppleStatTile
            label={isFa ? "پایبندی به هدف" : "Goal Adherence"}
            value={activeDays.length > 0 ? formatDaysRatio(daysOnTarget, activeDays.length, isFa) : "—"}
            subtitle={activeDays.length > 0 ? `(${formatPercent(adherencePct, isFa)})` : isFa ? "بدون داده" : "No data"}
            accentColor={adherencePct >= 70 ? "#10b981" : undefined}
          />
        </div>

        {/* Apple Fitness-Style Chart */}
        <AppleHistogram
          mode={histogramMode}
          bars={activeBars}
          goalValue={activeGoalValue}
          goalLabel={activeGoalLabel}
          unit={activeUnit}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onGoToScanner={onGoToScanner}
          isFa={isFa}
          rangeDays={histogramRangeDays}
        />
        </CardContent>
      </Card>

      {/* ====================================================================
          3. SUMMARY CARDS (CALORIES TODAY, NUTRIENTS, COST, SODIUM)
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm sm:text-base font-bold text-[var(--apple-text-primary)]">
          {isFa ? "شاخص‌های روزانه" : "Daily Metrics"}
        </h3>
        <AppleSummaryCards
          dailyTotals={dailyTotals}
          userProfile={userProfile}
          isFa={isFa}
        />
      </section>

      {/* ====================================================================
          4. LOGGED MEALS LIST (FOR SELECTED DATE)
          ==================================================================== */}
      <section className="flex flex-col gap-4">
        {/* Section Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[var(--apple-text-primary)]">
              {selectedDate === "all"
                ? isFa
                  ? `همه وعده‌ها (${formatNumber(filteredDiaryItems.length, true)})`
                  : `All Recorded Meals (${filteredDiaryItems.length})`
                : isFa
                  ? `وعده‌های ${formatShortDateLabel(selectedDate, true)} (${formatNumber(filteredDiaryItems.length, true)})`
                  : `Meals on ${formatShortDateLabel(selectedDate, false)} (${filteredDiaryItems.length})`}
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-[var(--apple-text-tertiary)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFa ? "جستجو در وعده‌ها..." : "Search meals..."}
                className="h-9 pl-9 pr-9 rtl:pl-9 rtl:pr-9 text-xs rounded-full bg-[var(--apple-surface)] border-[var(--apple-border)] text-[var(--apple-text-primary)] placeholder-[var(--apple-text-tertiary)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-[var(--apple-text-tertiary)] hover:text-[var(--apple-text-primary)] p-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Clear All button if items exist */}
            {filteredDiaryItems.length > 0 && !confirmingClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingClear(true)}
                className="h-9 px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isFa ? "پاکسازی" : "Clear"}</span>
              </Button>
            )}

            {confirmingClear && (
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs">
                <span className="text-red-500 px-2 font-medium">
                  {isFa ? "حذف شود؟" : "Confirm?"}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearLogs(selectedDate === "all" ? undefined : selectedDate);
                    setConfirmingClear(false);
                  }}
                  className="h-7 px-2.5 text-xs rounded-full"
                >
                  {isFa ? "بله" : "Yes"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmingClear(false)}
                  className="h-7 px-2.5 text-xs rounded-full"
                >
                  {isFa ? "انصراف" : "No"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Meal List Items or Empty State */}
        {filteredDiaryItems.length === 0 ? (
          <Card className="apple-card border-[var(--apple-border)] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex items-center justify-center text-[var(--apple-text-secondary)] mb-3">
              <BookOpen className="w-6 h-6 stroke-[1.8] opacity-75" />
            </div>
            <h4 className="text-base font-bold text-[var(--apple-text-primary)] mb-1">
              {isFa ? "هیچ وعده‌ای در این تاریخ ثبت نشده" : "No Meals Recorded for This Date"}
            </h4>
            <p className="text-xs text-[var(--apple-text-secondary)] max-w-sm mb-5 leading-relaxed">
              {isFa
                ? "می‌توانید با دوربین وعده جدید را اسکن کرده یا آن را به صورت دستی ثبت نمایید."
                : "You can scan your food label using the camera or manually record a past meal."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={onGoToScanner}
                size="sm"
                className="px-5 py-2.5 text-xs font-semibold shadow-sm rounded-full gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isFa ? "اسکن وعده با دوربین" : "Scan Meal with Camera"}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddPastModal(true)}
                className="px-5 py-2.5 text-xs font-semibold rounded-full gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? "ثبت دستی وعده" : "Record Manually"}</span>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredDiaryItems.map((item, idx) => {
              const itemDate = item.entryDate || todayIso;
              return (
                <Card
                  key={item.id}
                  className="apple-card apple-card-interactive p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-[var(--apple-border)]"
                >
                  {/* Left Side: Dish Info */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-[11px] font-bold text-[var(--apple-text-secondary)] flex items-center justify-center tabular-nums shrink-0 mt-0.5 sm:mt-0">
                      {formatNumber(idx + 1, isFa)}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-[var(--apple-text-primary)] truncate">
                        {item.productName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--apple-text-secondary)] mt-0.5">
                        <span className="font-medium text-[var(--apple-text-primary)]">
                          {formatShortDateLabel(itemDate, isFa)}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3 h-3 text-[var(--apple-text-tertiary)]" />
                          <span>{item.loggedAt}</span>
                        </span>
                        <span>·</span>
                        <span>{item.servingSizeText}</span>
                        {item.brand && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[140px]">{item.brand}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Calories, Macros, Price, Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--apple-border)] shrink-0">
                    <div className="flex items-center gap-3 text-xs tabular-nums">
                      <span className="font-bold text-sm sm:text-base text-[#ff3b30]">
                        {isFa
                          ? `${formatNumber(item.caloriesTotal, true)} کالری`
                          : `${formatNumber(item.caloriesTotal, false)} kcal`}
                      </span>

                      {/* Macros breakdown */}
                      <span className="hidden md:inline text-[var(--apple-text-secondary)]">
                        {isFa
                          ? `پ: ${formatNumber(item.proteinTotal, true)}g · ک: ${formatNumber(item.carbsTotal, true)}g · چ: ${formatNumber(item.fatTotal, true)}g`
                          : `P: ${item.proteinTotal}g · C: ${item.carbsTotal}g · F: ${item.fatTotal}g`}
                      </span>

                      {/* Price */}
                      {(item.priceToman || item.priceUSD) && (
                        <span className="hidden sm:inline font-medium text-[var(--apple-text-primary)]">
                          {formatPriceDisplay(item.priceToman, item.priceUSD, userProfile)}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLogItem(item.id);
                      }}
                      aria-label={isFa ? `حذف ${item.productName}` : `Delete ${item.productName}`}
                      className="w-8 h-8 rounded-full text-[var(--apple-text-secondary)] hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ====================================================================
          5. MOBILE FLOATING ACTION BUTTON (FAB)
          ==================================================================== */}
      <div className="sm:hidden fixed bottom-20 left-4 rtl:left-auto rtl:right-4 z-30">
        <Button
          size="lg"
          onClick={() => setShowAddPastModal(true)}
          aria-label={isFa ? "ثبت وعده در تاریخ دلخواه" : "Add meal on custom date"}
          className="h-12 px-5 text-xs font-semibold shadow-xl rounded-full gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isFa ? "ثبت وعده" : "Add Meal"}</span>
        </Button>
      </div>

      {/* ====================================================================
          6. MODALS: MEAL DRAWER & SCAN HISTORY QUICK-ADD
          ==================================================================== */}
      <MealDrawerModal
        isOpen={showAddPastModal}
        onClose={() => setShowAddPastModal(false)}
        onSubmit={handleManualSubmit}
        isFa={isFa}
        manualDate={manualDate}
        setManualDate={setManualDate}
        manualTime={manualTime}
        setManualTime={setManualTime}
        manualProductName={manualProductName}
        setManualProductName={setManualProductName}
        manualBrand={manualBrand}
        setManualBrand={setManualBrand}
        manualCalories={manualCalories}
        setManualCalories={setManualCalories}
        manualProtein={manualProtein}
        setManualProtein={setManualProtein}
        manualCarbs={manualCarbs}
        setManualCarbs={setManualCarbs}
        manualFat={manualFat}
        setManualFat={setManualFat}
        manualSodium={manualSodium}
        setManualSodium={setManualSodium}
        manualServingSize={manualServingSize}
        setManualServingSize={setManualServingSize}
        manualPriceToman={manualPriceToman}
        setManualPriceToman={setManualPriceToman}
      />

      {/* Scan History Quick-Add Modal */}
      {showScanHistoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 dark:bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            className="fixed inset-0"
            onClick={() => setShowScanHistoryModal(false)}
          />
          <div className="relative z-10 apple-card w-full max-w-2xl max-h-[85dvh] flex flex-col rounded-[28px] overflow-hidden shadow-2xl border border-[var(--apple-border)]">
            <div className="p-5 sm:p-6 border-b border-[var(--apple-border)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#ff3b30]/10 flex items-center justify-center text-[#ff3b30]">
                  <History className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[var(--apple-text-primary)]">
                    {isFa ? "افزودن سریع از سوابق اسکن" : "Add from Scan History"}
                  </h3>
                  <p className="text-xs text-[var(--apple-text-secondary)]">
                    {isFa
                      ? `افزودن مستقیم به تاریخ ${formatShortDateLabel(scanHistoryTargetDate, true)}`
                      : `Log directly to ${formatShortDateLabel(scanHistoryTargetDate, false)}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowScanHistoryModal(false)}
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--apple-surface-secondary)] text-[var(--apple-text-secondary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
              {recentScans.map((item) => {
                const id = item.id || item.productName;
                const isJustAdded = loggedScanHistoryId === id;
                return (
                  <div
                    key={id}
                    className="p-3.5 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-[var(--apple-text-primary)] truncate">
                        {item.productName}
                      </h4>
                      <span className="text-[11px] text-[var(--apple-text-secondary)] tabular-nums">
                        {formatNumber(item.calories, isFa)} {isFa ? "کالری" : "kcal"} · {item.servingSize}
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAddScan(item)}
                      type="button"
                      className={`h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isJustAdded
                          ? "bg-emerald-500 text-white"
                          : "btn-apple-primary !py-0 !shadow-none"
                      }`}
                    >
                      {isJustAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isJustAdded ? (isFa ? "ثبت شد" : "Added") : (isFa ? "افزودن" : "Add")}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryConsoleView;
