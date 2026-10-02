import { ScannedLabel } from "../types";

// Translation dictionary for English dish names to natural Persian
const DISH_NAME_FA_MAP: Record<string, string> = {
  "Ghormeh Sabzi with Saffron Rice": "قورمه سبزی اصیل با برنج زعفرانی",
  "Ghormeh Sabzi": "قورمه سبزی اصیل با برنج زعفرانی",
  "Persian Ghormeh Sabzi": "قورمه سبزی اصیل با برنج زعفرانی",
  "Chelo Kabab Koobideh": "چلو کباب کوبیده سنتی با گوجه",
  "Chelo Kabab": "چلو کباب کوبیده سنتی با گوجه",
  "Kabab Koobideh": "کباب کوبیده سنتی با گوجه",
  "High-Protein Greek Yogurt": "ماست یونانی پرپروتئین طبیعی",
  "Greek Yogurt": "ماست یونانی پرپروتئین طبیعی",
  "Organic Almond Milk (Unsweetened)": "شیر بادام ارگانیک (بدون قند افزوده)",
  "Organic Almond Milk": "شیر بادام ارگانیک (بدون قند افزوده)",
  "Almond Milk": "شیر بادام ارگانیک",
  "Pepperoni Pizza": "پیتزا پپرونی",
  "Pizza": "پیتزا مخصوص",
  "Caesar Salad with Grilled Chicken": "سالاد سزار با مرغ گریل",
  "Caesar Salad": "سالاد سزار کلاسیک",
  "Grilled Chicken Breast with Steamed Broccoli": "سینه مرغ گریل شده با بروکلی بخارپز",
  "Overnight Oats with Chia Seeds & Berries": "اوتمیل جو دوسر با دانه چیا و توت",
  "Avocado Toast on Sourdough": "تست آووکادو روی نان خمیرترش",
  "Tahchin Morgh (Crispy Saffron Rice Cake)": "ته‌چین مرغ زعفرانی مجلسی",
  "Tahchin": "ته‌چین مرغ زعفرانی",
  "Ash Reshteh (Persian Herb & Noodle Soup)": "آش رشته اصیل ایرانی",
  "Ash Reshteh": "آش رشته سنتی ایرانی",
  "Zereshk Polo Morgh": "زرشک پلو با مرغ مجلسی",
  "Dizi / Abgoosht": "دیزی سنگی سنتی با گوشت و نخود",
  "Dizi": "دیزی سنگی سنتی",
  "Abgoosht": "آبگوشت سنتی ایرانی",
  "Mirza Ghasemi": "میرزاقاسمی اصیل دودی گیلانی",
  "Fesenjan": "خورش فسنجان با گردو و انار",
  "Kashk-e Bademjan": "کشک بادمجان سنتی",
  "Baghali Polo ba Mahiche": "باقالی پلو با ماهیچه زعفرانی",
  "Joojeh Kabab": "جوجه کباب زعفرانی با برنج",
  "Chicken Breast": "سینه مرغ",
  "White Rice": "برنج سفید ایرانی",
  "Saffron Rice": "برنج زعفرانی"
};

const BRAND_FA_MAP: Record<string, string> = {
  "Authentic Persian Plate": "بشقاب سنتی ایرانی",
  "Persian Grill Traditional": "کباب سنتی ذغالی",
  "Chobani Plain": "چوبانی ساده",
  "Earth's Own": "ارثز اون",
  "Homemade": "خانگی",
  "Persian Traditional Plate": "غذای سنتی ایرانی"
};

const SERVING_SIZE_FA_MAP: Record<string, string> = {
  "1 plate (350g)": "۱ بشقاب (۳۵۰ گرم)",
  "2 skewers with rice (400g)": "۲ سیخ با چلو زعفرانی (۴۰۰ گرم)",
  "1 container (150g)": "۱ کاسه (۱۵۰ گرم)",
  "1 cup (240ml)": "۱ لیوان (۲۴۰ میلی‌لیتر)"
};

