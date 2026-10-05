import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  X,
  ChevronRight,
  Utensils,
  Check,
  Plus,
  Info,
  History,
  Clock,
  Trash2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { ScannedLabel, UserProfile } from "../types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "../worldFoods";
import { TRANSLATIONS } from "../translations";
import { CYBER_PRESET_DISHES, CyberPresetDish } from "../App";
import {
  RecommendedDish,
  getDailyRecommendedDish,
  getDailyFormattedDate,
} from "../recommendedDishes";
import {
  normalizeScannedLabel,
  formatSmartPrice,
} from "../utils/dishLocalization";

interface ScannerConsoleViewProps {
  userProfile: UserProfile;
  useRealCamera: boolean;
  isScanning: boolean;
  scanError: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recentScans: ScannedLabel[];
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCaptureSnapshot: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectCyberDish: (dish: CyberPresetDish) => void;
  onSelectWorldFood: (food: WorldFood) => void;
  onLogRecommendedDish?: (dish?: RecommendedDish) => void;
  onSelectRecentScan: (item: ScannedLabel) => void;
  onQuickLogRecentScan: (item: ScannedLabel) => void;
  onClearRecentScans: () => void;
}

export const ScannerConsoleView: React.FC<ScannerConsoleViewProps> = ({
  userProfile,
  useRealCamera,
  isScanning,
  scanError,
  videoRef,
  recentScans,
  onStartCamera,
  onStopCamera,
  onCaptureSnapshot,
  onFileUpload,
  onSelectCyberDish,
  onSelectWorldFood,
  onLogRecommendedDish,
  onSelectRecentScan,
  onQuickLogRecentScan,
  onClearRecentScans,
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [worldCategory, setWorldCategory] = useState<string>("all");
  const [justLogged, setJustLogged] = useState<boolean>(false);
  const [loggedRecentId, setLoggedRecentId] = useState<string | null>(null);
  const [dailyDishOffset, setDailyDishOffset] = useState<number>(0);

  const todayRecommendedDish = getDailyRecommendedDish(
    new Date(),
    dailyDishOffset,
  );
  const todayDateLabel = getDailyFormattedDate(new Date(), isFa ? "fa" : "en");

  const currentRate =
    userProfile.exchangeRateTomanPerUSD &&
    userProfile.exchangeRateTomanPerUSD > 0
      ? userProfile.exchangeRateTomanPerUSD
      : 230000;

  const formatPrice = (toman?: number, usd?: number) => {
    return formatSmartPrice(toman, usd, userProfile, 1) || "-";
  };

  const handleQuickLogRecent = (item: ScannedLabel) => {
    onQuickLogRecentScan(item);
    const id = item.id || item.productName;
    setLoggedRecentId(id);
    setTimeout(() => {
      setLoggedRecentId((curr) => (curr === id ? null : curr));
    }, 2500);
  };

  const handleLogRecommended = () => {
    if (onLogRecommendedDish) {
      onLogRecommendedDish(todayRecommendedDish);
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 3000);
    }
  };

  const handleOpenRecommendedDetails = () => {
    const dishAdapter: CyberPresetDish = {
      refId: todayRecommendedDish.refId,
      nameFa: todayRecommendedDish.nameFa,
      nameEn: todayRecommendedDish.nameEn,
      calories: todayRecommendedDish.calories,
      priceToman: todayRecommendedDish.priceToman,
      priceUSD: todayRecommendedDish.priceUSD,
      protein: todayRecommendedDish.protein,
      carbs: todayRecommendedDish.carbs,
      fat: todayRecommendedDish.fat,
      sodium: todayRecommendedDish.sodium,
      origin: isFa
        ? todayRecommendedDish.originFa
        : todayRecommendedDish.originEn,
      servingSize: isFa
        ? todayRecommendedDish.servingSizeFa
        : todayRecommendedDish.servingSizeEn,
      ingredients: isFa
        ? todayRecommendedDish.ingredientsFa
        : todayRecommendedDish.ingredientsEn,
      summaryFa: todayRecommendedDish.descFa,
      summaryEn: todayRecommendedDish.descEn,
    };
    onSelectCyberDish(dishAdapter);
  };

  const filteredFoods = WORLD_FOODS.filter((food) => {
    if (worldCategory === "all") return true;
    return food.region === worldCategory;
  });

  return (
<<<<<<< HEAD
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-24 sm:pb-28 lg:pb-8">
      {/* SCAN SECTION */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#ff3e00] font-mono text-xs mb-2 uppercase tracking-wide bg-[#ff3e00]/10 px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-[#ff3e00]" />
              <span>
                {isFa ? "بینایی هوش مصنوعی تغذیه" : "AI NUTRITION VISION"}
              </span>
            </div>
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f4f4f5] tracking-tight">
              {isFa
                ? "اسکن بشقاب غذا یا جدول ارزش غذایی"
                : "Scan Plate or Nutrition Label"}
            </h2>
          </div>
        </div>

        <p className="text-sm text-[#d4d4d8] leading-relaxed max-w-3xl mb-6">
          {isFa
            ? "از بشقاب غذا یا برچسب کالری محصول عکس بگیرید تا کالری، پروتئین، کربوهیدرات، چربی، سدیم و برآورد هزینه به‌صورت خودکار تحلیل شود."
            : "Capture a photo of your meal or nutrition facts table to parse calories, macronutrients, sodium, and estimated portion cost."}
        </p>

        {/* ACCESSIBLE ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartCamera}
            type="button"
            aria-label={
              isFa
                ? "روشن کردن دوربین جهت اسکن غذا"
                : "Start camera to scan food"
            }
            className="btn-cmd cursor-pointer flex items-center gap-2 text-sm font-semibold"
=======
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-6 sm:pb-8 lg:pb-6">
      {/* SCAN ACTION BAR */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onStartCamera}
            type="button"
            aria-label={isFa ? "اسکن با دوربین" : "Scan with Camera"}
            className="btn-cmd cursor-pointer py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2.5 rounded-lg shadow-sm"
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          >
            <Camera className="w-5 h-5" />
            <span>{isFa ? "اسکن با دوربین" : "Scan with Camera"}</span>
          </button>

          <label
<<<<<<< HEAD
            aria-label={
              isFa
                ? "بارگذاری عکس غذا از گالری"
                : "Upload food photo from gallery"
            }
            className="btn-cmd-dim cursor-pointer flex items-center gap-2 text-sm font-medium"
=======
            aria-label={isFa ? "بارگذاری عکس" : "Upload Photo"}
            className="btn-cmd-dim cursor-pointer py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2.5 rounded-lg border-[#3f3f46] hover:border-[#ff3e00]"
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          >
            <Upload className="w-5 h-5 text-[#ff3e00]" />
            <span>{isFa ? "بارگذاری عکس" : "Upload Photo"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileUpload}
            />
          </label>
        </div>

        {/* LIVE CAMERA FEED AREA */}
        {useRealCamera && (
          <div className="mt-5 border-2 border-[#ff3e00] bg-black rounded-lg relative aspect-[4/3] max-w-xl mx-auto overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* FOCUS BRACKETS */}
            <div className="absolute inset-8 pointer-events-none z-20">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff3e00]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ff3e00]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff3e00]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff3e00]" />
            </div>

            {/* LIVE CAMERA CONTROLS */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-3 z-30 px-4">
              <button
                onClick={onCaptureSnapshot}
                disabled={isScanning}
                type="button"
                aria-label={isFa ? "ثبت تصویر غذا" : "Capture photo"}
                className="btn-cmd cursor-pointer px-6 py-3 flex items-center gap-2 text-sm font-bold shadow-lg"
              >
                <Camera className="w-5 h-5" />
                <span>{isFa ? "ثبت تصویر" : "Capture Photo"}</span>
              </button>
              <button
                onClick={onStopCamera}
                type="button"
                aria-label={isFa ? "بستن دوربین" : "Close camera"}
                className="btn-cmd-dim cursor-pointer px-4 py-3 flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                <span>{isFa ? "بستن" : "Close"}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCAN ERROR BANNER */}
        {scanError && (
          <div
            role="alert"
            className="mt-3 p-3.5 bg-red-950/60 border border-red-700 text-red-200 text-xs sm:text-sm flex items-center gap-2.5 rounded-lg"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}
      </section>

      {/* TODAY'S RECOMMENDATION */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-4 sm:p-5">
        <div>
          {/* HEADER & CONTROLS */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-[#ff3e00] uppercase tracking-wider">
              {isFa ? "پیشنهاد امروز" : "Featured Meal"}
            </span>

<<<<<<< HEAD
        <div className="relative z-10">
          {/* BADGE HEADER & CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff3e00] text-black font-bold text-xs rounded uppercase tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>{isFa ? "پیشنهاد امروز" : "TODAY'S RECOMMENDATION"}</span>
              </div>

              {/* DATE BADGE */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111214] border border-[#27272a] text-[#f4f4f5] text-xs font-mono rounded">
                <Calendar className="w-3.5 h-3.5 text-[#ff3e00]" />
                <span>{todayDateLabel}</span>
              </div>

              {/* ROTATION TAG */}
              <span className="text-[11px] font-semibold text-[#ff3e00] bg-[#ff3e00]/10 px-2 py-0.5 rounded border border-[#ff3e00]/20 font-mono">
                {isFa ? todayRecommendedDish.tagFa : todayRecommendedDish.tagEn}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#ff3e00] bg-[#ff3e00]/10 px-2.5 py-1 rounded border border-[#ff3e00]/30 hidden sm:inline-block">
                {isFa
                  ? `${todayRecommendedDish.calories.toLocaleString("fa-IR")} کالری • ${todayRecommendedDish.protein.toLocaleString("fa-IR")} گرم پروتئین`
                  : `${todayRecommendedDish.calories} kcal • ${todayRecommendedDish.protein}g Protein`}
              </span>

              {dailyDishOffset !== 0 && (
                <button
                  onClick={() => setDailyDishOffset(0)}
                  type="button"
                  className="px-2 py-1 text-[11px] text-[#ff3e00] hover:text-[#ff784e] bg-[#ff3e00]/10 border border-[#ff3e00]/30 rounded transition-colors cursor-pointer"
                  title={
                    isFa
                      ? "بازگشت به غذای تعیین‌شده برای تاریخ امروز"
                      : "Reset to today's date dish"
                  }
                >
                  {isFa ? "پیشنهاد اصلی امروز" : "Today's Pick"}
                </button>
              )}
            </div>
=======
            <button
              onClick={() => setDailyDishOffset((prev) => prev + 1)}
              type="button"
              aria-label={isFa ? "پیشنهاد بعدی" : "Next dish"}
              className="px-2.5 py-1 text-xs text-[#9ca3af] hover:text-[#f4f4f5] bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#ff3e00]" />
              <span className="font-mono text-xs">{isFa ? "بعدی" : "Next"}</span>
            </button>
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          </div>

          {/* TITLE & ORIGIN */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h3 className="font-syne sm:font-vazirmatn text-base sm:text-lg font-bold text-[#ffffff] break-words">
              {isFa ? todayRecommendedDish.nameFa : todayRecommendedDish.nameEn}
            </h3>
<<<<<<< HEAD
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1a1aa] bg-[#08090a] px-2.5 py-1 rounded border border-[#27272a]">
              <span>
                {isFa
                  ? todayRecommendedDish.originFa
                  : todayRecommendedDish.originEn}
              </span>
              <span>•</span>
              <span>
                {isFa
                  ? todayRecommendedDish.servingSizeFa
                  : todayRecommendedDish.servingSizeEn}
              </span>
            </div>
=======
            <span className="text-xs font-mono text-[#9ca3af]">
              {isFa ? todayRecommendedDish.originFa : todayRecommendedDish.originEn}
            </span>
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          </div>

          {/* NUTRITION METRICS GRID */}
<<<<<<< HEAD
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 font-mono">
            <div className="bg-[#08090a] border border-[#27272a] p-3 rounded text-center">
              <span className="text-xs text-[#9ca3af] block">
                {isFa ? "پروتئین" : "Protein"}
              </span>
              <span className="text-base font-bold text-sky-400 mt-0.5 block">
                {isFa
                  ? `${todayRecommendedDish.protein.toLocaleString("fa-IR")} گرم`
                  : `${todayRecommendedDish.protein}g`}
              </span>
            </div>

            <div className="bg-[#08090a] border border-[#27272a] p-3 rounded text-center">
              <span className="text-xs text-[#9ca3af] block">
                {isFa ? "کربوهیدرات" : "Carbs"}
              </span>
              <span className="text-base font-bold text-amber-400 mt-0.5 block">
                {isFa
                  ? `${todayRecommendedDish.carbs.toLocaleString("fa-IR")} گرم`
                  : `${todayRecommendedDish.carbs}g`}
              </span>
            </div>

            <div className="bg-[#08090a] border border-[#27272a] p-3 rounded text-center">
              <span className="text-xs text-[#9ca3af] block">
                {isFa ? "چربی سالم" : "Fat"}
              </span>
              <span className="text-base font-bold text-rose-400 mt-0.5 block">
                {isFa
                  ? `${todayRecommendedDish.fat.toLocaleString("fa-IR")} گرم`
                  : `${todayRecommendedDish.fat}g`}
              </span>
            </div>

            <div className="bg-[#08090a] border border-[#27272a] p-3 rounded text-center">
              <span className="text-xs text-[#9ca3af] block">
                {isFa ? "برآورد هزینه" : "Est. Cost"}
              </span>
              <span className="text-base font-bold text-[#ff3e00] mt-0.5 block">
                {formatPrice(
                  todayRecommendedDish.priceToman,
                  todayRecommendedDish.priceUSD,
                )}
=======
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 font-mono text-xs">
            <div className="bg-[#08090a] border border-[#27272a] p-2 rounded text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] block truncate">{isFa ? "کالری" : "Calories"}</span>
              <span className="text-sm font-bold text-[#ff3e00] mt-0.5 block truncate">
                {isFa ? `${todayRecommendedDish.calories.toLocaleString("fa-IR")}` : `${todayRecommendedDish.calories} kcal`}
              </span>
            </div>

            <div className="bg-[#08090a] border border-[#27272a] p-2 rounded text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] block truncate">{isFa ? "پروتئین" : "Protein"}</span>
              <span className="text-sm font-bold text-sky-400 mt-0.5 block truncate">
                {isFa ? `${todayRecommendedDish.protein.toLocaleString("fa-IR")}g` : `${todayRecommendedDish.protein}g`}
              </span>
            </div>

            <div className="bg-[#08090a] border border-[#27272a] p-2 rounded text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] block truncate">{isFa ? "کربوهیدرات" : "Carbs"}</span>
              <span className="text-sm font-bold text-amber-400 mt-0.5 block truncate">
                {isFa ? `${todayRecommendedDish.carbs.toLocaleString("fa-IR")}g` : `${todayRecommendedDish.carbs}g`}
              </span>
            </div>

            <div className="bg-[#08090a] border border-[#27272a] p-2 rounded text-center min-w-0">
              <span className="text-[11px] text-[#9ca3af] block truncate">{isFa ? "هزینه" : "Cost"}</span>
              <span className="text-sm font-bold text-[#f4f4f5] mt-0.5 block truncate">
                {formatPrice(todayRecommendedDish.priceToman, todayRecommendedDish.priceUSD)}
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              </span>
            </div>
          </div>

<<<<<<< HEAD
          {/* HEALTH TIP BOX */}
          <div className="bg-[#08090a]/80 border border-[#27272a] p-3.5 rounded-lg mb-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#ff3e00] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed">
              <strong className="text-[#f4f4f5]">
                {isFa ? "نکته سلامت و تغذیه: " : "Nutritional Tip: "}
              </strong>
              {isFa
                ? todayRecommendedDish.funFactFa
                : todayRecommendedDish.funFactEn}
            </p>
          </div>

=======
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogRecommended}
              type="button"
<<<<<<< HEAD
              aria-label={
                isFa
                  ? "ثبت این غذا در یادداشت روزانه"
                  : "Add this meal to daily log"
              }
              className={`btn-cmd cursor-pointer px-5 py-2.5 text-sm font-bold flex items-center gap-2 transition-all ${
=======
              aria-label={isFa ? "ثبت این غذا در یادداشت روزانه" : "Add this meal to daily log"}
              className={`btn-cmd cursor-pointer px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
                justLogged ? "bg-emerald-500 border-emerald-500 text-black" : ""
              }`}
            >
              {justLogged ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isFa ? "ثبت شد ✓" : "Added ✓"}</span>
                </>
              ) : (
                <>
<<<<<<< HEAD
                  <Plus className="w-4 h-4" />
                  <span>
                    {isFa ? "ثبت این غذا در دفترچه" : "Add to Daily Diary"}
                  </span>
=======
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isFa ? "افزودن به دفترچه" : "Add to Diary"}</span>
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
                </>
              )}
            </button>

            <button
              onClick={handleOpenRecommendedDetails}
              type="button"
<<<<<<< HEAD
              aria-label={
                isFa
                  ? "مشاهده جزئیات کامل ارزش غذایی"
                  : "View full nutrition details"
              }
              className="btn-cmd-dim cursor-pointer px-4 py-2.5 text-sm font-medium flex items-center gap-2"
=======
              aria-label={isFa ? "مشاهده جزئیات" : "View details"}
              className="btn-cmd-dim cursor-pointer px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
            >
              <Utensils className="w-3.5 h-3.5 text-[#ff3e00]" />
              <span>{isFa ? "جزئیات" : "Details"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* LAST SCAN (ONLY RENDER IF SCANS EXIST) */}
      {recentScans.length > 0 && (
        <section className="bg-[#111214] border border-[#27272a] rounded-lg p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-[#ff3e00]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#f4f4f5]">
                {isFa ? "آخرین اسکن" : "Last Scan"}
              </h3>
            </div>

            <button
              onClick={onClearRecentScans}
              type="button"
              aria-label={isFa ? "پاک کردن آخرین اسکن" : "Clear last scan"}
              className="text-xs text-[#9ca3af] hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isFa ? "پاک کردن" : "Clear"}</span>
            </button>
          </div>

          <div className="max-w-xl">
            {recentScans.slice(0, 1).map((rawItem, idx) => {
              const item = normalizeScannedLabel(
                rawItem,
                isFa ? "fa" : "en",
                currentRate,
              );
              const itemToman = item.estimatedPrice?.amountToman;
              const itemUSD = item.estimatedPrice?.amountUSD;
              const itemId = item.id || `${item.productName}-${idx}`;
              const isItemLogged =
                loggedRecentId === itemId ||
                loggedRecentId === item.productName;

              return (
                <div
                  key={itemId}
                  className="bg-[#18191d] border border-[#27272a] hover:border-[#ff3e00]/60 rounded-lg p-3.5 transition-all"
                >
<<<<<<< HEAD
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono text-[#ff3e00] bg-[#ff3e00]/10 border border-[#ff3e00]/20 px-2.5 py-0.5 rounded font-semibold">
                        {item.foodType === "beverage"
                          ? isFa
                            ? "نوشیدنی اسکن‌شده"
                            : "Scanned Beverage"
                          : isFa
                            ? "غذای اسکن‌شده"
                            : "Scanned Food / Dish"}
                      </span>
                      {item.scannedAt && (
                        <span className="text-[11px] text-[#a1a1aa] font-mono shrink-0 bg-[#111214] px-2 py-0.5 rounded border border-[#27272a]">
                          {item.scannedAt}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base sm:text-lg text-[#f4f4f5] group-hover:text-[#ff3e00] transition-colors line-clamp-1">
                      {item.productName}
                    </h4>

                    {item.brand && (
                      <p className="text-xs text-[#9ca3af] truncate mt-0.5">
                        {item.brand}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono my-3 pt-2.5 border-t border-[#27272a]">
                      <span className="text-[#f4f4f5] font-bold">
                        {isFa
                          ? `${item.calories.toLocaleString("fa-IR")} کالری`
                          : `${item.calories} kcal`}
                      </span>
                      <span className="text-[#ff3e00] font-extrabold text-sm sm:text-base">
                        {formatPrice(itemToman, itemUSD)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#d4d4d8] font-mono mb-4 bg-[#111214] px-3 py-1.5 rounded border border-[#27272a]">
                      <span className="font-semibold text-sky-400">
                        P: {Math.round(item.protein)}g
                      </span>
                      <span className="text-[#52525b]">•</span>
                      <span className="font-semibold text-amber-400">
                        C: {Math.round(item.totalCarbohydrate)}g
                      </span>
                      <span className="text-[#52525b]">•</span>
                      <span className="font-semibold text-rose-400">
                        F: {Math.round(item.totalFat)}g
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#27272a]/80">
                    <button
                      onClick={() => onSelectRecentScan(item)}
                      type="button"
                      aria-label={
                        isFa
                          ? `مشاهده جزئیات ${item.productName}`
                          : `Inspect ${item.productName}`
                      }
                      className="py-2 px-3 bg-[#111214] hover:bg-[#27272a] text-[#d4d4d8] hover:text-white rounded text-xs font-semibold transition-colors text-center cursor-pointer border border-[#27272a]"
                    >
                      {isFa ? "مشاهده جزئیات" : "Inspect Details"}
                    </button>
=======
                  <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-[#f4f4f5] truncate">
                      {item.productName}
                    </h4>
                    <span className="text-[#ff3e00] font-bold text-sm font-mono shrink-0 ml-1">
                      {isFa ? `${item.calories.toLocaleString("fa-IR")} کالری` : `${item.calories} kcal`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#9ca3af] font-mono mb-3">
                    <span>P: {Math.round(item.protein)}g</span>
                    <span>·</span>
                    <span>C: {Math.round(item.totalCarbohydrate)}g</span>
                    <span>·</span>
                    <span>F: {Math.round(item.totalFat)}g</span>
                    <span>·</span>
                    <span>{formatPrice(itemToman, itemUSD)}</span>
                  </div>
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickLogRecent(item)}
                      type="button"
<<<<<<< HEAD
                      aria-label={
                        isFa
                          ? `ثبت مجدد ${item.productName} در دفترچه`
                          : `Re-log ${item.productName}`
                      }
                      className={`py-2 px-3 rounded text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
=======
                      aria-label={isFa ? `ثبت مجدد ${item.productName}` : `Re-log ${item.productName}`}
                      className={`py-1.5 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
                        isItemLogged
                          ? "bg-emerald-500 text-black"
                          : "bg-[#ff3e00] hover:bg-[#ff5722] text-black"
                      }`}
                    >
                      {isItemLogged ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isFa ? "ثبت شد" : "Logged"}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
<<<<<<< HEAD
                          <span>
                            {isFa ? "ثبت مجدد در دفترچه" : "Re-log to Diary"}
                          </span>
=======
                          <span>{isFa ? "ثبت مجدد" : "Re-log"}</span>
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSelectRecentScan(item)}
                      type="button"
                      aria-label={isFa ? `جزئیات ${item.productName}` : `Details ${item.productName}`}
                      className="py-1.5 px-3 bg-[#111214] hover:bg-[#27272a] text-[#d4d4d8] hover:text-white rounded text-xs font-medium transition-colors cursor-pointer border border-[#27272a]"
                    >
                      {isFa ? "جزئیات" : "Details"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* QUICK LOG MEALS CATALOG */}
      <section className="mt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h3 className="text-xs font-bold text-[#f4f4f5] uppercase tracking-wider">
            {isFa ? "غذاهای پیشنهادی" : "Quick Log Meals"}
          </h3>
<<<<<<< HEAD
          <span className="text-xs text-[#9ca3af]">
            {isFa ? "۴ غذای محبوب" : "4 Popular Dishes"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CYBER_PRESET_DISHES.map((dish) => (
            <div
              key={dish.refId}
              onClick={() => onSelectCyberDish(dish)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCyberDish(dish);
                }
              }}
              aria-label={
                isFa ? `انتخاب ${dish.nameFa}` : `Select ${dish.nameEn}`
              }
              className="bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] rounded-lg p-4 sm:p-5 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#9ca3af] font-medium">
                  {dish.origin || (isFa ? "اصیل ایرانی" : "Authentic")}
                </span>
                <span className="text-xs text-[#ff3e00] group-hover:underline transition-colors flex items-center gap-1 font-semibold">
                  {isFa ? "مشاهده جزئیات" : "Details"}{" "}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="font-syne sm:font-vazirmatn text-base sm:text-lg font-bold text-[#f4f4f5] group-hover:text-[#ff3e00] transition-colors mb-2">
                {isFa ? dish.nameFa : dish.nameEn}
              </h4>

              <div className="flex items-center justify-between text-xs font-mono pt-2.5 border-t border-[#27272a]">
                <span className="text-[#ff3e00] font-bold">
                  {isFa
                    ? `${dish.calories.toLocaleString("fa-IR")} کالری`
                    : `${dish.calories} kcal`}
                </span>
                <span className="text-[#9ca3af]">
                  {formatPrice(dish.priceToman, dish.priceUSD)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORLD RECIPES DISCOVERY REPOSITORY */}
      <section className="mt-4 pt-6 border-t border-[#27272a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs text-[#ff3e00] font-bold uppercase tracking-wider block">
              {isFa ? "آرشیو تغذیه ملل" : "GLOBAL NUTRITION DIRECTORY"}
            </span>
            <h3 className="font-syne text-xl font-bold text-[#f4f4f5] mt-1">
              {isFa ? "بانک داده غذاهای ملل جهان" : "World Foods Repository"}
            </h3>
          </div>
=======
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87

          {/* CATEGORY SELECTOR CHIPS */}
          <div className="flex flex-wrap gap-1 text-xs">
            {[
              { id: "all", labelEn: "All", labelFa: "همه" },
              { id: "Persian", labelEn: "Persian", labelFa: "ایرانی" },
              {
                id: "Middle East",
                labelEn: "Middle East",
                labelFa: "خاورمیانه",
              },
              { id: "Asia", labelEn: "Asia", labelFa: "آسیا" },
              { id: "Europe", labelEn: "Europe", labelFa: "اروپا" },
              { id: "Americas", labelEn: "Americas", labelFa: "آمریکا" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setWorldCategory(cat.id)}
                type="button"
                aria-pressed={worldCategory === cat.id}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer border text-xs font-medium ${
                  worldCategory === cat.id
                    ? "bg-[#ff3e00] text-black border-[#ff3e00] font-bold"
                    : "bg-[#18191d] text-[#d4d4d8] border-[#27272a] hover:border-[#ff3e00]"
                }`}
              >
                {isFa ? cat.labelFa : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredFoods.map((rawFood) => {
            const food = getLocalizedWorldFood(rawFood, currentLang);
            return (
              <div
                key={food.id}
                onClick={() => onSelectWorldFood(rawFood)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectWorldFood(rawFood);
                  }
                }}
<<<<<<< HEAD
                aria-label={
                  isFa ? `انتخاب ${food.name}` : `Select ${food.name}`
                }
                className="bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] rounded-lg p-4 transition-all cursor-pointer group flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
=======
                aria-label={isFa ? `انتخاب ${food.name}` : `Select ${food.name}`}
                className="bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] rounded-lg p-3 transition-all cursor-pointer group flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
>>>>>>> 6cbbf36a2b02593ff623a2e6891c6785bacb0f87
              >
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-[#9ca3af] mb-1">
                    <span>{food.origin}</span>
                    <span className="text-[#ff3e00] font-bold">
                      {food.healthRatingLabel}
                    </span>
                  </div>

                  <h4 className="font-syne sm:font-vazirmatn text-sm font-bold text-[#f4f4f5] group-hover:text-[#ff3e00] transition-colors line-clamp-1 mb-2">
                    {food.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-[#27272a] flex justify-between items-center font-mono text-xs">
                  <span className="text-[#ff3e00] font-bold">
                    {isFa
                      ? `${food.calories.toLocaleString("fa-IR")} کالری`
                      : `${food.calories} kcal`}
                  </span>
                  <span className="text-[#9ca3af]">
                    {formatPrice(food.priceToman, food.priceUSD)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ScannerConsoleView;
