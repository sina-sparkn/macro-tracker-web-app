export interface AppTranslations {
  scanner: string;
  diary: string;
  goals: string;
  scanNutritionLabel: string;
  snapPhotoDesc: string;
  startCamera: string;
  uploadPhoto: string;
  processingLabel: string;
  alignLabelBracket: string;
  foodOfTheDay: string;
  foodsAroundWorld: string;
  fullNutritionFacts: string;
  logToDiary: string;
  scanIssueDetected: string;
  todaysIntake: string;
  todaysMeals: string;
  diaryEmpty: string;
  clearAll: string;
  protein: string;
  carbs: string;
  fat: string;
  sodium: string;
  yourName: string;
  quickPresets: string;
  adjustCaps: string;
  calorieCap: string;
  proteinTarget: string;
  carbsTarget: string;
  fatTarget: string;
  sodiumLimit: string;
  languageSettings: string;
  selectLanguage: string;
  calorieGoalText: string;
  captureSnapshot: string;
  cancel: string;
  emptyDiaryBtn: string;
  healthProfileTitle: string;
  healthProfileDesc: string;
  presetBalanced: string;
  presetLoss: string;
  presetMuscle: string;
  presetKeto: string;
  detectedResult: string;
  portionMultiplier: string;
  portionMultiplierDesc: string;
  totalCalories: string;
  vitaminsMicro: string;
  aiLabelAnalysis: string;
  nutritionalHighlights: string;
  watchOutFor: string;
  extractedIngredients: string;
  logPortionBtn: string;
  calorieEstimate: string;
  healthScore: string;
  estimatedPrice: string;
  pricePerDish: string;
  ingredientsBreakdown: string;
  currency: string;
  dailyFoodBudget: string;
  culturalNotes: string;
  foodType: string;
  dish: string;
  packagedFood: string;
  beverage: string;
  toman: string;
  usd: string;
  totalBudgetSpent: string;
  origin: string;
  estimatedFoodSpend: string;
  dailyBudgetUtilized: string;
  budgetExceeded: string;
  currencyAndBudget: string;
  currencyPreference: string;
  dailyBudget: string;
  brand: string;
  servingSize: string;
  adjustPortionDesc: string;
  servings: string;
  perServingPrice: string;
  ingredientCosts: string;
  ingredients: string;
  appTitle: string;
  appSubtitle: string;
  dailyCalorieIntake: string;
  kcalUnit: string;
  gramUnit: string;
  mgUnit: string;
  globalSpec: string;
  dishesCount: string;
  globalRecipesSubtitle: string;
  viewDetails: string;
  kcalPerServing: string;
  limitExceeded: string;
  maxLimit: string;
  quantity: string;
  deleteEntry: string;
  dollarOption: string;
  tomanOption: string;
  budgetDescription: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  totalCarbs: string;
  sugars: string;
  fiber: string;
  cholesterol: string;
  addedSugars: string;
  sodiumContent: string;
  dailyValue: string;
  ocrVision: string;
  geminiApi: string;
  extractMacros: string;
  score: string;
  emptyDiaryPrompt: string;
  satAbbr: string;
  transAbbr: string;
  sugarsAbbr: string;
  fiberAbbr: string;
  proteinAbbr: string;
  carbsAbbr: string;
  fatAbbr: string;
  switchLanguage: string;
  ratingExcellent: string;
  ratingGood: string;
  ratingModerate: string;
  ratingPoor: string;
  detectedFoodLabelResult: string;
  unknownBrand: string;
  oneContainer: string;
  dailyValueAbbr: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  themeAutoSynced: string;
  themeToggleAria: string;
  scanHistory: string;
  scanHistorySubtitle: string;
  addToDiary: string;
  addedToDiary: string;
  clearHistory: string;
  noRecentScans: string;
  loadSampleScans: string;
  addFromScanHistory: string;
  selectServing: string;
  searchScanHistory: string;
  removeFromHistory: string;
}

