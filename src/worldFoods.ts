export interface WorldFood {
  id: string;
  name: string;
  origin: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  healthScore: number;
  healthRatingLabel: string;
  summary: string;
  nutritionalHighlights: string[];
  nutritionalWarnings: string[];
  ingredientsList: string[];
  servingSize: string;
  funFact: string;
  emoji: string;
}

export const WORLD_FOODS: WorldFood[] = [
  {
    id: "kimchi",
    name: "Korean Kimchi",
    origin: "South Korea",
    emoji: "🥬",
    description: "A traditional fermented Korean side dish made of salted napa cabbage and radishes with a chili paste kick.",
    calories: 23,
    protein: 2,
    carbs: 4,
    fat: 0.2,
    sodium: 490,
    healthScore: 95,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 cup (150g)",
    funFact: "Kimchi is loaded with probiotics ('good bacteria') that thrive during fermentation, significantly boosting gut microbiome health and digestion.",
    summary: "Kimchi is an exceptionally low-calorie, nutrient-dense superfood. It contains live active cultures that support digestive immune health.",
    nutritionalHighlights: [
      "Excellent source of gut-friendly probiotics",
      "Very low calorie density (only 23 kcal)",
      "High in Vitamin C, K, and folate"
    ],
    nutritionalWarnings: [
      "Moderate sodium levels (490mg) due to brining process"
    ],
    ingredientsList: ["Napa Cabbage", "Radish", "Red Pepper Powder", "Garlic", "Ginger", "Salt", "Green Onion"]
  },
  {
    id: "hummus",
    name: "Lebanese Hummus",
    origin: "Lebanon",
    emoji: "🧆",
    description: "A smooth, creamy dip made from cooked, mashed chickpeas blended with tahini, lemon juice, and garlic.",
    calories: 166,
    protein: 8,
    carbs: 14,
    fat: 10,
    sodium: 300,
    healthScore: 88,
    healthRatingLabel: "A - Excellent",
    servingSize: "1/2 cup (100g)",
    funFact: "The pairing of sesame-derived tahini and chickpeas forms a complete protein, supplying all essential amino acids.",
    summary: "Hummus offers a rich combination of plant protein, dietary fiber, and heart-healthy monounsaturated fats from tahini.",
    nutritionalHighlights: [
      "Excellent plant-based protein source",
      "Rich in dietary fiber (6g) for blood sugar stability",
      "Healthy fats from pure ground sesame seeds"
    ],
    nutritionalWarnings: [
      "Calorically dense, monitor serving sizes"
    ],
    ingredientsList: ["Chickpeas", "Tahini (Sesame Paste)", "Water", "Lemon Juice", "Garlic", "Sea Salt", "Olive Oil"]
  },
  {
    id: "acai",
    name: "Amazonian Açaí Bowl",
    origin: "Brazil",
    emoji: "🍓",
    description: "A thick smoothie bowl made of pureed frozen açaí palm fruit, typically topped with fresh berries, bananas, and seeds.",
    calories: 180,
    protein: 3,
    carbs: 26,
    fat: 7,
    sodium: 15,
    healthScore: 82,
    healthRatingLabel: "B - Good",
    servingSize: "1 bowl (200g)",
    funFact: "Açaí berries have more antioxidant molecules than almost any other fruit, helping combat oxidative stress and lower inflammation.",
    summary: "This tropical berry dish provides high levels of heart-healthy oleic acids and antioxidants, but beware of added sugars in sweeteners.",
    nutritionalHighlights: [
      "Extremely high in anthocyanins and antioxidants",
      "Good source of healthy omega-9 fatty acids",
      "Low in natural sodium"
    ],
    nutritionalWarnings: [
      "Watch out for sweetened granolas or honey toppings which add sugars"
    ],
    ingredientsList: ["Organic Açaí Puree", "Guarana Extract", "Banana", "Strawberries", "Blueberries", "Chia Seeds"]
  },
  {
    id: "injera",
    name: "Ethiopian Injera",
    origin: "Ethiopia",
    emoji: "🥞",
    description: "A sourdough flatbread with a unique spongy texture, traditionally made out of iron-rich teff flour.",
    calories: 120,
    protein: 4,
    carbs: 23,
    fat: 0.8,
    sodium: 80,
    healthScore: 90,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 flatbread (100g)",
    funFact: "Injera is made from Teff, which is the smallest grain in the world (about 1/150th the size of wheat) but packed with iron, protein, and calcium.",
    summary: "A wholesome fermented ancient grain flatbread that is gluten-free, rich in iron, and easy on the digestive tract.",
    nutritionalHighlights: [
      "Naturally gluten-free and easily digestible",
      "Superb source of slow-digesting complex carbohydrates",
      "Outstanding dietary iron density"
    ],
    nutritionalWarnings: [
      "Sourdough fermentation gives a tart taste, minimal nutritional downsides"
    ],
    ingredientsList: ["Teff Flour", "Water", "Wild Yeast Culture"]
  },
  {
    id: "ceviche",
    name: "Peruvian Ceviche",
    origin: "Peru",
    emoji: "🐟",
    description: "Fresh raw fish cured in fresh citrus juices, spiced with ají, chili peppers, chopped onions, and cilantro.",
    calories: 140,
    protein: 21,
    carbs: 6,
    fat: 2,
    sodium: 380,
    healthScore: 94,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 cup (180g)",
    funFact: "The citric acid in the lime juice causes the proteins in the seafood to denature, effectively 'cooking' the fish without heat.",
    summary: "Ceviche is a world-class dish for lean high protein nutrition, packed with essential minerals and heart-healthy omega-3 fats.",
    nutritionalHighlights: [
      "Extremely high protein density (21g protein per serving)",
      "Virtually fat-free and low carbohydrate",
      "Provides premium Omega-3 fatty acids for cognitive care"
    ],
    nutritionalWarnings: [
      "Contains raw fish; source ingredients must be ultra-fresh to ensure safety"
    ],
    ingredientsList: ["Sea Bass Fillet", "Lime Juice", "Red Onion", "Cilantro", "Ají Limo Chili", "Sweet Potato", "Salt"]
  }
];
