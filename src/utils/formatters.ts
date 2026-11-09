/**
 * Formatting and Localization Utilities for NutriScan
 * Apple Health & Persian RTL typographic standards
 */

import { UserProfile } from "../types";
import { formatSmartPrice } from "./dishLocalization";

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Converts any number or string containing ASCII digits to Persian digits.
 */
export function toPersianDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return "";
  return String(input).replace(/[0-9]/g, (char) => PERSIAN_DIGITS[+char]);
}

/**
 * Formats a number with thousands separators, using Persian digits if isFa is true.
 */
export function formatNumber(
  num: number | null | undefined,
  isFa: boolean,
  decimals: number = 0
): string {
  if (num === null || num === undefined || isNaN(num)) {
    return isFa ? "۰" : "0";
  }

  const fixed = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
  if (!isFa) {
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  // Format with Persian thousands separator
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  const result = parts.join("٫");
  return toPersianDigits(result);
}

/**
 * Formats a calorie count with localized unit.
 */
export function formatCalories(calories: number, isFa: boolean): string {
  const num = formatNumber(calories, isFa);
  return isFa ? `${num} کالری` : `${num} kcal`;
}

/**
 * Formats grams for macronutrients.
 */
export function formatGrams(amount: number, isFa: boolean, decimals = 0): string {
  const num = formatNumber(amount, isFa, decimals);
  return isFa ? `${num} گرم` : `${num} g`;
}

/**
 * Formats macro progress ratio e.g. "۰ / ۸۰ گرم" or "0 / 80 g"
 */
export function formatMacroRatio(
  current: number,
  goal: number,
  isFa: boolean,
  decimals = 0
): string {
  const currStr = formatNumber(current, isFa, decimals);
  const goalStr = formatNumber(goal, isFa, 0);
  return isFa ? `${currStr} / ${goalStr} گرم` : `${currStr} / ${goalStr} g`;
}

/**
 * Formats a percentage with localized symbol (Persian ٪ or English %).
 */
export function formatPercent(num: number, isFa: boolean): string {
  const rounded = Math.round(num);
  return isFa ? `${toPersianDigits(rounded)}٪` : `${rounded}%`;
}

/**
 * Formats day ratio e.g. "۰ از ۷ روز" or "0 of 7 days".
 */
export function formatDaysRatio(curr: number, total: number, isFa: boolean): string {
  return isFa
    ? `${toPersianDigits(curr)} از ${toPersianDigits(total)} روز`
    : `${curr} of ${total} days`;
}

/**
 * Formats price using the user profile settings and Iranian Toman / USD.
 */
export function formatPriceDisplay(
  toman?: number,
  usd?: number,
  userProfile?: UserProfile,
  servings = 1
): string {
  if (userProfile?.hidePrices) {
    return userProfile?.language === "fa" ? "فقط کالری" : "Calorie-Only";
  }
  const result = formatSmartPrice(toman, usd, userProfile, servings);
  return result || (userProfile?.language === "fa" ? "رایگان" : "Free");
}