export const TRANSLATIONS: Record<string, AppTranslations> = {
  en: {
    scanner: "Scanner",
    diary: "Diary",
    goals: "Goals",
    scanNutritionLabel: "Scan Meal or Label",
    snapPhotoDesc: "Snap a photo of your meal or nutrition table for instant calories & macros.",
    startCamera: "Start Camera",
    uploadPhoto: "Upload Photo",
    processingLabel: "Analyzing Meal...",
    alignLabelBracket: "Align Food Inside Frame",
    foodOfTheDay: "Today's Pick",
    foodsAroundWorld: "World Foods",
    fullNutritionFacts: "Nutrition Facts",
    logToDiary: "Log to Diary",
    scanIssueDetected: "Scan Issue Detected",
    todaysIntake: "Daily Intake",
    todaysMeals: "Meals",
    diaryEmpty: "No meals recorded yet",
    clearAll: "Clear All",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    sodium: "Sodium",
    yourName: "Your Name",
    quickPresets: "Dietary Presets",
    adjustCaps: "Nutrient Targets",
    calorieCap: "Daily Calorie Cap",
    proteinTarget: "Protein Target",
    carbsTarget: "Carbohydrate Target",
    fatTarget: "Fat Target",
    sodiumLimit: "Sodium Limit",
    languageSettings: "Language Settings",
    selectLanguage: "Select App Language",
    calorieGoalText: "calorie goal",
    captureSnapshot: "Capture Snapshot",
    cancel: "Cancel",
    emptyDiaryBtn: "Scan Food or Dish",
    healthProfileTitle: "Goals & Budget",
    healthProfileDesc: "Set your daily calorie, macro, and budget targets.",
    presetBalanced: "Balanced (2,000)",
    presetLoss: "Weight Loss (1,600)",
    presetMuscle: "Muscle Gain (2,500)",
    presetKeto: "Keto (1,800)",
    detectedResult: "Nutrition & Cost",
    portionMultiplier: "Portion Multiplier",
    portionMultiplierDesc: "Scale nutrition to your exact meal portion",
    totalCalories: "Total Calories",
    vitaminsMicro: "Micronutrients",
    aiLabelAnalysis: "AI Nutrition Insights",
    nutritionalHighlights: "Highlights",
    watchOutFor: "Watch Out For",
    extractedIngredients: "Ingredients",
    logPortionBtn: "Log to Diary",
    calorieEstimate: "Calories",
    healthScore: "Health Score",
    estimatedPrice: "Estimated Cost",
    pricePerDish: "Cost per Serving",
    ingredientsBreakdown: "Ingredients & Cost",
    currency: "Currency",
    dailyFoodBudget: "Daily Budget",
    culturalNotes: "Culinary Notes",
    foodType: "Food Category",
    dish: "Cooked Dish",
    packagedFood: "Packaged Product",
    beverage: "Beverage",
    toman: "Toman",
    usd: "USD",
    totalBudgetSpent: "Total Spent Today",
    origin: "Origin",
    estimatedFoodSpend: "Food Spend Today",
    dailyBudgetUtilized: "budget used",
    budgetExceeded: "Budget Exceeded",
    currencyAndBudget: "Currency & Budget",
    currencyPreference: "Currency",
    dailyBudget: "Daily Budget",
    brand: "Brand / Source",
    servingSize: "Serving Size",
    adjustPortionDesc: "Scale nutrition to your exact portion",
    servings: "servings",
    perServingPrice: "Meal cost",
    ingredientCosts: "Ingredients & Cost",
    ingredients: "ingredients",
    appTitle: "NutriScan",
    appSubtitle: "Smart Nutrition & Cost Tracker",
    dailyCalorieIntake: "Daily Calories",
    kcalUnit: "kcal",
    gramUnit: "g",
    mgUnit: "mg",
    globalSpec: "Global Spec",
    dishesCount: "Dishes",
    globalRecipesSubtitle: "Global culinary recipes & nutritional breakdown",
    viewDetails: "View Details",
    kcalPerServing: "kcal per serving",
    limitExceeded: "Limit Exceeded",
    maxLimit: "Max",
    quantity: "Qty",
    deleteEntry: "Delete Entry",
    dollarOption: "Dollar ($ USD)",
    tomanOption: "Toman (IRT)",
    budgetDescription: "Target daily food expenditure ceiling used for spending progress tracking",
    totalFat: "Total Fat",
    saturatedFat: "Saturated Fat",
    transFat: "Trans Fat",
    totalCarbs: "Total Carbohydrates",
    sugars: "Sugars",
    fiber: "Fiber",
    cholesterol: "Cholesterol",
    addedSugars: "Includes Added Sugars",
    sodiumContent: "Sodium Content",
    dailyValue: "DV",
    ocrVision: "OCR Vision",
    geminiApi: "Gemini API",
    extractMacros: "Extract Macros",
    score: "Score",
    emptyDiaryPrompt: "Head over to the scanner tab to scan a food label and register calories.",
    satAbbr: "Sat:",
    transAbbr: "Trans:",
    sugarsAbbr: "Sgrs:",
    fiberAbbr: "Fib:",
    proteinAbbr: "P:",
    carbsAbbr: "C:",
    fatAbbr: "F:",
    switchLanguage: "Switch language / تغییر زبان",
    ratingExcellent: "Excellent",
    ratingGood: "Good",
    ratingModerate: "Moderate",
    ratingPoor: "Poor",
    detectedFoodLabelResult: "Detected Food Label Result",
    unknownBrand: "Unknown",
    oneContainer: "1 container / serving",
    dailyValueAbbr: "DV",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System (Device)",
    themeAutoSynced: "Synced with device",
    themeToggleAria: "Toggle light and dark theme",
    scanHistory: "Scan History Log",
    scanHistorySubtitle: "Re-add previously scanned meals & foods to your diary with 1 click",
    addToDiary: "Add to Diary",
    addedToDiary: "Added to Diary ✓",
    clearHistory: "Clear History",
    noRecentScans: "No previously scanned foods in history yet",
    loadSampleScans: "Load Sample Scans",
    addFromScanHistory: "Add from Scan History",
    selectServing: "Serving",
    searchScanHistory: "Search scan history...",
    removeFromHistory: "Remove from history",
  },
  fa: {
    scanner: "اسکنر",
    diary: "یادداشت روزانه",
    goals: "اهداف و بودجه",
    scanNutritionLabel: "اسکن برچسب یا بشقاب غذا",
    snapPhotoDesc: "از بشقاب غذا یا جدول ارزش غذایی عکس بگیرید تا کالری، ماکروها، قیمت تخمینی هر پرس و تفکیک هزینه مواد اولیه محاسبه شود.",
    startCamera: "شروع کار با دوربین",
    uploadPhoto: "آپلود عکس",
    processingLabel: "در حال تحلیل غذا و محاسبه هزینه...",
    alignLabelBracket: "بشقاب یا برچسب را در کادر تنظیم کنید",
    foodOfTheDay: "غذای برگزیده روز",
    foodsAroundWorld: "غذاهای ملل و قیمت هر پرس",
    fullNutritionFacts: "جدول کامل ارزش غذایی",
    logToDiary: "ثبت در یادداشت روزانه",
    scanIssueDetected: "مشکل در اسکن شناسایی شد",
    todaysIntake: "میزان دریافت مواد مغذی امروز",
    todaysMeals: "وعده‌های غذایی ثبت‌شده امروز",
    diaryEmpty: "دفترچه غذای شما خالی است",
    clearAll: "پاک کردن همه",
    protein: "پروتئین",
    carbs: "کربوهیدرات",
    fat: "چربی",
    sodium: "سدیم",
    yourName: "نام شما",
    quickPresets: "تنظیمات سریع کالری و ماکرو",
    adjustCaps: "تنظیم محدودیت‌های مواد مغذی",
    calorieCap: "سقف کالری روزانه",
    proteinTarget: "هدف پروتئین",
    carbsTarget: "هدف کربوهیدرات",
    fatTarget: "هدف چربی",
    sodiumLimit: "محدودیت سدیم",
    languageSettings: "تنظیمات زبان",
    selectLanguage: "انتخاب زبان برنامه",
    calorieGoalText: "هدف کالری",
    captureSnapshot: "ثبت تصویر",
    cancel: "لغو",
    emptyDiaryBtn: "اسکن غذا یا محصول",
    healthProfileTitle: "پروفایل سلامت و بودجه",
    healthProfileDesc: "اهداف کالری، بودجه روزانه وعده‌های غذایی و واحد پول را مشخص کنید.",
    presetBalanced: "رژیم متعادل (۲۰۰۰)",
    presetLoss: "کاهش وزن (۱۶۰۰)",
    presetMuscle: "افزایش عضلانی (۲۵۰۰)",
    presetKeto: "کتو پرچربی (۱۸۰۰)",
    detectedResult: "تحلیل هوشمند غذا و قیمت‌گذاری",
    portionMultiplier: "ضریب سهم مصرفی",
    portionMultiplierDesc: "مقدار مصرفی خود را برای محاسبه دقیق کالری و هزینه تنظیم کنید",
    totalCalories: "مجموع کالری",
    vitaminsMicro: "ویتامین‌ها و مواد معدنی",
    aiLabelAnalysis: "بینش و تحلیل تغذیه‌ای هوش مصنوعی",
    nutritionalHighlights: "نکات مثبت و برجسته تغذیه‌ای",
    watchOutFor: "موارد نیازمند توجه و هشدار",
    extractedIngredients: "لیست مواد تشکیل‌دهنده شناسایی‌شده",
    logPortionBtn: "ثبت در یادداشت روزانه",
    calorieEstimate: "تخمین کالری",
    healthScore: "امتیاز سلامت",
    estimatedPrice: "قیمت تخمینی هر پرس",
    pricePerDish: "هزینه هر پرس غذا",
    ingredientsBreakdown: "تفکیک مواد اولیه و هزینه‌ها",
    currency: "واحد پول",
    dailyFoodBudget: "بودجه روزانه غذا",
    culturalNotes: "پیشینه و اصالت فرهنگی",
    foodType: "دسته‌بندی",
    dish: "غذای طبخ‌شده",
    packagedFood: "محصول بسته‌بندی",
    beverage: "نوشیدنی",
    toman: "تومان",
    usd: "دلار",
    totalBudgetSpent: "مجموع هزینه غذای امروز",
    origin: "خاستگاه",
    estimatedFoodSpend: "هزینه تقریبی غذای امروز",
    dailyBudgetUtilized: "از بودجه روزانه مصرف شد",
    budgetExceeded: "بیش از سقف بودجه",
    currencyAndBudget: "واحد پول و بودجه وعده‌ها",
    currencyPreference: "انتخاب واحد پول",
    dailyBudget: "سقف بودجه روزانه غذا",
    brand: "برند / رستوران",
    servingSize: "سهم استاندارد",
    adjustPortionDesc: "مقدار مصرفی خود را برای محاسبه دقیق کالری و هزینه تنظیم کنید",
    servings: "سهم",
    perServingPrice: "هزینه تخمینی برای این وعده",
    ingredientCosts: "تفکیک مواد اولیه و برآورد هزینه",
    ingredients: "ماده اولیه",
    appTitle: "نوتری‌اسکن",
    appSubtitle: "تحلیل هوشمند تغذیه، کالری و برآورد هزینه غذا",
    dailyCalorieIntake: "دریافت کالری روزانه",
    kcalUnit: "کالری",
    gramUnit: "گرم",
    mgUnit: "میلی‌گرم",
    globalSpec: "غذای برگزیده ملل",
    dishesCount: "غذا",
    globalRecipesSubtitle: "دستورهای اصیل ملل، تحلیل ارزش غذایی و قیمت مواد اولیه",
    viewDetails: "مشاهده جزئیات",
    kcalPerServing: "کالری در هر سهم",
    limitExceeded: "بیش از حد مجاز",
    maxLimit: "حداکثر",
    quantity: "تعداد",
    deleteEntry: "حذف مورد",
    dollarOption: "دلار ($ USD)",
    tomanOption: "تومان (IRT)",
    budgetDescription: "سقف بودجه روزانه برای مصرف غذا و ردیابی هزینه‌های وعده‌ها",
    totalFat: "کل چربی",
    saturatedFat: "چربی اشباع",
    transFat: "چربی ترانس",
    totalCarbs: "کل کربوهیدرات",
    sugars: "قند",
    fiber: "فیبر",
    cholesterol: "کلسترول",
    addedSugars: "شامل قند افزوده",
    sodiumContent: "میزان سدیم",
    dailyValue: "نیاز روزانه",
    ocrVision: "بینایی ماشین",
    geminiApi: "هوش مصنوعی جمینای",
    extractMacros: "استخراج درشت‌مغذی‌ها",
    score: "امتیاز",
    emptyDiaryPrompt: "برای اسکن برچسب مواد غذایی یا بشقاب غذا و ثبت کالری، به برگه اسکنر بروید.",
    satAbbr: "اشباع:",
    transAbbr: "ترانس:",
    sugarsAbbr: "قند:",
    fiberAbbr: "فیبر:",
    proteinAbbr: "پ:",
    carbsAbbr: "ک:",
    fatAbbr: "چ:",
    switchLanguage: "تغییر زبان / Switch language",
    ratingExcellent: "عالی",
    ratingGood: "خوب",
    ratingModerate: "متوسط",
    ratingPoor: "ضعیف",
    detectedFoodLabelResult: "نتیجه اسکن برچسب یا غذا",
    unknownBrand: "نامشخص",
    oneContainer: "۱ سهم / ظرف",
    dailyValueAbbr: "نیاز روزانه",
    theme: "پوسته",
    themeLight: "روشن",
    themeDark: "تیره",
    themeSystem: "دستگاه (خودکار)",
    themeAutoSynced: "همگام با پوسته دستگاه",
    themeToggleAria: "تغییر حالت تیره و روشن",
    scanHistory: "سوابق و تاریخچه اسکن‌ها",
    scanHistorySubtitle: "افزودن سریع غذاهای اسکن‌شده قبلی به یادداشت روزانه با یک کلیک",
    addToDiary: "ثبت در یادداشت",
    addedToDiary: "در یادداشت ثبت شد ✓",
    clearHistory: "پاک کردن تاریخچه",
    noRecentScans: "هنوز غذایی در تاریخچه اسکن‌های شما ثبت نشده است",
    loadSampleScans: "بارگذاری نمونه اسکن‌ها",
    addFromScanHistory: "افزودن از سوابق اسکن",
    selectServing: "سهم",
    searchScanHistory: "جستجو در سوابق اسکن...",
    removeFromHistory: "حذف از تاریخچه",
  }
};
