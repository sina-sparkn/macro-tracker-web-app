import React from "react";
import { Sliders, Activity, Coins, DollarSign, Target, ShieldCheck, ArrowRightLeft, RefreshCw, TrendingUp, Check } from "lucide-react";
import { UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";

interface GoalsConsoleViewProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onApplyPreset: (preset: "weight-loss" | "muscle" | "keto" | "balanced") => void;
}

export const GoalsConsoleView: React.FC<GoalsConsoleViewProps> = ({
  userProfile,
  onSaveProfile,
  onApplyPreset
}) => {
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleUpdate = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    const isGoalField = field === "calorieGoal" || field === "proteinGoal" || field === "carbsGoal" || field === "fatGoal";
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
      subtitleFa: "۲۰۰۰ کالری • ۸۰ گرم پروتئین",
      subtitleEn: "2000 kcal • 80g P",
      macroDetailFa: "کربو ۲۵۰g • چربی ۶۵g",
      macroDetailEn: "250g C • 65g F"
    },
    {
      id: "weight-loss" as const,
      nameFa: "کاهش وزن",
      nameEn: "Weight Loss",
      calories: 1600,
      protein: 90,
      carbs: 180,
      fat: 50,
      subtitleFa: "۱۶۰۰ کالری • ۹۰ گرم پروتئین",
      subtitleEn: "1600 kcal • 90g P",
      macroDetailFa: "کربو ۱۸۰g • چربی ۵۰g",
      macroDetailEn: "180g C • 50g F"
    },
    {
      id: "muscle" as const,
      nameFa: "عضله‌سازی",
      nameEn: "Muscle Gain",
      calories: 2500,
      protein: 140,
      carbs: 300,
      fat: 75,
      subtitleFa: "۲۵۰۰ کالری • ۱۴۰ گرم پروتئین",
      subtitleEn: "2500 kcal • 140g P",
      macroDetailFa: "کربو ۳۰۰g • چربی ۷۵g",
      macroDetailEn: "300g C • 75g F"
    },
    {
      id: "keto" as const,
      nameFa: "کتوژنیک",
      nameEn: "Keto",
      calories: 1800,
      protein: 100,
      carbs: 30,
      fat: 130,
      subtitleFa: "۱۸۰۰ کالری • ۳۰ گرم کربوهیدرات",
      subtitleEn: "1800 kcal • 30g C",
      macroDetailFa: "پروتئین ۱۰۰g • چربی ۱۳۰g",
      macroDetailEn: "100g P • 130g F"
    }
  ];

  const isPresetActive = (preset: typeof PRESET_CONFIGS[number]) => {
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

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24 sm:pb-28 lg:pb-8">
      {/* HEADER */}
      <div className="border-b border-[#27272a] pb-4">
        <span className="text-xs text-[#ff3e00] font-bold uppercase tracking-wide block">
          {isFa ? "تنظیمات سلامت و اهداف" : "NUTRITION TARGETS & BUDGET"}
        </span>
        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f4f4f5] mt-1">
          {isFa ? "تنظیم اهداف کالری، ماکروها و بودجه" : "Configure Goals & Budget"}
        </h2>
      </div>

      {/* QUICK PRESET SELECTORS */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <h3 className="text-xs text-[#9ca3af] font-bold uppercase tracking-wider block">
            {isFa ? "الگوهای رژیمی آماده" : "Quick Dietary Presets"}
          </h3>
          {activePresetConfig && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff3e00] bg-[#ff3e00]/10 border border-[#ff3e00]/30 px-2 py-0.5 rounded">
              <Check className="w-3 h-3 stroke-[3]" />
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
                className={`min-h-[76px] p-3.5 rounded-lg text-left rtl:text-right transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-b from-[#ff3e00]/15 to-[#18191d] border-2 border-[#ff3e00] shadow-[0_0_16px_rgba(255,62,0,0.18)]"
                    : "bg-[#18191d] border border-[#27272a] hover:border-[#ff3e00]/60 hover:bg-[#1a1c22]"
                }`}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff3e00]" />
                )}

                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`font-bold text-sm block ${
                      isActive ? "text-[#ff3e00]" : "text-[#f4f4f5] group-hover:text-[#ff3e00]"
                    }`}
                  >
                    {isFa ? preset.nameFa : preset.nameEn}
                  </span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-[#08090a] bg-[#ff3e00] px-1.5 py-0.5 rounded shadow-sm shrink-0">
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
                  className={`text-xs block ${
                    isActive ? "text-[#f4f4f5] font-semibold" : "text-[#9ca3af]"
                  }`}
                >
                  {isFa ? preset.subtitleFa : preset.subtitleEn}
                </span>

                <span className="text-[11px] text-[#71717a] mt-1 block font-mono">
                  {isFa ? preset.macroDetailFa : preset.macroDetailEn}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CURRENCY & FOOD BUDGET SETTINGS */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
        <h3 className="text-xs text-[#9ca3af] font-bold uppercase tracking-wider block mb-4">
          {isFa ? "واحد پولی و سقف بودجه روزانه" : "Currency & Daily Budget"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CURRENCY SELECTOR */}
          <div>
            <label className="text-xs text-[#d4d4d8] font-medium block mb-2">
              {isFa ? "واحد پول محاسباتی" : "Preferred Currency"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleUpdate("currency", "IRT")}
                type="button"
                aria-pressed={userProfile.currency === "IRT"}
                className={`min-h-[48px] py-3 px-4 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
                  userProfile.currency === "IRT"
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#18191d] text-[#d4d4d8] border-[#27272a] hover:border-[#ff3e00]"
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>تومان (IRT)</span>
              </button>

              <button
                onClick={() => handleUpdate("currency", "USD")}
                type="button"
                aria-pressed={userProfile.currency === "USD"}
                className={`min-h-[48px] py-3 px-4 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#ff3e00] focus-visible:outline-none ${
                  userProfile.currency === "USD"
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#18191d] text-[#d4d4d8] border-[#27272a] hover:border-[#ff3e00]"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>{isFa ? "دلار (USD)" : "Dollar (USD)"}</span>
              </button>
            </div>
          </div>

          {/* DAILY FOOD BUDGET */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor={userProfile.currency === "IRT" ? "daily-budget-slider-irt" : "daily-budget-slider-usd"} className="text-xs text-[#d4d4d8] font-medium">
                {isFa ? "سقف بودجه روزانه خوراک" : "Daily Meal Budget Cap"}
              </label>
              <span className="text-xs text-[#ff3e00] font-bold font-mono">
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
            <div className="flex justify-between items-center text-xs text-[#9ca3af] mt-2">
              <span>
                {isFa
                  ? "سقف تخمینی هزینه روزانه برای وعده‌ها و تفکیک هزینه مواد اولیه."
                  : "Estimated spending threshold to monitor your daily meal costs."}
              </span>
              <span className="text-[11px] text-[#71717a] font-mono shrink-0 ml-2 rtl:mr-2 rtl:ml-0">
                {isFa
                  ? `۱$ = ${(userProfile.exchangeRateTomanPerUSD || 230000).toLocaleString("fa-IR")} تومان`
                  : `$1 = ${(userProfile.exchangeRateTomanPerUSD || 230000).toLocaleString("en-US")} Tomans`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DOLLAR EXCHANGE RATE CONFIG (تنظیم قیمت دلار به تومان) */}
      <section className="bg-[#111214] border border-[#27272a] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ff3e00]/10 text-[#ff3e00] rounded-lg border border-[#ff3e00]/20">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-[#ff3e00] font-mono font-bold uppercase tracking-wider block">
                {isFa ? "تنظیم نرخ ارز" : "EXCHANGE RATE CONFIG"}
              </span>
              <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">
                {isFa ? "تنظیم قیمت لحظه‌ای دلار (تومان)" : "Custom Dollar Price (Tomans)"}
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#18191d] border border-[#27272a] px-3 py-1.5 rounded-lg font-mono text-xs">
            <span className="text-[#9ca3af]">{isFa ? "نرخ فعال:" : "Active:"}</span>
            <span className="text-[#ff3e00] font-bold">
              {isFa
                ? `${(userProfile.exchangeRateTomanPerUSD || 230000).toLocaleString("fa-IR")} تومان`
                : `${(userProfile.exchangeRateTomanPerUSD || 230000).toLocaleString("en-US")} Tomans`}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#d4d4d8] leading-relaxed mb-4 max-w-3xl">
          {isFa
            ? "قیمت هر ۱ دلار آمریکا را بر حسب تومان تعیین کنید. تمامی قیمت‌های غذاهای اسکن‌شده، غذاهای بین‌المللی، جمع هزینه‌های روزانه در دفترچه و سقف بودجه به‌صورت خودکار بر مبنای این قیمت محاسبه می‌شوند."
            : "Set your custom USD exchange rate in Tomans. All scanned meal estimates, international food prices, daily journal spending, and budget conversions update dynamically based on this rate."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#18191d] border border-[#27272a] rounded-lg p-4 mb-4">
          <div>
            <label htmlFor="dollar-rate-input" className="text-xs text-[#9ca3af] font-medium block mb-1.5">
              {isFa ? "قیمت ۱ دلار (تومان)" : "1 USD Price in Tomans"}
            </label>
            <div className="relative">
              <input
                id="dollar-rate-input"
                type="number"
                min="50000"
                max="2000000"
                step="1000"
                aria-label={isFa ? "قیمت هر دلار به تومان" : "Dollar rate in Tomans"}
                value={userProfile.exchangeRateTomanPerUSD ?? 230000}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleUpdate("exchangeRateTomanPerUSD", isNaN(val) || val <= 0 ? 230000 : val);
                }}
                className="w-full bg-[#111214] border border-[#27272a] focus:border-[#ff3e00] text-[#f4f4f5] text-base font-bold font-mono px-3.5 py-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff3e00]"
              />
              <span className="absolute left-3 rtl:right-auto ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-[#71717a] font-mono pointer-events-none">
                {isFa ? "تومان" : "IRT"}
              </span>
            </div>
          </div>

          <div className="bg-[#111214] border border-[#27272a] rounded-lg p-3 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between items-center text-[#9ca3af]">
              <span>{isFa ? "معادل ۲ دلار:" : "Equivalent $2.00:"}</span>
              <span className="text-[#f4f4f5] font-bold">
                {isFa
                  ? `${((userProfile.exchangeRateTomanPerUSD || 230000) * 2).toLocaleString("fa-IR")} تومان`
                  : `${((userProfile.exchangeRateTomanPerUSD || 230000) * 2).toLocaleString("en-US")} Tomans`}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#9ca3af]">
              <span>{isFa ? "معادل ۵ دلار:" : "Equivalent $5.00:"}</span>
              <span className="text-[#ff3e00] font-bold">
                {isFa
                  ? `${((userProfile.exchangeRateTomanPerUSD || 230000) * 5).toLocaleString("fa-IR")} تومان`
                  : `${((userProfile.exchangeRateTomanPerUSD || 230000) * 5).toLocaleString("en-US")} Tomans`}
              </span>
            </div>
          </div>
        </div>

        {/* QUICK STEP BUTTONS & RESET */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#71717a] font-medium mr-1 rtl:ml-1 rtl:mr-0">
            {isFa ? "تنظیم سریع:" : "Quick steps:"}
          </span>
          <button
            type="button"
            onClick={() => handleUpdate("exchangeRateTomanPerUSD", Math.max(50000, (userProfile.exchangeRateTomanPerUSD || 230000) - 10000))}
            className="px-2.5 py-1.5 bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] hover:border-[#ff3e00] text-[#d4d4d8] text-xs font-mono rounded cursor-pointer transition-colors"
          >
            -10,000
          </button>
          <button
            type="button"
            onClick={() => handleUpdate("exchangeRateTomanPerUSD", Math.max(50000, (userProfile.exchangeRateTomanPerUSD || 230000) - 5000))}
            className="px-2.5 py-1.5 bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] hover:border-[#ff3e00] text-[#d4d4d8] text-xs font-mono rounded cursor-pointer transition-colors"
          >
            -5,000
          </button>
          <button
            type="button"
            onClick={() => handleUpdate("exchangeRateTomanPerUSD", (userProfile.exchangeRateTomanPerUSD || 230000) + 5000)}
            className="px-2.5 py-1.5 bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] hover:border-[#ff3e00] text-[#d4d4d8] text-xs font-mono rounded cursor-pointer transition-colors"
          >
            +5,000
          </button>
          <button
            type="button"
            onClick={() => handleUpdate("exchangeRateTomanPerUSD", (userProfile.exchangeRateTomanPerUSD || 230000) + 10000)}
            className="px-2.5 py-1.5 bg-[#18191d] hover:bg-[#27272a] border border-[#27272a] hover:border-[#ff3e00] text-[#d4d4d8] text-xs font-mono rounded cursor-pointer transition-colors"
          >
            +10,000
          </button>

          <button
            type="button"
            onClick={() => handleUpdate("exchangeRateTomanPerUSD", 230000)}
            aria-label={isFa ? "بازنشانی نرخ به ۲۳۰٬۰۰۰ تومان" : "Reset rate to 230,000"}
            className="px-3 py-1.5 bg-[#18191d] hover:bg-[#ff3e00]/20 text-[#ff3e00] border border-[#ff3e00]/40 text-xs font-medium rounded cursor-pointer transition-colors flex items-center gap-1.5 ml-auto rtl:mr-auto rtl:ml-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{isFa ? "بازنشانی به ۲۳۰٬۰۰۰ تومان" : "Reset to 230,000"}</span>
          </button>
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
              <span className="text-[#ff3e00] font-bold font-mono text-sm">
                {isFa ? `${(userProfile.calorieGoal ?? 2000).toLocaleString("fa-IR")} کالری` : `${userProfile.calorieGoal ?? 2000} kcal`}
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
              <span className="text-[#ff3e00] font-bold font-mono text-sm">
                {isFa ? `${(userProfile.proteinGoal ?? 80).toLocaleString("fa-IR")} گرم` : `${userProfile.proteinGoal ?? 80}g`}
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
              <span className="text-[#ff3e00] font-bold font-mono text-sm">
                {isFa ? `${(userProfile.carbsGoal ?? 250).toLocaleString("fa-IR")} گرم` : `${userProfile.carbsGoal ?? 250}g`}
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
              <span className="text-[#ff3e00] font-bold font-mono text-sm">
                {isFa ? `${(userProfile.fatGoal ?? 65).toLocaleString("fa-IR")} گرم` : `${userProfile.fatGoal ?? 65}g`}
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
