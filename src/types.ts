export interface Vitamin {
  name: string;
  value: string;
  percentDV?: number;
}

export interface IngredientCost {
  name: string;
  amount: string;
  costToman: number;
  costUSD: number;
}

export interface EstimatedPrice {
  amountToman: number;
  amountUSD: number;
  confidence?: "high" | "medium" | "low";
}

export interface ScannedLabel {
  productName: string;
  brand: string;
  foodType?: "dish" | "packaged_food" | "beverage";
  cuisine?: string;
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
  estimatedPrice?: EstimatedPrice;
  ingredientCosts?: IngredientCost[];
  culturalNotes?: string;
  priceDisclaimer?: string;
  scannedAt?: string;
  id?: string;
  isDemoFallback?: boolean;
  apiKeyMissingNotice?: boolean;
}

export interface FoodLogItem {
  id: string;
  productName: string;
  brand: string;
  foodType?: "dish" | "packaged_food" | "beverage";
  cuisine?: string;
  loggedAt: string;
  servingsCount: number;
  servingSizeText: string;
  caloriesTotal: number;
  proteinTotal: number;
  carbsTotal: number;
  fatTotal: number;
  sodiumTotal: number;
  priceToman?: number;
  priceUSD?: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  costTomanTotal: number;
  costUSDTotal: number;
}

export interface UserProfile {
  name: string;
  calorieGoal: number;
  proteinGoal: number; // in grams
  carbsGoal: number; // in grams
  fatGoal: number; // in grams
  sodiumGoal: number; // in mg
  language?: string; // 'en' | 'fa' | 'es'
  currency?: "IRT" | "USD"; // Toman or USD
  dailyBudgetToman?: number;
  dailyBudgetUSD?: number;
}
