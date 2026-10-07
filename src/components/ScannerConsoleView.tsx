import React, { useState } from "react";
import { Camera, Upload, Sparkles, AlertTriangle, X, ChevronRight, Utensils, Check, Plus, Info, History, Clock, Trash2, RefreshCw, Calendar } from "lucide-react";
import { ScannedLabel, UserProfile } from "../types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "../worldFoods";
import { TRANSLATIONS } from "../translations";
import { CYBER_PRESET_DISHES, CyberPresetDish } from "../App";
import { RecommendedDish, getDailyRecommendedDish, getDailyFormattedDate } from "../recommendedDishes";
import { normalizeScannedLabel, formatSmartPrice } from "../utils/dishLocalization";

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
  onClearRecentScans
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [worldCategory, setWorldCategory] = useState<string>("all");
  const [justLogged, setJustLogged] = useState<boolean>(false);
  const [loggedRecentId, setLoggedRecentId] = useState<string | null>(null);
  const [dailyDishOffset, setDailyDishOffset] = useState<number>(0);

  const todayRecommendedDish = getDailyRecommendedDish(new Date(), dailyDishOffset);
  const todayDateLabel = getDailyFormattedDate(new Date(), isFa ? "fa" : "en");

  const currentRate = userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0
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
      origin: isFa ? todayRecommendedDish.originFa : todayRecommendedDish.originEn,
      servingSize: isFa ? todayRecommendedDish.servingSizeFa : todayRecommendedDish.servingSizeEn,
      ingredients: isFa ? todayRecommendedDish.ingredientsFa : todayRecommendedDish.ingredientsEn,
      summaryFa: todayRecommendedDish.descFa,
      summaryEn: todayRecommendedDish.descEn
    };
    onSelectCyberDish(dishAdapter);
  };

  const filteredFoods = WORLD_FOODS.filter((food) => {
    if (worldCategory === "all") return true;
    return food.region === worldCategory;
  });

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-20 lg:pb-8 relative z-10">
      {/* SCAN ACTION BAR (CYBER DATA CONSOLE) */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            onClick={onStartCamera}
            type="button"
            aria-label={isFa ? "اسکن با دوربین" : "Scan with Camera"}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-lg text-sm font-bold bg-[#ff3e00] hover:bg-[#ff5722] text-black border border-[#ff3e00] transition-colors cursor-pointer shadow-md"
          >
            <Camera className="w-5 h-5 stroke-[2.4]" />
            <span className="font-mono tracking-wide">{isFa ? "اسکن با دوربین" : "SCAN WITH CAMERA"}</span>
          </button>

          <label
            aria-label={isFa ? "بارگذاری عکس" : "Upload Photo"}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-lg text-sm font-bold bg-[#18191d] hover:bg-[#23252a] text-[#e0e0e0] border border-[#2a2c31] hover:border-[#ff3e00] transition-colors cursor-pointer shadow-md"
          >
            <Upload className="w-5 h-5 stroke-[2.4] text-[#ff3e00]" />
            <span className="font-mono tracking-wide">{isFa ? "بارگذاری عکس" : "UPLOAD FOOD PHOTO"}</span>
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
          <div className="mt-5 border-2 border-[#ff3e00] bg-black rounded-xl relative aspect-[4/3] max-w-xl mx-auto overflow-hidden shadow-2xl">
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
                className="bg-[#ff3e00] hover:bg-[#ff5722] text-black cursor-pointer px-6 py-3 flex items-center gap-2 text-sm font-bold rounded-lg shadow-lg font-mono"
              >
                <Camera className="w-5 h-5" />
                <span>{isFa ? "ثبت تصویر" : "CAPTURE PHOTO"}</span>
              </button>
              <button
                onClick={onStopCamera}
                type="button"
                aria-label={isFa ? "بستن دوربین" : "Close camera"}
                className="bg-[#18191d] hover:bg-[#27272a] text-[#e0e0e0] border border-[#2a2c31] cursor-pointer px-4 py-3 flex items-center gap-2 text-sm rounded-lg"
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
            className="mt-3 p-3.5 bg-red-950/60 border border-red-700/80 text-red-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="leading-snug">{scanError}</span>
            </div>
            <button
              type="button"
              onClick={handleOpenRecommendedDetails}
              className="shrink-0 px-3 py-1.5 bg-red-900/60 hover:bg-red-800 border border-red-600/70 text-white rounded-md text-xs font-medium cursor-pointer transition-colors"
            >
              {isFa ? "مشاهده تحلیل نمونه" : "View Sample Analysis"}
            </button>
          </div>
        )}
      </section>

      {/* FEATURED MEAL CARD (CYBER CONSOLE ARCHITECTURE) */}
      <section className="bg-[#111214] border border-[#2a2c31] rounded-xl p-5 sm:p-6 relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute top-3 left-4 font-mono text-4xl sm:text-5xl font-black text-white/[0.02] pointer-events-none select-none">
          REC_TODAY
        </div>

        <div className="relative z-10">
          {/* HEADER & CALORIE BADGE */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="meta text-[#ff3e00]">{isFa ? "پیشنهاد_امروز" : "PICKS OF THE DAY"}</span>
                <button
                  onClick={() => setDailyDishOffset((prev) => prev + 1)}
                  type="button"
                  aria-label={isFa ? "پیشنهاد بعدی" : "Next dish"}
                  className="px-2.5 py-1 text-xs text-[#707070] hover:text-[#e0e0e0] bg-[#18191d] hover:bg-[#23252a] border border-[#2a2c31] hover:border-[#ff3e00] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#ff3e00]" />
                  <span className="font-mono text-xs">{isFa ? "بعدی" : "Next"}</span>
                </button>
              </div>

              <h3 className="font-black text-xl sm:text-2xl text-[#e0e0e0] my-1.5 leading-snug break-words">
                {isFa ? todayRecommendedDish.nameFa : todayRecommendedDish.nameEn}
              </h3>
              <p className="text-[#707070] text-xs sm:text-sm font-sans">
                {isFa ? todayRecommendedDish.originFa : todayRecommendedDish.originEn}
              </p>
            </div>

            {/* CALORIE BOX */}
            <div className="text-center bg-[#0e1013] px-3.5 py-2.5 rounded-lg border border-[#2a2c31] shrink-0">
              <div className="meta text-[9px]">{isFa ? "کالری" : "Calories"}</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#ff3e00] font-mono mt-0.5 tabular-nums">
                {isFa ? todayRecommendedDish.calories.toLocaleString("fa-IR") : todayRecommendedDish.calories}
              </div>
            </div>
          </div>

          {/* MACRO INDICATOR BARS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 font-mono text-xs">
            <div className="border-r-2 rtl:border-r-0 rtl:border-l-2 border-[#3b82f6] pr-2.5 rtl:pr-0 rtl:pl-2.5 min-w-0">
              <span className="meta text-[9px] block text-[#707070]">{isFa ? "پروتئین" : "Protein"}</span>
              <span className="font-bold text-sm sm:text-base text-[#e0e0e0] mt-0.5 block truncate tabular-nums">
                {todayRecommendedDish.protein}g
              </span>
            </div>

            <div className="border-r-2 rtl:border-r-0 rtl:border-l-2 border-[#eab308] pr-2.5 rtl:pr-0 rtl:pl-2.5 min-w-0">
              <span className="meta text-[9px] block text-[#707070]">{isFa ? "کربوهیدرات" : "Carbs"}</span>
              <span className="font-bold text-sm sm:text-base text-[#e0e0e0] mt-0.5 block truncate tabular-nums">
                {todayRecommendedDish.carbs}g
              </span>
            </div>

            <div className="border-r-2 rtl:border-r-0 rtl:border-l-2 border-[#707070] pr-2.5 rtl:pr-0 rtl:pl-2.5 min-w-0">
              <span className="meta text-[9px] block text-[#707070]">{isFa ? "هزینه" : "Price"}</span>
              <span className="font-bold text-xs sm:text-sm text-[#e0e0e0] mt-0.5 block truncate tabular-nums">
                {formatPrice(todayRecommendedDish.priceToman, todayRecommendedDish.priceUSD)}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              onClick={handleLogRecommended}
              type="button"
              aria-label={isFa ? "ثبت این غذا در یادداشت روزانه" : "Add this meal to daily log"}
              className={`bg-[#ff3e00] hover:bg-[#ff5722] text-black cursor-pointer px-5 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all flex-1 ${
                justLogged ? "!bg-emerald-500 !text-black" : ""
              }`}
            >
              {justLogged ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isFa ? "ثبت شد ✓" : "Logged ✓"}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{isFa ? "ثبت در یادداشت" : "Log to Diary"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenRecommendedDetails}
              type="button"
              aria-label={isFa ? "مشاهده جزئیات" : "View details"}
              className="bg-[#18191d] hover:bg-[#23252a] border border-[#2a2c31] hover:border-[#ff3e00] text-[#e0e0e0] cursor-pointer px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Utensils className="w-4 h-4 text-[#ff3e00]" />
              <span>{isFa ? "جزئیات" : "Details"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SUGGESTED FOODS CATALOG (CYBER CONSOLE ARCHITECTURE) */}
      <section className="mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <h2 className="meta text-xs sm:text-sm text-[#707070]">
            {isFa ? "غذاهای_پیشنهادی" : "Suggested_Foods"}
          </h2>

          {/* CATEGORY SELECTOR CHIPS */}
          <div className="flex flex-wrap gap-1 text-xs">
            {[
              { id: "all", labelEn: "All", labelFa: "همه" },
              { id: "Persian", labelEn: "Persian", labelFa: "ایرانی" },
              { id: "Middle East", labelEn: "Middle East", labelFa: "خاورمیانه" },
              { id: "Asia", labelEn: "Asia", labelFa: "آسیا" },
              { id: "Europe", labelEn: "Europe", labelFa: "اروپا" },
              { id: "Americas", labelEn: "Americas", labelFa: "آمریکا" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setWorldCategory(cat.id)}
                type="button"
                aria-pressed={worldCategory === cat.id}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer border text-xs font-medium font-mono ${
                  worldCategory === cat.id
                    ? "bg-[#ff3e00] text-black border-[#ff3e00] font-bold"
                    : "bg-[#111214] text-[#707070] border-[#2a2c31] hover:border-[#ff3e00] hover:text-[#e0e0e0]"
                }`}
              >
                {isFa ? cat.labelFa : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                aria-label={isFa ? `انتخاب ${food.name}` : `Select ${food.name}`}
                className="bg-[#111214] border border-[#2a2c31] hover:border-[#ff3e00] rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                    <span className="text-[#22c55e] font-bold tracking-wider">
                      {food.healthRatingLabel || "A - EXCELLENT"}
                    </span>
                    <span className="meta text-[9px]">{food.origin}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#e0e0e0] group-hover:text-[#ff3e00] transition-colors line-clamp-1 mb-2">
                    {food.name}
                  </h4>
                </div>

                <div className="pt-2.5 border-t border-[#2a2c31] flex justify-between items-center font-mono text-xs">
                  <span className="text-[#ff3e00] font-bold">
                    {isFa ? `${food.calories.toLocaleString("fa-IR")} کالری` : `${food.calories} KCAL`}
                  </span>
                  <span className="text-[#707070]">{formatPrice(food.priceToman, food.priceUSD)}</span>
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
