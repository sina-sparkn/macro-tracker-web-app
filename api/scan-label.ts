import { GoogleGenAI, Type } from "@google/genai";

// Curated high-fidelity fallback foods with dish pricing and ingredient breakdown for demo / fallback mode
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
  }
];

export const maxDuration = 60;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // keep as is
      }
    }

    const {
      imageBase64,
      mimeType,
      language = "en",
      exchangeRateTomanPerUSD = 230000,
      customApiKey,
      preferredModel
    } = body || {};

    const isFa = language === "fa";
    const userRate = Number(exchangeRateTomanPerUSD) > 0 ? Number(exchangeRateTomanPerUSD) : 230000;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data in request payload." });
    }

    // Resolve all available Gemini API keys
    const geminiKeys: string[] = [];
    if (typeof customApiKey === "string" && customApiKey.trim()) {
      const trimmed = customApiKey.trim();
      if (trimmed.startsWith("AIza") || (!trimmed.startsWith("sk-") && !trimmed.startsWith("gsk_"))) {
        geminiKeys.push(trimmed);
      }
    }
    const envGeminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.VITE_GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5
    ].filter(Boolean) as string[];

    for (const raw of envGeminiKeys) {
      for (const part of raw.split(",")) {
        const k = part.trim();
        if (k && !geminiKeys.includes(k)) {
          geminiKeys.push(k);
        }
      }
    }

    // Resolve OpenAI API key
    let openAiKey = "";
    if (typeof customApiKey === "string" && customApiKey.trim().startsWith("sk-")) {
      openAiKey = customApiKey.trim();
    } else if (process.env.OPENAI_API_KEY) {
      openAiKey = process.env.OPENAI_API_KEY.trim();
    }

    // Resolve Groq API key
    let groqKey = "";
    if (typeof customApiKey === "string" && customApiKey.trim().startsWith("gsk_")) {
      groqKey = customApiKey.trim();
    } else if (process.env.GROQ_API_KEY) {
      groqKey = process.env.GROQ_API_KEY.trim();
    }

    if (geminiKeys.length === 0 && !openAiKey && !groqKey) {
      console.warn("No AI API keys configured on Vercel environment (Gemini/OpenAI/Groq).");
      return res.status(503).json({
        error: "models_unavailable",
        message: isFa
          ? "مدل‌ها در حال حاضر تحت استفاده سنگین هستند، لطفاً بعداً دوباره امتحان کنید."
          : "Models are on heavy usage and try again please later.",
        code: "MODELS_UNAVAILABLE"
      });
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
      promptString = `دستور حیاتی: شما یک متخصص و دستیار هوشمند تحلیل تغذیه و مواد غذایی هستید.
زبان رابط کاربری فارسی است، بنابراین تمامی مقادیر متنی خروجی JSON (شامل productName, brand, cuisine, servingSize, summary, nutritionalHighlights, nutritionalWarnings, culturalNotes, ingredientsList, ingredientCosts, notFoodReason) باید حتماً و بدون استثنا به زبان فارسی روان، اصیل و طبیعی نوشته شوند. هیچ فیلد متنی انگلیسی نباید در خروجی باشد.

مرحله ۱ - بررسی قطعی اینکه آیا تصویر مربوط به یک ماده خوراکی هست یا خیر:
تصویر پیوست را با دقت کامل بررسی کنید. آیا این تصویر نشان‌دهنده یک غذای پخته، بشقاب خوراک، میان‌وعده، میوه، سبزیجات، نوشیدنی، ماده اولیه آشپزی، محصول بسته‌بندی یا جدول ارزش غذایی است؟
- اگر تصویر مربوط به غذا یا نوشیدنی نیست (مثلاً عکس چهره یا اندام انسان، حیوان، خودرو، وسایل الکترونیکی مانند لپ‌تاپ، مانیتور یا موبایل، پوشاک، کفش، مبلمان، لوازم خانه، کتاب، مدارک، ابزار، منظره یا هر شیء غیرخوراکی دیگر):
  * حتماً مقدار isFood را برابر false قرار دهید.
  * در فیلد notFoodReason صراحتاً خاطرنشان کنید که این تصویر در واقع یک ماده غذایی نیست، و شیء مشاهده‌شده در تصویر را نام ببرید (برای نمونه: «این تصویر مربوط به یک لپ‌تاپ است و در واقع یک ماده غذایی نیست. لطفاً تصویری از غذا، نوشیدنی یا برچسب ارزش غذایی قرار دهید.»).
  * مقدار foodType را "not_food" و مقدار productName را نام شیء شناسایی‌شده (یا «غیرخوراکی») بگذارید.
  * تمام مقادیر عددی (کالری، چربی، سدیم، کربوهیدرات، فیبر، قند، پروتئین، healthScore) را برابر ۰ بگذارید.
  * آرایه‌های nutritionalHighlights, nutritionalWarnings, ingredientsList, ingredientCosts, vitamins را خالی بگذارید.
  * مقدار estimatedPrice را برابر { amountToman: 0, amountUSD: 0 } قرار دهید.

- اگر تصویر مربوط به یک غذای آماده، خوراک، نوشیدنی یا محصول بسته‌بندی/جدول ارزش غذایی است:
  * مقدار isFood را برابر true قرار دهید.
  * فیلد notFoodReason را رشته خالی "" بگذارید.

الگوریتم تخمین تغذیه‌ای دقیق با هدف خطای کمتر از ۸٪ (روش جزء‌به‌جزء):
۱. تفکیک اجزا و اوزان استاندارد (Bottom-up Decomposition):
   - ابتدا اجزای تشکیل‌دهنده را به گرم تفکیک و تخمین بزنید (مثلاً ۲۰۰ گرم چلو زعفرانی، ۱۲۰ گرم گوشت گوسفندی، ۱۵۰ گرم خورش سبزی، ۱۵ گرم روغن پخت).
   - مراجع استاندارد اوزان: دیس استاندارد چلو = ۲۰۰ تا ۲۵۰ گرم برنج پخته (~۲۶۰-۳۲۵ کالری)؛ هر سیخ کوبیده = ۸۰ گرم پخته (~۲۰۰ کالری)؛ جوجه کباب = ۲۰۰ گرم فیله پخته (~۳۳۰ کالری)؛ هر کف دست نان سنگک/بربری = ۱۰۰ گرم (~۲۶۰ کالری).
۲. قانون تعادل انرژی و ثبات فرمول اتواتر (Atwater Consistency Requirement):
   - مجموع کالری کل (calories) باید الزاماً با رابطه درشت‌مغذی‌ها منطبق باشد:
     Calories = (Protein * 4) + (Carbohydrate * 4) + (Fat * 9)
   - خطای مجاز بین کالری اعلامی و این فرمول باید زیر ۵٪ باشد. از تولید اعداد ناسازگار یا حدسی شدیداً خودداری کنید.

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
      promptString = `Analyze this food image with high clinical nutritional precision (target error < 8%).
STEP 1: MANDATORY FOOD VERIFICATION:
Inspect the provided image carefully to verify if it contains an actual food item, cooked dish, restaurant meal, beverage, edible ingredient, snack, or packaged food product / nutrition facts label.
- IF THE IMAGE IS NOT A FOOD ITEM (e.g. it depicts a person, animal, vehicle, electronic gadget/laptop/phone, clothing, shoe, furniture, room, landscape, document, tool, household item, or any other non-edible object):
  * Set "isFood": false
  * Set "notFoodReason": Explicitly point out that this is not a food item in fact, and mention what was detected in the image instead (e.g., "This image appears to show a laptop computer, and is not a food item in fact. NutriScan exclusively analyzes edible foods, beverages, and nutrition facts labels.").
  * Set "foodType" to "not_food" and "productName" to the concise name of the detected object (or "Not a food item").
  * Set all numeric nutritional fields (calories, totalFat, saturatedFat, transFat, cholesterol, sodium, totalCarbohydrate, dietaryFiber, totalSugars, addedSugars, protein, healthScore) to 0.
  * Set nutritionalHighlights, nutritionalWarnings, ingredientsList, ingredientCosts, vitamins to empty arrays [].
  * Set estimatedPrice to { "amountToman": 0, "amountUSD": 0 }.

- IF THE IMAGE IS A FOOD ITEM (dish, cooked food, packaged food product, beverage, or nutrition facts label):
  * Set "isFood": true
  * Set "notFoodReason": ""
  * Detect the exact type of food or dish, its cuisine origin (e.g. "Persian / Iranian", "Italian", "American", "Middle Eastern", etc.), and whether it is a prepared "dish", "packaged_food", or "beverage".

NUTRITIONAL ACCURACY DIRECTIVE (BOTTOM-UP INGREDIENT DECOMPOSITION):
1. Break down the visible portion into constituent ingredient masses in grams (e.g. 200g cooked rice, 120g grilled beef, 15g cooking oil/butter, 80g vegetables).
2. Enforce Atwater Mathematical Consistency: Total calories must closely obey:
   Calories = (4 * Protein) + (4 * Total Carbohydrate) + (9 * Total Fat)
   Ensure the reported calorie number matches this macronutrient summation with < 5% divergence.
3. Reference benchmarks for standard portions:
   - Cooked Rice: ~130 kcal per 100g (1 standard Iranian kafgir/skimmer ~ 75g; standard plate ~ 200-250g).
   - Cooked Lean Beef/Lamb: ~250 kcal per 100g (26g protein, 15g fat).
   - Cooked Chicken Breast: ~165 kcal per 100g (31g protein, 3.6g fat).
   - Cooking Oil / Butter additions: ~90 kcal per 10g (1 tbsp ~ 120 kcal pure fat).

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

    const PER_MODEL_TIMEOUT = 8500; // 8.5s per model candidate
    let responseText = "";
    let successfulModel = "";
    let lastError: any = null;

    // Helper: call OpenAI vision
    const tryOpenAiVision = async (model: string, apiKey: string): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PER_MODEL_TIMEOUT);
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: promptString + "\n\nRespond with strict JSON adhering to the nutritional schema." },
                  { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${cleanBase64}` } }
                ]
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1
          }),
          signal: controller.signal
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`OpenAI HTTP ${response.status}: ${body}`);
        }
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "";
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Helper: call Groq vision
    const tryGroqVision = async (model: string, apiKey: string): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PER_MODEL_TIMEOUT);
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: promptString + "\n\nRespond with valid JSON only." },
                  { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${cleanBase64}` } }
                ]
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1
          }),
          signal: controller.signal
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`Groq HTTP ${response.status}: ${body}`);
        }
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "";
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // If user explicitly preferred an OpenAI model and OpenAI key is available, attempt it first
    if (preferredModel?.startsWith("gpt-") && openAiKey) {
      try {
        console.log(`Attempting user preferred OpenAI model: ${preferredModel}...`);
        responseText = await tryOpenAiVision(preferredModel, openAiKey);
        if (responseText) {
          successfulModel = `openai:${preferredModel}`;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Preferred OpenAI model ${preferredModel} failed, continuing cascade:`, err.message || err);
      }
    }

    // Build candidate Gemini models cascade
    const defaultGeminiCandidates = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash-8b",
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-2.5-pro",
      "gemini-1.5-pro"
    ];

    let geminiCandidates = [...defaultGeminiCandidates];
    if (preferredModel && preferredModel !== "auto" && !preferredModel.startsWith("gpt-") && !preferredModel.startsWith("llama")) {
      geminiCandidates = [
        preferredModel,
        ...defaultGeminiCandidates.filter((m) => m !== preferredModel)
      ];
    }

    // Loop through Gemini candidate models and rotate keys on quota limit
    if (!responseText && geminiKeys.length > 0) {
      for (const modelCandidate of geminiCandidates) {
        if (responseText) break;

        for (let keyIdx = 0; keyIdx < geminiKeys.length; keyIdx++) {
          if (responseText) break;
          const currentKey = geminiKeys[keyIdx];

          try {
            const aiClient = new GoogleGenAI({
              apiKey: currentKey,
              httpOptions: {
                headers: {
                  "User-Agent": "aistudio-build",
                },
              },
            });

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout after ${PER_MODEL_TIMEOUT / 1000}s waiting for model ${modelCandidate}`)), PER_MODEL_TIMEOUT)
            );

            const generatePromise = aiClient.models.generateContent({
              model: modelCandidate,
              contents: { parts: [imagePart, { text: promptString }] },
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
                topP: 0.8,
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    isFood: {
                      type: Type.BOOLEAN,
                      description: "True if the image contains food, a meal, drink, edible ingredient, or nutrition facts label. False if it is NOT a food item in fact.",
                    },
                    notFoodReason: {
                      type: Type.STRING,
                      description: "If isFood is false, a statement pointing out that this is not a food item in fact and describing what was seen.",
                    },
                    productName: { type: Type.STRING },
                    brand: { type: Type.STRING },
                    foodType: { type: Type.STRING },
                    cuisine: { type: Type.STRING },
                    servingSize: { type: Type.STRING },
                    servingsPerContainer: { type: Type.NUMBER },
                    calories: { type: Type.NUMBER },
                    totalFat: { type: Type.NUMBER },
                    saturatedFat: { type: Type.NUMBER },
                    transFat: { type: Type.NUMBER },
                    cholesterol: { type: Type.NUMBER },
                    sodium: { type: Type.NUMBER },
                    totalCarbohydrate: { type: Type.NUMBER },
                    dietaryFiber: { type: Type.NUMBER },
                    totalSugars: { type: Type.NUMBER },
                    addedSugars: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    vitamins: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          value: { type: Type.STRING },
                          percentDV: { type: Type.NUMBER },
                        },
                        required: ["name", "value"],
                      },
                    },
                    healthScore: { type: Type.NUMBER },
                    healthRatingLabel: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    nutritionalHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    nutritionalWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ingredientsList: { type: Type.ARRAY, items: { type: Type.STRING } },
                    estimatedPrice: {
                      type: Type.OBJECT,
                      properties: {
                        amountToman: { type: Type.NUMBER },
                        amountUSD: { type: Type.NUMBER },
                        confidence: { type: Type.STRING }
                      },
                      required: ["amountToman", "amountUSD"]
                    },
                    ingredientCosts: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING },
                          costToman: { type: Type.NUMBER },
                          costUSD: { type: Type.NUMBER }
                        },
                        required: ["name", "amount", "costToman", "costUSD"]
                      }
                    },
                    culturalNotes: { type: Type.STRING },
                    priceDisclaimer: { type: Type.STRING }
                  },
                  required: [
                    "isFood",
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

            const response = await Promise.race([generatePromise, timeoutPromise]);
            responseText = response.text || "";
            successfulModel = modelCandidate;
            break;
          } catch (err: any) {
            lastError = err;
            const errStr = String(err).toLowerCase();
            const isNotFound = err.status === 404 || errStr.includes("404") || errStr.includes("not found");
            const isQuota = err.status === 429 || errStr.includes("429") || errStr.includes("quota") || errStr.includes("exhausted");

            console.warn(`Model ${modelCandidate} with key #${keyIdx + 1} failed:`, err.message || String(err));

            if (isNotFound) {
              break;
            }
            if (isQuota && keyIdx < geminiKeys.length - 1) {
              console.log(`Rotating to next Gemini key (#${keyIdx + 2}) on Vercel...`);
              continue;
            }
          }
        }
      }
    }

    // OpenAI Fallback if Gemini models failed or no Gemini keys
    if (!responseText && openAiKey) {
      const openAiCandidates = ["gpt-4o-mini", "gpt-4o"];
      for (const oModel of openAiCandidates) {
        if (responseText) break;
        try {
          console.log(`Failing over to OpenAI vision candidate: ${oModel}...`);
          responseText = await tryOpenAiVision(oModel, openAiKey);
          if (responseText) {
            successfulModel = `openai:${oModel}`;
            break;
          }
        } catch (e: any) {
          lastError = e;
          console.warn(`OpenAI candidate ${oModel} failed:`, e.message || e);
        }
      }
    }

    // Groq Fallback if both Gemini and OpenAI failed
    if (!responseText && groqKey) {
      const groqCandidates = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"];
      for (const gModel of groqCandidates) {
        if (responseText) break;
        try {
          console.log(`Failing over to Groq vision candidate: ${gModel}...`);
          responseText = await tryGroqVision(gModel, groqKey);
          if (responseText) {
            successfulModel = `groq:${gModel}`;
            break;
          }
        } catch (e: any) {
          lastError = e;
          console.warn(`Groq candidate ${gModel} failed:`, e.message || e);
        }
      }
    }

    if (!responseText) {
      console.warn("All candidate models failed or unavailable. Returning 503 models_unavailable (no fallback food).");
      return res.status(503).json({
        error: "models_unavailable",
        message: isFa
          ? "مدل‌ها در حال حاضر تحت استفاده سنگین هستند، لطفاً بعداً دوباره امتحان کنید."
          : "Models are on heavy usage and try again please later.",
        code: "MODELS_UNAVAILABLE",
        originalScanError: lastError?.message || String(lastError || "API error"),
      });
    }

    const parsed = JSON.parse(responseText || "{}");
    const isActuallyFood = parsed.isFood === true || (parsed.isFood !== false && parsed.foodType !== "not_food");
    if (!isActuallyFood) {
      parsed.isFood = false;
      parsed.foodType = "not_food";
      if (!parsed.notFoodReason) {
        parsed.notFoodReason = isFa
          ? "این تصویر در واقع یک ماده غذایی نیست. لطفاً تصویری از غذا، نوشیدنی یا برچسب ارزش غذایی ثبت کنید."
          : "This is not a food item in fact. Please capture or upload a photo of food, a beverage, or a nutrition facts label.";
      }
      parsed.calories = 0;
      parsed.totalFat = 0;
      parsed.protein = 0;
      parsed.totalCarbohydrate = 0;
      parsed.sodium = 0;
      parsed.healthScore = 0;
      parsed.nutritionalHighlights = [];
      parsed.nutritionalWarnings = [];
      parsed.ingredientsList = [];
      parsed.ingredientCosts = [];
      parsed.vitamins = [];
      parsed.estimatedPrice = { amountToman: 0, amountUSD: 0 };
    } else {
      parsed.isFood = true;
    }
    parsed.modelUsed = successfulModel;
    return res.status(200).json(parsed);
  } catch (err: any) {
    const isFa = req.body?.language === "fa";
    console.error("Vercel Serverless Function error in /api/scan-label:", err);
    return res.status(503).json({
      error: "models_unavailable",
      message: isFa
        ? "مدل‌ها در حال حاضر تحت استفاده سنگین هستند، لطفاً بعداً دوباره امتحان کنید."
        : "Models are on heavy usage and try again please later.",
      code: "MODELS_UNAVAILABLE",
      details: err.message || String(err),
    });
  }
}
