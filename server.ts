import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Safe body parsing middleware for both local and Vercel serverless environments
if (!process.env.VERCEL) {
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));
} else {
  // On Vercel, req.body is pre-parsed by the platform.
  // If it's undefined, we parse it safely only for write methods (POST, PUT, PATCH).
  app.use((req, res, next) => {
    if (req.body !== undefined) {
      return next();
    }
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      express.json({ limit: "15mb" })(req, res, (err) => {
        if (err) return next(err);
        if (req.body !== undefined) return next();
        express.urlencoded({ limit: "15mb", extended: true })(req, res, next);
      });
    } else {
      next();
    }
  });
}

// Lazy-initialized Google GenAI client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper sleep function for retry backoff
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Curated high-fidelity fallback foods with dish pricing and ingredient breakdown for demo mode
const FALLBACK_FOODS = [
  {
    productName: "Ghormeh Sabzi with Saffron Rice",
    brand: "Authentic Persian Plate",
    foodType: "dish",
    cuisine: "Persian / ایرانی",
    servingSize: "1 plate (350g)",
    servingsPerContainer: 1,
    calories: 420,
    totalFat: 16,
    saturatedFat: 4,
    transFat: 0,
    cholesterol: 45,
    sodium: 480,
    totalCarbohydrate: 38,
    dietaryFiber: 8,
    totalSugars: 2,
    addedSugars: 0,
    protein: 28,
    vitamins: [
      { name: "Iron", value: "4.2mg", percentDV: 24 },
      { name: "Vitamin K", value: "180mcg", percentDV: 150 },
      { name: "Vitamin C", value: "22mg", percentDV: 25 }
    ],
    healthScore: 92,
    healthRatingLabel: "A - Excellent",
    summary: "Traditional Persian slow-simmered herb stew rich in bioavailable iron, dietary fiber from kidney beans, and antioxidant green herbs.",
    nutritionalHighlights: ["High Protein (28g)", "Rich in Dietary Fiber (8g)", "Loaded with Vitamin K & Iron"],
    nutritionalWarnings: ["Ensure controlled oil during herb sautéing"],
    ingredientsList: ["Lamb Chuck", "Parsley", "Leek (Tareh)", "Coriander", "Fenugreek", "Red Kidney Beans", "Dried Lime", "Basmati Rice", "Saffron"],
    estimatedPrice: {
      amountToman: 185000,
      amountUSD: 3.2,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Lamb Chuck (120g)", amount: "120g", costToman: 110000, costUSD: 1.9 },
      { name: "Herb Medley (100g)", amount: "100g", costToman: 25000, costUSD: 0.45 },
      { name: "Basmati Rice & Saffron", amount: "80g", costToman: 26000, costUSD: 0.45 },
      { name: "Red Kidney Beans (40g)", amount: "40g", costToman: 12000, costUSD: 0.22 },
      { name: "Dried Lime & Spices", amount: "portion", costToman: 12000, costUSD: 0.18 }
    ],
    culturalNotes: "The undisputed national dish of Iran, balancing hot and cold energies through cooling dried black limes and warm herbs.",
    priceDisclaimer: "قیمت‌ها بر اساس تخمین هزینه مواد اولیه محاسبه شده و جنبه تخمینی دارد."
  },
  {
    productName: "Chelo Kabab Koobideh",
    brand: "Persian Grill Traditional",
    foodType: "dish",
    cuisine: "Persian / ایرانی",
    servingSize: "2 skewers with rice (400g)",
    servingsPerContainer: 1,
    calories: 680,
    totalFat: 28,
    saturatedFat: 11,
    transFat: 0.5,
    cholesterol: 85,
    sodium: 580,
    totalCarbohydrate: 62,
    dietaryFiber: 3,
    totalSugars: 3,
    addedSugars: 0,
    protein: 38,
    vitamins: [
      { name: "Zinc", value: "6.8mg", percentDV: 62 },
      { name: "Vitamin B12", value: "2.4mcg", percentDV: 100 },
      { name: "Iron", value: "3.8mg", percentDV: 21 }
    ],
    healthScore: 78,
    healthRatingLabel: "B - Good",
    summary: "High-protein Persian charcoal-grilled skewers with aromatic saffron basmati rice, grilled tomato, and digestion-aiding sumac.",
    nutritionalHighlights: ["Superior Protein Payload (38g)", "Rich in Natural Zinc & B12", "Charcoal Grilled"],
    nutritionalWarnings: ["High in Saturated Fat", "Calorie dense meal"],
    ingredientsList: ["Minced Lamb/Beef", "Basmati Rice", "Saffron", "Onion", "Sumac", "Tomato", "Butter", "Black Pepper"],
    estimatedPrice: {
      amountToman: 240000,
      amountUSD: 4.1,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Minced Meat (200g)", amount: "200g", costToman: 160000, costUSD: 2.8 },
      { name: "Basmati Rice & Saffron", amount: "120g", costToman: 40000, costUSD: 0.7 },
      { name: "Grilled Tomatoes & Sumac", amount: "2 pcs", costToman: 18000, costUSD: 0.3 },
      { name: "Onions & Seasonings", amount: "portion", costToman: 10000, costUSD: 0.18 },
      { name: "Butter & Garnish", amount: "portion", costToman: 12000, costUSD: 0.12 }
    ],
    culturalNotes: "A royal culinary masterpiece dating from the Qajar dynasty, served on festive celebrations throughout Iran.",
    priceDisclaimer: "قیمت‌ها بر اساس تخمین هزینه مواد اولیه محاسبه شده و جنبه تخمینی دارد."
  },
  {
    productName: "High-Protein Greek Yogurt",
    brand: "Chobani Plain",
    foodType: "packaged_food",
    cuisine: "Mediterranean",
    servingSize: "1 container (150g)",
    servingsPerContainer: 1,
    calories: 90,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 5,
    sodium: 55,
    totalCarbohydrate: 5,
    dietaryFiber: 0,
    totalSugars: 4,
    addedSugars: 0,
    protein: 16,
    vitamins: [
      { name: "Calcium", value: "180mg", percentDV: 15 },
      { name: "Potassium", value: "220mg", percentDV: 4 }
    ],
    healthScore: 95,
    healthRatingLabel: "A - Excellent",
    summary: "An incredibly nutrient-dense food, offering an exceptional protein payload with zero fat and zero added sugars.",
    nutritionalHighlights: ["High Protein (16g)", "Zero Added Sugars", "Fat Free"],
    nutritionalWarnings: [],
    ingredientsList: ["Cultured Nonfat Milk", "L. Acidophilus", "Bifidus", "L. Casei"],
    estimatedPrice: {
      amountToman: 45000,
      amountUSD: 0.8,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Cultured Milk Base (150g)", amount: "150g", costToman: 40000, costUSD: 0.7 },
      { name: "Live Active Cultures", amount: "portion", costToman: 5000, costUSD: 0.1 }
    ],
    culturalNotes: "Traditionally strained sheep or cow milk yogurt common across Greece, Turkey, and the Levant.",
    priceDisclaimer: "قیمت‌ها به صورت تخمینی ارائه شده‌اند."
  },
  {
    productName: "Organic Almond Milk (Unsweetened)",
    brand: "Earth's Own",
    foodType: "beverage",
    cuisine: "International",
    servingSize: "1 cup (240ml)",
    servingsPerContainer: 4,
    calories: 35,
    totalFat: 3,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 160,
    totalCarbohydrate: 1,
    dietaryFiber: 1,
    totalSugars: 0,
    addedSugars: 0,
    protein: 1,
    vitamins: [
      { name: "Calcium", value: "300mg", percentDV: 25 },
      { name: "Vitamin D", value: "2mcg", percentDV: 10 },
      { name: "Vitamin E", value: "7.5mg", percentDV: 50 }
    ],
    healthScore: 88,
    healthRatingLabel: "A - Excellent",
    summary: "An excellent dairy-free alternative that is extremely low in calories, sugar-free, and fortified with essential Calcium and Vitamin D.",
    nutritionalHighlights: ["Zero Added Sugars", "Low Calorie", "Fortified with Calcium"],
    nutritionalWarnings: ["Low Protein content"],
    ingredientsList: ["Almond Base (Water, Almonds)", "Calcium Carbonate", "Gellan Gum", "Sea Salt", "Natural Flavor", "Vitamin A Palmitate", "Vitamin D2"],
    estimatedPrice: {
      amountToman: 55000,
      amountUSD: 0.95,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Blanched Almonds", amount: "30g", costToman: 35000, costUSD: 0.6 },
      { name: "Filtered Water & Fortification", amount: "200ml", costToman: 20000, costUSD: 0.35 }
    ],
    culturalNotes: "Popularized as a dairy alternative with roots in medieval European and Middle Eastern cooking.",
    priceDisclaimer: "قیمت‌ها به صورت تخمینی ارائه شده‌اند."
  }
];

