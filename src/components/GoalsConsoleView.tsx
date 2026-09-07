import React from "react";
import { Sliders, Activity, Coins, DollarSign, Target, ShieldCheck } from "lucide-react";
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
    onSaveProfile({
      ...userProfile,
      [field]: value
    });
  };

  return (
    <div className="p-4 sm:p-6 xl:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* HEADER */}
      <div className="border-b border-[#2a2c31] pb-4">
        <span className="font-mono text-[10px] text-[#ff3e00] tracking-widest uppercase block">
          {isFa ? "پیکربندی سیستم // پارامترهای سلامت" : "SYSTEM_CONFIGURATION // HEALTH_PARAMETERS"}
        </span>
        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#e0e0e0] mt-0.5">
          {isFa ? "تنظیم اهداف کالری، ماکروها و بودجه" : "NUTRITION TARGETS & BUDGET"}
        </h2>
      </div>

      {/* QUICK PRESET SELECTORS */}
      <section className="bg-[#111214] border border-[#2a2c31] p-5">
        <span className="font-mono text-xs text-[#707070] uppercase tracking-wider block mb-3">
          {isFa ? "الگوهای رژیمی آماده" : "DIETARY_ARCHETYPE_PRESETS"}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onApplyPreset("balanced")}
            className="p-3 bg-[#08090a] border border-[#2a2c31] hover:border-[#ff3e00] text-left rtl:text-right transition-colors cursor-pointer group"
          >
            <span className="font-syne font-bold text-sm text-[#e0e0e0] group-hover:text-[#ff3e00] block">
              {isFa ? "متعادل" : "Balanced"}
            </span>
            <span className="font-mono text-[10px] text-[#707070] mt-1 block">
              {isFa ? "۲۰۰۰ کالری • ۸۰ گرم پروتئین" : "2000 kcal • 80g P"}
            </span>
          </button>

          <button
            onClick={() => onApplyPreset("weight-loss")}
            className="p-3 bg-[#08090a] border border-[#2a2c31] hover:border-[#ff3e00] text-left rtl:text-right transition-colors cursor-pointer group"
          >
            <span className="font-syne font-bold text-sm text-[#e0e0e0] group-hover:text-[#ff3e00] block">
              {isFa ? "کاهش وزن" : "Deficit"}
            </span>
            <span className="font-mono text-[10px] text-[#707070] mt-1 block">
              {isFa ? "۱۶۰۰ کالری • ۹۰ گرم پروتئین" : "1600 kcal • 90g P"}
            </span>
          </button>

          <button
            onClick={() => onApplyPreset("muscle")}
            className="p-3 bg-[#08090a] border border-[#2a2c31] hover:border-[#ff3e00] text-left rtl:text-right transition-colors cursor-pointer group"
          >
            <span className="font-syne font-bold text-sm text-[#e0e0e0] group-hover:text-[#ff3e00] block">
              {isFa ? "عضله‌سازی" : "Hypertrophy"}
            </span>
            <span className="font-mono text-[10px] text-[#707070] mt-1 block">
              {isFa ? "۲۵۰۰ کالری • ۱۴۰ گرم پروتئین" : "2500 kcal • 140g P"}
            </span>
          </button>

          <button
            onClick={() => onApplyPreset("keto")}
            className="p-3 bg-[#08090a] border border-[#2a2c31] hover:border-[#ff3e00] text-left rtl:text-right transition-colors cursor-pointer group"
          >
            <span className="font-syne font-bold text-sm text-[#e0e0e0] group-hover:text-[#ff3e00] block">
              {isFa ? "کتوژنیک" : "Ketogenic"}
            </span>
            <span className="font-mono text-[10px] text-[#707070] mt-1 block">
              {isFa ? "۱۸۰۰ کالری • ۳۰ گرم کربوهیدرات" : "1800 kcal • 30g C"}
            </span>
          </button>
        </div>
      </section>

      {/* CURRENCY & FOOD BUDGET SETTINGS */}
      <section className="bg-[#111214] border border-[#2a2c31] p-5">
        <span className="font-mono text-xs text-[#707070] uppercase tracking-wider block mb-4">
          {isFa ? "واحد پولی و محدودیت‌های بودجه" : "CURRENCY_&_BUDGETARY_CONSTRAINTS"}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CURRENCY SELECTOR */}
          <div>
            <label className="text-xs font-mono text-[#e0e0e0] block mb-2">
              {isFa ? "واحد پول محاسباتی" : "CURRENCY_DENOMINATION"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleUpdate("currency", "IRT")}
                className={`py-3 px-4 border font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  userProfile.currency === "IRT"
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#08090a] text-[#707070] border-[#2a2c31] hover:text-[#e0e0e0]"
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>تومان (IRT)</span>
              </button>

              <button
                onClick={() => handleUpdate("currency", "USD")}
                className={`py-3 px-4 border font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  userProfile.currency === "USD"
                    ? "bg-[#ff3e00] text-[#08090a] border-[#ff3e00] font-bold"
                    : "bg-[#08090a] text-[#707070] border-[#2a2c31] hover:text-[#e0e0e0]"
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
              <label className="text-xs font-mono text-[#e0e0e0]">
                {isFa ? "سقف بودجه روزانه خوراک" : "DAILY_FOOD_BUDGET"}
              </label>
              <span className="font-mono text-xs text-[#ff3e00] font-bold">
                {userProfile.currency === "IRT"
                  ? `${userProfile.dailyBudgetToman.toLocaleString("fa-IR")} تومان`
                  : `$${userProfile.dailyBudgetUSD}`}
              </span>
            </div>

            {userProfile.currency === "IRT" ? (
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={userProfile.dailyBudgetToman}
                onChange={(e) => handleUpdate("dailyBudgetToman", Number(e.target.value))}
                className="w-full accent-[#ff3e00] bg-[#1a1b1e] h-2 cursor-pointer"
              />
            ) : (
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={userProfile.dailyBudgetUSD}
                onChange={(e) => handleUpdate("dailyBudgetUSD", Number(e.target.value))}
                className="w-full accent-[#ff3e00] bg-[#1a1b1e] h-2 cursor-pointer"
              />
            )}
            <p className="text-[10px] font-mono text-[#707070] mt-1.5">
              {isFa
                ? "سقف تخمینی هزینه روزانه برای وعده‌ها و تفکیک هزینه مواد اولیه."
                : "Est. cap for daily meal costs and ingredient tracking."}
            </p>
          </div>
        </div>
      </section>

      {/* MACRONUTRIENT & CALORIE TARGET ADJUSTERS */}
      <section className="bg-[#111214] border border-[#2a2c31] p-5">
        <span className="font-mono text-xs text-[#707070] uppercase tracking-wider block mb-4">
          {isFa ? "اهداف و حدود دریافت روزانه" : "TARGET_INTAKE_LIMITS"}
        </span>

        <div className="space-y-5">
          {/* Calorie Goal */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#e0e0e0]">{isFa ? "هدف کالری روزانه" : "DAILY_CALORIE_TARGET"}</span>
              <span className="text-[#ff3e00] font-bold">
                {isFa ? `${userProfile.calorieGoal.toLocaleString("fa-IR")} کالری` : `${userProfile.calorieGoal} KCAL`}
              </span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              value={userProfile.calorieGoal}
              onChange={(e) => handleUpdate("calorieGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#1a1b1e] h-2 cursor-pointer"
            />
          </div>

          {/* Protein Goal */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#e0e0e0]">{isFa ? "هدف پروتئین" : "PROTEIN_GOAL"}</span>
              <span className="text-[#ff3e00] font-bold">
                {isFa ? `${userProfile.proteinGoal.toLocaleString("fa-IR")} گرم` : `${userProfile.proteinGoal}g`}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="250"
              step="5"
              value={userProfile.proteinGoal}
              onChange={(e) => handleUpdate("proteinGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#1a1b1e] h-2 cursor-pointer"
            />
          </div>

          {/* Carbs Goal */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#e0e0e0]">{isFa ? "هدف کربوهیدرات" : "CARBOHYDRATE_GOAL"}</span>
              <span className="text-[#ff3e00] font-bold">
                {isFa ? `${userProfile.carbsGoal.toLocaleString("fa-IR")} گرم` : `${userProfile.carbsGoal}g`}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="450"
              step="5"
              value={userProfile.carbsGoal}
              onChange={(e) => handleUpdate("carbsGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#1a1b1e] h-2 cursor-pointer"
            />
          </div>

          {/* Fat Goal */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#e0e0e0]">{isFa ? "هدف چربی" : "FAT_GOAL"}</span>
              <span className="text-[#ff3e00] font-bold">
                {isFa ? `${userProfile.fatGoal.toLocaleString("fa-IR")} گرم` : `${userProfile.fatGoal}g`}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={userProfile.fatGoal}
              onChange={(e) => handleUpdate("fatGoal", Number(e.target.value))}
              className="w-full accent-[#ff3e00] bg-[#1a1b1e] h-2 cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoalsConsoleView;
