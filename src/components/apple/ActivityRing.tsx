import React, { useEffect, useState } from "react";
import { toPersianDigits, formatNumber } from "../../utils/formatters";

interface ActivityRingProps {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  isFa?: boolean;
  label?: string;
  showCenterText?: boolean;
  children?: React.ReactNode;
}

export const ActivityRing: React.FC<ActivityRingProps> = ({
  current,
  goal,
  size = 180,
  strokeWidth = 14,
  isFa = false,
  label = isFa ? "کالری فعال" : "Active Calories",
  showCenterText = size >= 120,
  children
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const targetPercent = goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0;

  useEffect(() => {
    // Smooth animate on load
    const timeout = setTimeout(() => {
      setAnimatedPercent(targetPercent);
    }, 80);
    return () => clearTimeout(timeout);
  }, [targetPercent]);

  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-label={`${label}: ${current} / ${goal}`}
    >
      <svg
        className="w-full h-full -rotate-90 transform"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="appleCalorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--apple-accent-start, #ff6947)" />
            <stop offset="100%" stopColor="var(--apple-accent-end, #ff3b30)" />
          </linearGradient>
        </defs>

        {/* Track circle (background) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-black/[0.06] dark:text-white/[0.08]"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Filled ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#appleCalorieGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          className="apple-ring-glow"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 pointer-events-none">
        {children ? (
          children
        ) : showCenterText ? (
          <>
            {label && (
              <span className="text-[11px] font-medium text-[var(--apple-text-secondary)] tracking-tight">
                {label}
              </span>
            )}
            <span className="text-3xl font-bold tracking-tight text-[var(--apple-text-primary)] tabular-nums my-0.5">
              {formatNumber(current, isFa)}
            </span>
            <span className="text-[11px] font-normal text-[var(--apple-text-tertiary)] tabular-nums">
              {isFa ? `از ${formatNumber(goal, true)}` : `of ${formatNumber(goal, false)}`}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};