const FALLBACK_FOODS_FA = [
  {
    productName: "قورمه سبزی اصیل با برنج زعفرانی",
    brand: "بشقاب سنتی ایرانی",
    foodType: "dish",
    cuisine: "ایرانی",
    servingSize: "۱ بشقاب (۳۵۰ گرم)",
    servingsPerContainer: 1,
    calories: 420,
    totalFat: 16,
    saturatedFat: 4,
    transFat: 0,
    cholesterol: 45,
    sodium: 480,
    totalCarbohydrate: 38,
    dietaryFiber: 8,
    totalSugars: 2,
    addedSugars: 0,
    protein: 28,
    vitamins: [
      { name: "آهن", value: "4.2mg", percentDV: 24 },
      { name: "ویتامین K", value: "180mcg", percentDV: 150 },
      { name: "ویتامین C", value: "22mg", percentDV: 25 }
    ],
    healthScore: 92,
    healthRatingLabel: "A - عالی",
    summary: "خورش اصیل سنتی ایرانی سرشار از آهن با جذب بالا، فیبر رژیمی لوبیا قرمز و سبزیجات معطر غنی از آنتی‌اکسیدان.",
    nutritionalHighlights: ["پروتئین بالا (۲۸ گرم)", "سرشار از فیبر رژیمی (۸ گرم)", "منبع غنی ویتامین K و آهن طبیعی"],
    nutritionalWarnings: ["میزان روغن سرخ‌کردن سبزی را در حد ملایم نگه دارید"],
    ingredientsList: ["گوشت گوساله یا گوسفند", "جعفری", "تره", "گشنیز", "شنبلیله", "لوبیا قرمز", "لیمو عمانی", "برنج زعفرانی"],
    estimatedPrice: {
      amountToman: 185000,
      amountUSD: 3.2,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "گوشت گوسفندی / گوساله (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 110000, costUSD: 1.9 },
      { name: "سبزی قورمه سرخ‌شده (۱۰۰ گرم)", amount: "۱۰۰ گرم", costToman: 25000, costUSD: 0.45 },
      { name: "برنج زعفرانی دم‌کشیده (۸۰ گرم)", amount: "۸۰ گرم", costToman: 26000, costUSD: 0.45 },
      { name: "لوبیا قرمز درجه یک (۴۰ گرم)", amount: "۴۰ گرم", costToman: 12000, costUSD: 0.22 },
      { name: "لیمو عمانی و ادویه خورش", amount: "سهم مصرفی", costToman: 12000, costUSD: 0.18 }
    ],
    culturalNotes: "خورش ملی و تاریخی ایران که بازتاب تعادل طبع‌های گرم و سرد در مکتب سنتی آشپزی ایرانی است.",
    priceDisclaimer: "قیمت‌ها بر اساس تخمین هزینه مواد اولیه محاسبه شده و جنبه تخمینی دارد."
  },
  {
    productName: "چلو کباب کوبیده سنتی با گوجه",
    brand: "کباب سنتی ذغالی",
    foodType: "dish",
    cuisine: "ایرانی",
    servingSize: "۲ سیخ با چلو زعفرانی (۴۰۰ گرم)",
    servingsPerContainer: 1,
    calories: 680,
    totalFat: 28,
    saturatedFat: 11,
    transFat: 0.5,
    cholesterol: 85,
    sodium: 580,
    totalCarbohydrate: 62,
    dietaryFiber: 3,
    totalSugars: 3,
    addedSugars: 0,
    protein: 38,
    vitamins: [
      { name: "روی (زینک)", value: "6.8mg", percentDV: 62 },
      { name: "ویتامین B12", value: "2.4mcg", percentDV: 100 },
      { name: "آهن", value: "3.8mg", percentDV: 21 }
    ],
    healthScore: 78,
    healthRatingLabel: "B - خوب",
    summary: "کباب اصیل ذغالی ایرانی با گوشت مخلوط تازه، چلو معطر زعفرانی، گوجه کبابی و سماق کاهنده چربی.",
    nutritionalHighlights: ["پروتئین بسیار بالا (۳۸ گرم) مناسب عضله‌سازی", "سرشار از روی و ویتامین B12", "پخت سنتی روی زغال"],
    nutritionalWarnings: ["چربی اشباع نسبتاً بالا", "وعده با تراکم کالری بالا"],
    ingredientsList: ["گوشت چرخ‌کرده قلوه‌گاه و راسته", "برنج ایرانی", "زعفران", "پیاز", "سماق", "گوجه‌فرنگی", "کره"],
    estimatedPrice: {
      amountToman: 240000,
      amountUSD: 4.1,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "گوشت چرخ‌کرده مخلوط (۲۰۰ گرم)", amount: "۲۰۰ گرم", costToman: 160000, costUSD: 2.8 },
      { name: "برنج طارم ممتاز با زعفران (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 40000, costUSD: 0.7 },
      { name: "گوجه کبابی و سماق تبریز", amount: "۲ عدد", costToman: 18000, costUSD: 0.3 },
      { name: "پیاز رنده شده و ادویه", amount: "۵۰ گرم", costToman: 10000, costUSD: 0.18 },
      { name: "کره حیوانی و لیمو ترش", amount: "سهم مصرفی", costToman: 12000, costUSD: 0.12 }
    ],
    culturalNotes: "شاهکار مطبخ قاجار در تبریز و تهران که امروز محبوب‌ترین غذای میهمانی‌ها و نماد افتخار غذایی ایران است.",
    priceDisclaimer: "قیمت‌ها بر اساس تخمین هزینه مواد اولیه محاسبه شده و جنبه تخمینی دارد."
  },
  {
    productName: "ماست یونانی پرپروتئین طبیعی",
    brand: "چوبانی ساده",
    foodType: "packaged_food",
    cuisine: "مدیترانه‌ای",
    servingSize: "۱ کاسه (۱۵۰ گرم)",
    servingsPerContainer: 1,
    calories: 90,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 5,
    sodium: 55,
    totalCarbohydrate: 5,
    dietaryFiber: 0,
    totalSugars: 4,
    addedSugars: 0,
    protein: 16,
    vitamins: [
      { name: "کلسیم", value: "180mg", percentDV: 15 },
      { name: "پتاسیم", value: "220mg", percentDV: 4 }
    ],
    healthScore: 95,
    healthRatingLabel: "A - عالی",
    summary: "ماده غذایی فوق‌العاده مغذی با ۱۶ گرم پروتئین خالص، بدون چربی مضر و بدون قند افزوده.",
    nutritionalHighlights: ["پروتئین بالا (۱۶ گرم)", "بدون قند افزوده", "کاملاً بدون چربی"],
    nutritionalWarnings: [],
    ingredientsList: ["شیر بدون چربی پاستوریزه", "باکتری‌های زنده پروبیوتیک فعال"],
    estimatedPrice: {
      amountToman: 45000,
      amountUSD: 0.8,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "شیر باکیفیت تغلیظ شده (۱۵۰ گرم)", amount: "۱۵۰ گرم", costToman: 40000, costUSD: 0.7 },
      { name: "کشت پروبیوتیک فعال", amount: "سهم", costToman: 5000, costUSD: 0.1 }
    ],
    culturalNotes: "ماست چکیده سنتی که قرن‌ها در یونان، ترکیه و کشورهای حوزه مدیترانه تهیه می‌شود.",
    priceDisclaimer: "قیمت‌ها به صورت تخمینی ارائه شده‌اند."
  },
  {
    productName: "شیر بادام ارگانیک (بدون قند افزوده)",
    brand: "ارثز اون",
    foodType: "beverage",
    cuisine: "بین‌المللی",
    servingSize: "۱ لیوان (۲۴۰ میلی‌لیتر)",
    servingsPerContainer: 4,
    calories: 35,
    totalFat: 3,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 160,
    totalCarbohydrate: 1,
    dietaryFiber: 1,
    totalSugars: 0,
    addedSugars: 0,
    protein: 1,
    vitamins: [
      { name: "کلسیم", value: "300mg", percentDV: 25 },
      { name: "ویتامین D", value: "2mcg", percentDV: 10 },
      { name: "ویتامین E", value: "7.5mg", percentDV: 50 }
    ],
    healthScore: 88,
    healthRatingLabel: "A - عالی",
    summary: "جایگزین گیاهی عالی برای لبنیات با کالری بسیار پایین، بدون شکر و غنی شده با کلسیم و ویتامین D.",
    nutritionalHighlights: ["بدون قند افزوده", "بسیار کم‌کالری", "غنی از کلسیم و ویتامین D"],
    nutritionalWarnings: ["پروتئین پایین"],
    ingredientsList: ["پایه بادام ارگانیک", "کربنات کلسیم", "صمغ ژلان", "نمک دریا", "ویتامین D2"],
    estimatedPrice: {
      amountToman: 55000,
      amountUSD: 0.95,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "بادام خام پوست‌کنده (۳۰ گرم)", amount: "۳۰ گرم", costToman: 35000, costUSD: 0.6 },
      { name: "آب تصفیه شده و املاح معدنی", amount: "۲۰۰ میلی‌لیتر", costToman: 20000, costUSD: 0.35 }
    ],
    culturalNotes: "نوشیدنی گیاهی که در قرون وسطی نیز در آشپزی خاورمیانه و اروپا کاربرد داشته است.",
    priceDisclaimer: "قیمت‌ها به صورت تخمینی ارائه شده‌اند."
  }
];

