import { ScannedLabel } from "./types";

export interface MockLabelSample {
  id: string;
  name: string;
  brand: string;
  category: string;
  svgLabelUrl: string; // We'll render these dynamically inside the camera view
  result: ScannedLabel;
}

export const MOCK_SAMPLES: MockLabelSample[] = [
  {
    id: "greekyogurt",
    name: "0% Fat Vanilla Greek Yogurt",
    brand: "Chobani",
    category: "Healthy & High Protein",
    svgLabelUrl: "yogurt",
    result: {
      productName: "0% Fat Vanilla Greek Yogurt",
      brand: "Chobani",
      servingSize: "3/4 cup (170g)",
      servingsPerContainer: 1,
      calories: 100,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 10,
      sodium: 55,
      totalCarbohydrate: 11,
      dietaryFiber: 0,
      totalSugars: 9,
      addedSugars: 4,
      protein: 14,
      vitamins: [
        { name: "Calcium", value: "140mg", percentDV: 10 },
        { name: "Vitamin D", value: "2.5mcg", percentDV: 15 },
        { name: "Potassium", value: "220mg", percentDV: 4 }
      ],
      healthScore: 92,
      healthRatingLabel: "A - Excellent",
      summary: "This nonfat Greek yogurt is an outstanding high-protein choice. It has zero fat, low sodium, and is fortified with calcium and vitamin D.",
      nutritionalHighlights: [
        "Excellent high protein source (14g)",
        "Zero saturated fat and cholesterol-safe",
        "Excellent source of Vitamin D (15% DV)"
      ],
      nutritionalWarnings: [
        "Contains 4g of Added Sugars"
      ],
      ingredientsList: [
        "Cultured Nonfat Milk",
        "Vanilla Extract",
        "Fruit Pectin",
        "Natural Flavors",
        "Active Live Cultures"
      ]
    }
  },
  {
    id: "chocolatecookies",
    name: "Classic Chocolate Sandwich Cookies",
    brand: "Oreos",
    category: "Sweet Snack",
    svgLabelUrl: "cookies",
    result: {
      productName: "Classic Chocolate Sandwich Cookies",
      brand: "Oreos",
      servingSize: "3 cookies (34g)",
      servingsPerContainer: 12,
      calories: 160,
      totalFat: 7,
      saturatedFat: 2,
      transFat: 0,
      cholesterol: 0,
      sodium: 135,
      totalCarbohydrate: 25,
      dietaryFiber: 1,
      totalSugars: 14,
      addedSugars: 14,
      protein: 2,
      vitamins: [
        { name: "Iron", value: "1.8mg", percentDV: 10 },
        { name: "Calcium", value: "10mg", percentDV: 0 }
      ],
      healthScore: 22,
      healthRatingLabel: "E - Very Poor",
      summary: "Highly processed cookies with substantial added sugars and saturated fats. Best consumed in strict moderation as an occasional dessert.",
      nutritionalHighlights: [
        "Cholesterol free",
        "Low sodium per serving"
      ],
      nutritionalWarnings: [
        "High Added Sugars (14g - 28% of recommended daily value)",
        "Contains Saturated Fat (2g)",
        "Very low in dietary fiber and essential proteins"
      ],
      ingredientsList: [
        "Unbleached Enriched Flour",
        "Sugar",
        "Palm Oil",
        "Soybean Oil",
        "Cocoa",
        "High Fructose Corn Syrup",
        "Baking Soda",
        "Soy Lecithin",
        "Artificial Flavor"
      ]
    }
  },
  {
    id: "beeframen",
    name: "Instant Beef Ramen Noodles",
    brand: "Nissin",
    category: "Processed Dinner",
    svgLabelUrl: "ramen",
    result: {
      productName: "Instant Beef Ramen Noodles",
      brand: "Nissin",
      servingSize: "1 cup (64g)",
      servingsPerContainer: 1,
      calories: 290,
      totalFat: 12,
      saturatedFat: 6,
      transFat: 0,
      cholesterol: 5,
      sodium: 1160,
      totalCarbohydrate: 38,
      dietaryFiber: 2,
      totalSugars: 2,
      addedSugars: 1,
      protein: 6,
      vitamins: [
        { name: "Iron", value: "2.7mg", percentDV: 15 },
        { name: "Calcium", value: "20mg", percentDV: 2 },
        { name: "Potassium", value: "110mg", percentDV: 2 }
      ],
      healthScore: 35,
      healthRatingLabel: "D - Poor",
      summary: "This instant ramen cup contains extremely high sodium levels, representing over 50% of the recommended daily intake in a single serving, paired with elevated saturated fat.",
      nutritionalHighlights: [
        "Provides 6g of protein",
        "Good source of dietary Iron (15% DV)"
      ],
      nutritionalWarnings: [
        "Excessive Sodium (1160mg - 50% DV) can increase blood pressure",
        "High Saturated Fat (6g - 30% DV)",
        "Refined carbohydrates with low overall nutrient density"
      ],
      ingredientsList: [
        "Enriched Flour",
        "Palm Oil",
        "Salt",
        "Monosodium Glutamate",
        "Dehydrated Beef Powder",
        "Caramel Color",
        "Hydrolyzed Soy Protein",
        "Onion Powder",
        "Garlic Powder",
        "Disodium Guanylate"
      ]
    }
  }
];
