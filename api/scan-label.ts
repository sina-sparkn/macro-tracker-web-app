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
      exchangeRateTomanPerUSD = 230000
    } = body || {};

    const isFa = language === "fa";
    const userRate = Number(exchangeRateTomanPerUSD) > 0 ? Number(exchangeRateTomanPerUSD) : 230000;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data in request payload." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined on Vercel environment. Returning localized demo food item...");
      const pool = isFa ? FALLBACK_FOODS_FA : FALLBACK_FOODS;
      const fallbackItem = {
        ...pool[Math.floor(Math.random() * pool.length)],
        isDemoFallback: true,
        apiKeyMissingNotice: true,
        modelUsed: "offline-fallback",
      };
      return res.status(200).json(fallbackItem);
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
      promptString = `دستور حیاتی: شما یک متخصص تغذیه بالینی و ارزیاب دقیق مواد غذایی ایرانی هستید.
زبان رابط کاربری فارسی است، بنابراین تمامی مقادیر متنی خروجی JSON (شامل productName, brand, cuisine, servingSize, summary, nutritionalHighlights, nutritionalWarnings, culturalNotes, ingredientsList, ingredientCosts) باید حتماً و بدون استثنا به زبان فارسی روان، اصیل و طبیعی نوشته شوند. هیچ فیلد متنی انگلیسی نباید در خروجی باشد.

تصویر پیوست را با دقت میلی‌متری و علمی تحلیل کنید:
۱. یک غذای آماده، بشقاب غذای رستورانی یا خوراک خانگی (مانند قورمه سبزی، چلو کباب کوبیده، جوجه کباب، دیزی، پیتزا، پاستا، سالاد و غیره).
۲. یک محصول بسته‌بندی شده یا جدول ارزش غذایی.

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
The image can be either:
1. A prepared meal, cooked plate of food, or restaurant dish (e.g. Persian Ghormeh Sabzi, Kebab, Rice, Pizza, Pasta, Salad, Burger, Stew, Soup, etc.).
2. A packaged food product or nutrition facts label.

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

    const aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const candidateModels = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText = "";
    let successfulModel = "";
    let lastError: any = null;
    const PER_MODEL_TIMEOUT = 8500; // 8.5 seconds per model candidate fits safely within Vercel execution limits

    for (const modelCandidate of candidateModels) {
      if (responseText) break;
      try {
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
        console.warn(`Model ${modelCandidate} failed:`, err.message || String(err));
      }
    }

    if (!responseText) {
      console.warn("All Gemini model candidates failed. Returning demo item fallback gracefully.");
      const pool = isFa ? FALLBACK_FOODS_FA : FALLBACK_FOODS;
      const fallbackItem = {
        ...pool[Math.floor(Math.random() * pool.length)],
        isDemoFallback: true,
        modelUsed: "offline-fallback",
        originalScanError: lastError?.message || String(lastError || "API error"),
      };
      return res.status(200).json(fallbackItem);
    }

    const parsed = JSON.parse(responseText || "{}");
    parsed.modelUsed = successfulModel;
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error("Vercel Serverless Function error in /api/scan-label:", err);
    // Return graceful fallback so user never gets 500 error page
    const fallbackItem = {
      ...FALLBACK_FOODS[0],
      isDemoFallback: true,
      modelUsed: "offline-fallback",
      originalScanError: err.message || String(err),
    };
    return res.status(200).json(fallbackItem);
  }
}
