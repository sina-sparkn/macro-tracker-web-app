import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  getAllDiaryEntries,
  insertDiaryEntry,
  deleteDiaryEntryById,
  clearDiaryEntries,
  seedSampleHistory,
  getDatabaseStats,
  resolveLiveOrIndexedExchangeRate
} from "../server/sqliteDb.ts";

dotenv.config();

const app = express();

// Safe body parsing middleware for both local and Vercel serverless environments
app.use((req, res, next) => {
  if (req.body !== undefined) {
    return next();
  }
  if (["POST", "PUT", "PATCH"].includes(req.method || "")) {
    express.json({ limit: "15mb" })(req, res, (err) => {
      if (err) return next(err);
      if (req.body !== undefined) return next();
      express.urlencoded({ limit: "15mb", extended: true })(req, res, next);
    });
  } else {
    next();
  }
});

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
      amountToman: 950000,
      amountUSD: 4.13,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Lamb Chuck (120g)", amount: "120g", costToman: 600000, costUSD: 2.61 },
      { name: "Herb Medley (100g)", amount: "100g", costToman: 130000, costUSD: 0.57 },
      { name: "Basmati Rice & Saffron", amount: "80g", costToman: 110000, costUSD: 0.48 },
      { name: "Red Kidney Beans (40g)", amount: "40g", costToman: 60000, costUSD: 0.26 },
      { name: "Dried Lime & Spices", amount: "portion", costToman: 50000, costUSD: 0.22 }
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
      amountToman: 1150000,
      amountUSD: 5.0,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Minced Meat (200g)", amount: "200g", costToman: 820000, costUSD: 3.57 },
      { name: "Basmati Rice & Saffron", amount: "120g", costToman: 200000, costUSD: 0.87 },
      { name: "Grilled Tomatoes & Sumac", amount: "2 pcs", costToman: 60000, costUSD: 0.26 },
      { name: "Onions & Seasonings", amount: "portion", costToman: 40000, costUSD: 0.17 },
      { name: "Butter & Garnish", amount: "portion", costToman: 30000, costUSD: 0.13 }
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
      amountToman: 400000,
      amountUSD: 1.74,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Cultured Milk Base (150g)", amount: "150g", costToman: 350000, costUSD: 1.52 },
      { name: "Live Active Cultures", amount: "portion", costToman: 50000, costUSD: 0.22 }
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
      amountToman: 280000,
      amountUSD: 1.22,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "Blanched Almonds", amount: "30g", costToman: 180000, costUSD: 0.78 },
      { name: "Filtered Water & Fortification", amount: "200ml", costToman: 100000, costUSD: 0.44 }
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
      amountToman: 950000,
      amountUSD: 4.13,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "گوشت گوسفندی / گوساله (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 600000, costUSD: 2.61 },
      { name: "سبزی قورمه سرخ‌شده (۱۰۰ گرم)", amount: "۱۰۰ گرم", costToman: 130000, costUSD: 0.57 },
      { name: "برنج زعفرانی دم‌کشیده (۸۰ گرم)", amount: "۸۰ گرم", costToman: 110000, costUSD: 0.48 },
      { name: "لوبیا قرمز درجه یک (۴۰ گرم)", amount: "۴۰ گرم", costToman: 60000, costUSD: 0.26 },
      { name: "لیمو عمانی و ادویه خورش", amount: "سهم مصرفی", costToman: 50000, costUSD: 0.22 }
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
      amountToman: 1150000,
      amountUSD: 5.0,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "گوشت چرخ‌کرده مخلوط (۲۰۰ گرم)", amount: "۲۰۰ گرم", costToman: 820000, costUSD: 3.57 },
      { name: "برنج طارم ممتاز با زعفران (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 200000, costUSD: 0.87 },
      { name: "گوجه کبابی و سماق تبریز", amount: "۲ عدد", costToman: 60000, costUSD: 0.26 },
      { name: "پیاز رنده شده و ادویه", amount: "۵۰ گرم", costToman: 40000, costUSD: 0.17 },
      { name: "کره حیوانی و لیمو ترش", amount: "سهم مصرفی", costToman: 30000, costUSD: 0.13 }
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
      amountToman: 400000,
      amountUSD: 1.74,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "شیر باکیفیت تغلیظ شده (۱۵۰ گرم)", amount: "۱۵۰ گرم", costToman: 350000, costUSD: 1.52 },
      { name: "کشت پروبیوتیک فعال", amount: "سهم", costToman: 50000, costUSD: 0.22 }
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
      amountToman: 280000,
      amountUSD: 1.22,
      confidence: "high"
    },
    ingredientCosts: [
      { name: "بادام خام پوست‌کنده (۳۰ گرم)", amount: "۳۰ گرم", costToman: 180000, costUSD: 0.78 },
      { name: "آب تصفیه شده و املاح معدنی", amount: "۲۰۰ میلی‌لیتر", costToman: 100000, costUSD: 0.44 }
    ],
    culturalNotes: "نوشیدنی گیاهی که در قرون وسطی نیز در آشپزی خاورمیانه و اروپا کاربرد داشته است.",
    priceDisclaimer: "قیمت‌ها به صورت تخمینی ارائه شده‌اند."
  }
];

