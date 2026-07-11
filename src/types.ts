export interface Vitamin {
  name: string;
  value: string;
  percentDV?: number;
}

export interface ScannedLabel {
  productName: string;
  brand: string;
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  totalFat: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber?: number;
  totalSugars?: number;
  addedSugars?: number;
  protein: number;
  vitamins?: Vitamin[];
  healthScore: number; // 1 to 100
  healthRatingLabel: string; // 'A - Excellent', 'B - Good', etc.
  summary: string;
  nutritionalHighlights: string[];
  nutritionalWarnings: string[];
  ingredientsList?: string[];
  scannedAt?: string;
  id?: string;
  isDemoFallback?: boolean;
  apiKeyMissingNotice?: boolean;
}

export interface FoodLogItem {
  id: string;
  productName: string;
  brand: string;
  loggedAt: string;
  servingsCount: number;
  servingSizeText: string;
  caloriesTotal: number;
  proteinTotal: number;
  carbsTotal: number;
  fatTotal: number;
  sodiumTotal: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
}

export interface UserProfile {
  name: string;
  calorieGoal: number;
  proteinGoal: number; // in grams
  carbsGoal: number; // in grams
  fatGoal: number; // in grams
  sodiumGoal: number; // in mg
  language?: string; // 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko'
}
