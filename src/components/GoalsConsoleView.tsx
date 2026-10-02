import React from "react";
import {
  Coins,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Check,
  Sparkles,
  EyeOff,
  Eye,
  Utensils
} from "lucide-react";
import { UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";

interface GoalsConsoleViewProps {
  userProfile: UserProfile;
  isSyncingRate?: boolean;
  onSaveProfile: (profile: UserProfile) => void;
  onApplyPreset: (preset: "weight-loss" | "muscle" | "keto" | "balanced") => void;
  onSyncExchangeRate?: () => void;
}

export const GoalsConsoleView: React.FC<GoalsConsoleViewProps> = ({
  userProfile,
  isSyncingRate = false,
  onSaveProfile,
  onApplyPreset,
  onSyncExchangeRate
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleUpdate = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    const isGoalField =
      field === "calorieGoal" ||
      field === "proteinGoal" ||
      field === "carbsGoal" ||
      field === "fatGoal";
    onSaveProfile({
      ...userProfile,
      [field]: value,
      ...(isGoalField ? { activePreset: undefined } : {})
    });
  };

  const PRESET_CONFIGS = [
    {
      id: "balanced" as const,
      nameFa: "رژیم متعادل",
      nameEn: "Balanced",
      calories: 2000,
      protein: 80,
      carbs: 250,
      fat: 65,
      subtitleFa: "۲۰۰۰ کالری · ۸۰ گرم پروتئین",
      subtitleEn: "2000 kcal · 80g P",
      macroDetailFa: "کربو ۲۵۰g · چربی ۶۵g",
      macroDetailEn: "250g C · 65g F"
    },
    {
      id: "weight-loss" as const,
      nameFa: "کاهش وزن",
      nameEn: "Weight Loss",
      calories: 1600,
      protein: 90,
      carbs: 180,
      fat: 50,
      subtitleFa: "۱۶۰۰ کالری · ۹۰ گرم پروتئین",
      subtitleEn: "1600 kcal · 90g P",
      macroDetailFa: "کربو ۱۸۰g · چربی ۵۰g",
      macroDetailEn: "180g C · 50g F"
    },
    {
      id: "muscle" as const,
      nameFa: "عضله‌سازی",
      nameEn: "Muscle Gain",
      calories: 2500,
      protein: 140,
      carbs: 300,
      fat: 75,
      subtitleFa: "۲۵۰۰ کالری · ۱۴۰ گرم پروتئین",
      subtitleEn: "2500 kcal · 140g P",
      macroDetailFa: "کربو ۳۰۰g · چربی ۷۵g",
      macroDetailEn: "300g C · 75g F"
    },
    {
      id: "keto" as const,
      nameFa: "کتوژنیک",
      nameEn: "Keto",
      calories: 1800,
      protein: 100,
      carbs: 30,
      fat: 130,
      subtitleFa: "۱۸۰۰ کالری · ۳۰ گرم کربوهیدرات",
      subtitleEn: "1800 kcal · 30g C",
      macroDetailFa: "پروتئین ۱۰۰g · چربی ۱۳۰g",
      macroDetailEn: "100g P · 130g F"
    }
  ];

  const PRICING_TIERS = [
    {
      id: "home" as const,
      nameFa: "پخت خانگی / اقتصادی",
      nameEn: "Home-Cooked / Economy",
      descFa: "محاسبه بر مبنای خرید مواد اولیه خام خانگی (۲۰٪ اقتصادی‌تر)",
      descEn: "Raw grocery ingredient cost baseline (-20%)",
      badge: "0.8×"
    },
    {
      id: "market" as const,
      nameFa: "میانگین بازار روز",
      nameEn: "Standard Market Index",
      descFa: "برآورد استاندارد بر پایه میانگین قیمت روز بازار داخلی ایران",
      descEn: "Standard domestic market average benchmark (Default)",
      badge: "1.0×"
    },
    {
      id: "restaurant" as const,
      nameFa: "رستورانی / بیرون‌بر",
      nameEn: "Restaurant / Dining Out",
      descFa: "محاسبه بر اساس میانگین قیمت منوی رستوران‌ها و کترینگ (+۳۵٪)",
      descEn: "Prepared restaurant & catering menu pricing (+35%)",
      badge: "1.35×"
    }
  ];

  const isPresetActive = (preset: (typeof PRESET_CONFIGS)[number]) => {
    if (userProfile.activePreset === preset.id) {
      return true;
    }
    return (
      userProfile.calorieGoal === preset.calories &&
      userProfile.proteinGoal === preset.protein &&
      userProfile.carbsGoal === preset.carbs &&
      userProfile.fatGoal === preset.fat
    );
  };

  const activePresetConfig = PRESET_CONFIGS.find((p) => isPresetActive(p));
  const currentTier = userProfile.pricingTier || "market";
  const hidePrices = Boolean(userProfile.hidePrices);

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24 sm:pb-28 lg:pb-8">
      {/* HEADER */}
      <div className="border-b border-[#27272a] pb-4">
        <span className="text-xs text-[#ff3e00] font-bold uppercase tracking-wide block">
          {isFa ? "تنظیمات سلامت و اهداف" : "NUTRITION TARGETS & SMART BUDGET"}
        </span>
        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f4f4f5] mt-1">
          {isFa ? "تنظیم اهداف کالری، ماکروها و بودجه هوشمند" : "Configure Goals & Smart Pricing"}
        </h2>
      </div>

      {/* QUICK PRESET SELECTORS */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <h3 className="text-xs text-[#9ca3af] font-bold uppercase tracking-wider block">
            {isFa ? "الگوهای رژیمی آماده" : "Quick Dietary Presets"}
          </h3>
          {activePresetConfig && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff3e00]">
              <Check className="w-3.5 h-3.5 stroke-[3] text-[#ff3e00]" />
              <span>
                {isFa
                  ? `الگوی فعال: ${activePresetConfig.nameFa}`
                  : `Active: ${activePresetConfig.nameEn}`}
              </span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_CONFIGS.map((preset) => {
            const isActive = isPresetActive(preset);
            return (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.id)}
                type="button"
                aria-pressed={isActive}
                className={`min-h-[82px] p-3.5 rounded-lg text-left rtl:text-right transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none relative overflow-hidden ${
                  isActive
                    ? "bg-[#ff3e00]/15 border-2 border-[#ff3e00] ring-2 ring-[#ff3e00]/40"
                    : "bg-[#18191d] border border-[#27272a] hover:border-[#ff3e00]/60 hover:bg-[#1a1c22]"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ff3e00]" />
                )}

                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`font-bold text-sm block ${
                      isActive
                        ? "text-[#ff3e00] font-extrabold"
                        : "text-[#f4f4f5] group-hover:text-[#ff3e00]"
                    }`}
                  >
                    {isFa ? preset.nameFa : preset.nameEn}
                  </span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-extrabold text-black bg-[#ff3e00] px-2 py-0.5 rounded shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>{isFa ? "فعال" : "ACTIVE"}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#71717a] group-hover:text-[#ff3e00] transition-colors shrink-0">
                      {isFa ? "انتخاب" : "Apply"}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs block tabular-nums ${
                    isActive ? "text-[#ffffff] font-bold" : "text-[#9ca3af]"
                  }`}
                >
                  {isFa ? preset.subtitleFa : preset.subtitleEn}
                </span>

                <span
                  className={`text-[11px] mt-1 block font-mono tabular-nums ${
                    isActive ? "text-[#ff784e] font-semibold" : "text-[#71717a]"
                  }`}
                >
                  {isFa ? preset.macroDetailFa : preset.macroDetailEn}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* LIVE DOLLAR RATE IN IRAN & CURRENCY BUDGET */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#18191d] border border-[#27272a] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#ff3e00]/15 text-[#ff3e00] rounded-lg border border-[#ff3e00]/30 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#9ca3af] font-medium block">
                {isFa ? "نرخ لحظه‌ای دلار در ایران (همگام‌سازی خودکار)" : "Live Dollar Price in Iran (Auto-Synced)"}
              </span>
              <div className="font-syne text-xl sm:text-2xl font-extrabold text-[#f4f4f5] font-mono tabular-nums mt-0.5">
                {isFa
                  ? `۱ دلار = ${(userProfile.exchangeRateTomanPerUSD || 230000).toLocaleString("fa-IR")} تومان`
                  : `$1 USD = ${(userProfile.exchangeRateTomanPerUSD || 230000).toLocaleString("en-US")} Tomans`}
              </div>
            </div>
          </div>

          {onSyncExchangeRate && (
            <button
              type="button"
              onClick={onSyncExchangeRate}
              disabled={isSyncingRate}
              className="px-3.5 py-2 bg-[#111214] hover:bg-[#27272a] border border-[#27272a] hover:border-[#ff3e00] text-[#f4f4f5] text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#ff3e00] ${isSyncingRate ? "animate-spin" : ""}`} />
              <span>{isFa ? "به‌روزرسانی نرخ" : "Update Live Rate"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* CURRENCY SELECTOR */}
          <div>
            <label className="text-xs text-[#9ca3af] font-medium block mb-2">
              {isFa ? "واحد پول" : "Currency"}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onSaveProfile({ ...userProfile, currency: "IRT", hidePrices: false });
                }}
                type="button"
                aria-pressed={userProfile.currency === "IRT"}
                className={`min-h-[44px] py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  userProfile.currency === "IRT"
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#18191d] text-[#d4d4d8] border-[#27272a] hover:border-[#ff3e00]"
                }`}
              >
                <Coins className="w-3.5 h-3.5 shrink-0" />
                <span>تومان (IRT)</span>
              </button>

              <button
                onClick={() => {
                  onSaveProfile({ ...userProfile, currency: "USD", hidePrices: false });
                }}
                type="button"
                aria-pressed={userProfile.currency === "USD"}
                className={`min-h-[44px] py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  userProfile.currency === "USD"
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#18191d] text-[#d4d4d8] border-[#27272a] hover:border-[#ff3e00]"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? "دلار (USD)" : "USD ($)"}</span>
              </button>
            </div>
          </div>

          {/* DAILY FOOD BUDGET */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor={
                  userProfile.currency === "IRT"
                    ? "daily-budget-slider-irt"
                    : "daily-budget-slider-usd"
                }
                className="text-xs text-[#9ca3af] font-medium"
              >
                {isFa ? "سقف بودجه روزانه" : "Daily Budget"}
              </label>
              <span className="text-xs text-[#ff3e00] font-bold font-mono tabular-nums">
                {userProfile.currency === "IRT"
                  ? `${(userProfile.dailyBudgetToman ?? 1800000).toLocaleString("fa-IR")} تومان`
                  : `$${userProfile.dailyBudgetUSD ?? 7.8}`}
              </span>
            </div>

            {userProfile.currency === "IRT" ? (
              <input
                key="daily-budget-slider-irt"
                id="daily-budget-slider-irt"
                type="range"
                min="400000"
                max="6000000"
                step="100000"
                aria-label={isFa ? "سقف بودجه روزانه به تومان" : "Daily budget in Toman"}
                value={userProfile.dailyBudgetToman ?? 1800000}
                onChange={(e) => handleUpdate("dailyBudgetToman", Number(e.target.value))}
                className="w-full accent-[#ff3e00] bg-[#27272a] h-2.5 rounded-lg cursor-pointer"
              />
            ) : (
              <input
                key="daily-budget-slider-usd"
                id="daily-budget-slider-usd"
                type="range"
                min="2"
                max="35"
                step="1"
                aria-label={isFa ? "سقف بودجه روزانه به دلار" : "Daily budget in USD"}
                value={userProfile.dailyBudgetUSD ?? 7.8}
                onChange={(e) => handleUpdate("dailyBudgetUSD", Number(e.target.value))}
                className="w-full accent-[#ff3e00] bg-[#27272a] h-2.5 rounded-lg cursor-pointer"
              />
            )}
          </div>
        </div>
      </section>

      {/* MACRONUTRIENT & CALORIE TARGET ADJUSTERS */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
        <h3 className="text-xs text-[#9ca3af] font-bold uppercase tracking-wider block mb-5">
          {isFa ? "اهداف و حدود دریافت روزانه" : "Daily Nutritional Targets"}
        </h3>

        <div className="space-y-6">
          {/* Calorie Goal */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <label htmlFor="cal-slider" className="text-[#f4f4f5] font-medium">
                {isFa ? "هدف کالری روزانه" : "Daily Calorie Target"}
              </label>
              <span className="text-[#ff3e00] font-bold font-mono text-sm tabular-nums">
                {isFa
                  ? `${(userProfile.calorieGoal ?? 2000).toLocaleString("fa-IR")} کالری`
                  : `${userProfile.calorieGoal ?? 2000} kcal`}
              </span>
            </div>
            <input
              id="cal-slider"
              type="range"
              min="1200"
              max="4000"
              step="50"
              aria-label={isFa ? "هدف کالری روزانه" : "Daily calorie target"}
              value={userProfile.calorieGoal ?? 2000}
              onChange={(e) => handleUpdate("calorieGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#27272a] h-2.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Protein Goal */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <label htmlFor="protein-slider" className="text-[#f4f4f5] font-medium">
                {isFa ? "هدف پروتئین روزانه" : "Daily Protein Target"}
              </label>
              <span className="text-[#ff3e00] font-bold font-mono text-sm tabular-nums">
                {isFa
                  ? `${(userProfile.proteinGoal ?? 80).toLocaleString("fa-IR")} گرم`
                  : `${userProfile.proteinGoal ?? 80}g`}
              </span>
            </div>
            <input
              id="protein-slider"
              type="range"
              min="40"
              max="250"
              step="5"
              aria-label={isFa ? "هدف پروتئین روزانه" : "Daily protein target"}
              value={userProfile.proteinGoal ?? 80}
              onChange={(e) => handleUpdate("proteinGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#27272a] h-2.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Carbs Goal */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <label htmlFor="carbs-slider" className="text-[#f4f4f5] font-medium">
                {isFa ? "هدف کربوهیدرات روزانه" : "Daily Carbs Target"}
              </label>
              <span className="text-[#ff3e00] font-bold font-mono text-sm tabular-nums">
                {isFa
                  ? `${(userProfile.carbsGoal ?? 250).toLocaleString("fa-IR")} گرم`
                  : `${userProfile.carbsGoal ?? 250}g`}
              </span>
            </div>
            <input
              id="carbs-slider"
              type="range"
              min="20"
              max="450"
              step="5"
              aria-label={isFa ? "هدف کربوهیدرات روزانه" : "Daily carbs target"}
              value={userProfile.carbsGoal ?? 250}
              onChange={(e) => handleUpdate("carbsGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#27272a] h-2.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fat Goal */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <label htmlFor="fat-slider" className="text-[#f4f4f5] font-medium">
                {isFa ? "هدف چربی سالم روزانه" : "Daily Fat Target"}
              </label>
              <span className="text-[#ff3e00] font-bold font-mono text-sm tabular-nums">
                {isFa
                  ? `${(userProfile.fatGoal ?? 65).toLocaleString("fa-IR")} گرم`
                  : `${userProfile.fatGoal ?? 65}g`}
              </span>
            </div>
            <input
              id="fat-slider"
              type="range"
              min="20"
              max="150"
              step="5"
              aria-label={isFa ? "هدف چربی روزانه" : "Daily fat target"}
              value={userProfile.fatGoal ?? 65}
              onChange={(e) => handleUpdate("fatGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#27272a] h-2.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* BOTTOM CLEARANCE SPACER FOR MOBILE NAV DOCK */}
      <div className="h-12 lg:hidden shrink-0" aria-hidden="true" />
    </div>
  );
};

export default GoalsConsoleView;
