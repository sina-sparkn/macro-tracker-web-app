import { IngredientCost } from "./types";

export interface WorldFood {
  id: string;
  name: string;
  nativeName?: string;
  origin: string;
  region: "Persian" | "Middle East" | "Asia" | "Europe" | "Americas" | "Africa";
  emoji: string;
  description: string;
  culturalBackground: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  healthScore: number;
  healthRatingLabel: string;
  servingSize: string;
  funFact: string;
  summary: string;
  priceToman: number;
  priceUSD: number;
  ingredientCosts: IngredientCost[];
  nutritionalHighlights: string[];
  nutritionalWarnings: string[];
  ingredientsList: string[];

  // Persian localized fields
  nameFa?: string;
  originFa?: string;
  regionFa?: string;
  descriptionFa?: string;
  culturalBackgroundFa?: string;
  servingSizeFa?: string;
  funFactFa?: string;
  summaryFa?: string;
  ingredientCostsFa?: IngredientCost[];
  nutritionalHighlightsFa?: string[];
  nutritionalWarningsFa?: string[];
  ingredientsListFa?: string[];
}

export const WORLD_FOODS: WorldFood[] = [
  {
    id: "ghormeh_sabzi",
    name: "Ghormeh Sabzi (Herb Stew)",
    nativeName: "قورمه سبزی با برنج زعفرانی",
    nameFa: "قورمه سبزی با برنج زعفرانی",
    origin: "Iran",
    originFa: "ایران",
    region: "Persian",
    regionFa: "ایرانی",
    emoji: "🍲",
    description: "The quintessential Persian slow-cooked herb stew featuring tender lamb or beef, kidney beans, dried Persian limes (limoo amani), and aromatic sautéed herbs.",
    descriptionFa: "اصیل‌ترین خورش سنتی ایرانی با گوشت گوسفندی یا گوساله، لوبیا قرمز، لیمو عمانی و سبزیجات معطر سرخ‌شده.",
    culturalBackground: "Considered the national dish of Iran with roots dating back thousands of years. It represents Persian culinary philosophy: balancing hot and cold energies through cooling dried limes and warming green herbs.",
    culturalBackgroundFa: "خورش ملی و نماد سفره ایرانی با قدمتی چند هزار ساله؛ بازتاب‌دهنده تعادل سنتی طبع‌های گرم و سرد با لیمو عمانی خنک و سبزیجات معطر گرم.",
    calories: 420,
    protein: 28,
    carbs: 38,
    fat: 16,
    sodium: 480,
    healthScore: 92,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 plate (350g with saffron rice)",
    servingSizeFa: "۱ بشقاب (۳۵۰ گرم با برنج زعفرانی)",
    funFact: "The unique sour aroma comes from sun-dried Persian black limes (Limoo Amani) punctured before simmering.",
    funFactFa: "عطر ترش و منحصر‌به‌فرد این خورش ناشی از لیمو عمانی آفتاب‌خشک است که پیش از پخت سوراخ می‌شود تا عصاره آن خارج گردد.",
    summary: "Rich in antioxidants and iron from slow-simmered herbs (parsley, leek, coriander, fenugreek) and complex fiber from kidney beans.",
    summaryFa: "سرشار از آنتی‌اکسیدان‌ها، فیبر گیاهی و آهن طبیعی حاصل از سبزیجات تازه (تره، جعفری، گشنیز، شنبلیله) و لوبیا قرمز.",
    priceToman: 185000,
    priceUSD: 3.2,
    ingredientCosts: [
      { name: "Lamb / Beef Chuck (120g)", amount: "120g", costToman: 110000, costUSD: 1.9 },
      { name: "Persian Stew Herbs (Sabzi Ghormeh 100g)", amount: "100g", costToman: 25000, costUSD: 0.45 },
      { name: "Red Kidney Beans (40g)", amount: "40g", costToman: 12000, costUSD: 0.22 },
      { name: "Basmati Rice & Saffron (80g)", amount: "80g", costToman: 26000, costUSD: 0.45 },
      { name: "Dried Lime (Limoo) & Oil/Spices", amount: "portion", costToman: 12000, costUSD: 0.18 }
    ],
    ingredientCostsFa: [
      { name: "گوشت گوسفندی / گوساله (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 110000, costUSD: 1.9 },
      { name: "سبزی قورمه سرخ‌شده (۱۰۰ گرم)", amount: "۱۰۰ گرم", costToman: 25000, costUSD: 0.45 },
      { name: "لوبیا قرمز مرغوب (۴۰ گرم)", amount: "۴۰ گرم", costToman: 12000, costUSD: 0.22 },
      { name: "برنج دم‌سیاه با زعفران (۸۰ گرم)", amount: "۸۰ گرم", costToman: 26000, costUSD: 0.45 },
      { name: "لیمو عمانی، روغن و ادویه خورش", amount: "سهم مصرفی", costToman: 12000, costUSD: 0.18 }
    ],
    nutritionalHighlights: [
      "Extremely high in dietary fiber from fresh greens & beans",
      "High quality bioavailable protein (28g)",
      "High natural iron, magnesium, and vitamin K"
    ],
    nutritionalHighlightsFa: [
      "بسیار سرشار از فیبر رژیمی برگرفته از سبزیجات تازه و حبوبات",
      "پروتئین باکیفیت و با قابلیت جذب بالا (۲۸ گرم)",
      "منبع غنی آهن، منیزیم و ویتامین K"
    ],
    nutritionalWarnings: [
      "Avoid excess frying oil when preparing the herb mixture"
    ],
    nutritionalWarningsFa: [
      "از روغن زیاد هنگام سرخ کردن سبزی پرهیز کنید"
    ],
    ingredientsList: ["Lamb/Beef", "Parsley", "Coriander", "Fenugreek", "Persian Chives (Tareh)", "Red Kidney Beans", "Dried Persian Lime", "Turmeric", "Basmati Rice"],
    ingredientsListFa: ["گوشت گوساله/گوسفند", "جعفری", "گشنیز", "شنبلیله", "تره", "لوبیا قرمز", "لیمو عمانی", "زردچوبه", "برنج زعفرانی"]
  },
  {
    id: "chelo_kabab",
    name: "Chelo Kabab Koobideh",
    nativeName: "چلو کباب کوبیده سنتی با گوجه",
    nameFa: "چلو کباب کوبیده سنتی با گوجه",
    origin: "Iran",
    originFa: "ایران",
    region: "Persian",
    regionFa: "ایرانی",
    emoji: "🍢",
    description: "Iconic Persian skewered minced lamb and beef grilled over charcoal, served over steamed saffron basmati rice with grilled tomatoes and butter.",
    descriptionFa: "کباب کوبیده سنتی زغالی با گوشت تازه گوسفندی و گوساله، همراه با چلو زعفرانی، گوجه کبابی و کره محلی.",
    culturalBackground: "A royal tradition popularized during the Qajar era in Tabriz and Tehran, Chelo Kabab is now the ultimate celebratory Persian meal.",
    culturalBackgroundFa: "غذای درباری دوره قاجار در تبریز و تهران که امروز محبوب‌ترین غذای میهمانی‌ها و نماد فرهنگ غذایی ایران است.",
    calories: 680,
    protein: 38,
    carbs: 62,
    fat: 28,
    sodium: 580,
    healthScore: 78,
    healthRatingLabel: "B - Good",
    servingSize: "2 skewers with rice (400g)",
    servingSizeFa: "۲ سیخ با چلو زعفرانی (۴۰۰ گرم)",
    funFact: "Traditional diners sprinkle powdered red sumac on the meat, which helps aid digestion and cut through rich fats.",
    funFactFa: "پاشیدن سماق روی کباب نه تنها طعم لذیذی به آن می‌دهد بلکه به هضم چربی‌ها و کاهش جذب چربی‌های اشباع کمک می‌کند.",
    summary: "Outstanding source of lean animal protein, B-vitamins, and zinc, though higher in saturated fats and carbohydrates from buttery rice.",
    summaryFa: "منبع فوق‌العاده پروتئین حیوانی باکیفیت، ویتامین‌های گروه B و روی؛ همراه با چربی متوسط و کربوهیدرات برنج.",
    priceToman: 240000,
    priceUSD: 4.1,
    ingredientCosts: [
      { name: "Minced Lamb & Beef (200g)", amount: "200g", costToman: 160000, costUSD: 2.8 },
      { name: "Basmati Rice with Saffron (120g)", amount: "120g", costToman: 40000, costUSD: 0.7 },
      { name: "Grated Onions & Seasonings", amount: "50g", costToman: 10000, costUSD: 0.18 },
      { name: "Grilled Tomatoes & Sumac", amount: "2 pcs", costToman: 18000, costUSD: 0.3 },
      { name: "Butter & Lemon", amount: "portion", costToman: 12000, costUSD: 0.12 }
    ],
    ingredientCostsFa: [
      { name: "گوشت چرخ‌کرده قلوه‌گاه و راسته (۲۰۰ گرم)", amount: "۲۰۰ گرم", costToman: 160000, costUSD: 2.8 },
      { name: "برنج طارم درجه یک با زعفران (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 40000, costUSD: 0.7 },
      { name: "پیاز رنده‌شده و ادویه مخصوص", amount: "۵۰ گرم", costToman: 10000, costUSD: 0.18 },
      { name: "گوجه کبابی و سماق اعلا تبریز", amount: "۲ عدد", costToman: 18000, costUSD: 0.3 },
      { name: "کره حیوانی و لیمو ترش", amount: "سهم مصرفی", costToman: 12000, costUSD: 0.12 }
    ],
    nutritionalHighlights: [
      "Superior protein payload (38g) ideal for muscle building",
      "Rich in natural zinc and heme-iron",
      "Sumac spice provides concentrated polyphenol antioxidants"
    ],
    nutritionalHighlightsFa: [
      "۳۸ گرم پروتئین قدرتمند مناسب عضله‌سازی و بازسازی بافت‌ها",
      "سرشار از روی و آهن هِم با جذب بالا",
      "آنتی‌اکسیدان‌های طبیعی سماق ضدالتهاب"
    ],
    nutritionalWarnings: [
      "Moderate calorie density; consider half-portion rice if cutting carbs"
    ],
    nutritionalWarningsFa: [
      "تراکم کالری بالا؛ در صورت رژیم لاغری نیمی از برنج را مصرف کنید"
    ],
    ingredientsList: ["Minced Lamb/Beef", "Basmati Rice", "Saffron", "Onion", "Sumac", "Tomato", "Butter", "Black Pepper", "Salt"],
    ingredientsListFa: ["گوشت چرخ‌کرده گوسفند و گوساله", "برنج ایرانی", "زعفران", "پیاز", "سماق", "گوجه‌فرنگی", "کره", "فلفل سیاه", "نمک"]
  },
  {
    id: "ash_reshteh",
    name: "Ash Reshteh (Persian Noodle Soup)",
    nativeName: "آش رشته سنتی با کشک و نعناداغ",
    nameFa: "آش رشته سنتی با کشک و نعناداغ",
    origin: "Iran",
    originFa: "ایران",
    region: "Persian",
    regionFa: "ایرانی",
    emoji: "🥣",
    description: "A hearty, nourishing thick soup made with legumes (chickpeas, lentils, beans), fresh herbs, flat noodles (reshteh), topped with kashk (whey) and fried mint.",
    descriptionFa: "آش مقوی و اصیل با حبوبات (نخود، لوبیا چیتی، عدس)، سبزی آش تازه، رشته سنتی، کشک غلیظ و نعناداغ معطر.",
    culturalBackground: "Symbol of good fortune, traditionally cooked during Nowruz and seasonal gatherings. The noodles symbolize navigating the threads of life toward success.",
    culturalBackgroundFa: "نماد پیوند، برکت و شادکامی در نوروز و دورهمی‌های خانوادگی؛ رشته‌ها نماد گشوده شدن گره‌های زندگی هستند.",
    calories: 340,
    protein: 16,
    carbs: 52,
    fat: 8,
    sodium: 520,
    healthScore: 89,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 generous bowl (320g)",
    servingSizeFa: "۱ کاسه بزرگ (۳۲۰ گرم)",
    funFact: "Kashk, a sun-dried salted sour whey, is one of the world's most concentrated sources of natural fermented calcium and protein.",
    funFactFa: "کشک سنتی یکی از متراکم‌ترین منابع کلسیم و پروتئین تخمیری طبیعی جهان است.",
    summary: "Vegetarian powerhouse packed with plant proteins, legumes, gut-healthy greens, and slow-burning complex carbs.",
    summaryFa: "یک غذای گیاهی کامل و مقوی سرشار از پروتئین گیاهی، فیبر مفید برای گوارش و کربوهیدرات‌های پیچیده.",
    priceToman: 95000,
    priceUSD: 1.65,
    ingredientCosts: [
      { name: "Mixed Legumes (Chickpeas, Lentils, Beans 80g)", amount: "80g", costToman: 28000, costUSD: 0.48 },
      { name: "Fresh Herb Mix (Spinach, Coriander, Dill 100g)", amount: "100g", costToman: 24000, costUSD: 0.42 },
      { name: "Persian Reshteh Noodles (50g)", amount: "50g", costToman: 15000, costUSD: 0.26 },
      { name: "Kashk Whey & Fried Mint Garnish", amount: "40g", costToman: 18000, costUSD: 0.31 },
      { name: "Caramelized Fried Onions (Piaz Dagh)", amount: "30g", costToman: 10000, costUSD: 0.18 }
    ],
    ingredientCostsFa: [
      { name: "حبوبات مخلوط (نخود، لوبیا، عدس ۸۰ گرم)", amount: "۸۰ گرم", costToman: 28000, costUSD: 0.48 },
      { name: "سبزی آش تازه (اسفناج، تره، گشنیز، جعفری)", amount: "۱۰۰ گرم", costToman: 24000, costUSD: 0.42 },
      { name: "رشته آشی سنتی (۵۰ گرم)", amount: "۵۰ گرم", costToman: 15000, costUSD: 0.26 },
      { name: "کشک محلی غلیظ و نعناداغ", amount: "۴۰ گرم", costToman: 18000, costUSD: 0.31 },
      { name: "پیازداغ و سیرداغ کاراملی", amount: "۳۰ گرم", costToman: 10000, costUSD: 0.18 }
    ],
    nutritionalHighlights: [
      "Outstanding plant-based diversity (over 7 plants in one bowl)",
      "High in calcium from cultured Persian Kashk",
      "High dietary fiber (9g) for sustained satiety"
    ],
    nutritionalHighlightsFa: [
      "تنوع غذایی گیاهی فوق‌العاده (بیش از ۷ گیاه و سبزی در یک کاسه)",
      "منبع عالی کلسیم طبیعی از کشک سنتی",
      "۹ گرم فیبر رژیمی که احساس سیری طولانی‌مدت ایجاد می‌کند"
    ],
    nutritionalWarnings: [
      "Moderate sodium due to salted Kashk seasoning"
    ],
    nutritionalWarningsFa: [
      "به دلیل نمک کشک، مصرف نمک اضافی را به حداقل برسانید"
    ],
    ingredientsList: ["Reshteh Noodles", "Chickpeas", "Lentils", "Navy Beans", "Spinach", "Coriander", "Dill", "Kashk (Whey)", "Mint", "Onion"],
    ingredientsListFa: ["رشته آشی", "نخود", "عدس", "لوبیا چیتی", "اسفناج", "گشنیز", "شوید", "کشک", "نعنا", "پیاز"]
  },
  {
    id: "mirza_ghasemi",
    name: "Mirza Ghasemi (Smoked Eggplant)",
    nativeName: "میرزا قاسمی اصیل گیلانی",
    nameFa: "میرزا قاسمی اصیل گیلانی",
    origin: "Iran (Gilan)",
    originFa: "ایران (گیلان)",
    region: "Persian",
    regionFa: "ایرانی",
    emoji: "🍆",
    description: "Famous northern Iranian dish made of charred wood-smoked eggplants blended with ripe tomatoes, copious garlic, and whipped farm eggs.",
    descriptionFa: "خوراک مشهور گیلان با بادمجان‌های کباب‌شده روی زغال، گوجه‌فرنگی رنده‌شده، سیر فراوان و تخم‌مرغ تازه محلی.",
    culturalBackground: "Originating in Gilan (UNESCO Creative City of Gastronomy), invented by Mohammad Ghasem Khan, governor of Rasht in the 19th century.",
    culturalBackgroundFa: "برآمده از رشت، شهر خلاق خوراک‌شناسی یونسکو؛ ابداع‌شده توسط محمدقاسم خان والی رشت در دوره قاجار.",
    calories: 210,
    protein: 11,
    carbs: 16,
    fat: 12,
    sodium: 320,
    healthScore: 94,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 bowl with Sangak bread (220g)",
    servingSizeFa: "۱ کاسه با نان سنگک (۲۲۰ گرم)",
    funFact: "The irresistible smoky taste comes from grilling whole eggplants directly over open hardwood embers until charred black.",
    funFactFa: "عطر دودی فوق‌العاده این غذا ناشی از سوزاندن مستقیم پوست بادمجان روی زغال چوب است.",
    summary: "Extremely nutrient-dense and low in calories, providing powerful antioxidants (nasunin in eggplants, allicin in garlic) and egg protein.",
    summaryFa: "بسیار متراکم از نظر مواد مغذی و کم‌کالری؛ سرشار از آنتی‌اکسیدان ناسونین بادمجان، آلیسین ضدعفونی‌کننده سیر و پروتئین تخم‌مرغ.",
    priceToman: 75000,
    priceUSD: 1.3,
    ingredientCosts: [
      { name: "Charred Eggplants (200g)", amount: "200g", costToman: 22000, costUSD: 0.38 },
      { name: "Farm Eggs (2 pcs)", amount: "2 pcs", costToman: 20000, costUSD: 0.35 },
      { name: "Plum Tomatoes (150g)", amount: "150g", costToman: 15000, costUSD: 0.26 },
      { name: "Fresh Garlic & Turmeric", amount: "4 cloves", costToman: 8000, costUSD: 0.14 },
      { name: "Olive Oil & Seasonings", amount: "portion", costToman: 10000, costUSD: 0.17 }
    ],
    ingredientCostsFa: [
      { name: "بادمجان کبابی زغالی (۲۰۰ گرم)", amount: "۲۰۰ گرم", costToman: 22000, costUSD: 0.38 },
      { name: "تخم‌مرغ محلی تازه (۲ عدد)", amount: "۲ عدد", costToman: 20000, costUSD: 0.35 },
      { name: "گوجه‌فرنگی رنده‌شده پخته (۱۵۰ گرم)", amount: "۱۵۰ گرم", costToman: 15000, costUSD: 0.26 },
      { name: "سیر تازه شمال و زردچوبه", amount: "۴ حبه", costToman: 8000, costUSD: 0.14 },
      { name: "روغن زیتون گیلان و چاشنی‌ها", amount: "سهم مصرفی", costToman: 10000, costUSD: 0.17 }
    ],
    nutritionalHighlights: [
      "Low calorie density with high volume and satiety",
      "Loaded with garlic allicin for cardiovascular support",
      "High lutein and zeaxanthin from egg yolks"
    ],
    nutritionalHighlightsFa: [
      "تراکم کالری پایین با حجم سیرکننده بالا",
      "سرشار از آلیسین سیر برای سلامت قلب و عروق",
      "لوتئین و زآگزانتین تخم‌مرغ برای تقویت بینایی"
    ],
    nutritionalWarnings: [
      "Ensure moderate oil usage when scrambling the eggs"
    ],
    nutritionalWarningsFa: [
      "هنگام طبخ از روغن زیتون ملایم و به میزان کنترل‌شده استفاده نمایید"
    ],
    ingredientsList: ["Charred Eggplants", "Eggs", "Tomatoes", "Garlic", "Turmeric", "Olive Oil", "Black Pepper", "Sea Salt"],
    ingredientsListFa: ["بادمجان کبابی", "تخم‌مرغ", "گوجه‌فرنگی", "سیر تازه", "زردچوبه", "روغن زیتون", "فلفل سیاه", "نمک"]
  },
  {
    id: "kimchi",
    name: "Korean Kimchi & Tofu Plate",
    nativeName: "کیمچی و توفو سنتی کره",
    nameFa: "کیمچی و توفو سنتی کره",
    origin: "South Korea",
    originFa: "کره جنوبی",
    region: "Asia",
    regionFa: "آسیا",
    emoji: "🥬",
    description: "A traditional fermented Korean side dish made of salted napa cabbage, radishes, and gochugaru chili, served with warm steamed tofu.",
    descriptionFa: "خوراک تخمیری و سنتی کره‌ای تهیه شده از کلم ناپا، تربچه، فلفل گوچوگارو و سیر، همراه با توفو بخارپز پروتئینی.",
    culturalBackground: "UNESCO Intangible Cultural Heritage. The preparation ritual (Kimjang) brings communities together each autumn to prepare for winter.",
    culturalBackgroundFa: "میراث فرهنگی ناملموس یونسکو؛ سنت «کیم‌جانگ» پیونددهنده خانواده‌ها در فصل پاییز برای تهیه ذخیره زمستانی است.",
    calories: 145,
    protein: 12,
    carbs: 9,
    fat: 6,
    sodium: 490,
    healthScore: 96,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 plate (200g)",
    servingSizeFa: "۱ بشقاب (۲۰۰ گرم)",
    funFact: "Fermentation produces millions of beneficial lactic acid bacteria per gram, rivaling yogurt in probiotic density.",
    funFactFa: "فرایند تخمیر کیمچی میلیون‌ها باکتری پروبیوتیک زنده تولید می‌کند که تراکم آن با بهترین ماست‌های دنیا برابری می‌کند.",
    summary: "Outstanding gut-healing superfood pairing live active cultures with clean plant protein and anti-inflammatory capsaicin.",
    summaryFa: "سوپرفود تقویت‌کننده میکروبیوم روده با پروبیوتیک‌های فعال، پروتئین گیاهی پاک توفو و کپسایسین ضدالتهاب.",
    priceToman: 80000,
    priceUSD: 1.4,
    ingredientCosts: [
      { name: "Fermented Kimchi (120g)", amount: "120g", costToman: 40000, costUSD: 0.7 },
      { name: "Organic Silken Tofu (100g)", amount: "100g", costToman: 28000, costUSD: 0.48 },
      { name: "Toasted Sesame & Scallions", amount: "garnish", costToman: 12000, costUSD: 0.22 }
    ],
    ingredientCostsFa: [
      { name: "کیمچی کلم تخمیری دست‌ساز (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 40000, costUSD: 0.7 },
      { name: "توفو تازه گیاهی ارگانیک (۱۰۰ گرم)", amount: "۱۰۰ گرم", costToman: 28000, costUSD: 0.48 },
      { name: "کنجد برشته و پیازچه تازه", amount: "چاشنی", costToman: 12000, costUSD: 0.22 }
    ],
    nutritionalHighlights: [
      "Millions of gut-friendly active probiotics",
      "Very low calorie density (only 145 kcal)",
      "Rich in Vitamins A, C, and K"
    ],
    nutritionalHighlightsFa: [
      "میلیون‌ها باکتری پروبیوتیک فعال برای سلامت روده",
      "کالری فوق‌العاده کم (تنها ۱۴۵ کالری)",
      "منبع غنی ویتامین‌های A، C و K"
    ],
    nutritionalWarnings: [
      "Moderate sodium due to sea salt brining process"
    ],
    nutritionalWarningsFa: [
      "به دلیل فرآیند تخمیر با نمک دریایی، سدیم متوسط دارد"
    ],
    ingredientsList: ["Napa Cabbage", "Radish", "Tofu", "Gochugaru Chili", "Garlic", "Ginger", "Green Onion", "Sesame Seeds"],
    ingredientsListFa: ["کلم ناپا", "تربچه", "توفو", "فلفل قرمز گوچوگارو", "سیر", "زنجبیل", "پیازچه", "کنجد"]
  },
  {
    id: "hummus",
    name: "Lebanese Hummus & Tahini Bowl",
    nativeName: "حمص لبنانی با روغن زیتون بکر",
    nameFa: "حمص لبنانی با روغن زیتون بکر",
    origin: "Lebanon",
    originFa: "لبنان",
    region: "Middle East",
    regionFa: "خاورمیانه",
    emoji: "🧆",
    description: "Silky smooth whipped chickpeas folded with roasted sesame tahini, fresh lemon juice, crushed garlic, and drizzled with cold-pressed olive oil.",
    descriptionFa: "نخود پخته کرمی پوره‌شده با ارده کنجد بو داده، آب‌لیموی تازه، سیر له شده و روغن زیتون فرابکر مدیترانه‌ای.",
    culturalBackground: "A cornerstone of Levantine mezze dining for centuries, symbolizing hospitality and communal sharing across the Mediterranean.",
    culturalBackgroundFa: "پایه اصلی مزه مدیترانه‌ای که نماد بخشندگی، سلامت و دورهمی شاداب در فرهنگ شام و خاورمیانه است.",
    calories: 220,
    protein: 9,
    carbs: 18,
    fat: 13,
    sodium: 280,
    healthScore: 91,
    healthRatingLabel: "A - Excellent",
    servingSize: "1/2 cup (130g)",
    servingSizeFa: "نصف پیمانه (۱۳۰ گرم)",
    funFact: "Combining sesame tahini with chickpeas creates a complete amino acid profile, matching meat protein quality.",
    funFactFa: "ترکیب ارده کنجد با نخود، پروفایل اسیدهای آمینه ضروری را تکمیل کرده و کیفیتی معادل پروتئین گوشت پدید می‌آورد.",
    summary: "Heart-healthy unsaturated fats, plant proteins, and soluble fibers help stabilize cholesterol and regulate post-meal blood glucose.",
    summaryFa: "چربی‌های غیراشباع مفید قلب، فیبر محلول کاهنده کلسترول و شاخص گلیسمی بسیار پایین برای تثبیت قند خون.",
    priceToman: 70000,
    priceUSD: 1.2,
    ingredientCosts: [
      { name: "Cooked Chickpeas (100g)", amount: "100g", costToman: 20000, costUSD: 0.35 },
      { name: "Sesame Tahini (30g)", amount: "30g", costToman: 26000, costUSD: 0.45 },
      { name: "Cold-Pressed Extra Virgin Olive Oil (15ml)", amount: "15ml", costToman: 16000, costUSD: 0.28 },
      { name: "Fresh Lemon Juice & Garlic", amount: "fresh", costToman: 8000, costUSD: 0.12 }
    ],
    ingredientCostsFa: [
      { name: "نخود مرغوب پخته و پوست‌کنده (۱۰۰ گرم)", amount: "۱۰۰ گرم", costToman: 20000, costUSD: 0.35 },
      { name: "ارده کنجد خالص کنجدی (۳۰ گرم)", amount: "۳۰ گرم", costToman: 26000, costUSD: 0.45 },
      { name: "روغن زیتون فرابکر پرس سرد (۱۵ میلی‌لیتر)", amount: "۱۵ میلی‌لیتر", costToman: 16000, costUSD: 0.28 },
      { name: "آب لیموترش تازه شیراز و سیر", amount: "تازه", costToman: 8000, costUSD: 0.12 }
    ],
    nutritionalHighlights: [
      "Complete plant-based amino acid profile",
      "High in heart-protective monounsaturated oleic acid",
      "Excellent source of prebiotic dietary fiber"
    ],
    nutritionalHighlightsFa: [
      "پروفایل کامل اسیدهای آمینه گیاهی",
      "سرشار از اسید اولئیک روغن زیتون حامی قلب",
      "منبع عالی فیبر پری‌بیوتیک"
    ],
    nutritionalWarnings: [
      "Relatively calorie-dense due to tahini and olive oil"
    ],
    nutritionalWarningsFa: [
      "به دلیل ارده و روغن زیتون تراکم کالری نسبتاً بالایی دارد"
    ],
    ingredientsList: ["Chickpeas", "Tahini (Sesame Paste)", "Olive Oil", "Lemon Juice", "Garlic", "Sea Salt", "Cumin"],
    ingredientsListFa: ["نخود", "ارده کنجد", "روغن زیتون فرابکر", "آب لیمو", "سیر", "نمک دریا", "زیره"]
  },
  {
    id: "pasta_pomodoro",
    name: "Italian Pasta al Pomodoro & Basilico",
    nativeName: "پاستا پومودورو با گوجه سان‌مارزانو و ریحان",
    nameFa: "پاستا پومودورو با گوجه سان‌مارزانو و ریحان",
    origin: "Italy",
    originFa: "ایتالیا",
    region: "Europe",
    regionFa: "اروپا",
    emoji: "🍝",
    description: "Classic Neapolitan al dente spaghetti tossed in a sweet slow-simmered San Marzano tomato sauce, fresh fragrant basil, and aged Parmigiano.",
    descriptionFa: "اسپاگتی اصیل ایتالیایی آل‌دنته همراه با سس گوجه‌فرنگی شیرین سان‌مارزانو، برگ ریحان معطر و پنیر پارمیجانو رنده شده.",
    culturalBackground: "The hallmark of Italian cucina povera ('humble cuisine')—highlighting how just four pristine ingredients create culinary perfection.",
    culturalBackgroundFa: "نماد مکتب آشپزی اصیل ایتالیا که نشان می‌دهد چگونه ترکیب چند ماده اولیه باکیفیت شاهکاری جاودانه خلق می‌کند.",
    calories: 380,
    protein: 14,
    carbs: 64,
    fat: 8,
    sodium: 360,
    healthScore: 84,
    healthRatingLabel: "B - Good",
    servingSize: "1 plate (280g)",
    servingSizeFa: "۱ بشقاب (۲۸۰ گرم)",
    funFact: "Cooking tomatoes in olive oil dramatically boosts the bioavailability of lycopene, a potent cancer-preventing carotenoid.",
    funFactFa: "پختن گوجه‌فرنگی در روغن زیتون جذب آنتی‌اکسیدان لیکوپن را به شکل چشمگیری در بدن چند برابر می‌کند.",
    summary: "Clean source of complex energy with powerful lycopene antioxidants and heart-protective extra virgin olive oil.",
    summaryFa: "منبع تمیز انرژی با کربوهیدرات پیچیده، لیکوپن ضدسرطان و اسیدهای چرب محافظ قلب.",
    priceToman: 110000,
    priceUSD: 1.9,
    ingredientCosts: [
      { name: "Durum Wheat Spaghetti (100g)", amount: "100g", costToman: 25000, costUSD: 0.43 },
      { name: "Crushed Plum Tomatoes (150g)", amount: "150g", costToman: 30000, costUSD: 0.52 },
      { name: "Parmigiano-Reggiano Cheese (20g)", amount: "20g", costToman: 35000, costUSD: 0.6 },
      { name: "Extra Virgin Olive Oil & Fresh Basil", amount: "fresh", costToman: 20000, costUSD: 0.35 }
    ],
    ingredientCostsFa: [
      { name: "اسپاگتی گندم دوروم سمولینا (۱۰۰ گرم)", amount: "۱۰۰ گرم", costToman: 25000, costUSD: 0.43 },
      { name: "سس گوجه‌فرنگی دست‌چین (۱۵۰ گرم)", amount: "۱۵۰ گرم", costToman: 30000, costUSD: 0.52 },
      { name: "پنیر پارمیجانو رنده شده (۲۰ گرم)", amount: "۲۰ گرم", costToman: 35000, costUSD: 0.6 },
      { name: "روغن زیتون فرابکر و ریحان تازه ایتالیایی", amount: "تازه", costToman: 20000, costUSD: 0.35 }
    ],
    nutritionalHighlights: [
      "Supercharged lycopene antioxidant payload",
      "Low in saturated fats and cholesterol-free base",
      "High satiety index from al dente durum semolina"
    ],
    nutritionalHighlightsFa: [
      "سرشار از آنتی‌اکسیدان قدرتمند لیکوپن",
      "چربی اشباع بسیار پایین و بدون کلسترول مضر",
      "شاخص سیری مناسب به دلیل پخت آل‌دنته گندم دوروم"
    ],
    nutritionalWarnings: [
      "High carbohydrate proportion, pair with protein if on a low-carb diet"
    ],
    nutritionalWarningsFa: [
      "کربوهیدرات بالا؛ در صورت رژیم لوکارب بهتر است با پروتئین همراه شود"
    ],
    ingredientsList: ["Durum Semolina Spaghetti", "Plum Tomatoes", "Garlic", "Extra Virgin Olive Oil", "Fresh Basil", "Parmigiano Cheese", "Sea Salt"],
    ingredientsListFa: ["اسپاگتی دوروم", "گوجه‌فرنگی", "سیر", "روغن زیتون فرابکر", "ریحان تازه", "پنیر پارمسان", "نمک دریا"]
  },
  {
    id: "tacos",
    name: "Mexican Street Tacos al Pastor",
    nativeName: "تاکو مکزیکی با ذرت و آووکادو",
    nameFa: "تاکو ذرت اصیل مکزیکی با آووکادو",
    origin: "Mexico",
    originFa: "مکزیک",
    region: "Americas",
    regionFa: "قاره آمریکا",
    emoji: "🌮",
    description: "Warm artisanal corn tortillas filled with spiced marinated meat, diced white onions, fresh cilantro, salsa verde, and creamy avocado.",
    descriptionFa: "نان ترتیلای ذرت سنتی پر شده با گوشت طعم‌دار مکزیکی، پیاز نگینی، گشنیز تازه، سس سالسا ورد و تکه‌های آووکادو.",
    culturalBackground: "A fusion born from Lebanese immigrants who brought vertical spit-roasting (shawarma) to Mexico in the early 20th century, adapted with local chilies.",
    culturalBackgroundFa: "تلفیقی شگفت‌انگیز که در اوایل قرن بیستم با ورود مهاجران لبنانی و تلفیق با فلفل‌ها و ترتیلای ذرت مکزیک پدید آمد.",
    calories: 360,
    protein: 24,
    carbs: 32,
    fat: 15,
    sodium: 420,
    healthScore: 86,
    healthRatingLabel: "B - Good",
    servingSize: "2 tacos (220g)",
    servingSizeFa: "۲ تاکو (۲۲۰ گرم)",
    funFact: "Corn tortillas are nixtamalized (soaked in limestone water), which unlocks vitamin B3 (niacin) and calcium that raw corn lacks.",
    funFactFa: "نان ترتیلا با فرآیند باستانی نیکستامالیزاسیون تهیه می‌شود که کلسیم و نیاسین ذرت را برای بدن قابل جذب می‌کند.",
    summary: "Balanced balance of corn carbohydrates, lean protein, and healthy monounsaturated fats from avocado.",
    summaryFa: "ترکیب متعادل فیبر ذرت بدون گلوتن، پروتئین خالص و اسیدهای چرب سالم آووکادو.",
    priceToman: 130000,
    priceUSD: 2.25,
    ingredientCosts: [
      { name: "Spiced Marinated Meat (120g)", amount: "120g", costToman: 75000, costUSD: 1.3 },
      { name: "Nixtamalized Corn Tortillas (2 pcs)", amount: "2 pcs", costToman: 20000, costUSD: 0.35 },
      { name: "Avocado & Tomatillo Salsa", amount: "50g", costToman: 25000, costUSD: 0.43 },
      { name: "White Onions & Fresh Cilantro", amount: "fresh", costToman: 10000, costUSD: 0.17 }
    ],
    ingredientCostsFa: [
      { name: "گوشت طعم‌دار ادویه‌کاری‌شده (۱۲۰ گرم)", amount: "۱۲۰ گرم", costToman: 75000, costUSD: 1.3 },
      { name: "نان ترتیلا ذرت دست‌ساز (۲ عدد)", amount: "۲ عدد", costToman: 20000, costUSD: 0.35 },
      { name: "آووکادو تازه و سس سالسا (۵۰ گرم)", amount: "۵۰ گرم", costToman: 25000, costUSD: 0.43 },
      { name: "پیاز سفید نگینی، گشنیز و لیمو", amount: "تازه", costToman: 10000, costUSD: 0.17 }
    ],
    nutritionalHighlights: [
      "Gluten-free traditional corn tortillas with bioavailable calcium",
      "Monounsaturated fatty acids from fresh avocado",
      "High protein per portion (24g)"
    ],
    nutritionalHighlightsFa: [
      "ترتیلا ذرت کاملاً بدون گلوتن با کلسیم فعال",
      "چربی‌های مفید قلبی از آووکادو تازه",
      "۲۴ گرم پروتئین به ازای هر وعده"
    ],
    nutritionalWarnings: [
      "Check sodium levels in commercial salsas"
    ],
    nutritionalWarningsFa: [
      "در صورت مصرف سالساهای آماده، به میزان سدیم دقت کنید"
    ],
    ingredientsList: ["Marinated Pork/Beef", "Corn Tortillas", "Avocado", "Tomatillo", "White Onion", "Cilantro", "Lime Juice", "Achiote Chili"],
    ingredientsListFa: ["گوشت طعم‌دار", "نان ذرت ترتیلا", "آووکادو", "سس سالسا", "پیاز سفید", "گشنیز", "آب لیمو", "فلفل چیلی"]
  },
  {
    id: "injera",
    name: "Ethiopian Injera & Lentil Wat",
    nativeName: "نان اینجرا اتیوپی با خوراک عدس",
    nameFa: "نان اینجرا اتیوپی با خوراک عدس",
    origin: "Ethiopia",
    originFa: "اتیوپی",
    region: "Africa",
    regionFa: "آفریقا",
    emoji: "🥞",
    description: "Spongy sourdough fermented flatbread made from ancient teff grain, topped with spicy slow-simmered red lentils (Misir Wat).",
    descriptionFa: "نان اسفنجی تخمیری تهیه شده از دانه باستانی تف (Teff) همراه با خوراک پرادویه عدس قرمز (میسیر وات).",
    culturalBackground: "Injera serves as plate, utensil, and food in Ethiopian dining, where diners eat communally from one shared 'gebeta' platter to foster unity.",
    culturalBackgroundFa: "در اتیوپی اینجرا هم بشقاب، هم قاشق و هم غذاست؛ نماد همبستگی که همگی از یک سینی مشترک میل می‌کنند.",
    calories: 290,
    protein: 15,
    carbs: 48,
    fat: 4,
    sodium: 310,
    healthScore: 93,
    healthRatingLabel: "A - Excellent",
    servingSize: "1 portion (260g)",
    servingSizeFa: "۱ سهم (۲۶۰ گرم)",
    funFact: "Teff grain is the smallest grain in the world (1/150th size of wheat) but contains 5x the iron and calcium of standard wheat.",
    funFactFa: "دانه تف ریزترین غله جهان است (یک‌صد و پنجاهم گندم) اما ۵ برابر گندم آهن و کلسیم دارد.",
    summary: "A wholesome fermented ancient grain meal that is naturally vegan, gluten-free, rich in prebiotic fiber, and packed with plant iron.",
    summaryFa: "یک وعده غذایی باستانی کاملاً گیاهی، بدون گلوتن، سرشار از آهن و فیبر پری‌بیوتیک مفید برای دستگاه گوارش.",
    priceToman: 85000,
    priceUSD: 1.45,
    ingredientCosts: [
      { name: "Ancient Teff Flour (80g)", amount: "80g", costToman: 35000, costUSD: 0.6 },
      { name: "Red Lentils (80g)", amount: "80g", costToman: 22000, costUSD: 0.38 },
      { name: "Berbere Spice Blend & Garlic", amount: "portion", costToman: 16000, costUSD: 0.28 },
      { name: "Onions & Vegetable Oil", amount: "portion", costToman: 12000, costUSD: 0.19 }
    ],
    ingredientCostsFa: [
      { name: "آرد دانه باستانی تف (۸۰ گرم)", amount: "۸۰ گرم", costToman: 35000, costUSD: 0.6 },
      { name: "عدس قرمز پخته دال عدس (۸۰ گرم)", amount: "۸۰ گرم", costToman: 22000, costUSD: 0.38 },
      { name: "ادویه بربره اتیوپی و سیر تازه", amount: "سهم", costToman: 16000, costUSD: 0.28 },
      { name: "پیاز داغ و روغن گیاهی سالم", amount: "سهم", costToman: 12000, costUSD: 0.19 }
    ],
    nutritionalHighlights: [
      "Naturally 100% gluten-free and gut-fermented",
      "Remarkable iron and calcium content from teff",
      "High fiber (11g) promotes long-lasting energy"
    ],
    nutritionalHighlightsFa: [
      "۱۰۰٪ بدون گلوتن و تخمیر شده به‌صورت طبیعی",
      "آهن و کلسیم فوق‌العاده بالا از دانه تف",
      "۱۱ گرم فیبر برای انرژی پایدار و کنترل قند"
    ],
    nutritionalWarnings: [
      "Sourdough fermentation produces a distinctive tart flavor"
    ],
    nutritionalWarningsFa: [
      "تخمیر طبیعی طعمی ویژه و ترش‌مزه به نان می‌دهد"
    ],
    ingredientsList: ["Teff Flour", "Red Lentils", "Berbere Spice", "Garlic", "Ginger", "Red Onion", "Vegetable Broth"],
    ingredientsListFa: ["آرد تف", "دال عدس قرمز", "ادویه بربره", "سیر", "زنجبیل", "پیاز قرمز", "عصاره سبزیجات"]
  }
];

export function getLocalizedWorldFood(food: WorldFood, lang: "en" | "fa"): WorldFood {
  if (lang !== "fa") return food;
  return {
    ...food,
    name: food.nameFa || food.nativeName || food.name,
    origin: food.originFa || food.origin,
    description: food.descriptionFa || food.description,
    culturalBackground: food.culturalBackgroundFa || food.culturalBackground,
    servingSize: food.servingSizeFa || food.servingSize,
    funFact: food.funFactFa || food.funFact,
    summary: food.summaryFa || food.summary,
    ingredientCosts: food.ingredientCostsFa || food.ingredientCosts,
    nutritionalHighlights: food.nutritionalHighlightsFa || food.nutritionalHighlights,
    nutritionalWarnings: food.nutritionalWarningsFa || food.nutritionalWarnings,
    ingredientsList: food.ingredientsListFa || food.ingredientsList,
    healthRatingLabel: food.healthRatingLabel.replace("A - Excellent", "A - عالی")
      .replace("B - Good", "B - خوب")
      .replace("C - Moderate", "C - متوسط")
      .replace("D - Poor", "D - ضعیف")
  };
}