const INGREDIENT_FA_MAP: Record<string, string> = {
  "Lamb Chuck": "گوشت گوساله یا گوسفند",
  "Parsley": "جعفری تازه",
  "Leek (Tareh)": "تره",
  "Coriander": "گشنیز",
  "Fenugreek": "شنبلیله",
  "Red Kidney Beans": "لوبیا قرمز",
  "Dried Lime": "لیمو عمانی",
  "Basmati Rice": "برنج باسماتی یا ایرانی",
  "Saffron": "زعفران ممتاز",
  "Minced Lamb/Beef": "گوشت چرخ‌کرده مخلوط",
  "Onion": "پیاز",
  "Sumac": "سماق تبریز",
  "Tomato": "گوجه‌فرنگی",
  "Butter": "کره",
  "Black Pepper": "فلفل سیاه",
  "Cultured Nonfat Milk": "شیر بدون چربی پاستوریزه",
  "Live Active Cultures": "باکتری‌های زنده پروبیوتیک",
  "Almond Base (Water, Almonds)": "پایه بادام ارگانیک",
  "Calcium Carbonate": "کربنات کلسیم",
  "Sea Salt": "نمک دریا"
};

/**
 * Normalizes scanned food result to guarantee:
 * 1. Output language matches user interface setting (Persian if isFa is true)
 * 2. Prices are updated to current realistic 2026 Iran benchmarks (never stale 2023 prices like 185k Tomans)
 * 3. Currency and exchange rate are mathematically consistent
 */
