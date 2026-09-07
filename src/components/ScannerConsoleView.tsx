import React, { useState } from "react";
import { Camera, Upload, Sparkles, AlertTriangle, X, ChevronRight, Utensils, RefreshCw } from "lucide-react";
import { ScannedLabel, UserProfile } from "../types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "../worldFoods";
import { TRANSLATIONS } from "../translations";
import { CYBER_PRESET_DISHES, CyberPresetDish } from "../App";

interface ScannerConsoleViewProps {
  userProfile: UserProfile;
  useRealCamera: boolean;
  isScanning: boolean;
  scanError: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCaptureSnapshot: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectCyberDish: (dish: CyberPresetDish) => void;
  onSelectWorldFood: (food: WorldFood) => void;
}

export const ScannerConsoleView: React.FC<ScannerConsoleViewProps> = ({
  userProfile,
  useRealCamera,
  isScanning,
  scanError,
  videoRef,
  onStartCamera,
  onStopCamera,
  onCaptureSnapshot,
  onFileUpload,
  onSelectCyberDish,
  onSelectWorldFood
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [worldCategory, setWorldCategory] = useState<string>("all");

  const formatPrice = (toman: number, usd: number) => {
    if (userProfile.currency === "IRT") {
      return `${toman.toLocaleString("fa-IR")} تومان`;
    }
    return `$${usd.toFixed(2)}`;
  };

  const filteredFoods = WORLD_FOODS.filter((food) => {
    if (worldCategory === "all") return true;
    return food.region === worldCategory;
  });

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* HERO SECTION - CYBER DATA CONSOLE */}
      <section className="bg-[#111214] border border-[#2a2c31] p-5 sm:p-8 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-[#ff3e00] font-mono text-[11px] mb-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#ff3e00]" />
              <span>{isFa ? "آرایه حسگرها // بینایی هوشمند تغذیه" : "SENSOR_ARRAY // NUTRITIONAL_VISION"}</span>
            </div>
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#e0e0e0] uppercase tracking-tight">
              {isFa ? "اسکن برچسب یا بشـقاب غذا" : "SCAN PLATE OR DISH"}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#707070]">
            <span>{isFa ? "دقت پردازش تصویر: ۹۹.۴٪" : "OCR_CONFIDENCE: 99.4%"}</span>
            <span>|</span>
            <span className="text-[#ff3e00]">{isFa ? "بینایی هوش مصنوعی فعال" : "GEMINI_VISION_READY"}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#707070] leading-relaxed max-w-3xl mb-6">
          {isFa
            ? "از بشقاب غذا یا جدول ارزش غذایی عکس بگیرید تا کالری، ماکروها، قیمت تخمینی هر پرس و تفکیک هزینه مواد اولیه محاسبه شود."
            : "Capture an image of your cooked meal or packaged nutrition facts table to parse calories, macronutrients, estimated portion cost, and wholesale ingredient breakdown."}
        </p>

        {/* COMMAND LINE ACTIONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartCamera}
            className="btn-cmd cursor-pointer flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>{isFa ? "روشن کردن دوربین" : "START_CAMERA"}</span>
          </button>

          <label className="btn-cmd-dim cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>{isFa ? "بارگذاری عکس" : "UPLOAD_FILE"}</span>
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
          <div className="mt-6 border-2 border-[#ff3e00] bg-black relative aspect-[4/3] max-w-xl mx-auto overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* LASER SCANNING LINE */}
            <div className="absolute inset-x-0 h-0.5 bg-[#ff3e00] shadow-[0_0_12px_#ff3e00] z-20 animate-[bounce_2s_infinite] opacity-90" />
            
            {/* CORNER TARGET BRACKETS */}
            <div className="absolute inset-8 pointer-events-none z-20">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#ff3e00]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#ff3e00]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#ff3e00]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff3e00]" />
            </div>

            {/* LIVE CAMERA CONTROLS */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-3 z-30 px-4">
              <button
                onClick={onCaptureSnapshot}
                disabled={isScanning}
                className="btn-cmd cursor-pointer px-5 py-2.5 flex items-center gap-2 font-mono text-xs"
              >
                <Camera className="w-4 h-4" />
                <span>{isFa ? "ثبت تصویر" : "CAPTURE_SAMPLE"}</span>
              </button>
              <button
                onClick={onStopCamera}
                className="btn-cmd-dim cursor-pointer px-4 py-2.5 flex items-center gap-1.5 font-mono text-xs"
              >
                <X className="w-4 h-4" />
                <span>{isFa ? "بستن دوربین" : "ABORT"}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCAN ERROR BANNER */}
        {scanError && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}
      </section>

      {/* 4-CELL DATA GRID (CYBER CONSOLE SPEC) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-[#707070] uppercase tracking-wider">
            {isFa ? "نمونه‌های آماده ثبت سریع // پایگاه داده" : "PRESET_DATA_INDEX // FAST_LOG_SAMPLES"}
          </span>
          <span className="font-mono text-[10px] text-[#ff3e00]">
            {isFa ? "۴ نمونه فعال" : "4 SAMPLES ACTIVE"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CYBER_PRESET_DISHES.map((dish) => (
            <div
              key={dish.refId}
              onClick={() => onSelectCyberDish(dish)}
              className="bg-[#111214] border border-[#2a2c31] hover:border-[#ff3e00] p-4 sm:p-5 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-[10px] text-[#ff3e00] font-bold tracking-wider">
                  {dish.refId}
                </span>
                <span className="font-mono text-[10px] text-[#707070] group-hover:text-[#ff3e00] transition-colors flex items-center gap-1">
                  {isFa ? "مشاهده جزئیات" : "VIEW_DETAILS"} <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <h3 className="font-syne sm:font-vazirmatn text-base sm:text-lg font-bold text-[#e0e0e0] group-hover:text-white transition-colors mb-2">
                {isFa ? dish.nameFa : dish.nameEn}
              </h3>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#2a2c31]">
                <span className="text-[#ff3e00] font-bold">
                  {isFa ? `${dish.calories.toLocaleString("fa-IR")} کالری` : `${dish.calories} KCAL`}
                </span>
                <span className="text-[#707070]">
                  {formatPrice(dish.priceToman, dish.priceUSD)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORLD RECIPES DISCOVERY REPOSITORY */}
      <section className="mt-4 pt-6 border-t border-[#2a2c31]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="font-mono text-[10px] text-[#ff3e00] tracking-widest uppercase block">
              {isFa ? "آرشیو بین‌المللی غذاها و فرهنگ تغذیه" : "GLOBAL_CULINARY_ARCHIVE"}
            </span>
            <h3 className="font-syne text-xl font-bold text-[#e0e0e0] mt-0.5">
              {isFa ? "بانک داده غذاهای برگزیده ملل" : "GLOBAL NUTRITION DIRECTORY"}
            </h3>
          </div>

          {/* CATEGORY SELECTOR CHIPS */}
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
            {[
              { id: "all", labelEn: "ALL", labelFa: "همه" },
              { id: "Persian", labelEn: "PERSIAN", labelFa: "ایرانی" },
              { id: "Middle East", labelEn: "MIDDLE EAST", labelFa: "خاورمیانه" },
              { id: "Asia", labelEn: "ASIA", labelFa: "آسیا" },
              { id: "Europe", labelEn: "EUROPE", labelFa: "اروپا" },
              { id: "Americas", labelEn: "AMERICAS", labelFa: "آمریکا" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setWorldCategory(cat.id)}
                className={`px-2.5 py-1 uppercase transition-colors cursor-pointer border ${
                  worldCategory === cat.id
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#111214] text-[#707070] border-[#2a2c31] hover:text-[#e0e0e0]"
                }`}
              >
                {isFa ? cat.labelFa : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFoods.map((rawFood) => {
            const food = getLocalizedWorldFood(rawFood, currentLang);
            return (
              <div
                key={food.id}
                onClick={() => onSelectWorldFood(rawFood)}
                className="bg-[#111214] border border-[#2a2c31] hover:border-[#ff3e00] p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#707070] mb-1.5">
                    <span>{food.origin}</span>
                    <span className="text-[#ff3e00] font-bold">{food.healthRatingLabel}</span>
                  </div>

                  <h4 className="font-syne sm:font-vazirmatn text-sm font-bold text-[#e0e0e0] group-hover:text-white transition-colors line-clamp-1 mb-1">
                    {food.name}
                  </h4>

                  <p className="text-[11px] text-[#707070] line-clamp-2 leading-relaxed mb-3">
                    {food.summary}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#2a2c31] flex justify-between items-center font-mono text-[11px]">
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