// Diagnostic health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    platform: "Vercel Serverless"
  });
});

// API Routes
app.post("/api/scan-label", async (req, res) => {
  try {
    const { imageBase64, mimeType, language = "en", exchangeRateTomanPerUSD = 230000 } = req.body || {};
    const isFa = language === "fa";
    const userRate = Number(exchangeRateTomanPerUSD) > 0 ? Number(exchangeRateTomanPerUSD) : 230000;

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

    let promptString = "";
    if (isFa) {
      promptString = `دستور حیاتی: شما یک متخصص تغذیه و ارزیاب هزینه مواد غذایی ایرانی هستید.
زبان رابط کاربری فارسی است، بنابراین تمامی مقادیر متنی خروجی JSON (شامل productName, brand, cuisine, servingSize, summary, nutritionalHighlights, nutritionalWarnings, culturalNotes, ingredientsList, ingredientCosts) باید حتماً و بدون استثنا به زبان فارسی روان، اصیل و طبیعی نوشته شوند. هیچ فیلد متنی انگلیسی نباید در خروجی باشد.

تصویر پیوست را با دقت تحلیل کنید. این تصویر می‌تواند یکی از موارد زیر باشد:
۱. یک غذای آماده، بشقاب غذای رستورانی یا خوراک خانگی (مانند قورمه سبزی، چلو کباب کوبیده، جوجه کباب، دیزی، پیتزا، پاستا، سالاد و غیره).
۲. یک محصول بسته‌بندی شده یا جدول ارزش غذایی.

مشخصات غذایی شامل کالری، پروتئین، چربی، کربوهیدرات، فیبر، سدیم و ویتامین‌ها را با دقت تخمین بزنید.

دستورالعمل قیمت‌گذاری واقعی و به‌روز بازار ایران:
- نرخ مبنای محاسبه: هر ۱ دلار آمریکا = ${userRate.toLocaleString("fa-IR")} تومان.
- واقعیت قیمت‌های کنونی بازار ایران:
  * خورش‌ها و غذاهای پخته برنجی سنتی (مانند قورمه سبزی): حدود ۸۵۰,۰۰۰ تا ۱,۰۵۰,۰۰۰ تومان (~۳.۷ تا ۴.۵ دلار)
  * کباب‌های سنتی ذغالی و چلو کباب (مانند کوبیده یا برگ): حدود ۱,۱۰۰,۰۰۰ تا ۱,۴۰۰,۰۰۰ تومان (~۴.۸ تا ۶.۰ دلار)
  * لبنیات پرپروتئین یا ماست یونانی: حدود ۳۵۰,۰۰۰ تا ۴۵۰,۰۰۰ تومان (~۱.۵ تا ۲.۰ دلار)
  * نوشیدنی‌های ارگانیک و گیاهی: حدود ۲۵۰,۰۰۰ تا ۳۲۰,۰۰۰ تومان (~۱.۱ تا ۱.۴ دلار)
  * غذاهای سبک، آش، سوپ یا پاستا: حدود ۳۸۰,۰۰۰ تا ۵۵۰,۰۰۰ تومان (~۱.۶ تا ۲.۴ دلار)
- مواد اولیه تشکیل‌دهنده را با مقادیر و برآورد هزینه جداگانه به تومان و دلار بر اساس این نرخ روز درج کنید.
- رتبه‌بندی کیفی سلامت (healthRatingLabel) حتماً به فارسی باشد (مانند "A - عالی"، "B - خوب"، "C - متوسط").
- خروجی را دقیقاً طبق اسکیما به فرمت JSON تولید کنید. اعداد باید عددی باشند نه رشته.`;
    } else {
      promptString = `Analyze this food image. The image can be either:
1. A prepared meal, cooked plate of food, or restaurant dish (e.g. Persian Ghormeh Sabzi, Kebab, Rice, Pizza, Pasta, Salad, Burger, Stew, Soup, etc.).
2. A packaged food product or nutrition facts label.

Detect the exact type of food or dish, its cuisine origin (e.g. "Persian / Iranian", "Italian", "American", "Middle Eastern", etc.), and whether it is a prepared "dish", "packaged_food", or "beverage".
Extract or accurately calculate nutritional values (calories, protein, total fat, carbohydrates, dietary fiber, sugars, sodium, vitamins).
CRITICAL PRICING DIRECTIVE (IRAN REALISTIC MARKET BENCHMARK):
- Exchange rate benchmark: 1 USD = ${userRate.toLocaleString("en-US")} Tomans.
- Current market pricing reality:
  * Standard cooked dishes or stews (e.g. Ghormeh Sabzi): ~850,000 to 1,050,000 Tomans (~$3.70 - $4.50 USD).
  * Grilled meat / Chelo Kabab dishes: ~1,100,000 to 1,400,000 Tomans (~$4.80 - $6.00 USD).
  * Packaged Greek yogurt or high-protein dairy: ~350,000 to 450,000 Tomans (~$1.50 - $2.00 USD).
  * Plant milk / health beverages: ~250,000 to 320,000 Tomans (~$1.10 - $1.40 USD).
  * Vegetarian/pasta/legume dishes: ~380,000 to 550,000 Tomans (~$1.65 - $2.40 USD).
- Break down the constituent raw ingredients with their estimated portion amounts and individual estimated costs in Tomans and USD matching this economic benchmark.
- Calculate an objective Health Score (1-100) and Nutri-Score rating.
- Provide key nutritional highlights, warnings, summary, and cultural/historical notes.
- Format the output strictly according to the provided JSON schema. Ensure numeric values are numbers, not strings.`;
    }

    let responseText = "";
    let attempts = 0;
    let lastError: any = null;
    const candidateModels = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];

    for (const modelCandidate of candidateModels) {
      if (responseText) break;
      try {
        attempts++;
        const response = await getAIClient().models.generateContent({
          model: modelCandidate,
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
                    amountToman: { type: Type.NUMBER, description: "Estimated cost in Iranian Tomans, e.g. 950000" },
                    amountUSD: { type: Type.NUMBER, description: "Estimated cost in US Dollars, e.g. 4.13" },
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
        
        // Check if retryable
        const errStr = String(err).toLowerCase();
        const isRetryable = err.status === 503 || err.statusCode === 503 ||
                            err.status === 429 || err.statusCode === 429 ||
                            errStr.includes("503") || errStr.includes("unavailable") ||
                            errStr.includes("429") || errStr.includes("exhausted") ||
                            errStr.includes("demand");

        if (isRetryable) {
          const waitTime = attempts * 600;
          console.log(`Waiting ${waitTime}ms before trying next candidate model...`);
          await sleep(waitTime);
        }
      }
    }

    if (!responseText) {
      console.error("==================================================");
      console.error("GEMINI API SCAN CALL COMPLETED WITH FAILURE!");
      console.error(`- Candidate models attempted (${candidateModels.join(", ")})`);
      console.error(`- Last API error encountered:`, lastError?.message || String(lastError || "Unknown API error"));
      if (lastError?.stack) {
        console.error(`- Last error stack:\n`, lastError.stack);
      }
      console.error(`Activating local high-fidelity ${isFa ? "PERSIAN" : "ENGLISH"} fallback to keep app running smoothly...`);
      console.error("==================================================");

      // Pick a random fallback food matching the user's active language
      const pool = isFa ? FALLBACK_FOODS_FA : FALLBACK_FOODS;
      const randomIndex = Math.floor(Math.random() * pool.length);
      const fallbackItem = {
        ...pool[randomIndex],
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

// SQLite Food Diary Routes
app.get("/api/exchange-rate", async (req, res) => {
  try {
    const force = req.query.refresh === "true";
    const rateInfo = await resolveLiveOrIndexedExchangeRate(force);
    return res.json(rateInfo);
  } catch (error: any) {
    return res.json({
      rateTomanPerUSD: 230000,
      sourceEn: "Domestic Food Purchasing-Power Index (Auto-Calibrated)",
      sourceFa: "شاخص قدرت خرید و قیمت مستقیم بازار داخلی (کالیبره خودکار)",
      updatedAt: new Date().toISOString(),
      isLiveFeed: false
    });
  }
});

app.get("/api/diary", (req, res) => {
  try {
    const dateFilter = typeof req.query.date === "string" ? req.query.date : undefined;
    const entries = getAllDiaryEntries(dateFilter);
    const stats = getDatabaseStats();
    return res.json({ entries, stats });
  } catch (error: any) {
    console.error("SQLite GET /api/diary error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch diary entries from SQLite" });
  }
});

app.post("/api/diary", (req, res) => {
  try {
    const body = req.body || {};
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        insertDiaryEntry(item);
      }
      const entries = getAllDiaryEntries();
      const stats = getDatabaseStats();
      return res.json({ entries, stats });
    }

    const payload = body.item || body;
    const inserted = insertDiaryEntry(payload);
    const entries = getAllDiaryEntries();
    const stats = getDatabaseStats();
    return res.json({ entry: inserted, entries, stats });
  } catch (error: any) {
    console.error("SQLite POST /api/diary error:", error);
    return res.status(500).json({ error: error.message || "Failed to insert diary entry into SQLite" });
  }
});

app.post("/api/diary/seed", (req, res) => {
  try {
    seedSampleHistory(true);
    const entries = getAllDiaryEntries();
    const stats = getDatabaseStats();
    return res.json({ entries, stats });
  } catch (error: any) {
    console.error("SQLite POST /api/diary/seed error:", error);
    return res.status(500).json({ error: error.message || "Failed to seed SQLite diary" });
  }
});

app.delete("/api/diary/:id", (req, res) => {
  try {
    const { id } = req.params;
    deleteDiaryEntryById(id);
    const entries = getAllDiaryEntries();
    const stats = getDatabaseStats();
    return res.json({ deletedId: id, entries, stats });
  } catch (error: any) {
    console.error("SQLite DELETE /api/diary/:id error:", error);
    return res.status(500).json({ error: error.message || "Failed to delete diary entry from SQLite" });
  }
});

app.delete("/api/diary", (req, res) => {
  try {
    const dateFilter = typeof req.query.date === "string" ? req.query.date : undefined;
    const clearedCount = clearDiaryEntries(dateFilter);
    const entries = getAllDiaryEntries();
    const stats = getDatabaseStats();
    return res.json({ clearedCount, entries, stats });
  } catch (error: any) {
    console.error("SQLite DELETE /api/diary error:", error);
    return res.status(500).json({ error: error.message || "Failed to clear diary entries in SQLite" });
  }
});

export default app;
