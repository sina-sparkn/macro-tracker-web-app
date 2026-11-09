import React from "react";
import { formatNumber } from "../../utils/formatters";
import { Scale, TrendingDown, Dumbbell, Flame, Check } from "lucide-react";
import { Badge } from "../ui/badge";

export type PresetId = "balanced" | "weight-loss" | "muscle" | "keto";

export interface DietPresetItem {
  id: PresetId;
  nameFa: string;
  nameEn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  descFa: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DIET_PRESETS: DietPresetItem[] = [
  {
    id: "balanced",
    nameFa: "رژیم متعادل",
    nameEn: "Balanced",
    calories: 2000,
    protein: 80,
    carbs: 250,
    fat: 65,
    descFa: "تعادل استاندارد برای ثبات وزن و انرژی روزمره",
    descEn: "Standard daily balance for weight maintenance",
    icon: Scale
  },
  {
    id: "weight-loss",
    nameFa: "کاهش وزن",
    nameEn: "Weight Loss",
    calories: 1600,
    protein: 90,
    carbs: 180,
    fat: 50,
    descFa: "کسری کنترل‌شده کالری با سهم پروتئین بالا",
    descEn: "Controlled deficit with high protein retention",
    icon: TrendingDown
  },
  {
    id: "muscle",
    nameFa: "عضله‌سازی",
    nameEn: "Muscle Gain",
    calories: 2500,
    protein: 140,
    carbs: 300,
    fat: 75,
    descFa: "مازاد هدفمند کالری برای رشد و ترمیم عضلات",
    descEn: "Targeted surplus for hypertrophy and recovery",
    icon: Dumbbell
  },
  {
    id: "keto",
    nameFa: "کتوژنیک",
    nameEn: "Keto",
    calories: 1800,
    protein: 100,
    carbs: 30,
    fat: 130,
    descFa: "کربوهیدرات فوق‌العاده کم با چربی سالم غالب",
    descEn: "Very low carb with dominant healthy fats",
    icon: Flame
  }
];

interface DietPresetsGroupProps {
  activePresetId?: PresetId;
  onSelectPreset: (preset: PresetId) => void;
  isFa?: boolean;
}

export const DietPresetsGroup: React.FC<DietPresetsGroupProps> = ({
  activePresetId,
  onSelectPreset,
  isFa = false
}) => {
  return (
    <div
      role="radiogroup"
      aria-label={isFa ? "انتخاب الگوی رژیمی" : "Select dietary preset"}
      className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-0.5"
    >
      {DIET_PRESETS.map((preset) => {
        const isSelected = activePresetId === preset.id;
        const Icon = preset.icon;

        return (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectPreset(preset.id)}
            className={`w-full p-3 sm:p-4.5 rounded-2xl text-start transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 sm:gap-3 relative focus-visible:outline-hidden ${
              isSelected
                ? "bg-[var(--apple-surface)] border-2 border-[#ff3b30] shadow-md shadow-[#ff3b30]/15"
                : "bg-[var(--apple-surface)] border-2 border-[var(--apple-border)] hover:border-[var(--apple-border-strong)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
            }`}
          >
            {/* Top Row: Icon + Preset Name + Check Badge */}
            <div className="flex items-center justify-between gap-1.5 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-[#ff3b30]/15 text-[#ff3b30]"
                      : "bg-[var(--apple-surface-secondary)] text-[var(--apple-text-secondary)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isSelected
                      ? "text-[#ff3b30] font-bold"
                      : "text-[var(--apple-text-primary)]"
                  }`}
                >
                  {isFa ? preset.nameFa : preset.nameEn}
                </span>
              </div>

              {/* Selected Check Badge */}
              {isSelected && (
                <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#ff3b30] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Middle: Hero Calorie Target */}
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-lg sm:text-2xl font-extrabold text-[var(--apple-text-primary)] tabular-nums">
                {formatNumber(preset.calories, isFa)}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[var(--apple-text-tertiary)]">
                {isFa ? "کالری" : "kcal"}
              </span>
            </div>

            {/* Bottom: 3 Clean Semantic Macro Chips using shadcn Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 w-full pt-1 border-t border-[var(--apple-border)] text-[10px] sm:text-[11px] tabular-nums">
              {/* Protein (Blue) */}
              <Badge
                variant="protein"
                className="flex-1 justify-center py-0.5 px-0.5 sm:px-1 text-[10px] sm:text-[11px] font-semibold truncate"
                title={`${isFa ? "پروتئین" : "Protein"}: ${preset.protein}g`}
              >
                {isFa ? `پ: ${formatNumber(preset.protein, true)}` : `P: ${preset.protein}g`}
              </Badge>

              {/* Carbs (Amber) */}
              <Badge
                variant="carbs"
                className="flex-1 justify-center py-0.5 px-0.5 sm:px-1 text-[10px] sm:text-[11px] font-semibold truncate"
                title={`${isFa ? "کربوهیدرات" : "Carbs"}: ${preset.carbs}g`}
              >
                {isFa ? `ک: ${formatNumber(preset.carbs, true)}` : `C: ${preset.carbs}g`}
              </Badge>

              {/* Fat (Pink) */}
              <Badge
                variant="fat"
                className="flex-1 justify-center py-0.5 px-0.5 sm:px-1 text-[10px] sm:text-[11px] font-semibold truncate"
                title={`${isFa ? "چربی" : "Fat"}: ${preset.fat}g`}
              >
                {isFa ? `چ: ${formatNumber(preset.fat, true)}` : `F: ${preset.fat}g`}
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
};
