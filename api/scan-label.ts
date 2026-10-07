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
      promptString = `دستور حیاتی: شما یک متخصص تغذیه و ارزیاب هزینه مواد غذایی ایرانی هستید.
زبان رابط کاربری فارسی است، بنابراین تمامی مقادیر متنی خروجی JSON (شامل productName, brand, cuisine, servingSize, summary, nutritionalHighlights, nutritionalWarnings, culturalNotes, ingredientsList, ingredientCosts) باید حتماً و بدون استثنا به زبان فارسی روان، اصیل و طبیعی نوشته شوند.

تصویر پیوست را با دقت تحلیل کنید. این تصویر می‌تواند یک غذای آماده، بشقاب غذای رستورانی، خوراک خانگی، یا یک محصول بسته‌بندی شده باشد.
مشخصات غذایی شامل کالری، پروتئین، چربی، کربوهیدرات، فیبر، سدیم و ویتامین‌ها را با دقت تخمین بزنید.

دستورالعمل قیمت‌گذاری واقعی و به‌روز بازار ایران:
- نرخ مبنای محاسبه: هر ۱ دلار آمریکا = ${userRate.toLocaleString("fa-IR")} تومان.
- خروجی را دقیقاً طبق اسکیما به فرمت JSON تولید کنید. اعداد باید عددی باشند نه رشته.`;
    } else {
      promptString = `Analyze this food image. The image can be either a prepared meal, cooked plate of food, restaurant dish, or packaged food product.
Detect the exact food or dish, cuisine origin, and nutritional values (calories, protein, total fat, carbohydrates, dietary fiber, sodium, vitamins).
Exchange rate benchmark: 1 USD = ${userRate.toLocaleString("en-US")} Tomans.
Break down constituent raw ingredients with estimated costs in Tomans and USD.
Format the output strictly according to the provided JSON schema. Ensure numeric values are numbers, not strings.`;
    }

    const aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText = "";
    let lastError: any = null;

    for (const modelCandidate of candidateModels) {
      if (responseText) break;
      try {
        const response = await aiClient.models.generateContent({
          model: modelCandidate,
          contents: { parts: [imagePart, { text: promptString }] },
          config: {
            responseMimeType: "application/json",
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
        responseText = response.text || "";
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
        originalScanError: lastError?.message || String(lastError || "API error"),
      };
      return res.status(200).json(fallbackItem);
    }

    const parsed = JSON.parse(responseText || "{}");
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error("Vercel Serverless Function error in /api/scan-label:", err);
    // Return graceful fallback so user never gets 500 error page
    const fallbackItem = {
      ...FALLBACK_FOODS[0],
      isDemoFallback: true,
      originalScanError: err.message || String(err),
    };
    return res.status(200).json(fallbackItem);
  }
}
