import { ScannedLabel } from "../types";

export const INITIAL_SAMPLE_SCANS: ScannedLabel[] = [
  {
    id: "scan-sample-ghormeh",
    productName: "Ghormeh Sabzi with Saffron Rice",
    brand: "Authentic Persian Plate",
    foodType: "dish",
    cuisine: "Persian",
    servingSize: "380g (1 plate)",
    servingsPerContainer: 1,
    calories: 460,
    totalFat: 18,
    saturatedFat: 4.5,
    transFat: 0,
    cholesterol: 45,
    sodium: 520,
    totalCarbohydrate: 48,
    dietaryFiber: 8.5,
    totalSugars: 3,
    protein: 29,
    healthScore: 88,
    healthRatingLabel: "A - EXCELLENT",
    summary: "Traditional slow-cooked Persian herb stew with tender beef, kidney beans, and dried limes served over saffron basmati rice.",
    nutritionalHighlights: [
      "High in complete protein (29g)",
      "Rich in dietary fiber and iron from dark herbs",
      "Low in added sugars"
    ],
    nutritionalWarnings: [],
    ingredientsList: [
      "Fresh Parsley",
      "Coriander",
      "Fenugreek",
      "Lean Beef chunks",
      "Red Kidney Beans",
      "Dried Persian Limes (Limoo Omani)",
      "Saffron Rice"
    ],
    estimatedPrice: {
      amountToman: 980000,
      amountUSD: 4.25,
      confidence: "high"
    },
    scannedAt: "Today, 12:40 PM"
  },
  {
    id: "scan-sample-salad",
    productName: "Caesar Salad with Grilled Chicken",
    brand: "Fresh Mediterranean Deli",
    foodType: "dish",
    cuisine: "Mediterranean",
    servingSize: "320g bowl",
    servingsPerContainer: 1,
    calories: 380,
    totalFat: 14,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 70,
    sodium: 460,
    totalCarbohydrate: 16,
    dietaryFiber: 4.2,
    totalSugars: 2.5,
    protein: 42,
    healthScore: 92,
    healthRatingLabel: "A - EXCELLENT",
    summary: "Herb-marinated grilled chicken breast slices on crisp romaine lettuce, shaved parmesan, garlic croutons, and light olive-lemon dressing.",
    nutritionalHighlights: [
      "High protein density (42g)",
      "Low glycemic index carbohydrates",
      "Rich in calcium and vitamin K"
    ],
    nutritionalWarnings: [],
    ingredientsList: [
      "Grilled Chicken Breast",
      "Romaine Lettuce",
      "Aged Parmesan",
      "Whole Wheat Croutons",
      "Extra Virgin Olive Oil",
      "Lemon Zest"
    ],
    estimatedPrice: {
      amountToman: 790000,
      amountUSD: 3.45,
      confidence: "high"
    },
    scannedAt: "Today, 09:15 AM"
  },
  {
    id: "scan-sample-kabob",
    productName: "Chelo Kabab Koobideh",
    brand: "Persian Grill Traditional",
    foodType: "dish",
    cuisine: "Persian",
    servingSize: "350g serving",
    servingsPerContainer: 1,
    calories: 520,
    totalFat: 22,
    saturatedFat: 6.5,
    transFat: 0,
    cholesterol: 85,
    sodium: 580,
    totalCarbohydrate: 45,
    dietaryFiber: 3,
    totalSugars: 2,
    protein: 38,
    healthScore: 84,
    healthRatingLabel: "B - GOOD",
    summary: "Charbroiled minced meat kebabs served with grilled Persian tomatoes, sumac seasoning, and fluffy saffron basmati rice.",
    nutritionalHighlights: [
      "Rich in iron and zinc",
      "High protein (38g)",
      "Authentic charcoal aroma"
    ],
    nutritionalWarnings: [],
    ingredientsList: [
      "Minced Beef & Lamb",
      "Grated Onions",
      "Basmati Rice",
      "Pure Saffron",
      "Charred Tomato",
      "Sumac"
    ],
    estimatedPrice: {
      amountToman: 1150000,
      amountUSD: 5.0,
      confidence: "high"
    },
    scannedAt: "Yesterday, 08:30 PM"
  },
  {
    id: "scan-sample-yogurt",
    productName: "High-Protein Greek Yogurt",
    brand: "Chobani Plain",
    foodType: "packaged_food",
    cuisine: "Dairy & Probiotics",
    servingSize: "1 container (170g)",
    servingsPerContainer: 1,
    calories: 140,
    totalFat: 0.5,
    saturatedFat: 0.1,
    transFat: 0,
    cholesterol: 10,
    sodium: 65,
    totalCarbohydrate: 6,
    dietaryFiber: 0,
    totalSugars: 5,
    protein: 18,
    healthScore: 96,
    healthRatingLabel: "A - EXCELLENT",
    summary: "Thick strained non-fat Greek yogurt with live active cultures and zero added sugar. Excellent for muscle recovery and gut microbiome.",
    nutritionalHighlights: [
      "18g Pure Dairy Protein",
      "Zero added sugar",
      "Rich in active probiotic cultures"
    ],
    nutritionalWarnings: [],
    ingredientsList: [
      "Cultured Grade A Non-Fat Milk",
      "Live and Active Probiotic Cultures"
    ],
    estimatedPrice: {
      amountToman: 240000,
      amountUSD: 1.05,
      confidence: "high"
    },
    scannedAt: "Yesterday, 04:10 PM"
  }
];
