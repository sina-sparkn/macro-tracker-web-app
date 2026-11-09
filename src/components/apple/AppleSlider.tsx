import React, { useState, useId } from "react";
import { formatNumber } from "../../utils/formatters";

export type AppleSliderColor = "calorie" | "protein" | "carbs" | "fat" | "budget";

interface AppleSliderProps {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  color?: AppleSliderColor;
  isFa?: boolean;
  unit?: string;
  ariaLabel: string;
  ariaValueText?: string;
  showMinMax?: boolean;
  formatValue?: (val: number) => string;
  className?: string;
}

export const AppleSlider: React.FC<AppleSliderProps> = ({
  id,
  value,
  min,
  max,
  step = 1,
  onChange,
  color = "calorie",
  isFa = false,
  unit = "",
  ariaLabel,
  ariaValueText,
  showMinMax = true,
  formatValue,
  className = ""
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Clamp value between min and max
  const clampedValue = Math.min(Math.max(value, min), max);

  // Percentage from 0 to 100
  const range = max - min || 1;
  const pct = Math.min(Math.max(((clampedValue - min) / range) * 100, 0), 100);

  // Color classes for active fill
  const getColorClass = () => {
    switch (color) {
      case "protein":
        return "bg-[#0a84ff]";
      case "carbs":
        return "bg-[#ff9f0a]";
      case "fat":
        return "bg-[#ff375f]";
      case "budget":
        return "bg-[#30d158]";
      case "calorie":
      default:
        return "bg-gradient-to-r from-[#ff6947] to-[#ff3b30]";
    }
  };

  const formattedCurrent = formatValue
    ? formatValue(clampedValue)
    : `${formatNumber(clampedValue, isFa)}${unit ? " " + unit : ""}`;

  const formattedMin = formatValue
    ? formatValue(min)
    : `${formatNumber(min, isFa)}${unit ? " " + unit : ""}`;

  const formattedMax = formatValue
    ? formatValue(max)
    : `${formatNumber(max, isFa)}${unit ? " " + unit : ""}`;

  return (
    <div className={`relative w-full flex flex-col apple-slider-container ${className}`}>
      {/* Slider interactive area */}
      <div className="relative w-full h-10 flex items-center">
        {/* Neutral background track (6px) */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] pointer-events-none" />

        {/* Semantic colored fill bar (6px) */}
        <div
          className={`absolute h-1.5 rounded-full pointer-events-none ${getColorClass()} ${
            isActive ? "" : "transition-[width] duration-200 ease-out"
          }`}
          style={
            isFa
              ? { right: 0, width: `${pct}%` }
              : { left: 0, width: `${pct}%` }
          }
        />

        {/* Floating Value Bubble (Visible during hover / drag / active) */}
        {(isActive || isHovered) && (
          <div
            className="absolute -top-7 pointer-events-none z-20 transition-all duration-75"
            style={
              isFa
                ? { right: `calc(${pct}% - 14px)`, transform: "translateX(50%)" }
                : { left: `calc(${pct}% - 14px)`, transform: "translateX(-50%)" }
            }
          >
            <div className="px-2.5 py-0.5 rounded-full bg-[var(--apple-surface)] border border-[var(--apple-border)] shadow-md text-[11px] font-bold text-[var(--apple-text-primary)] tabular-nums whitespace-nowrap">
              {formattedCurrent}
            </div>
          </div>
        )}

        {/* Native Range Input (Transparent, accessible, full touch target) */}
        <input
          id={inputId}
          type="range"
          dir={isFa ? "rtl" : "ltr"}
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          aria-valuetext={ariaValueText || formattedCurrent}
          className="apple-slider-input relative z-10 w-full"
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsActive(true)}
          onTouchEnd={() => setIsActive(false)}
        />
      </div>

      {/* Min / Max Labels */}
      {showMinMax && (
        <div className="flex items-center justify-between text-[11px] text-[var(--apple-text-tertiary)] tabular-nums -mt-1 px-0.5 pointer-events-none">
          <span>{formattedMin}</span>
          <span>{formattedMax}</span>
        </div>
      )}
    </div>
  );
};
