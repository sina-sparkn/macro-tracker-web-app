import React, { useState } from "react";
import {
  Camera,
  Upload,
  AlertTriangle,
  X,
  Plus,
  Check,
  Utensils,
  UtensilsCrossed,
  Activity,
  History,
  Clock,
  Trash2,
  Search,
  Sparkles
} from "lucide-react";
import { ScannedLabel, UserProfile, NotFoodState, ModelsBusyState } from "../types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "../worldFoods";
import { TRANSLATIONS } from "../translations";
import { CyberPresetDish } from "../App";
import { RecommendedDish, getDailyRecommendedDish } from "../recommendedDishes";
import { formatNumber, formatPriceDisplay } from "../utils/formatters";
import { FoodSkeleton } from "./apple/FoodSkeleton";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface ScannerConsoleViewProps {
  userProfile: UserProfile;
  useRealCamera: boolean;
  isScanning: boolean;
  scanError: string | null;
  notFoodState?: NotFoodState | null;
  modelsBusyState?: ModelsBusyState | null;
  onDismissNotFood?: () => void;
  onDismissModelsBusy?: () => void;
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
  onRemoveRecentScan?: (idOrName: string) => void;
}

export const ScannerConsoleView: React.FC<ScannerConsoleViewProps> = ({
  userProfile,
  useRealCamera,
  isScanning,
  scanError,
  notFoodState,
  modelsBusyState,
  onDismissNotFood,
  onDismissModelsBusy,
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
  onRemoveRecentScan
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [worldCategory, setWorldCategory] = useState<string>("all");
  const [isCategorySwitching, setIsCategorySwitching] = useState<boolean>(false);
  const [justLogged, setJustLogged] = useState<boolean>(false);
  const [loggedRecentId, setLoggedRecentId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState<string>("");

  const todayRecommendedDish = getDailyRecommendedDish(new Date(), 0);

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
      setTimeout(() => setJustLogged(false), 2500);
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
      origin: isFa ? todayRecommendedDish.originFa : todayRecommendedDish.originEn,
      servingSize: isFa ? todayRecommendedDish.servingSizeFa : todayRecommendedDish.servingSizeEn,
      ingredients: isFa ? todayRecommendedDish.ingredientsFa : todayRecommendedDish.ingredientsEn,
      summaryFa: todayRecommendedDish.descFa,
      summaryEn: todayRecommendedDish.descEn
    };
    onSelectCyberDish(dishAdapter);
  };

  const handleSelectCategory = (catId: string) => {
    if (catId === worldCategory) return;
    setIsCategorySwitching(true);
    setWorldCategory(catId);
    setTimeout(() => {
      setIsCategorySwitching(false);
    }, 150);
  };

  const filteredRecentScans = recentScans.filter((item) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      (item.brand && item.brand.toLowerCase().includes(q)) ||
      (item.cuisine && item.cuisine.toLowerCase().includes(q))
    );
  });

  const filteredFoods = WORLD_FOODS.filter((food) => {
    if (worldCategory === "all") return true;
    return food.region === worldCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full select-none">
      {/* ====================================================================
          1. SCAN ACTIONS (DOMINANT PRIMARY CTA + SOFT TINTED SECONDARY)
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Dominant Primary "Scan with camera" button */}
          <Button
            size="lg"
            onClick={onStartCamera}
            aria-label={isFa ? "اسکن با دوربین" : "Scan with camera"}
            className="h-14 px-6 text-sm sm:text-base font-semibold shadow-lg rounded-full"
          >
            <Camera className="w-5 h-5 stroke-[2.2]" />
            <span>{isFa ? "اسکن هوشمند با دوربین" : "Scan with Camera"}</span>
          </Button>

          {/* Secondary Soft-Tinted "Upload photo" button */}
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="h-14 px-6 text-sm sm:text-base font-medium shadow-sm rounded-full cursor-pointer"
          >
            <label aria-label={isFa ? "بارگذاری عکس غذا" : "Upload photo"}>
              <Upload className="w-5 h-5 stroke-[2] text-[#ff3b30]" />
              <span>{isFa ? "بارگذاری تصویر غذا" : "Upload Photo"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileUpload}
              />
            </label>
          </Button>
        </div>

        {/* Multi-Model AI Engine Status Indicator */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] text-xs text-[var(--apple-text-secondary)] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[var(--apple-text-primary)] truncate text-xs">
                {isFa
                  ? "موتور اسکن هوش مصنوعی چندمدلی فعال (۱۳+ مدل)"
                  : "Multi-Model AI Scanner Active (13+ Models)"}
              </span>
              <span className="text-[10px] text-[var(--apple-text-tertiary)] truncate">
                {isFa
                  ? "جایگزینی خودکار بین Gemini 2.5 Flash, 2.0 Flash, 1.5 Flash, Pro و Vision جهت بیشترین شانس اسکن موفق"
                  : "Auto-failover across Gemini 2.5 Flash, 2.0 Flash, 1.5 Flash, Pro & Vision models"}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0 border-[var(--apple-border)] font-semibold text-[var(--apple-accent)] bg-black/5 dark:bg-white/5">
            {userProfile.preferredAiModel && userProfile.preferredAiModel !== "auto"
              ? userProfile.preferredAiModel
              : (isFa ? "آبشار خودکار" : "Auto-Cascade")}
          </Badge>
        </div>

        {/* Live Camera Viewfinder Modal / Card */}
        {useRealCamera && (
          <div className="apple-card p-4 overflow-hidden relative aspect-[4/3] max-w-xl mx-auto w-full border-2 border-[var(--apple-accent)] shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* Viewfinder brackets */}
            <div className="absolute inset-8 pointer-events-none z-10">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>

            {/* Live Camera Action Controls */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-3 z-20 px-4">
              <Button
                onClick={onCaptureSnapshot}
                disabled={isScanning}
                aria-label={isFa ? "ثبت تصویر" : "Capture photo"}
                className="px-6 py-3 text-sm shadow-xl rounded-full"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>{isFa ? "ثبت تصویر غذا" : "Capture Photo"}</span>
              </Button>
              <Button
                variant="secondary"
                onClick={onStopCamera}
                aria-label={isFa ? "بستن دوربین" : "Close camera"}
                className="px-4 py-3 text-sm bg-black/60 text-white backdrop-blur-md border-white/20 hover:bg-black/80 rounded-full"
              >
                <X className="w-4 h-4" />
                <span>{isFa ? "بستن" : "Close"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 1: NOT A FOOD ITEM STATE
            ==================================================================== */}
        {notFoodState && (
          <Card className="apple-card border-rose-500/30 bg-rose-500/10 dark:bg-rose-950/25 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
            <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[11px] font-semibold border-rose-500/40 text-rose-600 dark:text-rose-400 mb-1">
                      {t.notFoodBadge}
                    </Badge>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--apple-text-primary)]">
                      {t.notFoodTitle}
                    </h3>
                  </div>
                </div>

                {onDismissNotFood && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismissNotFood}
                    className="rounded-full w-8 h-8 p-0 text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]"
                    aria-label={isFa ? "بستن پیام" : "Dismiss notice"}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[var(--apple-surface-secondary)]/70 rounded-2xl p-3.5 border border-rose-500/15">
                {notFoodState.preview && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-rose-500/30">
                    <img
                      src={notFoodState.preview}
                      alt={notFoodState.detectedObject || "Non-food item"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-rose-900/40 flex items-center justify-center">
                      <UtensilsCrossed className="w-6 h-6 text-white/90 drop-shadow" />
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col gap-1 text-xs sm:text-sm">
                  {notFoodState.detectedObject && (
                    <div className="font-semibold text-[var(--apple-text-primary)] flex items-center gap-1.5 flex-wrap">
                      <span className="text-[var(--apple-text-secondary)] font-normal">
                        {t.detectedObject}:
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs">
                        {notFoodState.detectedObject}
                      </span>
                    </div>
                  )}
                  <p className="text-[var(--apple-text-secondary)] leading-relaxed">
                    {notFoodState.reason}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[var(--apple-text-secondary)]">
                <span>{t.notFoodNotice}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={onStartCamera}
                    className="rounded-full text-xs font-semibold px-4 h-8 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t.scanFoodBtn}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ====================================================================
            STATE 2: MODELS ON HEAVY USAGE STATE
            ==================================================================== */}
        {modelsBusyState && (
          <Card className="apple-card border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/25 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
            <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[11px] font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400 mb-1">
                      {t.modelsBusyBadge}
                    </Badge>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--apple-text-primary)]">
                      {t.modelsBusyTitle}
                    </h3>
                  </div>
                </div>

                {onDismissModelsBusy && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismissModelsBusy}
                    className="rounded-full w-8 h-8 p-0 text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)]"
                    aria-label={isFa ? "بستن پیام" : "Dismiss notice"}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="bg-[var(--apple-surface-secondary)]/70 rounded-2xl p-4 border border-amber-500/15 flex flex-col gap-2">
                <p className="text-xs sm:text-sm text-[var(--apple-text-primary)] font-medium leading-relaxed">
                  {modelsBusyState.message}
                </p>
                <p className="text-[11px] sm:text-xs text-[var(--apple-text-secondary)] leading-relaxed">
                  {t.modelsBusyNotice}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-[var(--apple-text-tertiary)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isFa ? "لطفاً بعداً دوباره امتحان کنید" : "Please try again later"}</span>
                </span>
                {onDismissModelsBusy && (
                  <Button
                    size="sm"
                    onClick={onDismissModelsBusy}
                    className="rounded-full text-xs font-semibold px-4 h-8 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <span>{t.gotItBtn}</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan Error Banner */}
        {scanError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-3"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed">{scanError}</span>
          </div>
        )}
      </section>

      {/* ====================================================================
          2. RESULT CARD (HERO CALORIES, CLEAN STAT TILES, PILL CTA)
          ==================================================================== */}
      <Card className="apple-card border-[var(--apple-border)] relative overflow-hidden">
        <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-semibold text-[#ff3b30] uppercase tracking-wider">
                {isFa ? "غذای برگزیده روز" : "Featured Meal"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--apple-text-primary)]">
                {isFa ? todayRecommendedDish.nameFa : todayRecommendedDish.nameEn}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--apple-text-secondary)]">
                {isFa ? todayRecommendedDish.originFa : todayRecommendedDish.originEn}
              </p>
            </div>

            {/* Hero Calorie Stat */}
            <div className="flex flex-col sm:items-end">
              <span className="text-xs font-medium text-[var(--apple-text-secondary)]">
                {isFa ? "میزان کالری" : "Calories"}
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-[var(--apple-text-primary)] tracking-tight tabular-nums my-0.5">
                {formatNumber(todayRecommendedDish.calories, isFa)}
              </div>
              <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                {isFa ? "کیلوکالری در هر سهم" : "kcal per serving"}
              </span>
            </div>
          </div>

          {/* 3 Clean Macro & Price Stat Tiles with Thin Colored Indicators */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Protein Tile */}
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[var(--apple-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a84ff] shrink-0" />
                <span className="truncate">{isFa ? "پروتئین" : "Protein"}</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-bold text-[var(--apple-text-primary)] tabular-nums truncate">
                {isFa
                  ? `${formatNumber(todayRecommendedDish.protein, true)} گرم`
                  : `${formatNumber(todayRecommendedDish.protein, false)} g`}
              </span>
            </div>

            {/* Carbs Tile */}
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[var(--apple-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] shrink-0" />
                <span className="truncate">{isFa ? "کربوهیدرات" : "Carbs"}</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-bold text-[var(--apple-text-primary)] tabular-nums truncate">
                {isFa
                  ? `${formatNumber(todayRecommendedDish.carbs, true)} گرم`
                  : `${formatNumber(todayRecommendedDish.carbs, false)} g`}
              </span>
            </div>

            {/* Price Tile */}
            <div className="p-2 sm:p-3.5 rounded-2xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[var(--apple-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] shrink-0" />
                <span className="truncate">{isFa ? "برآورد هزینه" : "Est. Cost"}</span>
              </div>
              <span className="text-[10.5px] sm:text-xs md:text-sm font-bold text-[var(--apple-text-primary)] tabular-nums leading-tight">
                {formatPriceDisplay(todayRecommendedDish.priceToman, todayRecommendedDish.priceUSD, userProfile)}
              </span>
            </div>
          </div>

          {/* Action Buttons: Full-width Primary Pill + Secondary Ghost */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleLogRecommended}
              aria-label={isFa ? "ثبت این وعده در یادداشت روزانه" : "Add this meal to food log"}
              className={`flex-1 w-full py-3.5 text-sm font-semibold rounded-full transition-all ${
                justLogged ? "!bg-emerald-500 !shadow-emerald-500/30" : ""
              }`}
            >
              {justLogged ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isFa ? "در یادداشت ثبت شد" : "Added to Log"}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{isFa ? "ثبت در یادداشت روزانه" : "Add to Log"}</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleOpenRecommendedDetails}
              aria-label={isFa ? "مشاهده جزئیات ارزش غذایی" : "View meal details"}
              className="w-full sm:w-auto px-5 py-3.5 text-sm rounded-full"
            >
              <Utensils className="w-4 h-4 text-[#ff3b30]" />
              <span>{isFa ? "مشاهده جزئیات" : "Details"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ====================================================================
          3. RECENT SCAN HISTORY (IF ANY)
          ==================================================================== */}
      {recentScans.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--apple-text-secondary)]" />
              <h3 className="text-sm sm:text-base font-semibold text-[var(--apple-text-primary)]">
                {isFa ? "تاریخچه اسکن‌ها" : "Scan History"}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--apple-surface-secondary)] text-[var(--apple-text-secondary)] font-medium tabular-nums">
                {formatNumber(recentScans.length, isFa)}
              </span>
            </div>
          </div>

          {/* Search if >= 3 items */}
          {recentScans.length >= 3 && (
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--apple-text-tertiary)] absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder={isFa ? "جستجو در اسکن‌های اخیر..." : "Search recent scans..."}
                className="h-10 rounded-full pl-10 pr-10 rtl:pl-10 rtl:pr-10 text-xs bg-[var(--apple-surface)] border-[var(--apple-border)] text-[var(--apple-text-primary)] placeholder-[var(--apple-text-tertiary)]"
              />
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredRecentScans.map((item) => {
              const id = item.id || item.productName;
              const isItemLogged = loggedRecentId === id;
              return (
                <Card
                  key={id}
                  className="apple-card apple-card-interactive p-4 flex flex-col justify-between gap-3 border-[var(--apple-border)]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px] text-[var(--apple-text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.scannedAt || (isFa ? "امروز" : "Today")}</span>
                      </span>
                      {item.cuisine && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--apple-surface-secondary)] text-[var(--apple-text-secondary)] text-[10px]">
                          {item.cuisine}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-[var(--apple-text-primary)] line-clamp-1 mt-1">
                      {item.productName}
                    </h4>
                    <span className="text-xs text-[var(--apple-text-secondary)]">
                      {item.brand || (isFa ? "وعده غذایی" : "Meal")}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--apple-border)] flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--apple-text-primary)] tabular-nums">
                      {isFa
                        ? `${formatNumber(item.calories, true)} کالری`
                        : `${formatNumber(item.calories, false)} kcal`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleQuickLogRecent(item)}
                        aria-label={isFa ? "ثبت سریع در یادداشت" : "Quick log"}
                        className={`h-8 px-3 rounded-full text-xs font-medium gap-1 ${
                          isItemLogged
                            ? "!bg-emerald-500 text-white"
                            : ""
                        }`}
                      >
                        {isItemLogged ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>{isItemLogged ? (isFa ? "ثبت شد" : "Added") : (isFa ? "ثبت" : "Log")}</span>
                      </Button>

                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onSelectRecentScan(item)}
                        aria-label={isFa ? "جزئیات" : "Details"}
                        className="w-8 h-8 rounded-full"
                      >
                        <Utensils className="w-3.5 h-3.5 text-[#ff3b30]" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          4. SUGGESTED FOODS (SEGMENTED PILL FILTERS, QUALITY BADGES A/B)
          ==================================================================== */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--apple-text-primary)]">
            {isFa ? "غذاهای پیشنهادی" : "Suggested Foods"}
          </h3>

          {/* Segmented / Scrollable Pill Filter */}
          <div className="apple-segmented-container overflow-x-auto max-w-full py-1">
            {[
              { id: "all", labelFa: "همه", labelEn: "All" },
              { id: "Persian", labelFa: "ایرانی", labelEn: "Persian" },
              { id: "Middle East", labelFa: "خاورمیانه", labelEn: "Middle East" },
              { id: "Asia", labelFa: "آسیا", labelEn: "Asia" },
              { id: "Europe", labelFa: "اروپا", labelEn: "Europe" },
              { id: "Americas", labelFa: "آمریکا", labelEn: "Americas" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                type="button"
                className={`apple-segmented-item whitespace-nowrap text-xs ${
                  worldCategory === cat.id ? "apple-segmented-item-active" : ""
                }`}
              >
                {isFa ? cat.labelFa : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Food Cards Grid or Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {isCategorySwitching ? (
            Array.from({ length: 6 }).map((_, idx) => <FoodSkeleton key={idx} />)
          ) : (
            filteredFoods.map((rawFood) => {
              const food = getLocalizedWorldFood(rawFood, currentLang);
              const isGradeA = food.healthScore >= 80;
              return (
                <Card
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
                  aria-label={food.name}
                  className="apple-card apple-card-interactive p-4.5 flex flex-col justify-between gap-3 cursor-pointer group border-[var(--apple-border)]"
                >
                  {/* Line 1: Badge + Origin + Name */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      {/* Quality Badge (A = Green pill, B = Amber pill) using shadcn Badge */}
                      <Badge
                        variant={isGradeA ? "success" : "carbs"}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {isGradeA ? "A" : "B"}
                      </Badge>
                      <span className="text-[11px] text-[var(--apple-text-tertiary)] truncate max-w-[140px]">
                        {food.origin}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-[var(--apple-text-primary)] group-hover:text-[#ff3b30] transition-colors line-clamp-1">
                      {food.name}
                    </h4>
                  </div>

                  {/* Line 2: Calories & Price on Clean Two-Line Layout */}
                  <div className="pt-2.5 border-t border-[var(--apple-border)] flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--apple-text-primary)] tabular-nums">
                      {isFa
                        ? `${formatNumber(food.calories, true)} کالری`
                        : `${formatNumber(food.calories, false)} kcal`}
                    </span>
                    <span className="text-[var(--apple-text-secondary)] font-medium tabular-nums">
                      {formatPriceDisplay(food.priceToman, food.priceUSD, userProfile)}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default ScannerConsoleView;