// API Routes
app.post("/api/scan-label", async (req, res) => {
  try {
    const { imageBase64, mimeType, language = "en" } = req.body;
    const isFa = language === "fa";

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image data" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to high-fidelity demo data with warning...");
      const pool = isFa ? FALLBACK_FOODS_FA : FALLBACK_FOODS;
      const randomIndex = Math.floor(Math.random() * pool.length);
      const fallbackItem = {
        ...pool[randomIndex],
        isDemoFallback: true,
        apiKeyMissingNotice: true,
      };
      return res.json(fallbackItem);
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    let promptString = `Analyze this food image. The image can be either:
1. A prepared meal, cooked plate of food, or restaurant dish (e.g. Persian Ghormeh Sabzi, Kebab, Rice, Pizza, Pasta, Salad, Burger, Stew, Soup, etc.).
2. A packaged food product or nutrition facts label.

Detect the exact type of food or dish, its cuisine origin (e.g. "Persian / ایرانی", "Italian", "American", "Middle Eastern", etc.), and whether it is a prepared "dish", "packaged_food", or "beverage".
Extract or accurately calculate nutritional values (calories, protein, total fat, carbohydrates, dietary fiber, sugars, sodium, vitamins).
CRITICAL FOR THIS APPLICATION:
- Estimate the realistic cost/price per dish or serving in BOTH Iranian Tomans (e.g., 185000 for 185,000 Tomans) and US Dollars (USD).
- Break down the constituent raw ingredients with their estimated portion amounts and individual estimated costs in Tomans and USD.
- Calculate an objective Health Score (1-100) and Nutri-Score rating.
- Provide key nutritional highlights, warnings, summary, and cultural/historical notes.
- Format the output strictly according to the provided JSON schema. Ensure numeric values are numbers, not strings.`;

    if (isFa) {
      promptString += `\n\nCRITICAL LOCALIZATION DIRECTIVE: The user's application interface is in Persian (فارسی).
You MUST provide all textual fields including productName, brand, cuisine, servingSize, summary, nutritionalHighlights, nutritionalWarnings, culturalNotes, ingredientsList, and ingredientCosts (both name and amount) in natural, fluent Persian (فارسی).
For example:
- productName: "قورمه سبزی با برنج زعفرانی" or "پیتزا پپرونی"
- servingSize: "۱ بشقاب (۳۵۰ گرم)"
- healthRatingLabel: "A - عالی" or "B - خوب" or "C - متوسط" or "D - ضعیف"`;
    }

    let responseText = "";
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: any = null;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const response = await getAIClient().models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [imagePart, { text: promptString }] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                productName: {
                  type: Type.STRING,
                  description: "The name of the food dish or product (e.g. 'Ghormeh Sabzi with Saffron Rice' or 'Greek Yogurt').",
                },
                brand: {
                  type: Type.STRING,
                  description: "The brand name or restaurant/style origin (e.g. 'Persian Traditional Plate' or brand name).",
                },
                foodType: {
                  type: Type.STRING,
                  description: "Type of food: 'dish' (for cooked/prepared plates), 'packaged_food', or 'beverage'.",
                },
                cuisine: {
                  type: Type.STRING,
                  description: "Cuisine or cultural origin, e.g. 'Persian / ایرانی', 'Mediterranean', 'Italian', 'International'.",
                },
                servingSize: {
                  type: Type.STRING,
                  description: "The serving size text, e.g. '1 plate (350g)' or '1 cup (240ml)'.",
                },
                servingsPerContainer: {
                  type: Type.NUMBER,
                  description: "Number of servings per container or plate. Defaults to 1 for a single plate.",
                },
                calories: {
                  type: Type.NUMBER,
                  description: "Total calories (kcal) per single serving.",
                },
                totalFat: {
                  type: Type.NUMBER,
                  description: "Total fat in grams per single serving.",
                },
                saturatedFat: {
                  type: Type.NUMBER,
                  description: "Saturated fat in grams per single serving. Use 0 if not present.",
                },
                transFat: {
                  type: Type.NUMBER,
                  description: "Trans fat in grams per single serving. Use 0 if not present.",
                },
                cholesterol: {
                  type: Type.NUMBER,
                  description: "Cholesterol in milligrams (mg) per single serving. Use 0 if not present.",
                },
                sodium: {
                  type: Type.NUMBER,
                  description: "Sodium in milligrams (mg) per single serving. Use 0 if not present.",
                },
                totalCarbohydrate: {
                  type: Type.NUMBER,
                  description: "Total Carbohydrates in grams per single serving.",
                },
                dietaryFiber: {
                  type: Type.NUMBER,
                  description: "Dietary fiber in grams per single serving. Use 0 if not present.",
                },
                totalSugars: {
                  type: Type.NUMBER,
                  description: "Total sugars in grams per single serving. Use 0 if not present.",
                },
                addedSugars: {
                  type: Type.NUMBER,
                  description: "Added sugars in grams per single serving. Use 0 if not present.",
                },
                protein: {
                  type: Type.NUMBER,
                  description: "Protein in grams per single serving.",
                },
                vitamins: {
                  type: Type.ARRAY,
                  description: "Vitamins and minerals listed or estimated (e.g. Iron, Calcium, Vitamin D, Vitamin C, Potassium).",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Name of the vitamin or mineral, e.g. 'Calcium' or 'Iron'." },
                      value: { type: Type.STRING, description: "Amount or value as listed or estimated, e.g. '4.2mg' or '260mg'." },
                      percentDV: { type: Type.NUMBER, description: "The percent Daily Value (% DV) as a number, e.g. 20 for 20%." },
                    },
                    required: ["name", "value"],
                  },
                },
                healthScore: {
                  type: Type.NUMBER,
                  description: "An overall healthiness rating from 1 to 100, calculated objectively based on nutrient density, sugar/salt/fat content, and fiber/protein profile.",
                },
                healthRatingLabel: {
                  type: Type.STRING,
                  description: "Nutri-Score style rating text, choosing from 'A - Excellent', 'B - Good', 'C - Moderate', 'D - Poor', 'E - Very Poor'.",
                },
                summary: {
                  type: Type.STRING,
                  description: "A summary explaining the nutritional quality and nature of this food in 1-2 friendly sentences.",
                },
                nutritionalHighlights: {
                  type: Type.ARRAY,
                  description: "List of positive properties (e.g. 'High in Protein', 'Rich in Dietary Fiber', 'Loaded with Iron').",
                  items: { type: Type.STRING },
                },
                nutritionalWarnings: {
                  type: Type.ARRAY,
                  description: "List of warning properties (e.g. 'High Saturated Fat', 'High Sodium').",
                  items: { type: Type.STRING },
                },
                ingredientsList: {
                  type: Type.ARRAY,
                  description: "List of constituent ingredients. Return empty array if not discernible.",
                  items: { type: Type.STRING },
                },
                estimatedPrice: {
                  type: Type.OBJECT,
                  description: "Estimated cost of this dish or serving based on raw ingredient market prices.",
                  properties: {
                    amountToman: { type: Type.NUMBER, description: "Estimated cost in Iranian Tomans, e.g. 185000" },
                    amountUSD: { type: Type.NUMBER, description: "Estimated cost in US Dollars, e.g. 3.2" },
                    confidence: { type: Type.STRING, description: "'high', 'medium', or 'low'" }
                  },
                  required: ["amountToman", "amountUSD"]
                },
                ingredientCosts: {
                  type: Type.ARRAY,
                  description: "Estimated cost breakdown of the main raw ingredients composing this dish.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Ingredient name and portion amount, e.g. 'Lamb / Beef (120g)' or 'Basmati Rice (80g)'" },
                      amount: { type: Type.STRING, description: "Amount used, e.g. '120g' or '1 cup'" },
                      costToman: { type: Type.NUMBER, description: "Estimated ingredient cost in Tomans" },
                      costUSD: { type: Type.NUMBER, description: "Estimated ingredient cost in USD" }
                    },
                    required: ["name", "amount", "costToman", "costUSD"]
                  }
                },
                culturalNotes: {
                  type: Type.STRING,
                  description: "Cultural history, culinary background, and traditions associated with this food."
                },
                priceDisclaimer: {
                  type: Type.STRING,
                  description: "Standard project disclaimer: 'قیمت‌ها و ارزش غذایی به صورت تخمینی توسط مدل هوش مصنوعی بر اساس مواد اولیه محاسبه شده‌اند.'"
                }
              },
              required: [
                "productName",
                "brand",
                "servingSize",
                "servingsPerContainer",
                "calories",
                "totalFat",
                "sodium",
                "totalCarbohydrate",
                "protein",
                "healthScore",
                "healthRatingLabel",
                "summary",
                "nutritionalHighlights",
                "nutritionalWarnings",
              ],
            },
          },
        });
        responseText = response.text || "";
        break; // Success! Break out of the retry loop.
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempts} failed:`, err.message || String(err));
        
        // Check if retryable (e.g., 503 UNAVAILABLE, 429 rate limit, high demand API errors)
        const errStr = String(err).toLowerCase();
        const isRetryable = err.status === 503 || err.statusCode === 503 ||
                            err.status === 429 || err.statusCode === 429 ||
                            errStr.includes("503") || errStr.includes("unavailable") ||
                            errStr.includes("429") || errStr.includes("exhausted") ||
                            errStr.includes("demand");
        
        if (attempts < maxAttempts && isRetryable) {
          const waitTime = attempts * 800;
          console.log(`Waiting ${waitTime}ms before retry...`);
          await sleep(waitTime);
        } else {
          break; // Exit loop if not retryable or we're at max attempts
        }
      }
    }

    if (!responseText) {
      console.error("==================================================");
      console.error("GEMINI API SCAN CALL COMPLETED WITH FAILURE!");
      console.error(`- Max attempts (${maxAttempts}) reached or call timed out.`);
      console.error(`- Last API error encountered:`, lastError?.message || String(lastError || "Unknown API error"));
      if (lastError?.stack) {
        console.error(`- Last error stack:\n`, lastError.stack);
      }
      console.error("Activating local high-fidelity fallback to keep app running smoothly...");
      console.error("==================================================");

      // Pick a random fallback food to keep the app working for the user beautifully
      const randomIndex = Math.floor(Math.random() * FALLBACK_FOODS.length);
      const fallbackItem = {
        ...FALLBACK_FOODS[randomIndex],
        isDemoFallback: true,
        originalScanError: lastError?.message || String(lastError || "Unknown API error")
      };
      return res.json(fallbackItem);
    }

    const parsedData = JSON.parse(responseText || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("==================================================");
    console.error("SERVER-SIDE NUTRISCAN EXCEPTION DETECTED!");
    console.error("- Error Message:", error.message || String(error));
    if (error.stack) {
      console.error("- Stack Trace:\n", error.stack);
    }
    console.error("- Request Body Keys:", Object.keys(req.body || {}));
    if (req.body && req.body.imageBase64) {
      console.error("- Base64 Length:", req.body.imageBase64.length);
      console.error("- MIME Type:", req.body.mimeType);
    }
    console.error("==================================================");

    return res.status(500).json({
      error: "Failed to scan and analyze food label.",
      details: error.message || String(error),
      stack: error.stack,
    });
  }
});

// Export app for serverless deployment (e.g. Vercel)
export default app;

// Configure Vite or Static Asset Serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  setupVite().catch((err) => {
    console.error("Failed to start Vite dev server:", err);
  });
}
