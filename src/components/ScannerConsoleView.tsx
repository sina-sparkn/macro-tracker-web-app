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
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full pb-6 sm:pb-8 lg:pb-6">
      {/* SCAN ACTION BAR */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onStartCamera}
            type="button"
            aria-label={isFa ? "اسکن با دوربین" : "Scan with Camera"}
            className="btn-cmd cursor-pointer py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2.5 rounded-lg shadow-sm"
          >
            <Camera className="w-5 h-5" />
            <span>{isFa ? "اسکن با دوربین" : "Scan with Camera"}</span>
          </button>

          <label
            aria-label={isFa ? "بارگذاری عکس" : "Upload Photo"}
            className="btn-cmd-dim cursor-pointer py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2.5 rounded-lg border-[#3f3f46] hover:border-[#ff3e00]"
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

            <button
              onClick={() => setDailyDishOffset((prev) => prev + 1)}
              type="button"
              aria-label={isFa ? "پیشنهاد بعدی" : "Next dish"}
              className="px-2.5 py-1 text-xs text-[#9ca3af] hover:text-[#f4f4f5] bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#ff3e00]" />
              <span className="font-mono text-xs">{isFa ? "بعدی" : "Next"}</span>
            </button>
          </div>

          {/* TITLE & ORIGIN */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h3 className="font-syne sm:font-vazirmatn text-base sm:text-lg font-bold text-[#ffffff] break-words">
              {isFa ? todayRecommendedDish.nameFa : todayRecommendedDish.nameEn}
            </h3>
            <span className="text-xs font-mono text-[#9ca3af]">
              {isFa ? todayRecommendedDish.originFa : todayRecommendedDish.originEn}
            </span>
          </div>

          {/* NUTRITION METRICS GRID */}
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
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogRecommended}
              type="button"
              aria-label={isFa ? "ثبت این غذا در یادداشت روزانه" : "Add this meal to daily log"}
              className={`btn-cmd cursor-pointer px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
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
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isFa ? "افزودن به دفترچه" : "Add to Diary"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenRecommendedDetails}
              type="button"
              aria-label={isFa ? "مشاهده جزئیات" : "View details"}
              className="btn-cmd-dim cursor-pointer px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
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
              const item = normalizeScannedLabel(rawItem, isFa ? "fa" : "en", currentRate);
              const itemToman = item.estimatedPrice?.amountToman;
              const itemUSD = item.estimatedPrice?.amountUSD;
              const itemId = item.id || `${item.productName}-${idx}`;
              const isItemLogged = loggedRecentId === itemId || loggedRecentId === item.productName;

              return (
                <div
                  key={itemId}
                  className="bg-[#18191d] border border-[#27272a] hover:border-[#ff3e00]/60 rounded-lg p-3.5 transition-all"
                >
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickLogRecent(item)}
                      type="button"
                      aria-label={isFa ? `ثبت مجدد ${item.productName}` : `Re-log ${item.productName}`}
                      className={`py-1.5 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
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
                          <span>{isFa ? "ثبت مجدد" : "Re-log"}</span>
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
                aria-label={isFa ? `انتخاب ${food.name}` : `Select ${food.name}`}
                className="bg-[#111214] border border-[#27272a] hover:border-[#ff3e00] rounded-lg p-3 transition-all cursor-pointer group flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none"
              >
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-[#9ca3af] mb-1">
                    <span>{food.origin}</span>
                    <span className="text-[#ff3e00] font-bold">{food.healthRatingLabel}</span>
                  </div>

                  <h4 className="font-syne sm:font-vazirmatn text-sm font-bold text-[#f4f4f5] group-hover:text-[#ff3e00] transition-colors line-clamp-1 mb-2">
                    {food.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-[#27272a] flex justify-between items-center font-mono text-xs">
                  <span className="text-[#ff3e00] font-bold">
                    {isFa ? `${food.calories.toLocaleString("fa-IR")} کالری` : `${food.calories} kcal`}
                  </span>
                  <span className="text-[#9ca3af]">{formatPrice(food.priceToman, food.priceUSD)}</span>
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
