import React, { useState } from "react";
import {
  Coins,
  DollarSign,
  RefreshCw,
  Check,
  Flame,
  Zap,
  Wheat,
  Droplet,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";
import { formatNumber, toPersianDigits } from "../utils/formatters";
import { AppleSlider } from "./apple/AppleSlider";
import { AppleStepper } from "./apple/AppleStepper";
import { AppleEditableValue } from "./apple/AppleEditableValue";
import { AppleSegmentedControl, SegmentOption } from "./apple/AppleSegmentedControl";
import { DietPresetsGroup, DIET_PRESETS, PresetId } from "./apple/DietPresetsGroup";
import { MacroSplitSummary } from "./apple/MacroSplitSummary";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface GoalsConsoleViewProps {
  userProfile: UserProfile;
  isSyncingRate?: boolean;
  onSaveProfile: (profile: UserProfile) => void;
  onApplyPreset: (
    preset: "weight-loss" | "muscle" | "keto" | "balanced"
  ) => void;
  onSyncExchangeRate?: () => void;
}

export const GoalsConsoleView: React.FC<GoalsConsoleViewProps> = ({
  userProfile,
  isSyncingRate = false,
  onSaveProfile,
  onApplyPreset,
  onSyncExchangeRate
}) => {
  const currentLang = userProfile.language || "fa";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fa || TRANSLATIONS.en;

  const [savedFeedback, setSavedFeedback] = useState(false);

  const triggerSavedFeedback = () => {
    setSavedFeedback(true);
    const timer = setTimeout(() => setSavedFeedback(false), 2000);
    return () => clearTimeout(timer);
  };

  const handleUpdate = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => {
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
    triggerSavedFeedback();
  };

  const isPresetActive = (preset: (typeof DIET_PRESETS)[number]) => {
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

  const activePreset = DIET_PRESETS.find((p) => isPresetActive(p));

  const handleSelectPreset = (presetId: PresetId) => {
    onApplyPreset(presetId);
    triggerSavedFeedback();
  };

  // Currency options for segmented control
  const currencyOptions: SegmentOption<"IRT" | "USD">[] = [
    { id: "IRT", label: isFa ? "تومان (IRT)" : "Toman (IRT)", icon: Coins },
    { id: "USD", label: isFa ? "دلار (USD)" : "Dollar (USD)", icon: DollarSign }
  ];

  const formatTimestamp = (ts?: string) => {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        const timeStr = d.toLocaleTimeString(isFa ? "fa-IR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit"
        });
        return `${isFa ? "امروز ساعت" : "Today at"} ${timeStr}`;
      }
    } catch {}
    return ts;
  };

  const exchangeRate = userProfile.exchangeRateTomanPerUSD || 230000;
  const currentCurrency = userProfile.currency || "IRT";
  const budgetToman = userProfile.dailyBudgetToman ?? 1800000;
  const budgetUSD = userProfile.dailyBudgetUSD ?? 7.8;

  // Secondary converted budget calculation
  const convertedBudgetStr =
    currentCurrency === "IRT"
      ? (isFa
          ? `معادل تقریبی: ${formatNumber(Number((budgetToman / exchangeRate).toFixed(1)), true)} دلار`
          : `Approx: $${(budgetToman / exchangeRate).toFixed(1)} USD`)
      : (isFa
          ? `معادل تقریبی: ${formatNumber(Math.round(budgetUSD * exchangeRate), true)} تومان`
          : `Approx: ${(Math.round(budgetUSD * exchangeRate)).toLocaleString("en-US")} Tomans`);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full select-none pb-28 lg:pb-12">
      {/* ====================================================================
          1. PAGE HEADER (IOS SETTINGS STYLE)
          ==================================================================== */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--apple-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[var(--apple-accent)] uppercase tracking-wider">
              {isFa ? "تنظیمات" : "Settings"}
            </span>
            <span className="text-xs text-[var(--apple-text-tertiary)]">›</span>
            <span className="text-xs text-[var(--apple-text-secondary)] font-medium">
              {isFa ? "اهداف و بودجه" : "Goals & Budget"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--apple-text-primary)]">
            {isFa ? "اهداف تغذیه و بودجه" : "Nutrition & Budget Goals"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--apple-text-secondary)] mt-1">
            {isFa
              ? "شخصی‌سازی سقف کالری، سهم درشت‌مغذی‌ها و تنظیم بودجه روزانه خوراک"
              : "Customize daily energy targets, macronutrient split and meal budgets"}
          </p>
        </div>

        {/* Saved confirmation badge */}
        <div
          className={`self-start sm:self-center transition-all duration-300 ${
            savedFeedback
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <Badge variant="success" className="px-3 py-1.5 text-xs font-semibold gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isFa ? "تنظیمات ذخیره شد" : "Changes Saved"}</span>
          </Badge>
        </div>
      </section>

      {/* ====================================================================
          2. DIET PRESETS (BALANCED, WEIGHT LOSS, MUSCLE GAIN, KETO)
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--apple-text-secondary)]">
            {isFa ? "الگوهای رژیمی استاندارد" : "Dietary Presets"}
          </span>
          {activePreset && (
            <span className="text-xs text-[var(--apple-accent)] font-semibold inline-flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>
                {isFa ? `الگوی فعال: ${activePreset.nameFa}` : `Active: ${activePreset.nameEn}`}
              </span>
            </span>
          )}
        </div>

        <DietPresetsGroup
          activePresetId={activePreset?.id}
          onSelectPreset={handleSelectPreset}
          isFa={isFa}
        />
      </section>

      {/* ====================================================================
          3. EXCHANGE RATE & CURRENCY GROUPED CARD
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--apple-text-secondary)] px-1">
          {isFa ? "ارز و سقف بودجه روزانه" : "Currency & Daily Budget"}
        </span>

        <Card className="apple-card border-[var(--apple-border)] shadow-sm">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
            {/* Row A: Live USD Exchange Rate */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-[var(--apple-text-secondary)] block truncate">
                    {isFa ? "نرخ زنده دلار در بازار ایران" : "Live USD Market Exchange Rate"}
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-[var(--apple-text-primary)] tabular-nums mt-0.5 truncate">
                    {isFa
                      ? `۱ دلار = ${formatNumber(exchangeRate, true)} تومان`
                      : `$1 USD = ${exchangeRate.toLocaleString("en-US")} Tomans`}
                  </div>
                  <span className="text-[11px] text-[var(--apple-text-tertiary)] block mt-0.5">
                    {userProfile.autoRateUpdatedAt
                      ? `${isFa ? "آخرین بروزرسانی:" : "Updated:"} ${formatTimestamp(userProfile.autoRateUpdatedAt)}`
                      : (isFa
                          ? "بروزرسانی مستقیم از شاخص قدرت خرید و قیمت بازار"
                          : "Domestic food purchasing-power index")}
                  </span>
                </div>
              </div>

              {onSyncExchangeRate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={onSyncExchangeRate}
                        disabled={isSyncingRate}
                        aria-label={isFa ? "به‌روزرسانی نرخ ارز" : "Refresh exchange rate"}
                        className="rounded-full w-10 h-10 border border-[var(--apple-border)] shrink-0"
                      >
                        <RefreshCw
                          className={`w-4 h-4 text-[var(--apple-accent)] ${
                            isSyncingRate ? "animate-spin" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span>{isFa ? "به‌روزرسانی نرخ زنده" : "Refresh live rate"}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="border-t border-[var(--apple-border)]" />

            {/* Row B: Currency Unit Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[var(--apple-text-primary)] block">
                  {isFa ? "واحد پول پیش‌فرض بودجه" : "Default Currency Unit"}
                </span>
                <span className="text-[11px] text-[var(--apple-text-secondary)]">
                  {isFa
                    ? "تعیین واحد پولی برای سقف بودجه و برآورد هزینه‌ها"
                    : "Choose currency for budget caps and meal calculations"}
                </span>
              </div>

              <div className="w-full sm:w-64">
                <AppleSegmentedControl
                  options={currencyOptions}
                  value={currentCurrency}
                  onChange={(val) => {
                    onSaveProfile({
                      ...userProfile,
                      currency: val,
                      hidePrices: false
                    });
                    triggerSavedFeedback();
                  }}
                  size="md"
                />
              </div>
            </div>

            <div className="border-t border-[var(--apple-border)]" />

            {/* Row C: Daily Budget Cap */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[var(--apple-text-primary)]">
                    {isFa ? "سقف بودجه روزانه خوراک" : "Daily Food Budget Cap"}
                  </span>
                  <span className="text-[11px] text-[var(--apple-text-tertiary)] tabular-nums">
                    {convertedBudgetStr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentCurrency === "IRT" ? (
                    <>
                      <AppleEditableValue
                        value={budgetToman}
                        min={400000}
                        max={6000000}
                        unit={isFa ? "تومان" : "Toman"}
                        onChange={(val) => handleUpdate("dailyBudgetToman", val)}
                        isFa={isFa}
                      />
                      <AppleStepper
                        value={budgetToman}
                        min={400000}
                        max={6000000}
                        step={50000}
                        onChange={(val) => handleUpdate("dailyBudgetToman", val)}
                        isFa={isFa}
                      />
                    </>
                  ) : (
                    <>
                      <AppleEditableValue
                        value={budgetUSD}
                        min={2}
                        max={35}
                        prefix="$"
                        unit="USD"
                        onChange={(val) => handleUpdate("dailyBudgetUSD", val)}
                        isFa={isFa}
                      />
                      <AppleStepper
                        value={budgetUSD}
                        min={2}
                        max={35}
                        step={0.5}
                        onChange={(val) => handleUpdate("dailyBudgetUSD", val)}
                        isFa={isFa}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Slider */}
              {currentCurrency === "IRT" ? (
                <AppleSlider
                  value={budgetToman}
                  min={400000}
                  max={6000000}
                  step={50000}
                  onChange={(val) => handleUpdate("dailyBudgetToman", val)}
                  color="budget"
                  unit={isFa ? "تومان" : "Toman"}
                  ariaLabel={isFa ? "سقف بودجه روزانه به تومان" : "Daily budget cap in Toman"}
                  isFa={isFa}
                />
              ) : (
                <AppleSlider
                  value={budgetUSD}
                  min={2}
                  max={35}
                  step={0.5}
                  onChange={(val) => handleUpdate("dailyBudgetUSD", val)}
                  color="budget"
                  unit="USD"
                  ariaLabel={isFa ? "سقف بودجه روزانه به دلار" : "Daily budget cap in USD"}
                  isFa={isFa}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ====================================================================
          4. DAILY GOALS (CALORIES, PROTEIN, CARBS, FAT)
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--apple-text-secondary)] px-1">
          {isFa ? "اهداف روزانه انرژی و درشت‌مغذی‌ها" : "Daily Energy & Macro Targets"}
        </span>

        <Card className="apple-card border-[var(--apple-border)] shadow-sm">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-6">
            {/* Derived Macro Energy Split Bar & Alignment Summary */}
            <MacroSplitSummary
              calorieGoal={userProfile.calorieGoal ?? 2000}
              proteinGoal={userProfile.proteinGoal ?? 80}
              carbsGoal={userProfile.carbsGoal ?? 250}
              fatGoal={userProfile.fatGoal ?? 65}
              isFa={isFa}
            />

          <div className="border-t border-[var(--apple-border)]" />

          {/* ROW 1: CALORIES */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--apple-text-primary)] block">
                    {isFa ? "هدف کالری روزانه" : "Daily Calorie Target"}
                  </span>
                  <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                    {isFa ? "سهمیه کل انرژی روزانه" : "Total daily energy allowance"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AppleEditableValue
                  value={userProfile.calorieGoal ?? 2000}
                  min={1200}
                  max={4000}
                  unit={isFa ? "کالری" : "kcal"}
                  onChange={(val) => handleUpdate("calorieGoal", val)}
                  isFa={isFa}
                />
                <AppleStepper
                  value={userProfile.calorieGoal ?? 2000}
                  min={1200}
                  max={4000}
                  step={50}
                  onChange={(val) => handleUpdate("calorieGoal", val)}
                  isFa={isFa}
                />
              </div>
            </div>

            <AppleSlider
              value={userProfile.calorieGoal ?? 2000}
              min={1200}
              max={4000}
              step={50}
              onChange={(val) => handleUpdate("calorieGoal", val)}
              color="calorie"
              unit={isFa ? "کالری" : "kcal"}
              ariaLabel={isFa ? "هدف کالری روزانه" : "Daily Calorie Target"}
              isFa={isFa}
            />
          </div>

          <div className="border-t border-[var(--apple-border)]" />

          {/* ROW 2: PROTEIN */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0a84ff]/10 text-[#0a84ff] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--apple-text-primary)] block">
                    {isFa ? "هدف پروتئین روزانه" : "Daily Protein Target"}
                  </span>
                  <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                    {isFa ? "۴ کالری به ازای هر گرم" : "4 kcal per gram"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AppleEditableValue
                  value={userProfile.proteinGoal ?? 80}
                  min={40}
                  max={250}
                  unit={isFa ? "گرم" : "g"}
                  onChange={(val) => handleUpdate("proteinGoal", val)}
                  isFa={isFa}
                />
                <AppleStepper
                  value={userProfile.proteinGoal ?? 80}
                  min={40}
                  max={250}
                  step={5}
                  onChange={(val) => handleUpdate("proteinGoal", val)}
                  isFa={isFa}
                />
              </div>
            </div>

            <AppleSlider
              value={userProfile.proteinGoal ?? 80}
              min={40}
              max={250}
              step={5}
              onChange={(val) => handleUpdate("proteinGoal", val)}
              color="protein"
              unit={isFa ? "گرم" : "g"}
              ariaLabel={isFa ? "هدف پروتئین روزانه" : "Daily Protein Target"}
              isFa={isFa}
            />
          </div>

          <div className="border-t border-[var(--apple-border)]" />

          {/* ROW 3: CARBS */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ff9f0a]/10 text-[#ff9f0a] flex items-center justify-center shrink-0">
                  <Wheat className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--apple-text-primary)] block">
                    {isFa ? "هدف کربوهیدرات روزانه" : "Daily Carbs Target"}
                  </span>
                  <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                    {isFa ? "۴ کالری به ازای هر گرم" : "4 kcal per gram"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AppleEditableValue
                  value={userProfile.carbsGoal ?? 250}
                  min={20}
                  max={450}
                  unit={isFa ? "گرم" : "g"}
                  onChange={(val) => handleUpdate("carbsGoal", val)}
                  isFa={isFa}
                />
                <AppleStepper
                  value={userProfile.carbsGoal ?? 250}
                  min={20}
                  max={450}
                  step={5}
                  onChange={(val) => handleUpdate("carbsGoal", val)}
                  isFa={isFa}
                />
              </div>
            </div>

            <AppleSlider
              value={userProfile.carbsGoal ?? 250}
              min={20}
              max={450}
              step={5}
              onChange={(val) => handleUpdate("carbsGoal", val)}
              color="carbs"
              unit={isFa ? "گرم" : "g"}
              ariaLabel={isFa ? "هدف کربوهیدرات روزانه" : "Daily Carbs Target"}
              isFa={isFa}
            />
          </div>

          <div className="border-t border-[var(--apple-border)]" />

          {/* ROW 4: FAT */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ff375f]/10 text-[#ff375f] flex items-center justify-center shrink-0">
                  <Droplet className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--apple-text-primary)] block">
                    {isFa ? "هدف چربی سالم روزانه" : "Daily Healthy Fat Target"}
                  </span>
                  <span className="text-[11px] text-[var(--apple-text-tertiary)]">
                    {isFa ? "۹ کالری به ازای هر گرم" : "9 kcal per gram"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AppleEditableValue
                  value={userProfile.fatGoal ?? 65}
                  min={20}
                  max={150}
                  unit={isFa ? "گرم" : "g"}
                  onChange={(val) => handleUpdate("fatGoal", val)}
                  isFa={isFa}
                />
                <AppleStepper
                  value={userProfile.fatGoal ?? 65}
                  min={20}
                  max={150}
                  step={5}
                  onChange={(val) => handleUpdate("fatGoal", val)}
                  isFa={isFa}
                />
              </div>
            </div>

            <AppleSlider
              value={userProfile.fatGoal ?? 65}
              min={20}
              max={150}
              step={5}
              onChange={(val) => handleUpdate("fatGoal", val)}
              color="fat"
              unit={isFa ? "گرم" : "g"}
              ariaLabel={isFa ? "هدف چربی سالم روزانه" : "Daily Healthy Fat Target"}
              isFa={isFa}
            />
          </div>
        </CardContent>
      </Card>
    </section>
    </div>
  );
};

export default GoalsConsoleView;