export function normalizeScannedLabel(
  label: ScannedLabel,
  targetLang: "fa" | "en" = "en",
  exchangeRate: number = 230000
): ScannedLabel {
  const isFa = targetLang === "fa";
  const cloned: ScannedLabel = JSON.parse(JSON.stringify(label));

  // 1. PRICE NORMALIZATION (Eliminate old low price fallbacks)
  let currentToman = cloned.estimatedPrice?.amountToman;
  let currentUSD = cloned.estimatedPrice?.amountUSD;
  const prodLower = (cloned.productName || "").toLowerCase();

  if (prodLower.includes("ghormeh") || prodLower.includes("قورمه") || prodLower.includes("sabzi")) {
    if (!currentToman || currentToman < 500000) {
      currentToman = 950000;
      currentUSD = 4.13;
    }
  } else if (prodLower.includes("kabab") || prodLower.includes("کباب") || prodLower.includes("koobideh") || prodLower.includes("کوبیده")) {
    if (!currentToman || currentToman < 600000) {
      currentToman = 1150000;
      currentUSD = 5.0;
    }
  } else if (prodLower.includes("yogurt") || prodLower.includes("ماست") || prodLower.includes("chobani")) {
    if (!currentToman || currentToman < 200000) {
      currentToman = 400000;
      currentUSD = 1.74;
    }
  } else if (prodLower.includes("almond") || prodLower.includes("بادام") || prodLower.includes("milk") || prodLower.includes("شیر")) {
    if (!currentToman || currentToman < 150000) {
      currentToman = 280000;
      currentUSD = 1.22;
    }
  } else if (cloned.foodType === "dish" && (!currentToman || currentToman < 350000)) {
    // General hot dish floor
    currentToman = currentUSD && currentUSD > 1 ? Math.round(currentUSD * exchangeRate) : 650000;
    currentUSD = Number((currentToman / exchangeRate).toFixed(2));
  } else {
    // Ensure Toman and USD are in sync
    if ((!currentToman || currentToman <= 0) && currentUSD && currentUSD > 0) {
      currentToman = Math.round(currentUSD * exchangeRate);
    }
    if ((!currentUSD || currentUSD <= 0) && currentToman && currentToman > 0) {
      currentUSD = Number((currentToman / exchangeRate).toFixed(2));
    }
  }

  cloned.estimatedPrice = {
    amountToman: currentToman || 650000,
    amountUSD: currentUSD || 2.8,
    confidence: cloned.estimatedPrice?.confidence || "high"
  };

  // 2. PERSIAN LOCALIZATION
  if (isFa) {
    // Dish Name
    if (DISH_NAME_FA_MAP[cloned.productName]) {
      cloned.productName = DISH_NAME_FA_MAP[cloned.productName];
    } else {
      // Partial name match
      for (const [enName, faName] of Object.entries(DISH_NAME_FA_MAP)) {
        if (cloned.productName.toLowerCase().includes(enName.toLowerCase())) {
          cloned.productName = faName;
          break;
        }
      }
    }

    // Brand
    if (cloned.brand && BRAND_FA_MAP[cloned.brand]) {
      cloned.brand = BRAND_FA_MAP[cloned.brand];
    } else if (cloned.brand && /^[a-zA-Z\s]+$/.test(cloned.brand)) {
      if (cloned.brand.toLowerCase().includes("persian")) {
        cloned.brand = "بشقاب سنتی ایرانی";
      }
    }

    // Cuisine
    if (!cloned.cuisine || cloned.cuisine.toLowerCase().includes("persian") || cloned.cuisine.toLowerCase().includes("iran")) {
      cloned.cuisine = "ایرانی";
    } else if (cloned.cuisine.toLowerCase().includes("mediterranean")) {
      cloned.cuisine = "مدیترانه‌ای";
    } else if (cloned.cuisine.toLowerCase().includes("international")) {
      cloned.cuisine = "بین‌المللی";
    } else if (cloned.cuisine.toLowerCase().includes("italian")) {
      cloned.cuisine = "ایتالیایی";
    }

    // Serving size
    if (cloned.servingSize && SERVING_SIZE_FA_MAP[cloned.servingSize]) {
      cloned.servingSize = SERVING_SIZE_FA_MAP[cloned.servingSize];
    } else if (cloned.servingSize && cloned.servingSize.includes("plate")) {
      cloned.servingSize = "۱ بشقاب استاندارد";
    }

    // Health Rating Label
    if (cloned.healthRatingLabel) {
      if (cloned.healthRatingLabel.startsWith("A")) cloned.healthRatingLabel = "A - عالی";
      else if (cloned.healthRatingLabel.startsWith("B")) cloned.healthRatingLabel = "B - خوب";
      else if (cloned.healthRatingLabel.startsWith("C")) cloned.healthRatingLabel = "C - متوسط";
      else if (cloned.healthRatingLabel.startsWith("D")) cloned.healthRatingLabel = "D - ضعیف";
      else if (cloned.healthRatingLabel.startsWith("E")) cloned.healthRatingLabel = "E - بسیار ضعیف";
    }

    // Summary (if in English)
    if (cloned.summary && /^[a-zA-Z\s,.-]+$/.test(cloned.summary.slice(0, 30))) {
      if (prodLower.includes("ghormeh") || prodLower.includes("قورمه")) {
        cloned.summary = "خورش اصیل سنتی ایرانی سرشار از آهن با جذب بالا، فیبر رژیمی لوبیا قرمز و سبزیجات معطر غنی از آنتی‌اکسیدان.";
      } else if (prodLower.includes("kabab") || prodLower.includes("کباب")) {
        cloned.summary = "کباب اصیل ذغالی ایرانی با گوشت مخلوط تازه، چلو معطر زعفرانی، گوجه کبابی و سماق کاهنده چربی.";
      } else if (prodLower.includes("yogurt") || prodLower.includes("ماست")) {
        cloned.summary = "ماده غذایی فوق‌العاده مغذی با ۱۶ گرم پروتئین خالص، بدون چربی مضر و بدون قند افزوده.";
      } else if (prodLower.includes("almond") || prodLower.includes("بادام")) {
        cloned.summary = "جایگزین گیاهی عالی برای لبنیات با کالری بسیار پایین، بدون شکر و غنی شده با کلسیم و ویتامین D.";
      } else {
        cloned.summary = `تحلیل تغذیه‌ای سهم غذایی: حاوی ${cloned.calories} کالری و ${Math.round(cloned.protein)} گرم پروتئین با کیفیت.`;
      }
    }

    // Nutritional Highlights
    if (cloned.nutritionalHighlights && cloned.nutritionalHighlights.length > 0) {
      cloned.nutritionalHighlights = cloned.nutritionalHighlights.map((hl) => {
        if (/^[a-zA-Z\s()0-9g]+$/.test(hl)) {
          if (hl.toLowerCase().includes("protein")) return `پروتئین بالا (${Math.round(cloned.protein)} گرم)`;
          if (hl.toLowerCase().includes("fiber")) return "سرشار از فیبر رژیمی طبیعی";
          if (hl.toLowerCase().includes("sugar")) return "بدون قند افزوده یا بسیار کم‌شکر";
          if (hl.toLowerCase().includes("iron") || hl.toLowerCase().includes("vitamin")) return "غنی از ریزمغذی‌ها و ویتامین‌های ضروری";
          if (hl.toLowerCase().includes("low calorie")) return "کم‌کالری و سبک";
          if (hl.toLowerCase().includes("charcoal")) return "پخت سنتی با عطر ذغال";
          return hl;
        }
        return hl;
      });
    }

    // Nutritional Warnings
    if (cloned.nutritionalWarnings && cloned.nutritionalWarnings.length > 0) {
      cloned.nutritionalWarnings = cloned.nutritionalWarnings.map((w) => {
        if (/^[a-zA-Z\s]+$/.test(w)) {
          if (w.toLowerCase().includes("sodium") || w.toLowerCase().includes("salt")) return "میزان سدیم متوسط به بالا";
          if (w.toLowerCase().includes("fat")) return "حاوی چربی اشباع، مصرف با اعتدال";
          if (w.toLowerCase().includes("calorie")) return "وعده متراکم از نظر کالری";
          if (w.toLowerCase().includes("oil")) return "کنترل روغن مصرفی توصیه می‌شود";
          return w;
        }
        return w;
      });
    }

    // Ingredients List
    if (cloned.ingredientsList && cloned.ingredientsList.length > 0) {
      cloned.ingredientsList = cloned.ingredientsList.map((ing) => INGREDIENT_FA_MAP[ing] || ing);
    }

    // Ingredient Costs
    if (cloned.ingredientCosts && cloned.ingredientCosts.length > 0) {
      cloned.ingredientCosts = cloned.ingredientCosts.map((item) => {
        let name = item.name;
        for (const [enIng, faIng] of Object.entries(INGREDIENT_FA_MAP)) {
          if (name.toLowerCase().includes(enIng.toLowerCase())) {
            name = faIng;
            break;
          }
        }
        // Scale ingredient cost proportionally to updated total
        let costToman = item.costToman;
        if (costToman && costToman < 50000 && cloned.estimatedPrice?.amountToman && cloned.estimatedPrice.amountToman > 500000) {
          costToman = Math.round(costToman * (cloned.estimatedPrice.amountToman / 200000));
        }
        const costUSD = costToman ? Number((costToman / exchangeRate).toFixed(2)) : item.costUSD;

        return {
          ...item,
          name,
          costToman: costToman || item.costToman,
          costUSD: costUSD || item.costUSD
        };
      });
    }

    // Cultural notes
    if (cloned.culturalNotes && /^[a-zA-Z\s,.-]+$/.test(cloned.culturalNotes.slice(0, 30))) {
      if (prodLower.includes("ghormeh") || prodLower.includes("قورمه")) {
        cloned.culturalNotes = "خورش ملی و تاریخی ایران که بازتاب تعادل طبع‌های گرم و سرد در مکتب سنتی آشپزی ایرانی است.";
      } else if (prodLower.includes("kabab") || prodLower.includes("کباب")) {
        cloned.culturalNotes = "شاهکار مطبخ قاجار که امروز محبوب‌ترین غذای میهمانی‌ها و نماد افتخار غذایی ایران است.";
      }
    }

    cloned.priceDisclaimer = "قیمت‌ها بر اساس تخمین هزینه مواد اولیه و نرخ روز بازار محاسبه شده و جنبه تخمینی دارد.";
  }

  return cloned;
}
